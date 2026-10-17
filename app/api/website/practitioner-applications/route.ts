import { NextRequest } from 'next/server'
import { database, JS_ORGANIZATION_ID } from '@/lib/jeevansutra/customer-server'
import { applicationInput } from '@/lib/jeevansutra/practitioner-input'
import { readBody, reply, rateLimit, applicantIdentity } from '@/lib/jeevansutra/practitioner-server'
export const runtime = 'nodejs'
export async function POST(request: NextRequest) {
  if (process.env.JS_PRACTITIONER_APPLICATIONS_ENABLED !== 'true') return reply({ error: 'Applications are not open yet.' }, 503)
  let body: Record<string, unknown>
  try { body = await readBody(request) } catch { return reply({ error: 'Invalid or oversized request. Please reload and retry.' }, 400) }
  let input
  try { input = applicationInput(body) } catch (error) { return reply({ error: (error as Error).message }, 400) }
  try {
    if (!await rateLimit(request, 'practitioner-apply')) return reply({ error: 'Too many attempts. Please try again in an hour.' }, 429)
    const identity = await applicantIdentity(request)
    if (!identity || identity.email !== input.email) return reply({ error: 'Verify the application email before submitting. If your session expired, reload and verify again.' }, 401)
    const result = await database('jeevansutra_practitioner_applications', {
      method: 'POST', body: JSON.stringify({ ...input, auth_user_id: identity.id, email_verified_at: new Date().toISOString(), organization_id: JS_ORGANIZATION_ID }),
    })
    if (!result.ok) {
      const error = await result.json().catch(() => ({}))
      // The same acknowledgement prevents email enumeration; an existing application is preserved.
      if (error.code !== '23505') throw new Error('Save failed')
    }
    const lookup = await database(`jeevansutra_practitioner_applications?auth_user_id=eq.${identity.id}&organization_id=eq.${JS_ORGANIZATION_ID}&select=${applicantFields}`)
    const rows = lookup.ok ? await lookup.json() : []
    if (rows.length !== 1) return reply({ error: 'An application already exists for this email but could not be linked to this account. Please contact the administrator.' }, 409)
    return reply({ success: true, applicationId: rows[0].id, application: rows[0], message: 'Thank you. Your application has been received. If you applied before, your existing application remains on file. Our team will review it before employee access is granted.' }, 201)
  } catch {
    console.error('[practitioner-apply] service failure')
    return reply({ error: 'Unable to save your application right now. Your entries are still here; please try again later.' }, 503)
  }
}

// Return applicant-facing fields only. Never expose invitation hashes or internal notes.
const applicantFields = 'id,full_name,mobile,email,city,state_region,country,expertise,methods,experience,languages,guidance_areas,qualification_type,qualification_details,consultation_mode,availability,introduction,portfolio_url,accuracy_consent,contact_consent,application_status,created_at,updated_at'
export async function GET(request: NextRequest) {
  try {
    const identity = await applicantIdentity(request)
    if (!identity) return reply({ error: 'Verify your email first.' }, 401)
    const result = await database(`jeevansutra_practitioner_applications?auth_user_id=eq.${encodeURIComponent(identity.id)}&organization_id=eq.${JS_ORGANIZATION_ID}&select=${applicantFields}&limit=2`)
    if (!result.ok) throw new Error('Lookup failed')
    const rows = await result.json()
    if (rows.length > 1) throw new Error('Ambiguous application')
    return reply({ success: true, application: rows[0] || null })
  } catch { return reply({ error: 'Unable to load your application. Please try again.' }, 503) }
}
export async function PATCH(request: NextRequest) {
  try {
    const body = await readBody(request)
    if (!await rateLimit(request, 'practitioner-edit')) return reply({ error: 'Too many attempts. Please retry later.' }, 429)
    const identity = await applicantIdentity(request)
    if (!identity) return reply({ error: 'Verify your email first.' }, 401)
    let input
    try { input = applicationInput(body) } catch (error) { return reply({ error: (error as Error).message }, 400) }
    if (input.email !== identity.email) return reply({ error: 'Use your verified email address.' }, 403)
    if (typeof body.version !== 'string' || !Number.isFinite(Date.parse(body.version))) return reply({ error: 'Reload your application before editing.' }, 400)
    // Atomic filters prevent overwriting an admin review or a concurrent edit.
    const result = await database(`jeevansutra_practitioner_applications?auth_user_id=eq.${encodeURIComponent(identity.id)}&organization_id=eq.${JS_ORGANIZATION_ID}&application_status=eq.pending&employee_id=is.null&updated_at=eq.${encodeURIComponent(body.version)}&select=${applicantFields}`, {
      method: 'PATCH', headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
    })
    if (!result.ok) throw new Error('Update failed')
    const rows = await result.json()
    if (rows.length !== 1) return reply({ error: 'Your application has changed or is already being reviewed. Reload to see its latest details.' }, 409)
    return reply({ success: true, application: rows[0], message: 'Your application details have been updated.' })
  } catch { return reply({ error: 'Unable to update your application. Your entries are still here; please retry.' }, 503) }
}
