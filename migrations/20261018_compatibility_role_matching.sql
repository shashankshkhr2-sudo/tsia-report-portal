begin;
create or replace function public.save_js_compatibility_v2_draft(
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
 -- Match the complete saved context, including records created before roles entered the key.
 -- Priorities deliberately do not identify a new chargeable comparison.
 select v.id,v.preview into v_id,v_preview
 from public.js_compatibility_previews v
 join public.js_compatibility_private d on d.preview_id=v.id
 where v.auth_user_id=p_auth_user_id and v.organization_id=v_org
 and d.method_version='JS_COMPATIBILITY_V2_DRAFT_1'
 and d.source->>'kind'=p_source->>'kind'
 and d.source->>'relationship'=p_source->>'relationship'
 and lower(d.source#>>'{self,name}')=lower(p_source#>>'{self,name}')
 and d.source#>>'{self,dob}'=p_source#>>'{self,dob}'
 and lower(d.source#>>'{other,name}')=lower(p_source#>>'{other,name}')
 and d.source#>>'{other,dob}'=p_source#>>'{other,dob}'
 and lower(regexp_replace(btrim(d.source->>'selfRole'),'\s+',' ','g'))
     =lower(regexp_replace(btrim(p_source->>'selfRole'),'\s+',' ','g'))
 and lower(regexp_replace(btrim(d.source->>'otherRole'),'\s+',' ','g'))
     =lower(regexp_replace(btrim(p_source->>'otherRole'),'\s+',' ','g'))
 order by v.created_at,v.id limit 1;
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

commit;
