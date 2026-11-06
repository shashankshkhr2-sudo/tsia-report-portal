import { NextResponse } from "next/server"
import { customerIdentity } from "@/lib/jeevansutra/customer-server"
import { getColourDay } from "@/lib/jeevansutra/colour-calendar"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const reply = (body: unknown, status = 200) => NextResponse.json(body, {
  status,
  headers: { "Cache-Control": "private, no-store" }
})

export async function GET(request: Request) {
  try {
    if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED !== "true") {
      return reply({ error: "Daily colours are not open yet." }, 503)
    }
    const identity = await customerIdentity(request)
    if (!identity) {
      return reply({ error: "Please sign in, or complete your registration first." }, 401)
    }
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date())
    const part = (type: string) => parts.find(item => item.type === type)?.value || ""
    const today = [part("year"), part("month"), part("day")].join("-")
    const result = getColourDay(identity.client.date_of_birth, today)
    return reply({
      date: today,
      timeZone: "Asia/Kolkata",
      colour: result.dailyColours[0]
    })
  } catch {
    return reply({ error: "Unable to load your daily colour. Please try again." }, 503)
  }
}
