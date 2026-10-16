'use client'
import { useEffect, useState, type FormEvent } from 'react'
import { reviewDocument, addInterviewNote } from '@/app/applications/actions'
type Document = { id: string; original_name: string; document_type: string; upload_source: string; uploaded_at: string; uploaded_by: string; uploaded_by_name: string; review_status: string; review_notes: string | null; notes: string }
export default function ApplicationDocuments({ applicationId, token, admin = false }: { applicationId: string; token?: string; admin?: boolean }) {
  const [documents, setDocuments] = useState<Document[]>([]); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false)
  const [notes, setNotes] = useState(''); const [interview, setInterview] = useState(''); const [interviewMode, setInterviewMode] = useState('telephone')
  const endpoint = `/api/website/practitioner-documents?application=${applicationId}`
  const headers = (): Record<string, string> => token ? { Authorization: `Bearer ${token}` } : {}
  async function load() {
    try { const response = await fetch(endpoint, { headers: headers(), cache: 'no-store' }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setDocuments(result.documents) } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load documents.') }
  }
  useEffect(() => { void load() }, [applicationId, token])
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setBusy(true); setMessage('')
    try { const response = await fetch(endpoint, { method: 'POST', headers: headers(), body: new FormData(form) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); form.reset(); setMessage('Document saved privately. It is not yet reviewed.'); await load() } catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed.') } finally { setBusy(false) }
  }
  async function open(id: string) {
    setBusy(true)
    try { const response = await fetch(`${endpoint}&document=${id}`, { headers: headers(), cache: 'no-store' }); const result = await response.json(); if (!response.ok) throw new Error(result.error); window.location.assign(result.url) } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to open document.') } finally { setBusy(false) }
  }
  async function review(id: string, status: string) {
    setBusy(true)
    try { const result = await reviewDocument({ id, applicationId, status, notes }); setMessage(result.error || 'Document review saved.'); if (!result.error) { setNotes(''); await load() } } catch { setMessage('Unable to save review.') } finally { setBusy(false) }
  }
  async function saveInterview() {
    setBusy(true)
    try { const result = await addInterviewNote({ applicationId, notes: interview, mode: interviewMode }); setMessage(result.error || 'Interview note saved in review history.'); if (!result.error) setInterview('') } catch { setMessage('Unable to save interview note.') } finally { setBusy(false) }
  }
  return <section className="mt-8 min-w-0 rounded-2xl border bg-white p-5 text-[#392c30]">
    <h3 className="font-serif text-2xl text-[#64263B]">Education & Qualification Documents</h3><p className="mt-3 text-sm leading-7">Optional. Attach degrees or certificates if available. Self-taught applicants can apply without attachments. PDF, JPEG or PNG; up to 5 MB each, maximum 10 documents. Please do not upload client records or identity documents.</p>
    <form onSubmit={upload} className="mt-5 space-y-4"><label className="block text-sm">Document type<select name="documentType" className="mt-2 w-full rounded-xl border bg-white p-3"><option value="degree">Degree</option><option value="certificate">Certificate</option><option value="other_qualification">Other qualification</option></select></label><label className="block text-sm">Document file<input name="file" type="file" accept="application/pdf,image/jpeg,image/png" required className="mt-2 block w-full text-sm" /></label><label className="block text-sm">Notes {admin ? '(include when/how it was received)' : '(optional)'}<textarea name="notes" maxLength={2000} rows={2} className="mt-2 w-full rounded-xl border p-3" /></label><button disabled={busy} className="rounded-xl bg-[#64263B] px-5 py-3 text-white disabled:opacity-50">{busy ? 'Please wait…' : admin ? 'Attach Document as Administrator' : 'Attach Document'}</button></form>
    <div className="mt-6 space-y-4">{documents.map(doc => <article key={doc.id} className="rounded-xl border p-4"><p className="break-words font-medium">{doc.original_name}</p><p className="mt-2 text-xs leading-6">{doc.document_type.replaceAll('_', ' ')} · Added by {doc.uploaded_by_name || doc.uploaded_by} ({doc.upload_source}) · {new Date(doc.uploaded_at).toLocaleString('en-IN')}</p><p className="text-sm">Status: {doc.review_status.replaceAll('_', ' ')}</p>{doc.notes && <p className="mt-2 whitespace-pre-wrap text-sm">Upload notes: {doc.notes}</p>}{doc.review_notes && <p className="mt-2 whitespace-pre-wrap text-sm">Review notes: {doc.review_notes}</p>}<button type="button" disabled={busy} onClick={() => open(doc.id)} className="mt-3 underline">Open private document</button>{admin && <div className="mt-3 flex flex-wrap gap-3">{[['not_reviewed', 'Not reviewed'], ['verified', 'Verified'], ['needs_clarification', 'Needs clarification']].map(([value, title]) => <button key={value} disabled={busy || !notes.trim()} onClick={() => review(doc.id, value)} type="button" className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">{title}</button>)}</div>}</article>)}</div>
    {admin && <><label className="mt-5 block text-sm">Document review notes (required when changing a status)<textarea value={notes} onChange={e => setNotes(e.target.value)} maxLength={2000} rows={2} className="mt-2 w-full rounded-xl border p-3" /></label><div className="mt-7 border-t pt-5"><h4 className="font-semibold">Interview notes</h4><select aria-label="Interview mode" value={interviewMode} onChange={e => setInterviewMode(e.target.value)} className="mt-3 w-full rounded-xl border bg-white p-3"><option value="telephone">Telephone interview</option><option value="in_person">In-person interview</option><option value="other">Other follow-up</option></select><textarea aria-label="Interview notes" value={interview} onChange={e => setInterview(e.target.value)} maxLength={2000} rows={3} className="mt-3 w-full rounded-xl border p-3" /><button type="button" disabled={busy || !interview.trim()} onClick={saveInterview} className="mt-3 rounded-xl bg-[#64263B] px-5 py-3 text-white disabled:opacity-50">Save Interview Note</button></div></>}
    {message && <p role="status" className="mt-4 text-sm leading-7">{message}</p>}
  </section>
}
