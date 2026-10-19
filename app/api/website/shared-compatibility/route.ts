import { compatibilityDraftEnabled } from "@/lib/jeevansutra/compatibility-release"
import { customerResult } from "@/lib/jeevansutra/compatibility-customer-result"
import { NextResponse } from "next/server"
import { createHash } from "node:crypto"
import { database, JS_ORGANIZATION_ID } from "@/lib/jeevansutra/customer-server"
import { sharingIdentity, shareableReading, sharingRateLimit } from "@/lib/jeevansutra/sharing-server"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const reply = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } })

export async function POST(request: Request) {
 try {
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply({ error: "Invalid request." }, 403)
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") return reply({ error: "Sharing is unavailable." }, 503)
  const identity = await sharingIdentity(request)
  if (!identity) return reply({ error: "Sign in or register using the invited email address." }, 401)
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "Invalid request." }, 415)
  const reader = request.body?.getReader()
  if (!reader) return reply({ error: "Invalid request." }, 400)
  const chunks: Uint8Array[] = []; let size = 0
  while (true) {
   const { done, value } = await reader.read(); if (done) break
   size += value.byteLength
   if (size > 1000) { await reader.cancel(); return reply({ error: "Request is too large." }, 413) }
   chunks.push(value)
  }
  let input
  try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")) } catch { return reply({ error: "Invalid invitation." }, 400) }
  let resolvedHash: string | undefined
  if (input && typeof input.id === "string" && input.token === undefined) {
   if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id)) return reply({ error: "Invalid invitation." }, 400)
   if (!await sharingRateLimit("inbox-action:" + identity.userId, 30)) return reply({ error: "Please wait before trying again." }, 429)
   const lookup = await database(`js_compatibility_shares?id=eq.${input.id}&recipient_email=eq.${encodeURIComponent(identity.email)}&organization_id=eq.${JS_ORGANIZATION_ID}&ready_at=not.is.null&select=token_hash&limit=1`)
   if (!lookup.ok) throw Error("Invitation lookup failed")
   const rows = await lookup.json()
   if (!rows[0]?.token_hash) return reply({ error: "Invitation is unavailable for this account." }, 404)
   input.token = ""
   resolvedHash = rows[0].token_hash
  }
  if (input?.action === "decline") {
   if (typeof input.token !== "string" || (!/^[a-f0-9]{64}$/.test(input.token) && !resolvedHash) || input.confirmed !== true) return reply({ error: "Confirm that you want to decline this invitation." }, 400)
   if (!await sharingRateLimit("decline:" + identity.userId, 30)) return reply({ error: "Please wait before trying again." }, 429)
   const hash = (resolvedHash || createHash("sha256").update(input.token).digest("hex"))
   const response = await database("rpc/decline_js_compatibility_share", { method: "POST", body: JSON.stringify({ p_auth_user_id: identity.userId, p_token_hash: hash }) })
   if (!response.ok) throw new Error("Decline failed")
   if (await response.json() !== true) return reply({ error: "Unable to decline this invitation. Check the invited email or refresh its status." }, 403)
   return reply({ declined: true })
  }
  if (!input || typeof input.token !== "string" || (!/^[a-f0-9]{64}$/.test(input.token) && !resolvedHash) || input.accepted !== true || input.consent !== true) return reply({ error: "Confirm that you want to accept this invitation." }, 400)
  if (typeof input.dob !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(input.dob)) return reply({ error: "Enter your date of birth to accept this invitation." }, 400)
  if (!await sharingRateLimit("accept:" + identity.userId, 30)) return reply({ error: "Please wait before trying again." }, 429)
  const hash = (resolvedHash || createHash("sha256").update(input.token).digest("hex"))
  const lookup = await database(`js_compatibility_shares?token_hash=eq.${hash}&organization_id=eq.${JS_ORGANIZATION_ID}&recipient_email=eq.${encodeURIComponent(identity.email)}&revoked_at=is.null&ready_at=not.is.null&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&select=id,preview_id,owner_user_id&limit=1`)
  if (!lookup.ok) throw new Error("Invitation lookup failed")
  const rows = await lookup.json(); const share = rows[0]
  if (!share || !await shareableReading(share.preview_id, share.owner_user_id)) return reply({ error: "Invitation is unavailable. Use the invited email address, or ask the sender for a new invitation." }, 404)
  const response = await database("rpc/accept_js_compatibility_share", { method: "POST", body: JSON.stringify({ p_auth_user_id: identity.userId, p_token_hash: hash, p_dob: input.dob }) })
  if (!response.ok) throw new Error("Acceptance failed")
  const id = await response.json()
  if (!id) return reply({ error: "Unable to verify this invitation. Check your email and date of birth, or contact the sender. If you have tried several times, wait one hour before trying again." }, 403)
  return reply({ accepted: true, id })
 } catch { return reply({ error: "Unable to accept the invitation. Please try again." }, 503) }
}

