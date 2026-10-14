import { CombinedProfile } from './combined-profile'
import type { NumerologyCalculationResult, NumerologyDigit } from '@/lib/numerology/types'
const strengths: Record<NumerologyDigit, { title: string; description: string }> = {
  1: { title: 'You like finding your own way', description: 'You may enjoy taking the first step and trying your own ideas. Having space to make your own choices can feel important to you.' },
  2: { title: 'You care about how others feel', description: 'You may notice the little things that matter to people. Listening, working together and feeling close to others can bring out your caring side.' },
  3: { title: 'You have ideas worth sharing', description: 'You may enjoy learning something new and telling others about it. A good conversation or a creative idea can bring out your enthusiasm.' },
  4: { title: 'You can see a different way', description: 'You may notice what others overlook and enjoy making sense of things. You can appreciate a clear plan while still having ideas of your own.' },
  5: { title: 'You enjoy new experiences', description: 'You may feel curious about people, places and ideas. When things change, you can enjoy exploring what comes next.' },
  6: { title: 'You want people to feel cared for', description: 'You may enjoy making others feel welcome and comfortable. Close relationships and a pleasant home can mean a lot to you.' },
  7: { title: 'You like understanding things deeply', description: 'You may take time to think and ask thoughtful questions. Quiet moments can give you space to explore what matters to you.' },
  8: { title: 'You value effort and progress', description: 'You may appreciate keeping your word and seeing things through. Working towards something meaningful can bring out your determination.' },
  9: { title: 'You put your heart into what matters', description: 'You may feel ready to act when you care about something. Standing up for people and helping with a purpose can bring out your generous side.' },
}
export function BasicNumerologyProfile({ calculation: c }: { calculation: NumerologyCalculationResult }) {
  return <section id="your-numbers" className="space-y-6">

    <h3 className="font-serif text-2xl">What Your Numbers Say About You</h3>
    <p className="text-sm leading-6 text-[#766b67]">Each number offers a different starting point for your reading.</p>
    <div className="grid gap-4 md:grid-cols-3">{[
      { title: 'Your birthday number · Mulank', value: c.mulank.final, detail: `Your birth day ${c.birthDay} gives you the number ${c.mulank.final}.` },
      { title: 'Your life path number · Bhagyank', value: c.bhagyank.final, detail: `The numbers in your date of birth add up to ${c.bhagyank.compound}, then reduce to ${c.bhagyank.final}.` },
      { title: 'Your name number · Chaldean', value: c.nameNumber.finalNumber, detail: `The letters in your name add up to ${c.nameNumber.compoundTotal}, then reduce to ${c.nameNumber.finalNumber}. A different spelling can change this number.` },
    ].map((item,index,items) => <article key={item.title} className="rounded-2xl border border-[#eadfd4] bg-[#FAF7F0] p-5"><h4 className="text-lg font-bold text-[#64263B]">{item.title}</h4><div className="my-4 flex items-center gap-3"><strong className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#64263B] font-serif text-3xl text-[#EAD8AD]">{item.value}</strong><strong className="text-lg text-[#64263B]">{c.grahas[item.value]}</strong></div><h4 className="mt-2 font-serif text-xl text-[#64263B]">{index>0 && items.slice(0,index).some(previous=>previous.value===item.value)?'A familiar theme in another part of your profile':strengths[item.value].title}</h4><p className="mt-3 text-sm leading-6">{index>0 && items.slice(0,index).some(previous=>previous.value===item.value)?`This number matches your ${items.find(previous=>previous.value===item.value)?.title.includes('Mulank')?'Mulank':'Bhagyank'}. Read its description above; the combined reading below explains how it fits with your other numbers.`:strengths[item.value].description}</p><details className="mt-3 text-sm text-[#766b67]"><summary className="cursor-pointer">How your number is calculated</summary><p className="mt-2">{item.detail} Traditionally associated with {c.grahas[item.value]}.</p></details></article>)}</div>
    <h4 className="font-semibold">Your Name and Birthday, Together</h4>
    <p>{c.nameNumber.finalNumber === c.mulank.final ? 'Your name and birthday share a number, so you will see a familiar theme in both descriptions.' : 'Your name and birthday give different numbers, offering different sides of yourself to reflect on.'} {c.nameNumber.finalNumber === c.bhagyank.final ? 'Your name number also matches your life path number.' : 'Your life path number adds another description to explore.'} No combination makes you better or worse than someone else.</p>
    <CombinedProfile calculation={c} key={`${c.nameNumber.normalizedName}:${JSON.stringify(c.loShu.counts)}`} />
    <details className="rounded-2xl border border-[#eadfd4] p-4"><summary className="cursor-pointer font-semibold text-[#64263B]">Present, repeated and missing numbers</summary><div className="mt-4 space-y-3 text-sm leading-6"><p><strong>Present:</strong> {c.loShu.presentNumbers.join(', ')}.</p><p><strong>Repeated:</strong> {Object.entries(c.loShu.repeatedNumbers).map(([n,count])=>`${n} (${count} times)`).join(', ') || 'None'}.</p><p><strong>Missing:</strong> {c.loShu.missingNumbers.join(', ') || 'None'}. A missing number does not mean you lack its associated quality.</p></div></details>
    <p className="text-sm leading-6 text-[#766b67]">These descriptions come from traditional numerology. They are invitations to reflect, rather than a personality test or a promise about your future.</p>
  </section>
}
