import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "node:crypto"
import { customerIdentity, database } from "@/lib/jeevansutra/customer-server"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const bucket = "js-customer-photos"
const maxSize = 2097152
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } })
async function storage(path: string, init: RequestInit = {}) {
 const key = process.env.SUPABASE_SECRET_KEY
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL
 if (!key || !url) throw new Error("Storage unavailable")
 return fetch(new URL("/storage/v1/" + path, url), { ...init, headers: { apikey: key, ...(!key.startsWith("sb_secret_") ? { Authorization: "Bearer " + key } : {}), ...init.headers }, cache: "no-store", signal: AbortSignal.timeout(20000) })
}
function photoType(b: Uint8Array) {
 if (b.length >= 8 && [137,80,78,71,13,10,26,10].every((v,i) => b[i] === v)) return "image/png"
 if (b.length >= 3 && b[0] === 255 && b[1] === 216 && b[2] === 255) return "image/jpeg"
 if (b.length >= 12 && Buffer.from(b.slice(0,4)).toString() === "RIFF" && Buffer.from(b.slice(8,12)).toString() === "WEBP") return "image/webp"
 return null
}
export async function GET(request: NextRequest) {
 try {
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") return reply({error:"Customer access is unavailable."},503)
  const identity = await customerIdentity(request)
  if (!identity) return reply({error:"Please sign in first."},401)
  const result = await storage("object/" + bucket + "/" + encodeURIComponent(identity.userId) + "/profile")
  if (!result.ok) {
   if (result.status === 400 || result.status === 404) return reply({error:"No profile photo found."},404)
   throw new Error("Photo unavailable")
  }
  const bytes = new Uint8Array(await result.arrayBuffer())
  const mime = photoType(bytes)
  if (!mime || bytes.length > maxSize) throw new Error("Invalid photo")
  return new NextResponse(Buffer.from(bytes), {headers:{"Content-Type":mime,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}})
 } catch { return reply({error:"Unable to load your photo."},503) }
}
export async function POST(request: NextRequest) {
 try {
  if (request.headers.get("origin") !== request.nextUrl.origin) return reply({error:"Invalid request."},403)
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") return reply({error:"Customer access is unavailable."},503)
  const identity = await customerIdentity(request)
  if (!identity) return reply({error:"Please sign in first."},401)
  const secret = process.env.JS_RATE_LIMIT_HASH_SECRET
  if (!secret || secret.length < 32) throw new Error("Upload unavailable")
  const limit = await database("rpc/check_js_registration_rate_limit", {method:"POST",body:JSON.stringify({p_request_key:createHmac("sha256",secret).update("customer-photo:" + identity.userId).digest("hex"),p_max_attempts:10,p_window_minutes:60})})
  if (!limit.ok) throw new Error("Limit unavailable")
  if (await limit.json() !== true) return reply({error:"Please wait before uploading another photo."},429)
  const reader = request.body?.getReader()
  if (!reader) return reply({error:"Choose a photo."},400)
  const chunks: Uint8Array[] = []; let size = 0
  while (true) { const {done,value} = await reader.read(); if (done) break; size += value.byteLength; if (size > maxSize) { await reader.cancel(); return reply({error:"Choose a photo up to 2 MB."},413) } chunks.push(value) }
  const bytes = Buffer.concat(chunks)
  const mime = photoType(bytes)
  if (!mime) return reply({error:"Choose a JPEG, PNG or WebP photo."},400)
  const upload = await storage("object/" + bucket + "/" + encodeURIComponent(identity.userId) + "/profile", {method:"POST",headers:{"Content-Type":mime,"x-upsert":"true"},body:bytes})
  if (!upload.ok) throw new Error("Upload failed")
  return reply({saved:true})
 } catch { return reply({error:"Unable to save your photo. Please try again."},503) }
}
