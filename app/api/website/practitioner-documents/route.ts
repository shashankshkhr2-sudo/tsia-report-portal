import { NextRequest } from 'next/server'
import { randomUUID } from 'node:crypto'
import { database } from '@/lib/jeevansutra/customer-server'
import { reply, rateLimit } from '@/lib/jeevansutra/practitioner-server'
import { BUCKET, storage, documentAccess, documentFormat } from '@/lib/jeevansutra/practitioner-documents-server'
export const runtime = 'nodejs'
export async function GET(request: NextRequest) {
  try {
    const application = request.nextUrl.searchParams.get('application') || ''
    const access = await documentAccess(request, application)
    if (!access) return reply({ error: 'Access denied or session expired.' }, 403)
    const id = request.nextUrl.searchParams.get('document')
    const response = await database(`js_practitioner_documents?application_id=eq.${application}&select=id,original_name,document_type,upload_source,uploaded_at,review_status,review_notes,notes,storage_path,uploaded_by,uploaded_by_name`)
    if (!response.ok) throw new Error('Lookup failed')
    const rows = await response.json()
    if (!id) return reply({ documents: rows.map(({ storage_path, ...row }: { storage_path: string; [key: string]: unknown }) => row) })
    const doc = rows.find((row: { id: string }) => row.id === id)
    if (!doc) return reply({ error: 'Document unavailable.' }, 404)
    const signed = await storage(`object/sign/${BUCKET}/${doc.storage_path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 60 }) })
    const result = signed.ok ? await signed.json() : null
    if (!result?.signedURL) throw new Error('Sign failed')
    return reply({ url: new URL(`/storage/v1${result.signedURL}`, process.env.NEXT_PUBLIC_SUPABASE_URL).href })
  } catch { return reply({ error: 'Unable to load documents.' }, 503) }
}
export async function POST(request: NextRequest) {
  let uploadedPath: string | null = null
  try {
    if (request.headers.get('origin') !== request.nextUrl.origin) return reply({ error: 'Invalid request.' }, 403)
    const application = request.nextUrl.searchParams.get('application') || ''
    const access = await documentAccess(request, application)
    if (!access) return reply({ error: 'Access denied or session expired. Verify your email again if needed.' }, 403)
    if (!access.admin && !['pending', 'under_review'].includes(access.application.application_status)) return reply({ error: 'Please ask the administrator to add documents after review.' }, 403)
    if (!await rateLimit(request, 'practitioner-upload')) return reply({ error: 'Too many uploads. Please try again later.' }, 429)
    const reader = request.body?.getReader(); if (!reader) return reply({ error: 'No file supplied.' }, 400)
    const chunks: Uint8Array[] = []; let size = 0
    while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > 5 * 1024 * 1024 + 20000) { await reader.cancel(); return reply({ error: 'Maximum file size is 5 MB.' }, 413) } chunks.push(value) }
    const form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData()
    const file = form.get('file'); const kind = form.get('documentType'); const notes = form.get('notes')
    if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024 || !['degree', 'certificate', 'other_qualification'].includes(String(kind)) || typeof notes !== 'string' || notes.length > 2000) return reply({ error: 'Choose a degree or certificate file, up to 5 MB, and valid notes.' }, 400)
    const bytes = new Uint8Array(await file.arrayBuffer()); const format = documentFormat(bytes)
    if (!format) return reply({ error: 'Only PDF, JPEG and PNG files are accepted.' }, 400)
    const path = `${application}/${randomUUID()}.${format.extension}`
    const upload = await storage(`object/${BUCKET}/${path}`, { method: 'POST', headers: { 'Content-Type': format.mime, 'x-upsert': 'false' }, body: Buffer.from(bytes) })
    if (!upload.ok) throw new Error('Upload failed')
    uploadedPath = path
    const result = await database('rpc/register_js_practitioner_document', { method: 'POST', body: JSON.stringify({ p_application: application, p_actor: access.actor, p_admin: access.admin, p_path: path, p_name: file.name.slice(0, 180), p_type: kind, p_notes: notes.trim() }) })
    if (!result.ok) throw new Error('Register failed')
    uploadedPath = null
    return reply({ success: true }, 201)
  } catch {
    if (uploadedPath) await storage(`object/${BUCKET}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: [uploadedPath] }) }).catch(() => null)
    return reply({ error: 'Unable to save the document. Maximum 10 documents per application. Your application remains saved; please retry or contact the administrator.' }, 503)
  }
}
