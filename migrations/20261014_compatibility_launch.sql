begin;
create table public.js_compatibility_previews (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid not null references public.js_customer_access(auth_user_id) on delete cascade,
 client_id uuid not null references public.clients(id) on delete cascade,
 organization_id uuid not null references public.organizations(id),
 comparison_key text not null check (comparison_key ~ '^[a-f0-9]{64}$'),
 preview jsonb not null check (jsonb_typeof(preview) = 'object'),
 created_at timestamptz not null default now(),
 unique (auth_user_id, comparison_key)
);
alter table public.js_compatibility_previews enable row level security;
revoke all on public.js_compatibility_previews from public, anon, authenticated, service_role;
grant select on public.js_compatibility_previews to service_role;
create function public.save_js_compatibility_preview(p_auth_user_id uuid, p_comparison_key text, p_preview jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 v_client uuid; v_id uuid; v_preview jsonb; v_count integer;
 v_org constant uuid := 'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba';
begin
 if p_auth_user_id is null or p_comparison_key is null or p_comparison_key !~ '^[a-f0-9]{64}$'
 or p_preview is null or jsonb_typeof(p_preview) <> 'object' or octet_length(p_preview::text) > 12000 then
 raise exception 'Invalid preview parameters'; end if;
 select a.client_id into v_client from public.js_customer_access a join auth.users u on u.id = a.auth_user_id
 where a.auth_user_id = p_auth_user_id and a.organization_id = v_org and u.email_confirmed_at is not null;
 if v_client is null then raise exception 'Verified registered account required'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('js-compatibility:' || p_auth_user_id::text, 0));
 select count(*) into v_count from public.js_compatibility_previews where auth_user_id = p_auth_user_id;
 select id, preview into v_id, v_preview from public.js_compatibility_previews where auth_user_id = p_auth_user_id and comparison_key = p_comparison_key;
 if found then return jsonb_build_object('id', v_id, 'preview', v_preview, 'remaining', greatest(0, 3 - v_count), 'reused', true); end if;
 if v_count >= 3 then return jsonb_build_object('limitReached', true, 'remaining', 0); end if;
 insert into public.js_compatibility_previews(auth_user_id, client_id, organization_id, comparison_key, preview)
 values (p_auth_user_id, v_client, v_org, p_comparison_key, p_preview) returning id into v_id;
 return jsonb_build_object('id', v_id, 'preview', p_preview, 'remaining', 2 - v_count, 'reused', false);
end;
$$;
revoke all on function public.save_js_compatibility_preview(uuid,text,jsonb) from public, anon, authenticated;
grant execute on function public.save_js_compatibility_preview(uuid,text,jsonb) to service_role;
commit;
