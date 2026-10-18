begin;
create table public.js_name_guidance_interests (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid not null references auth.users(id),
 client_id uuid not null references public.clients(id),
 organization_id uuid not null,
 service text not null check (service in ('personal','child','business','brand','project','product','signature')),
 action text not null check (action in ('review','compare','new','design')),
 details jsonb not null check (jsonb_typeof(details)='object' and octet_length(details::text)<=12000),
 consent_at timestamptz not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(auth_user_id,organization_id,service,action)
);
create index js_name_guidance_interests_org_updated on public.js_name_guidance_interests(organization_id,updated_at desc);
alter table public.js_name_guidance_interests enable row level security;
revoke all on public.js_name_guidance_interests from public,anon,authenticated;
grant select,insert,update on public.js_name_guidance_interests to service_role;
comment on table public.js_name_guidance_interests is 'Latest explicitly submitted naming interest per verified account, service and action. Private; no anonymous or direct customer access. Not a paid booking or practitioner recommendation.';
commit;
