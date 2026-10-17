begin;
-- Private source and practitioner guidance never belong in customer preview JSON.
create table public.js_compatibility_private (
 preview_id uuid primary key references public.js_compatibility_previews(id) on delete cascade,
 source jsonb not null check (jsonb_typeof(source) = 'object'),
 practitioner jsonb not null check (jsonb_typeof(practitioner) = 'object'),
 method_version text not null,
 consent_at timestamptz not null default now()
);
alter table public.js_compatibility_private enable row level security;
revoke all on public.js_compatibility_private from public, anon, authenticated, service_role;

create function public.save_js_compatibility_v2_draft(
 p_auth_user_id uuid, p_comparison_key text, p_preview jsonb, p_source jsonb, p_practitioner jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 v_client uuid; v_id uuid; v_preview jsonb; v_count integer;
 v_org constant uuid := 'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba';
begin
 if p_comparison_key is null or p_comparison_key !~ '^[a-f0-9]{64}$'
 or p_preview is null or jsonb_typeof(p_preview)<>'object' or octet_length(p_preview::text)>20000
 or p_source is null or jsonb_typeof(p_source)<>'object' or octet_length(p_source::text)>10000
 or p_practitioner is null or jsonb_typeof(p_practitioner)<>'object' or octet_length(p_practitioner::text)>30000
 or p_preview->>'version' is distinct from 'JS_COMPATIBILITY_V2_DRAFT_1'
 then raise exception 'Invalid comparison'; end if;
 select a.client_id into v_client from public.js_customer_access a
 join auth.users u on u.id=a.auth_user_id
 join public.clients c on c.id=a.client_id and c.organization_id=a.organization_id
 where a.auth_user_id=p_auth_user_id and a.organization_id=v_org
 and u.email_confirmed_at is not null;
 if v_client is null then raise exception 'Verified registered account required'; end if;
 -- Same lock as legacy saving, so concurrent old/new saves cannot exceed the allowance.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('js-compatibility:'||p_auth_user_id::text,0));
 select count(*) into v_count from public.js_compatibility_previews where auth_user_id=p_auth_user_id;
 select id,preview into v_id,v_preview from public.js_compatibility_previews
 where auth_user_id=p_auth_user_id and comparison_key=p_comparison_key;
 if found then return jsonb_build_object('id',v_id,'preview',v_preview,'remaining',greatest(0,3-v_count),'reused',true); end if;
 if v_count>=3 then return jsonb_build_object('limitReached',true,'remaining',0); end if;
 insert into public.js_compatibility_previews(auth_user_id,client_id,organization_id,comparison_key,preview)
 values(p_auth_user_id,v_client,v_org,p_comparison_key,p_preview) returning id into v_id;
 insert into public.js_compatibility_private(preview_id,source,practitioner,method_version)
 values(v_id,p_source,p_practitioner,'JS_COMPATIBILITY_V2_DRAFT_1');
 return jsonb_build_object('id',v_id,'preview',p_preview,'remaining',greatest(0,2-v_count),'reused',false);
end;
$$;
revoke all on function public.save_js_compatibility_v2_draft(uuid,text,jsonb,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.save_js_compatibility_v2_draft(uuid,text,jsonb,jsonb,jsonb) to service_role;

-- Assignment and active-staff checks are enforced inside the database, not just the UI.
create function public.js_practitioner_compatibility(p_preview_id uuid default null,p_page integer default 0)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_result jsonb;
begin
 if not exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_active=true
 and p.organization_id='d7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'::uuid
 and regexp_replace(lower(btrim(p.role::text)), '[\s_-]+','','g') <> 'customer')
 then raise exception 'Authorised practitioner access required'; end if;
 if p_preview_id is null then
  select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) into v_result from (
   select v.id,v.client_id,c.full_name as client_name,v.preview->>'kind' as kind,
    v.preview->>'relationship' as relationship,v.preview#>>'{people,1,name}' as other_name,
    v.created_at,(d.preview_id is not null) as has_guidance
   from public.js_compatibility_previews v join public.clients c on c.id=v.client_id and c.organization_id=v.organization_id
   left join public.js_compatibility_private d on d.preview_id=v.id
   where v.organization_id='d7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'::uuid
   and public.can_access_assigned_client(c.organization_id,c.primary_employee_id)
   order by v.created_at desc,v.id limit 50 offset greatest(0,least(coalesce(p_page,0),100000))*50
  ) t;
 else
  select jsonb_build_object('id',v.id,'client_name',c.full_name,'preview',v.preview,
   'practitioner',d.practitioner,'created_at',v.created_at) into v_result
  from public.js_compatibility_previews v join public.clients c on c.id=v.client_id and c.organization_id=v.organization_id
  left join public.js_compatibility_private d on d.preview_id=v.id
  where v.id=p_preview_id and v.organization_id='d7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'::uuid
  and public.can_access_assigned_client(c.organization_id,c.primary_employee_id);
 end if;
 return v_result;
end;
$$;
revoke all on function public.js_practitioner_compatibility(uuid,integer) from public,anon;
grant execute on function public.js_practitioner_compatibility(uuid,integer) to authenticated;
commit;
