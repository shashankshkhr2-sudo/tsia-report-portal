import 'server-only'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { database, JS_ORGANIZATION_ID } from './customer-server'
import { applicantIdentity } from './practitioner-server'
export const BUCKET = 'js-practitioner-documents'
export async function documentAccess(request: NextRequest, applicationId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(applicationId)) return null
  const response = await database(`jeevansutra_practitioner_applications?id=eq.${applicationId}&organization_id=eq.${JS_ORGANIZATION_ID}&select=id,auth_user_id,application_status`)
  if (!response.ok) throw new Error('Lookup failed')
  const rows = await response.json()
  if (rows.length !== 1) return null
  if (request.headers.has('authorization')) {
    const user = await applicantIdentity(request)
    return user && user.id === rows[0].auth_user_id ? { actor: user.id, admin: false, application: rows[0] } : null
  }
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return null
  const { data, error } = await client.rpc('can_review_js_applications', { p_organization_id: JS_ORGANIZATION_ID })
  return !error && data === true ? { actor: user.id, admin: true, application: rows[0] } : null
}
export async function storage(path: string, init: RequestInit) {
  const key = process.env.SUPABASE_SECRET_KEY; const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!key || !url) throw new Error('Storage unavailable')
  return fetch(new URL(`/storage/v1/${path}`, url), { ...init, headers: { apikey: key, ...(!key.startsWith('sb_secret_') ? { Authorization: `Bearer ${key}` } : {}), ...init.headers }, cache: 'no-store', signal: AbortSignal.timeout(20000) })
}
export function documentFormat(bytes: Uint8Array): { mime: string; extension: string } | null {
  if (bytes.length >= 5 && String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-') return { mime: 'application/pdf', extension: 'pdf' }
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((v, i) => bytes[i] === v)) return { mime: 'image/png', extension: 'png' }
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return { mime: 'image/jpeg', extension: 'jpg' }
  return null
}
