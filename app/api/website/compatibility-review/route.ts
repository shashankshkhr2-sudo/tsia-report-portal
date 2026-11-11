import { customerAuthResponse } from "@/lib/jeevansutra/customer-server"
import { comparisonPerson } from "@/lib/jeevansutra/compatibility-launch"
import { buildPersonalMarriageReview } from "@/lib/jeevansutra/compatibility-personal-report"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: {
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "Vary": "Authorization",
  } })
}

export async function POST(request: Request) {
  const local = !process.env.VERCEL_ENV && process.env.NODE_ENV === "development"
  const preview = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF === "feat/family-compatibility"
  if (process.env.JS_COMPATIBILITY_REVIEW_ENABLED !== "true" || !(local || preview)) {
    return reply({ error: "Not found." }, 404)
  }
  if (!/^Bearer [A-Za-z0-9._-]+$/.test(request.headers.get("authorization") || "")) {
    return reply({ error: "Please sign in with your review account." }, 401)
  }
  try {
    const response = await customerAuthResponse(request)
    if (!response.ok) return reply({ error: "Please sign in again." }, 401)
    const user = await response.json()
    if (!user.id || !user.email_confirmed_at || user.is_anonymous === true || typeof user.email !== "string" || user.email.trim().toLowerCase() !== "shashankshkhr2@gmail.com") {
      return reply({ error: "Review access is unavailable for this account." }, 403)
    }
  } catch {
    return reply({ error: "Unable to verify review access. Please try again." }, 503)
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return reply({ error: "A JSON request is required." }, 415)
  }
  const reader = request.body?.getReader()
  if (!reader) return reply({ error: "Enter both names and dates of birth." }, 400)
  let input: unknown
  try {
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 2000) { await reader.cancel(); return reply({ error: "Request is too large." }, 413) }
      chunks.push(value)
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } catch {
    return reply({ error: "Invalid request." }, 400)
  } finally {
    reader.releaseLock()
  }
  try {
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid input")
    const data = input as Record<string, unknown>
    function person(value: unknown) {
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid person")
      const p = value as Record<string, unknown>
      if (typeof p.name !== "string" || typeof p.dob !== "string" || !p.dob.trim()) throw new Error("Missing details")
      return comparisonPerson(p.name, p.dob)
    }
    const self = person(data.self)
    const other = person(data.other)
    const result = buildPersonalMarriageReview({ self, other, kind: "Love & Marriage", relationship: "Considering marriage" })
    return reply({ report: result.report, reviewOnly: true })
  } catch {
    return reply({ error: "Check both names and dates (DD/MM/YYYY). This draft supports only the currently reviewed numerical pairing." }, 422)
  }
}
