import { NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'
import { customerIdentity, database, JS_ORGANIZATION_ID } from '@/lib/jeevansutra/customer-server'
import { comparisonPerson, launchKinds, launchPreview } from '@/lib/jeevansutra/compatibility-launch'
import { validRelationship, priorities as allowedPriorities } from '@/lib/jeevansutra/compatibility-contract'
import { buildCompatibility } from '@/lib/jeevansutra/compatibility-engine'
import { compatibilityDraftEnabled } from '@/lib/jeevansutra/compatibility-release'
import { customerResult } from '@/lib/jeevansutra/compatibility-customer-result'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const reply = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } })
export async function GET(request: Request) {
  try {
    if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== 'true') return reply({ error: 'Customer previews are not open yet.' }, 503)
    const identity = await customerIdentity(request)
    if (!identity) return reply({ error: 'Sign in with your verified registered account first.' }, 401)
    const response = await database(`js_compatibility_previews?auth_user_id=eq.${identity.userId}&organization_id=eq.${JS_ORGANIZATION_ID}&select=id,preview,created_at&order=created_at.desc`)
    if (!response.ok) return reply({ error: 'Unable to load your complimentary previews.' }, 503)
    const rows = await response.json()
    const visible = rows.filter((row: { preview: { version?: string } }) => compatibilityDraftEnabled() || row.preview.version !== 'JS_COMPATIBILITY_V2_DRAFT_1')
    const history = visible.map((row: { id: string; preview: unknown; created_at: string }) => ({ id: row.id, created_at: row.created_at, preview: customerResult(row.preview) }))
    return reply({ history, remaining: Math.max(0, 3 - rows.length), draftEnabled: compatibilityDraftEnabled() })
  } catch { return reply({ error: 'Unable to load previews. Please try again.' }, 503) }
}
export async function POST(request: Request) {
  try {
    if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== 'true') return reply({ error: 'Customer previews are not open yet.' }, 503)
    const identity = await customerIdentity(request)
    if (!identity) return reply({ error: 'Sign in with your verified registered account first.' }, 401)
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Invalid request.' }, 415)
    const reader = request.body?.getReader()
    if (!reader) return reply({ error: 'Invalid request.' }, 400)
    const chunks: Uint8Array[] = []; let size = 0
    while (true) {
      const { done, value } = await reader.read(); if (done) break
      size += value.byteLength
      if (size > 2000) { await reader.cancel(); return reply({ error: 'Request is too large.' }, 413) }
      chunks.push(value)
    }
    let input
    try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return reply({ error: 'Invalid request.' }, 400) }
    const draft = compatibilityDraftEnabled()
    if (!input || (draft ? !validRelationship(input.kind, input.relationship) : !launchKinds.includes(input.kind)) || input.permission !== true || typeof input.name !== 'string' || typeof input.dob !== 'string') return reply({ error: 'Choose a comparison type and confirm permission.' }, 400)
    let other
    try { other = comparisonPerson(input.name, input.dob) } catch (error) { return reply({ error: error instanceof Error ? error.message : 'Check the other person’s details.' }, 400) }
    if (draft && (!other.dob || !Array.isArray(input.priorities) || input.priorities.length > 3
      || new Set(input.priorities).size !== input.priorities.length
      || input.priorities.some((p: unknown) => typeof p !== 'string' || !(allowedPriorities as readonly string[]).includes(p))
      || typeof input.selfRole !== 'string' || typeof input.otherRole !== 'string'
      || !input.selfRole.trim() || !input.otherRole.trim() || input.selfRole.length > 60 || input.otherRole.length > 60))
      return reply({ error: 'Both dates of birth, each person’s role and up to three valid priorities are required.' }, 400)
    const self = { name: identity.client.current_name || identity.client.full_name, dob: identity.client.date_of_birth.split('-').reverse().join('/') }
    const secret = process.env.JS_RATE_LIMIT_HASH_SECRET
    if (!secret || secret.length < 32) return reply({ error: 'Previews are temporarily unavailable.' }, 503)
    const limit = await database('rpc/check_js_registration_rate_limit', { method: 'POST', body: JSON.stringify({ p_request_key: createHmac('sha256', secret).update(`compatibility:${identity.userId}`).digest('hex'), p_max_attempts: 20, p_window_minutes: 60 }) })
    if (!limit.ok) return reply({ error: 'Previews are temporarily unavailable.' }, 503)
    if (await limit.json() !== true) return reply({ error: 'Please wait before trying again.' }, 429)
    // Include the self profile snapshot so a changed DOB never silently reuses an incompatible report.
    const key = createHmac('sha256', secret).update(JSON.stringify(draft ? ['v2-draft', input.kind, input.relationship, input.selfRole.trim().replace(/\s+/g, ' ').toLowerCase(), input.otherRole.trim().replace(/\s+/g, ' ').toLowerCase(), self.name.toLowerCase(), self.dob, other.name.toLowerCase(), other.dob] : [input.kind, other.name.toLowerCase(), other.dob])).digest('hex')
    const source = draft ? { self, other, kind: input.kind, relationship: input.relationship, selfRole: input.selfRole.trim(), otherRole: input.otherRole.trim(), priorities: input.priorities } : null
    const built = source ? buildCompatibility(source) : null
    const saved = await database(draft ? 'rpc/save_js_compatibility_v2_draft' : 'rpc/save_js_compatibility_preview', { method: 'POST', body: JSON.stringify({
      p_auth_user_id: identity.userId, p_comparison_key: key,
      p_preview: built ? built.standard : launchPreview(input.kind, self, other),
      ...(built && source ? { p_source: source, p_practitioner: built.practitioner } : {}),
    }) })
    if (!saved.ok) return reply({ error: 'Your preview could not be saved. Please try again.' }, 503)
    const result = await saved.json()
    if (result.limitReached) return reply({ error: 'You have used your three complimentary previews. Your saved previews remain available.', remaining: 0 }, 409)
    return reply({ id: result.id, preview: customerResult(result.preview), remaining: result.remaining, reused: result.reused })
  } catch { return reply({ error: 'Unable to prepare your preview. Please try again.' }, 503) }
}
