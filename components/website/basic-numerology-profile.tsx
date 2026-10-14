import type { NumerologyCalculationResult, NumerologyDigit } from '@/lib/numerology/types'
const meanings: Record<NumerologyDigit, string> = {
  1: 'Initiative, independence and self-expression.',
  2: 'Cooperation, sensitivity and emotional awareness.',
  3: 'Learning, creativity and expression.',
  4: 'Structure, organization and unconventional thinking.',
  5: 'Communication, adaptability and variety.',
  6: 'Care, harmony and responsibility.',
  7: 'Reflection, analysis and deeper understanding.',
  8: 'Persistence, management and material responsibility.',
  9: 'Energy, conviction and purposeful action.',
}
export function BasicNumerologyProfile({ calculation: c }: { calculation: NumerologyCalculationResult }) {
  return <section className="mt-6 space-y-5">
    <h3 className="font-serif text-2xl">My basic numerology profile</h3>
    <p>Your free profile explains the calculations and their traditional symbolic meanings.</p>
    <div className="space-y-4">{[
      { title: 'Mulank', value: c.mulank.final, detail: `Your birth day ${c.birthDay} reduces to ${c.mulank.final}. This is the birth-day theme in this method.` },
      { title: 'Bhagyank', value: c.bhagyank.final, detail: `Your full date of birth totals ${c.bhagyank.compound}, reducing to ${c.bhagyank.final}. This is the full-DOB theme.` },
      { title: 'Chaldean name number', value: c.nameNumber.finalNumber, detail: `Your name totals ${c.nameNumber.compoundTotal}, reducing to ${c.nameNumber.finalNumber}. This is the name-expression theme; spelling affects the calculation.` },
    ].map(item => <article key={item.title} className="rounded-xl bg-[#f9f5ef] p-4"><h4 className="font-semibold">{item.title} · {item.value}</h4><p className="mt-2">{item.detail}</p><p className="mt-2">{c.grahas[item.value]} · {meanings[item.value]}</p></article>)}</div>
    <h4 className="font-semibold">Name and DOB connections</h4>
    <p>{c.nameNumber.finalNumber === c.mulank.final ? 'Your name number and Mulank share the same reduced number.' : 'Your name number and Mulank have different reduced numbers.'} {c.nameNumber.finalNumber === c.bhagyank.final ? 'Your name number also matches your Bhagyank.' : 'Your name number differs from your Bhagyank.'} These are calculation relationships, not a good-or-bad rating.</p>
    <h4 className="font-semibold">Numbers present in your Lo Shu</h4>
    {c.loShu.presentNumbers.map(n => <p key={n}><strong>{n} · {c.grahas[n]}:</strong> {meanings[n]} Appears {c.loShu.counts[n]} {c.loShu.counts[n] === 1 ? 'time' : 'times'}.</p>)}
    <h4 className="font-semibold">Repeated numbers</h4>
    <p>{Object.entries(c.loShu.repeatedNumbers).map(([n,count]) => `${n} (${count} occurrences)`).join(', ') || 'No repeated numbers.'} Repetition means a theme occurs more often in this grid; it does not establish a measured personality trait.</p>
    <h4 className="font-semibold">Numbers absent from your grid</h4>
    <p>{c.loShu.missingNumbers.join(', ') || 'None'}. A missing number is absent from this calculation; it does not mean you lack its associated quality.</p>
    {c.loShu.missingNumbers.map(n => <p key={n}>{n} · {c.grahas[n]}: {meanings[n]}</p>)}
    <p className="text-sm text-[#766b67]">Career, love-life, personal direction, personality-improvement advice and remedies are paid guidance. Numerology is a traditional interpretive practice, not proof of personality or a guaranteed outcome.</p>
  </section>
}
