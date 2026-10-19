begin;
create or replace function public.accept_js_compatibility_share(p_auth_user_id uuid,p_token_hash text) returns uuid language plpgsql security definer set search_path = $empty$$empty$ as $fn$ begin return null; end; $fn$;
revoke all on function public.accept_js_compatibility_share(uuid,text) from public,anon,authenticated,service_role;
create or replace function public.accept_js_compatibility_share(p_auth_user_id uuid,p_token_hash text,p_dob text) returns uuid language plpgsql security definer set search_path = $empty$$empty$ as $fn$
declare v_email text; v_share uuid; v_expected text; v_date date; v_key text; v_org constant uuid := $v$d7e678c2-2d43-4fd9-9ef4-48a791b6a5ba$v$;
begin
if p_auth_user_id is null or p_token_hash is null or p_token_hash !~ $v$^[a-f0-9]{64}$$v$ then return null; end if;
select lower(btrim(u.email)) into v_email from auth.users u where u.id=p_auth_user_id and u.email_confirmed_at is not null and u.is_anonymous is not true and exists(select 1 from public.js_customer_access a join public.clients c on c.id=a.client_id and c.organization_id=a.organization_id where a.auth_user_id=u.id and a.organization_id=v_org);
if v_email is null then return null; end if;
v_key := $v$js-share-dob-account:$v$ || p_auth_user_id::text;
if not public.check_js_registration_rate_limit(pg_catalog.md5(v_key)||pg_catalog.md5($v$second:$v$||v_key),10,60) then return null; end if;
v_key := $v$js-share-dob-invite:$v$ || p_auth_user_id::text || $v$:$v$ || p_token_hash;
if not public.check_js_registration_rate_limit(pg_catalog.md5(v_key)||pg_catalog.md5($v$second:$v$||v_key),5,60) then return null; end if;
if p_dob is null or p_dob !~ $v$^[0-9]{4}-[0-9]{2}-[0-9]{2}$$v$ then return null; end if;
begin v_date := p_dob::date; exception when invalid_datetime_format or datetime_field_overflow then return null; end;
if pg_catalog.to_char(v_date,$v$YYYY-MM-DD$v$)<>p_dob or v_date>current_date then return null; end if;
select s.id,d.source #>> $v${other,dob}$v$ into v_share,v_expected from public.js_compatibility_shares s join public.js_compatibility_previews v on v.id=s.preview_id and v.auth_user_id=s.owner_user_id and v.organization_id=s.organization_id join public.js_compatibility_private d on d.preview_id=v.id where s.token_hash=p_token_hash and s.organization_id=v_org and s.recipient_email=v_email and s.revoked_at is null and s.ready_at is not null and s.expires_at>pg_catalog.clock_timestamp() and v.is_active=true and (s.accepted_user_id is null or s.accepted_user_id=p_auth_user_id) for update of s,v,d;
if v_share is null or v_expected is null then return null; end if;
if v_expected<>pg_catalog.to_char(v_date,$v$DD/MM/YYYY$v$) and v_expected<>p_dob then return null; end if;
update public.js_compatibility_shares set accepted_user_id=p_auth_user_id,accepted_at=coalesce(accepted_at,pg_catalog.clock_timestamp()) where id=v_share;
return v_share; end; $fn$;
revoke all on function public.accept_js_compatibility_share(uuid,text,text) from public,anon,authenticated;
grant execute on function public.accept_js_compatibility_share(uuid,text,text) to service_role;
commit;
