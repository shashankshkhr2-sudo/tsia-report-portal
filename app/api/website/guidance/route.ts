import { NextResponse } from 'next/server'
import { customerGuidanceCopy } from '@/lib/jeevansutra/customer-copy'
import { createHmac } from 'node:crypto'
import { customerIdentity, database, JS_ORGANIZATION_ID } from '@/lib/jeevansutra/customer-server'
import { guidanceTopics, validateIntake, describeIntake, type GuidanceTopic } from '@/lib/jeevansutra/intake'
import { calculateNumerologyV2 } from '@/lib/numerology/calculations'
import { runNumerologyV3FromCalculation } from '@/lib/numerology-intelligence/engine'
import { buildUniversalNumerologyIntelligence } from '@/lib/consultation/universal-numerology-intelligence'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
function enabled() { return process.env.JS_CUSTOMER_GUIDANCE_ENABLED === 'true' }
export async function GET(request: Request) {
 try {
  if (!enabled()) return reply({ error: 'Customer guidance is not open yet.' }, 503)
  const identity = await customerIdentity(request)
  if (!identity) return reply({ error: 'Please sign in, or complete your registration first.' }, 401)
  const calculation = calculateNumerologyV2({ fullName: identity.client.current_name || identity.client.full_name, dateOfBirth: identity.client.date_of_birth })
  const history = await database(`js_guidance_snapshots?auth_user_id=eq.${identity.userId}&client_id=eq.${identity.client.id}&select=id,topic,intake,preview,created_at&order=created_at.desc&limit=20`)
  if (!history.ok) return reply({ error: 'Unable to load saved guidance.' }, 503)
  return reply({ profile: { name: calculation.input.fullName, dob: calculation.input.dateOfBirth }, calculation, history: await history.json() })
 } catch { return reply({ error: 'Unable to load guidance. Please try again.' }, 503) }
}
export async function POST(request: Request) {
 try {
  if (!enabled()) return reply({ error: 'Customer guidance is not open yet.' }, 503)
  const identity = await customerIdentity(request)
  if (!identity) return reply({ error: 'Please sign in, or complete registration first.' }, 401)
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Invalid request.' }, 415)
  const reader = request.body?.getReader()
  if (!reader) return reply({ error: 'Invalid request.' }, 400)
  const chunks: Uint8Array[] = []
  let length = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    length += value.byteLength
    if (length > 12000) { await reader.cancel(); return reply({ error: 'Please shorten your answers.' }, 413) }
    chunks.push(value)
  }
  const bytes = Buffer.concat(chunks).toString('utf8')
  let input: Record<string, unknown>
  try { input = JSON.parse(bytes) } catch { return reply({ error: 'Invalid request.' }, 400) }
  if (!input || !guidanceTopics.includes(input.topic as GuidanceTopic) || typeof input.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) return reply({ error: 'Choose a valid guidance topic.' }, 400)
  let intake
  try { intake = validateIntake(input.topic as GuidanceTopic, input.intake) } catch (error) { return reply({ error: error instanceof Error ? error.message : 'Invalid answers.' }, 400) }
  const hashSecret = process.env.JS_RATE_LIMIT_HASH_SECRET
  if (!hashSecret || hashSecret.length < 32) return reply({ error: 'Guidance is temporarily unavailable.' }, 503)
  const limit = await database('rpc/check_js_registration_rate_limit', { method: 'POST', body: JSON.stringify({ p_request_key: createHmac('sha256', hashSecret).update(`guidance:${identity.userId}`).digest('hex'), p_max_attempts: 20, p_window_minutes: 60 }) })
  if (!limit.ok) return reply({ error: 'Guidance is temporarily unavailable.' }, 503)
  if (await limit.json() !== true) return reply({ error: 'Please wait before creating more previews.' }, 429)
  const existing = await database(`js_guidance_snapshots?auth_user_id=eq.${identity.userId}&request_id=eq.${input.requestId}&select=id,preview`)
  if (!existing.ok) return reply({ error: 'Unable to verify saved guidance.' }, 503)
  const existingRows = await existing.json()
  if (existingRows.length) return reply(existingRows[0])
  const calculation = calculateNumerologyV2({ fullName: identity.client.current_name || identity.client.full_name, dateOfBirth: identity.client.date_of_birth })
  const intelligence = runNumerologyV3FromCalculation(calculation)
  // Goal dates and income aspirations are discussion context, not future-timing requests.
  const guidance = buildUniversalNumerologyIntelligence({ topic: input.topic as GuidanceTopic, clientConcern: intake.obstacle, calculation, conclusions: intelligence.conclusions })
  const preview = { version: 'JS_FREE_PREVIEW_2', scope: customerGuidanceCopy(guidance.scope.suggestedResponse), insights: guidance.scope.canProvideNumerologyGuidance ? guidance.relevantQualities.slice(0, 2).map(item => ({ title: item.title, explanation: customerGuidanceCopy(item.interpretation), basis: item.verificationStatus })) : [], question: guidance.suggestedQuestions[0] || 'What would you most like to understand?', action: guidance.scope.canProvideNumerologyGuidance ? guidance.behaviouralDevelopment[0]?.practicalImprovement || '' : '', limitation: 'Traditional numerology-based reflection; not a prediction of earnings, events or other people’s feelings.' }
  const saved = await database('js_guidance_snapshots?on_conflict=auth_user_id,request_id', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=representation' }, body: JSON.stringify({ auth_user_id: identity.userId, client_id: identity.client.id, organization_id: JS_ORGANIZATION_ID, request_id: input.requestId, topic: input.topic, intake, preview, practitioner_context: { intakeSummary: describeIntake(intake), calculation, guidance, engineVersion: intelligence.engineVersion } }) })
  if (!saved.ok) return reply({ error: 'Your preview could not be saved. Please try again.' }, 503)
  const rows = await saved.json()
  if (!rows.length) {
   const retry = await database(`js_guidance_snapshots?auth_user_id=eq.${identity.userId}&request_id=eq.${input.requestId}&select=id,preview`)
   if (!retry.ok) return reply({ error: 'Unable to confirm saved guidance.' }, 503)
   const result = await retry.json()
   return result.length ? reply(result[0]) : reply({ error: 'Unable to confirm saved guidance.' }, 503)
  }
  return reply({ id: rows[0].id, preview: rows[0].preview }, 201)
 } catch { return reply({ error: 'Unable to prepare guidance. Please try again.' }, 503) }
}
