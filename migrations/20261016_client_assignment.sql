-- Review and apply to VERIFIED STAGING first. No existing clients are reassigned.
begin;
create table public.practitioner_assignment_settings (
 employee_id uuid primary key references public.profiles(id),
 available boolean not null default false,
 capacity integer not null default 20 check (capacity between 1 and 500),
 updated_at timestamptz not null default now()
);
create table public.client_assignment_history (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null,
 client_id uuid not null references public.clients(id),
 previous_employee_id uuid,
 employee_id uuid,
 actor_id uuid not null,
 method text not null check (method in ('admin','system')),
 reason text not null,
 created_at timestamptz not null default now()
);
alter table public.practitioner_assignment_settings enable row level security;
alter table public.client_assignment_history enable row level security;
revoke all on public.practitioner_assignment_settings, public.client_assignment_history from anon, authenticated;

create function public.assignment_admin_org() returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_org uuid;
begin
 select organization_id into v_org from public.profiles
 where id = auth.uid() and is_active = true
 and regexp_replace(lower(btrim(role::text)), '[\s_-]+','','g') in ('admin','superadmin');
 if v_org is null then raise exception 'Administrator access required'; end if;
 return v_org;
end $$;
revoke all on function public.assignment_admin_org() from public, anon, authenticated;

create function public.assignment_dashboard() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_org uuid; v_clients jsonb; v_staff jsonb; v_history jsonb;
begin
 v_org := public.assignment_admin_org();
 select coalesce(jsonb_agg(x order by x.created_at desc),'[]'::jsonb) into v_clients from (
 select c.id, c.client_number, c.full_name, c.date_of_birth, c.email, c.created_at, c.primary_employee_id,
 exists(select 1 from public.js_customer_access a where a.client_id=c.id and a.organization_id=v_org) as website
 from public.clients c where c.organization_id=v_org and c.status='active'
 ) x;
 select coalesce(jsonb_agg(x order by x.full_name),'[]'::jsonb) into v_staff from (
 select p.id,p.full_name,p.role,p.specialization,p.is_active,
 coalesce(s.available,false) as available, coalesce(s.capacity,20) as capacity,
 (select count(*) from public.clients c where c.organization_id=v_org and c.status='active' and c.primary_employee_id=p.id) as workload
 from public.profiles p left join public.practitioner_assignment_settings s on s.employee_id=p.id
 where p.organization_id=v_org
 and regexp_replace(lower(btrim(p.role::text)), '[\s_-]+','','g') not in ('customer','admin','superadmin')
 ) x;
 select coalesce(jsonb_agg(x order by x.created_at desc),'[]'::jsonb) into v_history from (
 select h.* from public.client_assignment_history h where h.organization_id=v_org order by h.created_at desc limit 100
 ) x;
 return jsonb_build_object('clients',v_clients,'employees',v_staff,'history',v_history);
end $$;
revoke all on function public.assignment_dashboard() from public, anon;
grant execute on function public.assignment_dashboard() to authenticated;

create function public.set_practitioner_availability(p_employee uuid,p_available boolean,p_capacity integer) returns void
language plpgsql security definer set search_path = '' as $$
declare v_org uuid;
begin
 v_org := public.assignment_admin_org();
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_org::text || ':assignment',0));
 if p_available is null or p_capacity is null or p_capacity not between 1 and 500 then raise exception 'Invalid availability settings'; end if;
 if not exists(select 1 from public.profiles where id=p_employee and organization_id=v_org and is_active=true
 and regexp_replace(lower(btrim(role::text)), '[\s_-]+','','g') not in ('customer','admin','superadmin')) then raise exception 'Eligible employee required'; end if;
 insert into public.practitioner_assignment_settings(employee_id,available,capacity) values(p_employee,p_available,p_capacity)
 on conflict(employee_id) do update set available=excluded.available,capacity=excluded.capacity,updated_at=now();
end $$;
revoke all on function public.set_practitioner_availability(uuid,boolean,integer) from public,anon;
grant execute on function public.set_practitioner_availability(uuid,boolean,integer) to authenticated;

-- Protect assignment changes even when a caller uses direct table access.
create function public.guard_client_assignment() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_org uuid; v_method text; v_reason text;
begin
 if new.primary_employee_id is not distinct from old.primary_employee_id then return new; end if;
 v_org := public.assignment_admin_org();
 if old.organization_id is distinct from v_org or new.organization_id is distinct from v_org then raise exception 'Organisation mismatch'; end if;
 v_method := current_setting('app.assignment_method',true);
 v_reason := nullif(btrim(current_setting('app.assignment_reason',true)),'');
 if v_method not in ('admin','system') or v_method is null or v_reason is null then raise exception 'Use the authorised assignment action'; end if;
 insert into public.client_assignment_history(organization_id,client_id,previous_employee_id,employee_id,actor_id,method,reason)
 values(v_org,old.id,old.primary_employee_id,new.primary_employee_id,auth.uid(),v_method,v_reason);
 return new;
