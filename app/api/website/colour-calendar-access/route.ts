import { NextResponse } from "next/server"
import { customerIdentity } from "@/lib/jeevansutra/customer-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const reply = (body: unknown, status = 200) => NextResponse.json(body, {
  status, headers: { "Cache-Control": "private, no-store" }
})

export async function GET(request: Request) {
  try {
    const preview = process.env.VERCEL_ENV === "preview" || (!process.env.VERCEL_ENV && process.env.NODE_ENV === "development")
    if (!preview || process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") {
      return reply({ error: "Calendar test access is unavailable." }, 403)
    }
    const identity = await customerIdentity(request)
    if (!identity || identity.isAnonymous) {
      return reply({ error: "Sign in with your registered account." }, 401)
    }
    const testers = (process.env.JS_COLOUR_CALENDAR_TEST_EMAILS || "")
      .split(",").map(email => email.trim().toLowerCase()).filter(Boolean)
    if (!testers.includes(identity.email)) {
      return reply({ error: "Calendar test access is not enabled for this account." }, 403)
    }
    return reply({ access: "tester", dob: identity.client.date_of_birth })
  } catch {
    return reply({ error: "Unable to verify calendar access. Please try again." }, 503)
  }
}
