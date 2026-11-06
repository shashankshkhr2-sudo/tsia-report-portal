import { notFound } from "next/navigation"
import { ProfessionExplorer } from "@/components/website/profession-explorer"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Explore Suitable Professions | Jeevan Sutra",
  description: "Explore qualities and profession areas through your numerology reading, then reflect on your current work and goals.",
  robots: { index: false, follow: false }
}

export default function ProfessionsPage() {
  const preview = process.env.VERCEL_ENV === "preview" ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === "development")
  if (!preview) notFound()
  return <main className="min-h-screen bg-[#FAF7F0] text-[#42353A]">
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6">
      <ProfessionExplorer />
    </div>
  </main>
}
