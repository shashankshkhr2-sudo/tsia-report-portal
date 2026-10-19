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
import { sharingIdentity } from "@/lib/jeevansutra/sharing-server"
import { JS_ORGANIZATION_ID } from "@/lib/jeevansutra/customer-server"
import { compatibilityDraftEnabled } from "@/lib/jeevansutra/compatibility-release"
export async function GET(request: NextRequest) {
 try {
  if(process.env.JS_CUSTOMER_GUIDANCE_ENABLED!=="true")return reply({error:"Unavailable"},503)
  const identity=await sharingIdentity(request);if(!identity)return reply({error:"Please sign in"},401)
  const id=request.nextUrl.searchParams.get("id")||"";const person=request.nextUrl.searchParams.get("person")
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)||(person!=="0"&&person!=="1"))return reply({error:"Invalid photo"},400)
  const response=await database("js_compatibility_shares?id=eq."+id+"&accepted_user_id=eq."+identity.userId+"&recipient_email=eq."+encodeURIComponent(identity.email)+"&organization_id=eq."+JS_ORGANIZATION_ID+"&revoked_at=is.null&ready_at=not.is.null&expires_at=gt."+encodeURIComponent(new Date().toISOString())+"&reading.is_active=eq.true&reading.organization_id=eq."+JS_ORGANIZATION_ID+"&select=owner_user_id,reading:js_compatibility_previews!inner(id,auth_user_id,version:preview->>version,people:preview->people)&limit=1")
  if(!response.ok)throw Error("Lookup unavailable")
  const rows=await response.json();const share=rows[0];const reading=share?.reading
  if(!reading||reading.auth_user_id!==share.owner_user_id||(!compatibilityDraftEnabled()&&reading.version==="JS_COMPATIBILITY_V2_DRAFT_1"))return reply({error:"Photo unavailable"},404)
  const owner=encodeURIComponent(share.owner_user_id)
  const path=person==="0"?"object/js-customer-photos/"+owner+"/profile":"object/js-connection-photos/"+owner+"/"+encodeURIComponent(reading.id)
  const normalise=(value:unknown)=>typeof value==="string"?value.normalize("NFKC").trim().replace(/\s+/g," ").toLocaleLowerCase():""
  const connectionName=normalise(reading.people?.[1]?.name)
  const ownNames=[identity.client.current_name,identity.client.full_name].map(normalise).filter(Boolean)
  const ownPhoto=person==="1"&&connectionName&&ownNames.includes(connectionName)
  let result=await storage(ownPhoto?"object/js-customer-photos/"+encodeURIComponent(identity.userId)+"/profile":path)
  if(ownPhoto&&(result.status===400||result.status===404))result=await storage(path)
  if(!result.ok)return reply({error:"Photo unavailable"},result.status===400||result.status===404?404:503)
  const bytes=new Uint8Array(await result.arrayBuffer());const mime=photoType(bytes)
  if(!mime||bytes.length>maxSize)throw Error("Invalid photo")
  return new NextResponse(Buffer.from(bytes),{headers:{"Content-Type":mime,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}})
 }catch{return reply({error:"Photo unavailable"},503)}
}
