import { NextRequest } from 'next/server'
import { createHash } from 'node:crypto'
import { database } from '@/lib/jeevansutra/customer-server'
import { readBody, reply, rateLimit } from '@/lib/jeevansutra/practitioner-server'
export const runtime = 'nodejs'
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try { body = await readBody(request) } catch { return reply({ error: 'Invalid request.' }, 400) }
  const match = /^Bearer ([A-Za-z0-9._-]{1,8192})$/.exec(request.headers.get('authorization') || '')
  if (!match || typeof body.invite !== 'string' || !/^[a-f0-9]{64}$/.test(body.invite)) return reply({ error: 'Sign in and use your complete onboarding link.' }, 400)
  try {
    if (!await rateLimit(request, 'practitioner-onboarding')) return reply({ error: 'Too many attempts. Please try again in an hour.' }, 429)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!url || !key) throw new Error('Configuration missing')
    const verified = await fetch(new URL('/auth/v1/user', url), { headers: { apikey: key, Authorization: `Bearer ${match[1]}` }, cache: 'no-store', signal: AbortSignal.timeout(10000) })
    if (!verified.ok) return reply({ error: 'Please sign in again with your verified application email.' }, 401)
    const user = await verified.json()
    if (!user.id || !user.email_confirmed_at || user.is_anonymous) return reply({ error: 'Confirm your email before activating employee access.' }, 403)
    const result = await database('rpc/claim_js_practitioner_invitation', { method: 'POST', body: JSON.stringify({ p_hash: createHash('sha256').update(body.invite).digest('hex'), p_user: user.id }) })
    if (!result.ok) return reply({ error: 'Unable to activate: the link may be expired or used, your email may differ, or your account already has a customer/staff profile. Contact the administrator; existing accounts are preserved.' }, 409)
    return reply({ success: true })
  } catch { return reply({ error: 'Onboarding unavailable. Please retry later.' }, 503) }
}
