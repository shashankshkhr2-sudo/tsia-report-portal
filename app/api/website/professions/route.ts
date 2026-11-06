import { NextResponse } from "next/server"
import { customerIdentity } from "@/lib/jeevansutra/customer-server"
import { calculateNumerologyV2 } from "@/lib/numerology/calculations"
import { buildProfessionReading } from "@/lib/jeevansutra/profession-reading"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const reply = (body: unknown, status = 200) => NextResponse.json(body, {
  status,
  headers: { "Cache-Control": "private, no-store" }
})

export async function GET(request: Request) {
  try {
    const preview = process.env.VERCEL_ENV === "preview" ||
      (!process.env.VERCEL_ENV && process.env.NODE_ENV === "development")
    if (!preview || process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") {
      return reply({ error: "Profession exploration is not available here yet." }, 403)
    }

    const identity = await customerIdentity(request)
    if (!identity || identity.isAnonymous) {
      return reply({ error: "Please sign in and complete your profile." }, 401)
    }

    const name = identity.client.current_name?.trim() || identity.client.full_name
    const calculation = calculateNumerologyV2({
      fullName: name,
      dateOfBirth: identity.client.date_of_birth
    })

    return reply({
      profile: { name: calculation.input.fullName },
      reading: buildProfessionReading(calculation)
    })
  } catch {
    return reply({ error: "Unable to prepare your profession reading. Please try again." }, 503)
  }
}