end $$;
revoke all on function public.guard_client_assignment() from public,anon,authenticated;
create trigger protect_client_assignment before update of primary_employee_id on public.clients
 for each row execute function public.guard_client_assignment();

create function public.assign_client_practitioner(p_client uuid,p_employee uuid,p_expected uuid,p_reason text,p_auto boolean default false) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_org uuid; v_old uuid; v_selected uuid; v_capacity integer; v_workload integer;
begin
 v_org := public.assignment_admin_org();
 if p_auto is null or nullif(btrim(p_reason),'') is null or length(p_reason)>500 then raise exception 'Assignment reason required (maximum 500 characters)'; end if;
 -- All admin/system actions in this organisation share a lock to preserve capacity.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_org::text || ':assignment',0));
 select primary_employee_id into v_old from public.clients where id=p_client and organization_id=v_org and status='active' for update;
 if not found then raise exception 'Active client not found'; end if;
 if v_old is distinct from p_expected then raise exception 'Assignment changed. Refresh before trying again.'; end if;
 if p_auto and v_old is not null then raise exception 'Automatic assignment never replaces an existing assignment'; end if;
 if p_auto then
 select p.id into v_selected from public.profiles p join public.practitioner_assignment_settings s on s.employee_id=p.id
 where p.organization_id=v_org and p.is_active=true and s.available=true
 and regexp_replace(lower(btrim(p.role::text)), '[\s_-]+','','g') not in ('customer','admin','superadmin')
 and (select count(*) from public.clients c where c.organization_id=v_org and c.status='active' and c.primary_employee_id=p.id)<s.capacity
 order by (select count(*) from public.clients c where c.organization_id=v_org and c.status='active' and c.primary_employee_id=p.id),p.id limit 1;
 else v_selected := p_employee; end if;
 if v_selected is null then raise exception 'No available employee with capacity. Client remains awaiting assignment.'; end if;
 if v_selected=v_old then raise exception 'Client is already assigned to this employee'; end if;
 select s.capacity into v_capacity from public.profiles p join public.practitioner_assignment_settings s on s.employee_id=p.id
 where p.id=v_selected and p.organization_id=v_org and p.is_active=true and s.available=true
 and regexp_replace(lower(btrim(p.role::text)), '[\s_-]+','','g') not in ('customer','admin','superadmin');
 if not found then raise exception 'Employee is not available or eligible'; end if;
 select count(*) into v_workload from public.clients where organization_id=v_org and status='active' and primary_employee_id=v_selected;
 if v_workload>=v_capacity then raise exception 'Employee capacity reached'; end if;
 perform set_config('app.assignment_method',case when p_auto then 'system' else 'admin' end,true);
 perform set_config('app.assignment_reason',btrim(p_reason),true);
 update public.clients set primary_employee_id=v_selected,updated_at=now() where id=p_client and organization_id=v_org;
 return v_selected;
end $$;
revoke all on function public.assign_client_practitioner(uuid,uuid,uuid,text,boolean) from public,anon;
grant execute on function public.assign_client_practitioner(uuid,uuid,uuid,text,boolean) to authenticated;
-- Match the employee list boundary at the database level as well.
create function public.can_access_assigned_client(p_org uuid,p_employee uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_active=true
 and p.organization_id=p_org and regexp_replace(lower(btrim(p.role::text)), '[\s_-]+','','g')<>'customer'
 and (regexp_replace(lower(btrim(p.role::text)), '[\s_-]+','','g') in ('admin','superadmin') or p_employee=p.id));
$$;
revoke all on function public.can_access_assigned_client(uuid,uuid) from public,anon;
grant execute on function public.can_access_assigned_client(uuid,uuid) to authenticated;
create policy clients_assignment_read_scope on public.clients as restrictive for select to authenticated
 using(public.can_access_assigned_client(organization_id,primary_employee_id));
create policy clients_assignment_update_scope on public.clients as restrictive for update to authenticated
 using(public.can_access_assigned_client(organization_id,primary_employee_id))
 with check(public.can_access_assigned_client(organization_id,primary_employee_id));
commit;
