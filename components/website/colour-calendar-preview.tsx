import { CalendarDays, Layers, Sparkles } from "lucide-react"

const sampleColours = [
  { name: "Rose", hex: "#C9899B" },
  { name: "Cream", hex: "#F3E8D1" },
  { name: "Burgundy", hex: "#64263B" }
]

export function ColourCalendarPreview() {
  return <section aria-labelledby="calendar-preview-title" className="rounded-3xl border border-[#D2B577] bg-white p-4 text-[#64263B] sm:p-6">
    <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-[#906C36] sm:text-xs">The full colour calendar</p>
    <h2 id="calendar-preview-title" className="mt-2 text-center font-serif text-2xl leading-tight sm:text-3xl">More choice. Every day.</h2>

    <figure className="mt-4 overflow-hidden rounded-2xl border border-[#D2B577]/50 bg-[#FAF7F0]">
      <figcaption className="px-3 pt-3 text-xs font-medium text-[#766B67]">Sample preview · Not your personal results</figcaption>
      <div className="grid grid-cols-2 items-center gap-3 p-3">
        <div>
          <p className="mb-2 font-serif text-lg">A day of colour</p>
          <ul className="grid grid-cols-3 gap-1.5">
            {sampleColours.map(colour => <li key={colour.name} className="min-w-0 text-center">
              <div aria-hidden="true" style={{ backgroundColor: colour.hex }} className="h-10 rounded-lg border border-black/10 sm:h-14" />
              <span className="mt-1 block break-words text-[10px] leading-4 text-[#514047]">{colour.name}</span>
            </li>)}
          </ul>
        </div>
        <img src="/website/metals/gold-accessory.webp" alt="Example gold bangle and pendant on ivory fabric" width={600} height={600} loading="lazy" className="aspect-[5/4] w-full rounded-xl object-cover" />
      </div>
    </figure>

    <ul className="my-4 space-y-3 text-sm leading-5">
      <li className="flex items-start gap-3"><Layers aria-hidden="true" size={20} className="shrink-0 text-[#A78349]" /><span>Three shades for each day</span></li>
      <li className="flex items-start gap-3"><Sparkles aria-hidden="true" size={20} className="shrink-0 text-[#A78349]" /><span>Your personal palette &amp; metal accessories</span></li>
      <li className="flex items-start gap-3"><CalendarDays aria-hidden="true" size={20} className="shrink-0 text-[#A78349]" /><span>Browse colours for different dates</span></li>
    </ul>

    <details className="group">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center rounded-xl bg-[#64263B] px-4 py-3 text-center text-sm font-semibold text-[#FAF0DE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B] [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">View calendar preview →</span>
        <span className="hidden group-open:inline">Close calendar preview ↑</span>
      </summary>
      <div className="mt-4 rounded-xl bg-[#FAF7F0] p-4 text-sm leading-6 text-[#65544D]">
        <p className="font-semibold text-[#64263B]">Inside your full calendar</p>
        <p className="mt-2">See seven days at a time, move between weeks or choose a date. Explore your personal palette alongside three daily shades and optional metal accessories.</p>
        <p className="mt-2">Choose one or two shades for your outfit or accessories. Suggestions are inspired by numerology traditions.</p>
        <p className="mt-3 text-xs">Illustration only. Your colours will use your saved birth details. Pricing and paid access are not available yet.</p>
      </div>
    </details>
    <p className="mt-3 text-center text-xs text-[#766B67]">Full access coming soon</p>
  </section>
}
