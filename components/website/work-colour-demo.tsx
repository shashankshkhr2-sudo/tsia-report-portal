"use client"
import { useState } from "react"
type Insight = { title: string; explanation: string }
type Preview = { insights: Insight[]; action: string }
type Props = { mulank: number; career: Preview; business: Preview }
const options = ["Business / Self-employed", "Job / Salaried employee", "Consultant / Freelancer", "Student / Starting a career", "Currently not working / Returning to work", "Other"]
const palettes: Record<number, { planet: string; colours: string[] }> = {
  1: { planet: "Sun", colours: ["Gold", "Soft orange", "Apricot"] },
  2: { planet: "Moon", colours: ["White", "Cream", "Pearl"] },
  3: { planet: "Jupiter", colours: ["Yellow", "Soft gold", "Mustard"] },
  4: { planet: "Rahu", colours: ["Blue", "Grey", "Slate"] },
  5: { planet: "Mercury", colours: ["Green", "Sage", "Mint"] },
  6: { planet: "Venus", colours: ["White", "Light pink", "Rose"] },
  7: { planet: "Ketu", colours: ["Light green", "White", "Pale sage"] },
  8: { planet: "Saturn", colours: ["Dark blue", "Black", "Navy"] },
  9: { planet: "Mars", colours: ["Red", "Brick red", "Burgundy"] }
}
const contexts = [
  "For business, reflect on how you organise your work, understand customer needs and follow through on commitments.",
  "For a salaried role, reflect on your responsibilities, working environment and opportunities to use your skills.",
  "For consulting or freelance work, reflect on your specialist skills, client communication and ability to manage your own workload.",
  "As you explore a career, use these themes to think about interests and skills you would like to test through learning or practical experience.",
  "As you consider returning to work, reflect on your existing strengths, current circumstances and the support you need.",
  "Use these themes as a starting point for describing the work you do and what matters to you."
]
export function WorkColourDemo({ mulank, career, business }: Props) {
  const [selected, setSelected] = useState<number[]>([])
  const [answered, setAnswered] = useState(false)
  const [concern, setConcern] = useState("")
  const palette = palettes[mulank]
  const readings = selected.map(i => i === 0 ? business : career)
  const insights = Array.from(new Map(readings.flatMap(r => r.insights).map(i => [i.title + i.explanation, i])).values()).slice(0, 3)
  const toggle = (i: number) => setSelected(previous => previous.includes(i) ? previous.filter(x => x !== i) : [...previous, i])
  return <section className="mt-6 rounded-3xl border border-[#DFCEAF] bg-[#FAF7F0] p-5 text-[#392e30] sm:p-8">
    <p className="text-xs font-semibold text-[#906c36]">FICTIONAL DEMO · NOTHING IS SAVED</p>
    <h2 className="mt-2 font-serif text-3xl text-[#64263B]">Improve Your Current Work</h2>
    {!answered ? <form className="mt-5" onSubmit={e => { e.preventDefault(); if (selected.length) setAnswered(true) }}>
      <fieldset><legend className="text-lg font-semibold">What type of work do you currently do?</legend>
      <p className="mt-2 text-sm">Choose more than one if needed.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{options.map((label, i) => <label key={label} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#D2B577] bg-white p-4"><input type="checkbox" checked={selected.includes(i)} onChange={() => toggle(i)} className="h-5 w-5 accent-[#64263B]" /><span>{label}</span></label>)}</div>
      </fieldset>
      <button disabled={!selected.length} className="mt-5 min-h-12 rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-white disabled:opacity-50">Explore my work style</button>
    </form> : <div className="mt-5" aria-live="polite">
      <p className="font-semibold">{selected.map(i => options[i]).join(" · ")}</p>
      <button type="button" onClick={() => setAnswered(false)} className="mt-2 min-h-11 underline">Change my answer</button>
      <h3 className="mt-5 font-serif text-2xl text-[#64263B]">How this work style may fit you</h3>
      <p className="mt-3 leading-7">These are traditional numerology interpretations for reflection. Your work category and birth numbers cannot establish whether a profession is suitable; your skills, interests and circumstances matter.</p>
      {selected.map(i => <p key={i} className="mt-3 leading-7">{contexts[i]}</p>)}
      {insights.map(item => <article key={item.title + item.explanation} className="mt-4 rounded-xl border border-[#eadfd4] bg-white p-4"><h4 className="font-semibold text-[#64263B]">{item.title}</h4><p className="mt-2 whitespace-pre-line leading-7">{item.explanation}</p></article>)}
      {palette && <article className="mt-6 rounded-2xl border border-[#D2B577] bg-white p-5">
        <h3 className="font-serif text-2xl text-[#64263B]">Colours to explore</h3>
        <p className="mt-3 leading-7">Your Mulank {mulank} is traditionally associated with {palette.planet}. This sample palette uses Indian planetary colour associations, with related shades offered as styling choices.</p>
        <ul className="mt-3 flex flex-wrap gap-2">{palette.colours.map(colour => <li key={colour} className="rounded-full border border-[#D2B577] px-4 py-2">{colour}</li>)}</ul>
        <p className="mt-3 leading-7">Choose a shade you enjoy, combine it with your usual wardrobe, or use a small accent such as a scarf, bag or notebook. Wear other colours freely. There is no compulsory weekday schedule and no colour guarantees an outcome.</p>
      </article>}
      <label htmlFor="work-demo-concern" className="mt-6 block text-lg font-semibold">What is the main difficulty you are facing in your current work?</label>
      <textarea id="work-demo-concern" value={concern} onChange={e => setConcern(e.target.value)} maxLength={1200} rows={4} className="mt-3 w-full rounded-xl border border-[#ded4cb] bg-white p-3 text-base" placeholder="Describe what is happening in your own words." />
      <p className="mt-2 text-sm text-[#766b67]">Demo only: your answer stays on this screen and clears on reload. Problem-specific responses will be added in the next step.</p>
    </div>}
  </section>
}
