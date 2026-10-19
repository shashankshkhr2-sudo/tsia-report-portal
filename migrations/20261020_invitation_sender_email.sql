begin;
create or replace function public.js_invitation_sender_emails(p_auth_user_id uuid) returns table(owner_user_id uuid,sender_email text) language sql stable security definer set search_path = $e$$e$ as $fn$
select distinct s.owner_user_id, lower(btrim(sender.email)) from public.js_compatibility_shares s join auth.users recipient on recipient.id=p_auth_user_id join auth.users sender on sender.id=s.owner_user_id join public.js_customer_access a on a.auth_user_id=sender.id and a.organization_id=s.organization_id where s.organization_id=$v$d7e678c2-2d43-4fd9-9ef4-48a791b6a5ba$v$::uuid and s.recipient_email=lower(btrim(recipient.email)) and recipient.email_confirmed_at is not null and recipient.is_anonymous is not true and sender.email_confirmed_at is not null and sender.is_anonymous is not true and s.ready_at is not null and exists(select 1 from public.js_customer_access r join public.clients c on c.id=r.client_id and c.organization_id=r.organization_id where r.auth_user_id=recipient.id and r.organization_id=s.organization_id);
$fn$;
revoke all on function public.js_invitation_sender_emails(uuid) from public,anon,authenticated;
grant execute on function public.js_invitation_sender_emails(uuid) to service_role;
commit;
