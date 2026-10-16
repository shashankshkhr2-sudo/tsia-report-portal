'use server'
import { createHash, randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
export async function reviewApplication(input: { id: string; status: string; notes: string; location: string }) {
  if (!/^[0-9a-f-]{36}$/i.test(input.id) || !['under_review', 'approved', 'rejected'].includes(input.status) || !input.notes.trim() || input.notes.length > 2000 || (input.location && !/^[0-9a-f-]{36}$/i.test(input.location))) return { error: 'Please check your review details.' }
  try {
    const client = await createClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user) return { error: 'Please sign in again.' }
    const token = input.status === 'approved' ? randomBytes(32).toString('hex') : null
    const { error } = await client.rpc('review_js_practitioner_application', {
      p_id: input.id, p_status: input.status, p_notes: input.notes.trim(),
      p_hash: token ? createHash('sha256').update(token).digest('hex') : null,
      p_location: input.location || null,
    })
    if (error) return { error: 'Unable to save. Check your access, location and whether this applicant is already an employee.' }
    revalidatePath('/applications')
    return { success: true, token }
  } catch { return { error: 'Review service unavailable. Please retry.' } }
}

export async function reviewDocument(input: { id: string; applicationId: string; status: string; notes: string }) {
  if (!/^[0-9a-f-]{36}$/i.test(input.id) || !/^[0-9a-f-]{36}$/i.test(input.applicationId) || !['not_reviewed', 'verified', 'needs_clarification'].includes(input.status) || !input.notes.trim() || input.notes.length > 2000) return { error: 'Check the document review details.' }
  try {
    const client = await createClient()
    const { error } = await client.rpc('review_js_practitioner_document', { p_id: input.id, p_application: input.applicationId, p_status: input.status, p_notes: input.notes.trim() })
    if (error) return { error: 'Unable to save document review. Check administrator access.' }
    revalidatePath('/applications'); return { success: true }
  } catch { return { error: 'Document review unavailable.' } }
}
export async function addInterviewNote(input: { applicationId: string; notes: string; mode: string }) {
  if (!/^[0-9a-f-]{36}$/i.test(input.applicationId) || !['telephone', 'in_person', 'other'].includes(input.mode) || !input.notes.trim() || input.notes.length > 2000) return { error: 'Enter valid interview details.' }
  try {
    const client = await createClient()
    const { error } = await client.rpc('add_js_practitioner_interview_note', { p_application: input.applicationId, p_mode: input.mode, p_notes: input.notes.trim() })
    if (error) return { error: 'Unable to save interview note. Check administrator access.' }
    revalidatePath('/applications'); return { success: true }
  } catch { return { error: 'Interview notes unavailable.' } }
}
