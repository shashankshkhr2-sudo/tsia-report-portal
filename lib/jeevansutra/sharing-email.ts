import { sharingEmailContent } from "./sharing-email-template"
import type { CustomerReading } from "./compatibility-contract"
import "server-only"
export function sharingSite() {
 const value = process.env.JS_SHARING_SITE_URL
 if (!value) throw new Error("Sharing website is not configured.")
 const url = new URL(value)
 if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("Invalid sharing website configuration.")
 return url.origin
}
export async function sendSharingInvitation(input: { email: string; senderName: string; token: string; shareId: string; reading: CustomerReading }) {
 const key = process.env.RESEND_API_KEY
 if (!key) throw new Error("Invitation email is not configured.")
 if (!/^[a-f0-9]{64}$/.test(input.token)) throw new Error("Invalid invitation.")
 const link = sharingSite() + "/website/shared-compatibility#invite=" + input.token
 const name = input.senderName.replace(/[\r\n]/g, " ").trim().slice(0,120) || "A Jeevan Sutra member"
 const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "Idempotency-Key": "js-share-" + input.shareId },
  body: JSON.stringify({
   from: "Jeevan Sutra <care@jeevansutra.co.in>",
   to: [input.email],
   subject: "An invitation to view shared Jeevan Sutra insights",
   text: sharingEmailContent(input.reading, name, link).text,
   html: sharingEmailContent(input.reading, name, link).html
  }),
  cache: "no-store",
  signal: AbortSignal.timeout(15000)
 })
 if (!response.ok) throw new Error("Unable to send the invitation email.")
 const result: unknown = await response.json()
 if (!result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string") throw new Error("Unable to confirm invitation delivery.")
 return result.id
}
