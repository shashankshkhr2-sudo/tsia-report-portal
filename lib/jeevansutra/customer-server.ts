import 'server-only'
export const JS_ORGANIZATION_ID = 'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'
export async function database(path: string, init: RequestInit = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) throw new Error('Customer service is unavailable.')
  const headers: Record<string, string> = { apikey: key, 'Content-Type': 'application/json', ...(init.headers as Record<string, string> || {}) }
  if (!key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${key}`
  return fetch(new URL(`/rest/v1/${path}`, url), { ...init, headers, cache: 'no-store', signal: AbortSignal.timeout(10000) })
}
export async function customerIdentity(request: Request) {
  const match = /^Bearer ([A-Za-z0-9._-]+)$/.exec(request.headers.get('authorization') || '')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!match || match[1].length > 8192 || !url || !key) return null
  const response = await fetch(new URL('/auth/v1/user', url), { headers: { apikey: key, Authorization: `Bearer ${match[1]}` }, cache: 'no-store', signal: AbortSignal.timeout(10000) })
  if (!response.ok) return null
  const user = await response.json()
  if (!user.id || !user.email_confirmed_at) return null
  const mapping = await database(`js_customer_access?auth_user_id=eq.${encodeURIComponent(user.id)}&organization_id=eq.${JS_ORGANIZATION_ID}&select=client_id`)
  if (!mapping.ok) throw new Error('Unable to load your saved registration.')
  const rows = await mapping.json()
  if (rows.length !== 1) return null
  const client = await database(`clients?id=eq.${rows[0].client_id}&organization_id=eq.${JS_ORGANIZATION_ID}&select=id,full_name,current_name,date_of_birth`)
  if (!client.ok) throw new Error('Unable to load your profile.')
  const clients = await client.json()
  return clients.length === 1 ? { userId: user.id as string, email: typeof user.email === "string" ? user.email.trim().toLowerCase() : "", isAnonymous: user.is_anonymous === true, client: clients[0] as { id: string; full_name: string; current_name: string | null; date_of_birth: string } } : null
}