export async function GET(request: Request) {
 try {
  if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") return reply({ error: "Sharing is unavailable." }, 503)
  const identity = await sharingIdentity(request)
  if (!identity) return reply({ error: "Sign in with your verified registered account." }, 401)
  const params = new URL(request.url).searchParams
  const id = params.get("id")
  if (id !== null && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return reply({ error: "Invalid shared reading." }, 400)
  const offset = Number(params.get("offset") || "0")
  if (!Number.isSafeInteger(offset) || offset < 0) return reply({ error: "Invalid list position." }, 400)
  if (!id && params.get("view") === "inbox") {
   const response = await database(`js_compatibility_shares?recipient_email=eq.${encodeURIComponent(identity.email)}&organization_id=eq.${JS_ORGANIZATION_ID}&ready_at=not.is.null&select=id,owner_user_id,created_at,expires_at,accepted_at,accepted_user_id,declined_at,revoked_at&order=created_at.desc,id.desc&limit=100&offset=${offset}`)
   if (!response.ok) throw Error("Invitation inbox unavailable")
   type InboxRow = { id:string; owner_user_id:string; created_at:string; expires_at:string; accepted_at:string|null; accepted_user_id:string|null; declined_at:string|null; revoked_at:string|null }
   const rows:InboxRow[] = await response.json()
   const owners = Array.from(new Set(rows.map(row=>row.owner_user_id)))
   const names = new Map<string,string>()
   if (owners.length) {
    const access = await database("js_customer_access?organization_id=eq."+JS_ORGANIZATION_ID+"&auth_user_id=in.("+owners.join(",")+")&select=auth_user_id,client_id")
    if (!access.ok) throw Error("Sender lookup unavailable")
    const mappings:{auth_user_id:string;client_id:string}[] = await access.json()
    const ids = Array.from(new Set(mappings.map(row=>row.client_id)))
    if (ids.length) {
     const clientsResponse = await database("clients?organization_id=eq."+JS_ORGANIZATION_ID+"&id=in.("+ids.join(",")+")&select=id,full_name,current_name")
     if (!clientsResponse.ok) throw Error("Sender names unavailable")
     const clients:{id:string;full_name:string;current_name:string|null}[] = await clientsResponse.json()
     const byId = new Map(clients.map(client=>[client.id,client.current_name||client.full_name]))
     for (const mapping of mappings) { const name=byId.get(mapping.client_id);if(name)names.set(mapping.auth_user_id,name) }
    }
   }
   return reply({ invitations:rows.map(row=>({id:row.id,senderName:names.get(row.owner_user_id)||"Jeevan Sutra member",created_at:row.created_at,expires_at:row.expires_at,accepted_at:row.accepted_at,declined_at:row.declined_at,status:row.declined_at?"declined":row.revoked_at?"stopped":Date.parse(row.expires_at)<=Date.now()?"expired":row.accepted_at&&row.accepted_user_id===identity.userId?"accepted":row.accepted_at?"unavailable":"pending"})),nextOffset:rows.length===100?offset+100:null })
  }
  const fields = "id,auth_user_id,organization_id,created_at,version:preview->>version,kind:preview->>kind,relationship:preview->>relationship,people:preview->people" + (id ? ",preview" : "")
  const base = `js_compatibility_shares?accepted_user_id=eq.${identity.userId}&recipient_email=eq.${encodeURIComponent(identity.email)}&organization_id=eq.${JS_ORGANIZATION_ID}&revoked_at=is.null&ready_at=not.is.null&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&reading.is_active=eq.true&reading.organization_id=eq.${JS_ORGANIZATION_ID}`
  const response = await database(base + `&select=id,owner_user_id,created_at,expires_at,reading:js_compatibility_previews!inner(${fields})&order=created_at.desc,id.desc` + (id ? `&id=eq.${id}&limit=1` : `&limit=100&offset=${offset}`))
  if (!response.ok) throw new Error("Shared readings unavailable")
  type Row = { id: string; owner_user_id: string; created_at: string; expires_at: string; reading: { id: string; auth_user_id: string; organization_id: string; created_at: string; version?: string; kind: string; relationship?: string; people: { name: string }[]; preview?: unknown } }
  const rows: Row[] = await response.json()
  const visible = rows.filter(row => row.reading && row.reading.auth_user_id === row.owner_user_id && row.reading.organization_id === JS_ORGANIZATION_ID && (compatibilityDraftEnabled() || row.reading.version !== "JS_COMPATIBILITY_V2_DRAFT_1"))
  if (id) {
   const row = visible[0]
   if (!row) return reply({ error: "Shared insights are unavailable or access has expired." }, 404)
   return reply({ id: row.id, preview: customerResult(row.reading.preview), expires_at: row.expires_at })
  }
  const senderNames = new Map<string,string>()
  const owners = Array.from(new Set(visible.map(row=>row.owner_user_id)))
  if (owners.length) {
   const access = await database("js_customer_access?organization_id=eq."+JS_ORGANIZATION_ID+"&auth_user_id=in.("+owners.map(encodeURIComponent).join(",")+")&select=auth_user_id,client_id")
   if (!access.ok) throw Error("Sender lookup unavailable")
   const mappings: {auth_user_id:string;client_id:string}[] = await access.json()
   const ids = Array.from(new Set(mappings.map(row=>row.client_id)))
   if (ids.length) {
    const response = await database("clients?organization_id=eq."+JS_ORGANIZATION_ID+"&id=in.("+ids.map(encodeURIComponent).join(",")+")&select=id,full_name,current_name")
    if (!response.ok) throw Error("Sender names unavailable")
    const clients: {id:string;full_name:string;current_name:string|null}[] = await response.json()
    const names = new Map(clients.map(client=>[client.id,client.current_name||client.full_name]))
    for (const mapping of mappings) { const name=names.get(mapping.client_id); if(name)senderNames.set(mapping.auth_user_id,name) }
   }
  }
  return reply({ history: visible.map(row => ({ id: row.id, senderName: senderNames.get(row.owner_user_id) || null, created_at: row.created_at, expires_at: row.expires_at, preview: { kind: row.reading.kind, relationship: row.reading.relationship || null, people: row.reading.people.map(person => ({ name: person.name })) } })), nextOffset: rows.length === 100 ? offset + 100 : null })
 } catch { return reply({ error: "Unable to load shared insights. Please try again." }, 503) }
}
