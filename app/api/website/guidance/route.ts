import { NextResponse } from 'next/server'
import { customerIdentity } from '@/lib/jeevansutra/customer-server'
import { calculateNumerologyV2 } from '@/lib/numerology/calculations'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
export async function GET(request: Request) {
 try {
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== 'true') return reply({ error: 'Customer guidance is not open yet.' }, 503)
  const identity = await customerIdentity(request)
  if (!identity) return reply({ error: 'Please sign in, or complete your registration first.' }, 401)
  const calculation = calculateNumerologyV2({ fullName: identity.client.current_name || identity.client.full_name, dateOfBirth: identity.client.date_of_birth })
  // Historical topic snapshots remain stored; free access returns calculations only.
  return reply({ profile: { name: calculation.input.fullName, dob: calculation.input.dateOfBirth }, calculation, history: [] })
 } catch { return reply({ error: 'Unable to load your profile. Please try again.' }, 503) }
}
export async function POST(request: Request) {
 try {
  const identity = await customerIdentity(request)
  if (!identity) return reply({ error: 'Please sign in first.' }, 401)
  return reply({ error: 'Personalized topic guidance is a paid service. Checkout is coming soon.' }, 403)
 } catch { return reply({ error: 'Unable to verify your account. Please try again.' }, 503) }
}
