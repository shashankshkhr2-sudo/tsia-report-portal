import { createHmac } from "node:crypto"
import { database, JS_ORGANIZATION_ID } from "@/lib/jeevansutra/customer-server"
import { compatibilityDraftEnabled } from "@/lib/jeevansutra/compatibility-release"
import { customerResult } from "@/lib/jeevansutra/compatibility-customer-result"
import "server-only"
import { customerIdentity } from "@/lib/jeevansutra/customer-server"

export async function sharingIdentity(request: Request) {
 const identity = await customerIdentity(request)
 if (!identity || identity.isAnonymous || !identity.email || identity.email.length > 254) return null
 return identity
}

export async function shareableReading(id: string, ownerId: string) {
 if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null
 const response = await database(`js_compatibility_previews?id=eq.${id}&auth_user_id=eq.${encodeURIComponent(ownerId)}&organization_id=eq.${JS_ORGANIZATION_ID}&is_active=eq.true&select=id,preview,created_at&limit=1`)
 if (!response.ok) throw new Error("Unable to check saved insights.")
 const rows = await response.json()
 const row = rows[0]
 if (!row || (!compatibilityDraftEnabled() && row.preview?.version === "JS_COMPATIBILITY_V2_DRAFT_1")) return null
 return { id: row.id as string, preview: customerResult(row.preview), created_at: row.created_at as string }
}

export async function sharingRateLimit(subject: string, maximum: number) {
 const secret = process.env.JS_RATE_LIMIT_HASH_SECRET
 if (!secret || secret.length < 32) throw new Error("Sharing is temporarily unavailable.")
 const response = await database("rpc/check_js_registration_rate_limit", {
  method: "POST", body: JSON.stringify({
   p_request_key: createHmac("sha256", secret).update("sharing:" + subject).digest("hex"),
   p_max_attempts: maximum, p_window_minutes: 60
  })
 })
 if (!response.ok) throw new Error("Sharing is temporarily unavailable.")
 return await response.json() === true
}
