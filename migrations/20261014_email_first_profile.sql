begin;
create function public.save_js_basic_profile(p_auth_user_id uuid, p_name text, p_dob date, p_consent boolean)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
 v_org constant uuid := 'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba';
 v_email text; v_client uuid;
begin
 if p_auth_user_id is null or nullif(btrim(p_name),'') is null or length(btrim(p_name)) > 120
 or p_dob is null or p_dob < date '1900-01-01' or p_dob > current_date or p_consent is distinct from true then
 raise exception 'Invalid profile details'; end if;
 select lower(btrim(email)) into v_email from auth.users where id = p_auth_user_id and email_confirmed_at is not null and coalesce(is_anonymous,false) = false;
 if nullif(v_email,'') is null then raise exception 'Verified email required'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_org::text || ':' || p_auth_user_id::text,0));
 select client_id into v_client from public.js_customer_access where auth_user_id = p_auth_user_id and organization_id = v_org;
 if found then return v_client; end if;
 select r.client_id into v_client from public.jeevansutra_registrations r join public.clients c on c.id = r.client_id
 where r.auth_user_id = p_auth_user_id and r.organization_id = v_org and c.organization_id = v_org
 and r.verification_status = 'verified' and r.registration_status = 'completed';
 if not found then
 insert into public.clients(organization_id,full_name,current_name,date_of_birth,email,status)
 values(v_org,btrim(p_name),btrim(p_name),p_dob,v_email,'active') returning id into v_client;
 insert into public.jeevansutra_registrations(organization_id,client_id,service_category,consent_given,consent_at,verification_status,registration_status,auth_user_id,verified_email,verified_at)
 values(v_org,v_client,'free',true,now(),'verified','completed',p_auth_user_id,v_email,now());
 end if;
 insert into public.js_customer_access(auth_user_id,client_id,organization_id) values(p_auth_user_id,v_client,v_org);
 return v_client;
end;
$$;
revoke all on function public.save_js_basic_profile(uuid,text,date,boolean) from public,anon,authenticated;
grant execute on function public.save_js_basic_profile(uuid,text,date,boolean) to service_role;
commit;
