import Link from 'next/link'
import type { NumerologyCalculationResult } from '@/lib/numerology/types'
export function NameReview({ calculation:c }: { calculation:NumerologyCalculationResult }) {
 return <article id="name-review" className="rounded-2xl border border-[#C5A15A]/40 bg-[#FAF7F0] p-5">
  <h4 className="text-lg font-bold text-[#64263B]">Your Name Review · Chaldean</h4>
  <p className="mt-3 break-words font-semibold">{c.nameNumber.originalName}</p>
  <div className="my-4 flex items-center gap-3"><strong className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#64263B] font-serif text-3xl text-[#EAD8AD]">{c.nameNumber.finalNumber}</strong><strong className="text-lg text-[#64263B]">{c.grahas[c.nameNumber.finalNumber]}</strong></div>
  <h5 className="font-serif text-xl text-[#64263B]">Should you consider a name correction?</h5>
  <p className="mt-3 font-bold text-[#64263B]">Practitioner review needed</p>
  <p className="mt-2 text-sm leading-6">Your spelling calculation is complete. A correction recommendation needs a review of your compound name number, Mulank, Bhagyank and wider profile.</p>
  <p className="mt-3 text-sm leading-6">Name number: <strong>{c.nameNumber.finalNumber}</strong> · Mulank: <strong>{c.mulank.final}</strong> · Bhagyank: <strong>{c.bhagyank.final}</strong>. {c.nameNumber.finalNumber===c.mulank.final?'Your name number matches your Mulank. ':''}{c.nameNumber.finalNumber===c.bhagyank.final?'Your name number matches your Bhagyank. ':''}Matching or different numbers alone do not establish that a correction is required.</p>
  <details className="mt-4 text-sm"><summary className="cursor-pointer font-semibold text-[#64263B]">See your name spelling calculation</summary><div className="mt-4 space-y-4">{c.nameNumber.words.map((word,index)=><div key={`${word.word}:${index}`}><p className="font-bold">{word.word}</p><div className="mt-2 flex flex-wrap gap-2">{word.letters.map((item,i)=><span key={i} className="flex min-w-9 flex-col items-center rounded-lg border border-[#ded4cb] bg-white px-2 py-1"><strong>{item.letter}</strong><span>{item.value}</span></span>)}</div><p className="mt-2">Word total: <strong>{word.total}</strong></p></div>)}<p className="font-semibold text-[#64263B]">Full-name total: {c.nameNumber.compoundTotal} → {c.nameNumber.finalNumber}</p><p className="text-xs text-[#766b67]">Each letter uses its Chaldean value. The full-name total is reduced to one digit. A spelling change can change this calculation.</p></div></details>
  <Link href="/website/services#name_correction" className="mt-5 inline-block font-semibold text-[#64263B] underline underline-offset-4">Explore Name Correction Review · ₹999</Link><p className="mt-2 text-xs text-[#766b67]">Alternative spellings and detailed correction advice belong to the paid review. Coming soon.</p>
 </article>
}
