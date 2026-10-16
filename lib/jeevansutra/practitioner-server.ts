import 'server-only'
import { createHmac } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { database } from './customer-server'
export function reply(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
}
export async function readBody(request: NextRequest): Promise<Record<string, unknown>> {
  if (request.headers.get('origin') !== request.nextUrl.origin) throw new Error('Invalid request origin.')
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('Invalid request format.')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Missing request.')
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 20000) { await reader.cancel(); throw new Error('Request too large.') }
    chunks.push(value)
  }
  let body: unknown
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw new Error('Invalid request format.') }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid request format.')
  return body as Record<string, unknown>
}
export async function rateLimit(request: NextRequest, scope: string) {
  const secret = process.env.JS_RATE_LIMIT_HASH_SECRET
  const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
  if (!secret || secret.length < 32 || !ip) throw new Error('Service temporarily unavailable.')
  const key = createHmac('sha256', secret).update(`${scope}:${ip}`).digest('hex')
  const result = await database('rpc/check_js_practitioner_rate_limit', { method: 'POST', body: JSON.stringify({ p_key: key }) })
  if (!result.ok) throw new Error('Service temporarily unavailable.')
  return (await result.json()) === true
}

export async function applicantIdentity(request: NextRequest) {
  const match = /^Bearer ([A-Za-z0-9._-]{1,8192})$/.exec(request.headers.get('authorization') || '')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!match || !url || !key) return null
  const result = await fetch(new URL('/auth/v1/user', url), { headers: { apikey: key, Authorization: `Bearer ${match[1]}` }, cache: 'no-store', signal: AbortSignal.timeout(10000) })
  if (!result.ok) return null
  const user = await result.json()
  return user.id && user.email && user.email_confirmed_at && !user.is_anonymous ? { id: user.id as string, email: (user.email as string).trim().toLowerCase() } : null
}
