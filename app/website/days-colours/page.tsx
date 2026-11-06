import { TestColourCalendar } from "@/components/website/test-colour-calendar"
import { FreeDailyColour } from "@/components/website/free-daily-colour"

export const metadata = {
  title: "Days & Colours | Jeevan Sutra",
  description: "Discover one complimentary daily colour and explore a sample of the personal colour calendar.",
  alternates: { canonical: "https://www.jeevansutra.co.in/website/days-colours" }
}

export default function DaysColoursPage() {
  return <main className="min-h-screen bg-[#FAF7F0] text-[#42353A]">
    <header className="bg-[#64263B] px-5 py-9 text-[#FAF0DE] sm:py-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D2B577]">Jeevan Sutra · Days &amp; Colours</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Your Days. Your Colours.</h1>
        <p className="mt-4 max-w-xl leading-7">A little colour. A little inspiration. Discover a shade for today.</p>
      </div>
    </header>
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-7 sm:px-6">
      <FreeDailyColour />
      <TestColourCalendar />
      <section aria-labelledby="paid-colour-preview" className="overflow-hidden rounded-3xl border border-[#D2B577]/60 bg-white">
        <div className="p-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#906C36]">Paid version · Coming soon</p>
          <h2 id="paid-colour-preview" className="mt-2 font-serif text-3xl text-[#64263B]">Your personal colour calendar</h2>
          <p className="mt-3 leading-7 text-[#766B67]">Explore three daily shades, your personal palette and optional metal accessories, with a calendar to browse different dates.</p>
        </div>
        <figure>
          <img src="/website/home/days-colours.webp" alt="Illustrative sample with fabric colours, a decorative calendar and silver jewellery" width={1200} height={800} loading="lazy" className="block h-auto w-full" />
          <figcaption className="px-5 py-4 text-sm leading-6 text-[#766B67] sm:px-8">Sample image only — an illustration of the paid experience, not your personal results.</figcaption>
        </figure>
        <p className="border-t border-[#E4D8C4] px-5 py-4 text-sm leading-6 text-[#766B67] sm:px-8">Paid access and pricing will be announced here. No payment is collected yet.</p>
      </section>
    </div>
  </main>
}
