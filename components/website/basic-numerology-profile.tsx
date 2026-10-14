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
  return <section className="mt-6 space-y-5">
    <CombinedProfile calculation={c} key={`${c.nameNumber.normalizedName}:${c.birthDay}:${c.bhagyank.compound}:${JSON.stringify(c.loShu.counts)}`} />
    <h3 className="font-serif text-2xl">Get to know your numbers</h3>
    <p>Your name and date of birth offer a starting point for exploring yourself through traditional numerology. See which descriptions feel familiar to you.</p>
    <div className="space-y-4">{[
      { title: 'Your birthday number · Mulank', value: c.mulank.final, detail: `Your birth day ${c.birthDay} gives you the number ${c.mulank.final}.` },
      { title: 'Your life path number · Bhagyank', value: c.bhagyank.final, detail: `The numbers in your date of birth add up to ${c.bhagyank.compound}, then reduce to ${c.bhagyank.final}.` },
      { title: 'Your name number · Chaldean', value: c.nameNumber.finalNumber, detail: `The letters in your name add up to ${c.nameNumber.compoundTotal}, then reduce to ${c.nameNumber.finalNumber}. A different spelling can change this number.` },
    ].map(item => <article key={item.title} className="rounded-xl bg-[#f9f5ef] p-5"><p className="text-sm text-[#766b67]">{item.title} · {item.value}</p><h4 className="mt-2 font-serif text-2xl">{strengths[item.value].title}</h4><p className="mt-3 leading-7">{strengths[item.value].description}</p><details className="mt-3 text-sm text-[#766b67]"><summary className="cursor-pointer">How your number is calculated</summary><p className="mt-2">{item.detail} Traditionally associated with {c.grahas[item.value]}.</p></details></article>)}</div>
    <h4 className="font-semibold">How your name and birthday connect</h4>
    <p>{c.nameNumber.finalNumber === c.mulank.final ? 'Your name and birthday share a number, so you will see a familiar theme in both descriptions.' : 'Your name and birthday give different numbers, offering different sides of yourself to reflect on.'} {c.nameNumber.finalNumber === c.bhagyank.final ? 'Your name number also matches your life path number.' : 'Your life path number adds another description to explore.'} No combination makes you better or worse than someone else.</p>
    <h4 className="font-semibold">More strengths to explore in your Lo Shu grid</h4>
    <p>This grid brings together numbers from your date of birth, Mulank and Bhagyank. These are the themes linked to the numbers that appear:</p>
    {c.loShu.presentNumbers.map(n => <article key={n} className="rounded-xl bg-[#f9f5ef] p-4"><h5 className="font-semibold">{strengths[n].title}</h5><p className="mt-2">{strengths[n].description}</p><p className="mt-2 text-sm text-[#766b67]">Number {n} · {c.grahas[n]} · Appears {c.loShu.counts[n]} {c.loShu.counts[n] === 1 ? 'time' : 'times'} in your grid.</p></article>)}
    <h4 className="font-semibold">Themes that appear more than once</h4>
    <p>{Object.entries(c.loShu.repeatedNumbers).map(([n,count]) => `${n} (${count} times)`).join(', ') || 'No numbers repeat in your grid.'} A repeated number gives you a theme to think about. Your everyday experiences will tell you whether it fits.</p>
    <h4 className="font-semibold">A missing number does not mean a missing strength</h4>
    <p>{c.loShu.missingNumbers.length ? `Numbers ${c.loShu.missingNumbers.join(', ')} do not appear in this grid.` : 'All nine numbers appear in your grid.'} You can still have qualities linked to any number. Your choices, experiences and relationships also shape who you are.</p>
    <p className="text-sm leading-6 text-[#766b67]">These descriptions come from traditional numerology. They are invitations to reflect, rather than a personality test or a promise about your future.</p>
  </section>
}
