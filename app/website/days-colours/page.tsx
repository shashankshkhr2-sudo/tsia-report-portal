import { TestColourCalendar } from "@/components/website/test-colour-calendar"

export const metadata = {
  title: "Days & Colours | Jeevan Sutra",
  description: "Your personal colour calendar and optional metal accessories.",
  alternates: { canonical: "https://www.jeevansutra.co.in/website/days-colours" }
}

export default function DaysColoursPage() {
  return <main className="min-h-screen bg-[#FAF7F0] text-[#42353A]">
    <h1 className="sr-only">Days &amp; Colours</h1>
    <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
      <TestColourCalendar />
    </div>
  </main>
}
