begin;
alter table public.js_compatibility_shares add column if not exists declined_at timestamptz;
create or replace function public.decline_js_compatibility_share(p_auth_user_id uuid,p_token_hash text) returns boolean language plpgsql security definer set search_path = $empty$$empty$ as $fn$
declare v_email text; v_id uuid; v_org constant uuid := $v$d7e678c2-2d43-4fd9-9ef4-48a791b6a5ba$v$;
begin
if p_auth_user_id is null or p_token_hash is null or p_token_hash !~ $v$^[a-f0-9]{64}$$v$ then return false; end if;
select lower(btrim(u.email)) into v_email from auth.users u where u.id=p_auth_user_id and u.email_confirmed_at is not null and u.is_anonymous is not true and exists(select 1 from public.js_customer_access a join public.clients c on c.id=a.client_id and c.organization_id=a.organization_id where a.auth_user_id=u.id and a.organization_id=v_org);
if v_email is null then return false; end if;
select s.id into v_id from public.js_compatibility_shares s where s.token_hash=p_token_hash and s.organization_id=v_org and s.recipient_email=v_email and s.accepted_at is null and s.accepted_user_id is null and s.ready_at is not null and (s.declined_at is not null or (s.revoked_at is null and s.expires_at>pg_catalog.clock_timestamp())) for update of s;
if v_id is null then return false; end if;
update public.js_compatibility_shares set declined_at=coalesce(declined_at,pg_catalog.clock_timestamp()),revoked_at=coalesce(revoked_at,pg_catalog.clock_timestamp()) where id=v_id;
return true; end; $fn$;
revoke all on function public.decline_js_compatibility_share(uuid,text) from public,anon,authenticated;
grant execute on function public.decline_js_compatibility_share(uuid,text) to service_role;
commit;
