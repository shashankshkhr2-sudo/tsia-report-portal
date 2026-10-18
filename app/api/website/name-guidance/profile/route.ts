import { NextResponse } from 'next/server'
import { customerIdentity } from '@/lib/jeevansutra/customer-server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
export async function GET(request: Request) {
 try {
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== 'true') return reply({ error: 'Customer access is not open yet.' }, 503)
  const identity = await customerIdentity(request)
  if (!identity) return reply({ error: 'Sign in with a verified registered account.' }, 401)
  // Return only the signed-in customer's name and DOB; no IDs or other records.
  return reply({ name: identity.client.current_name || identity.client.full_name, dob: identity.client.date_of_birth })
 } catch { return reply({ error: 'Unable to load your profile.' }, 503) }
}
