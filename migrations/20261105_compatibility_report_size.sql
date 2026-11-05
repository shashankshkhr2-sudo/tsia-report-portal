BEGIN;
DO $migration$
DECLARE
 definition text;
 old_limit text := $old$octet_length(p_preview::text) > 12000$old$;
BEGIN
 definition := pg_get_functiondef($signature$public.save_js_compatibility_preview(uuid,text,jsonb)$signature$::regprocedure);
 IF array_length(string_to_array(definition, old_limit), 1) <> 2 THEN
  RAISE EXCEPTION $error$Expected size check not found exactly once; no changes applied$error$;
 END IF;
 EXECUTE replace(definition, old_limit, $new$octet_length(p_preview::text) > 65536$new$);
END;
$migration$;
COMMIT;
