import { NextRequest } from 'next/server'
import { database } from '@/lib/jeevansutra/customer-server'
import { applicantIdentity, readBody, reply, rateLimit } from '@/lib/jeevansutra/practitioner-server'
export async function POST(request: NextRequest) {
  if (process.env.JS_PRACTITIONER_APPLICATIONS_ENABLED !== 'true') return reply({ error: 'Applications are not open yet.' }, 503)
  try {
    await readBody(request)
    if (!await rateLimit(request, 'practitioner-contact')) return reply({ error: 'Too many attempts. Please retry later.' }, 429)
    const user = await applicantIdentity(request)
    if (!user) return reply({ error: 'Verify your email first.' }, 401)
    const profile = await database(`profiles?id=eq.${user.id}&select=role,is_active,organization_id`)
    const access = await database(`js_customer_access?auth_user_id=eq.${user.id}&select=auth_user_id`)
    if (!profile.ok || !access.ok) throw new Error('Lookup failed')
    const rows = await profile.json(); const mappings = await access.json()
    if (rows.length !== 1 || rows[0].is_active || rows[0].organization_id || !['customer', 'report_generator'].includes(rows[0].role?.trim().toLowerCase()) || mappings.length) return reply({ error: 'This email already belongs to a customer or staff account. Contact the administrator to apply without changing that account.' }, 409)
    return reply({ success: true })
  } catch { return reply({ error: 'Unable to check contact verification. Please retry later.' }, 503) }
}

export async function GET() { return reply({ enabled: process.env.JS_PRACTITIONER_APPLICATIONS_ENABLED === 'true' }) }
