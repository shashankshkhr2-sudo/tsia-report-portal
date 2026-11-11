import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CompatibilityPersonalReview } from "@/components/website/compatibility-personal-review"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Compatibility Design Review | Jeevan Sutra",
  robots: { index: false, follow: false },
}

export default function CompatibilityReviewPage() {
  const local = !process.env.VERCEL_ENV && process.env.NODE_ENV === "development"
  const preview = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF === "feat/family-compatibility"
  if (process.env.JS_COMPATIBILITY_REVIEW_ENABLED !== "true" || !(local || preview)) notFound()
  return <CompatibilityPersonalReview />
}
