import { sharingEmailContent } from "@/lib/jeevansutra/sharing-email-template"
import { randomBytes, randomUUID, createHash } from "node:crypto"
import { sharingRateLimit } from "@/lib/jeevansutra/sharing-server"
import { sendSharingInvitation, sharingSite } from "@/lib/jeevansutra/sharing-email"
import { NextResponse } from "next/server"
import { database, JS_ORGANIZATION_ID } from "@/lib/jeevansutra/customer-server"
import { sharingIdentity, shareableReading } from "@/lib/jeevansutra/sharing-server"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const reply = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } })
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: Request) {
 try {
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") return reply({ error: "Sharing is unavailable." }, 503)
  const identity = await sharingIdentity(request)
  if (!identity) return reply({ error: "Sign in with your verified registered account." }, 401)
  const id = new URL(request.url).searchParams.get("id") || ""
  if (!uuid.test(id)) return reply({ error: "Invalid saved reading." }, 400)
  if (!await shareableReading(id, identity.userId)) return reply({ error: "Saved reading is unavailable." }, 404)
  const offset = Number(new URL(request.url).searchParams.get("offset") || "0")
  if (!Number.isSafeInteger(offset) || offset < 0) return reply({ error: "Invalid page." }, 400)
  const response = await database(`js_compatibility_shares?preview_id=eq.${id}&owner_user_id=eq.${identity.userId}&organization_id=eq.${JS_ORGANIZATION_ID}&select=id,recipient_email,created_at,expires_at,revoked_at,accepted_at,email_sent_at,ready_at,delivery_channel&order=created_at.desc,id.desc&limit=100&offset=${offset}`)
  if (!response.ok) throw new Error("Invitation list unavailable")
  const invitations = await response.json()
  return reply({ invitations, nextOffset: invitations.length === 100 ? offset + 100 : null })
 } catch { return reply({ error: "Unable to load invitations. Please try again." }, 503) }
}

export async function DELETE(request: Request) {
 try {
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply({ error: "Invalid request." }, 403)
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") return reply({ error: "Sharing is unavailable." }, 503)
  const identity = await sharingIdentity(request)
  if (!identity) return reply({ error: "Sign in with your verified registered account." }, 401)
  const id = new URL(request.url).searchParams.get("id") || ""
  if (!uuid.test(id)) return reply({ error: "Invalid invitation." }, 400)
  const recipient = new URL(request.url).searchParams.get("recipient")
  if (recipient !== null) {
   const email = recipient.trim().toLowerCase()
   if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ error: "Invalid recipient." }, 400)
   if (!await shareableReading(id, identity.userId)) return reply({ error: "Saved reading is unavailable." }, 404)
   const response = await database(`js_compatibility_shares?preview_id=eq.${id}&owner_user_id=eq.${identity.userId}&organization_id=eq.${JS_ORGANIZATION_ID}&recipient_email=eq.${encodeURIComponent(JSON.stringify(email))}&revoked_at=is.null`, { method: "PATCH", body: JSON.stringify({ revoked_at: new Date().toISOString() }) })
   if (!response.ok) throw new Error("Revocation failed")
   return reply({ revoked: true, recipient: email })
  }
  const response = await database(`js_compatibility_shares?id=eq.${id}&owner_user_id=eq.${identity.userId}&organization_id=eq.${JS_ORGANIZATION_ID}&select=id`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ revoked_at: new Date().toISOString() }) })
  if (!response.ok) throw new Error("Revocation failed")
  const rows = await response.json()
  if (!rows.length) return reply({ error: "Invitation is unavailable." }, 404)
  return reply({ revoked: true, id })
 } catch { return reply({ error: "Unable to revoke access. Please try again." }, 503) }
}

export async function POST(request: Request) {
 try {
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply({ error: "Invalid request." }, 403)
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") return reply({ error: "Sharing is unavailable." }, 503)
  const identity = await sharingIdentity(request)
  if (!identity) return reply({ error: "Sign in with your verified registered account." }, 401)
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "Invalid request." }, 415)
  const reader = request.body?.getReader()
  if (!reader) return reply({ error: "Invalid request." }, 400)
  const chunks: Uint8Array[] = []; let size = 0
  while (true) {
   const { done, value } = await reader.read(); if (done) break
   size += value.byteLength
   if (size > 2000) { await reader.cancel(); return reply({ error: "Request is too large." }, 413) }
   chunks.push(value)
  }
  let input
  try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")) } catch { return reply({ error: "Invalid request." }, 400) }
  if (!input || typeof input.id !== "string" || !uuid.test(input.id) || typeof input.email !== "string" || input.confirmed !== true) return reply({ error: "Choose saved insights and confirm the recipient email." }, 400)
  const delivery = input.delivery ?? "email"
  if (delivery !== "email" && delivery !== "manual") return reply({ error: "Choose a valid sharing option." }, 400)
  const email = input.email.trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@<>(),;:\"]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return reply({ error: "Enter a valid recipient email." }, 400)
  if (email === identity.email) return reply({ error: "Choose the other person’s email address." }, 400)
  const reading = await shareableReading(input.id, identity.userId)
  if (!reading) return reply({ error: "Saved reading is unavailable." }, 404)
  sharingSite()
  if (delivery === "email" && !process.env.RESEND_API_KEY) throw new Error("Email is not configured")
  if (!await sharingRateLimit("owner:" + identity.userId, 10)) return reply({ error: "Please wait before sending another invitation." }, 429)
  if (!await sharingRateLimit("recipient:" + email, 10)) return reply({ error: "Please wait before sending another invitation." }, 429)
  const id = randomUUID()
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const saved = await database("js_compatibility_shares", { method: "POST", body: JSON.stringify({ id, preview_id: input.id, owner_user_id: identity.userId, organization_id: JS_ORGANIZATION_ID, recipient_email: email, token_hash: createHash("sha256").update(token).digest("hex"), expires_at: expiresAt, delivery_channel: delivery }) })
  if (!saved.ok) throw new Error("Unable to save invitation")
  if (delivery === "email") await sendSharingInvitation({ email, senderName: identity.client.current_name || identity.client.full_name, token, shareId: id, reading: reading.preview })
  const marked = await database(`js_compatibility_shares?id=eq.${id}&owner_user_id=eq.${identity.userId}&organization_id=eq.${JS_ORGANIZATION_ID}&revoked_at=is.null&select=id`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ ready_at: new Date().toISOString(), ...(delivery === "email" ? { email_sent_at: new Date().toISOString() } : {}) }) })
  if (!marked.ok) throw new Error("Unable to activate invitation")
  const rows = await marked.json()
  if (!rows.length) throw new Error("Invitation is unavailable")
  if (delivery === "manual") {
   const link = sharingSite() + "/website/shared-compatibility#invite=" + token
   const content = sharingEmailContent(reading.preview, identity.client.current_name || identity.client.full_name, link)
   return reply({ id, delivery, link, text: content.shareText, recipient_email: email, expires_at: expiresAt }, 201)
  }
  return reply({ id, delivery, sent: true, expires_at: expiresAt }, 201)
 } catch { return reply({ error: "Unable to confirm the invitation. Refresh the invitation list before trying again." }, 503) }
}
