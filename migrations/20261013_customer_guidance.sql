begin;
create table if not exists public.js_customer_access (
 auth_user_id uuid primary key references auth.users(id) on delete cascade,
 client_id uuid not null unique references public.clients(id) on delete cascade,
 organization_id uuid not null references public.organizations(id),
 created_at timestamptz not null default now()
);
alter table public.js_customer_access enable row level security;
revoke all on public.js_customer_access from public, anon, authenticated;
grant select on public.js_customer_access to authenticated;
grant select, insert on public.js_customer_access to service_role;
drop policy if exists js_customer_access_own on public.js_customer_access;
create policy js_customer_access_own on public.js_customer_access for select to authenticated using (auth_user_id = auth.uid());

create table if not exists public.js_guidance_snapshots (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid not null references public.js_customer_access(auth_user_id) on delete cascade,
 client_id uuid not null references public.clients(id) on delete cascade,
 organization_id uuid not null references public.organizations(id),
 request_id uuid not null,
 topic text not null check (topic in ('career','business','money','family','personal_direction')),
 intake jsonb not null,
 preview jsonb not null,
 practitioner_context jsonb not null,
 created_at timestamptz not null default now(),
 unique(auth_user_id, request_id)
);
create index if not exists js_guidance_client_created on public.js_guidance_snapshots(client_id, created_at desc);
alter table public.js_guidance_snapshots enable row level security;
revoke all on public.js_guidance_snapshots from public, anon, authenticated;
grant select on public.js_guidance_snapshots to authenticated;
grant select, insert on public.js_guidance_snapshots to service_role;
drop policy if exists js_guidance_practitioner_read on public.js_guidance_snapshots;
create policy js_guidance_practitioner_read on public.js_guidance_snapshots for select to authenticated using (
 exists (
  select 1 from public.profiles p join public.clients c on c.id = js_guidance_snapshots.client_id
  where p.id = auth.uid() and p.is_active = true
   and p.organization_id = js_guidance_snapshots.organization_id
   and c.organization_id = p.organization_id
   and (p.role = 'admin' or c.primary_employee_id = p.id)
 )
);
-- Customers read a deliberately limited view through the authenticated API,
-- which excludes practitioner-only context. No direct customer table grants.
commit;
