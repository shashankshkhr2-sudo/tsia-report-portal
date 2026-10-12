'use server'
import { createClient } from '@/lib/supabase/server'
export async function getCustomerGuidanceForPractitioner(clientId: string) {
 if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== 'true') return { result: [], error: null }
 try {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !/^[0-9a-f-]{36}$/i.test(clientId)) return { result: [], error: 'Unable to verify access.' }
  // Uses the practitioner session, never a privileged customer-service key.
  const { data, error } = await supabase.from('js_guidance_snapshots').select('id,topic,intake,preview,practitioner_context,created_at').eq('client_id', clientId).order('created_at', { ascending: false }).limit(10)
  if (error) return { result: [], error: 'Unable to load website previews.' }
  return { result: data || [], error: null }
 } catch { return { result: [], error: 'Unable to load website previews.' } }
}
