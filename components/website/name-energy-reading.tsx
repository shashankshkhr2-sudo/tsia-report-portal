import type { ReactNode } from 'react'
import { ProfileDob } from './profile-dob'

const strengths: Record<number, { title: string; description: string }> = {
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

const grahas: Record<number,string> = {1:'Surya',2:'Chandra',3:'Guru',4:'Rahu',5:'Budh',6:'Shukra',7:'Ketu',8:'Shani',9:'Mangal'}
const themes: Record<number,string> = {1:'initiative and independence',2:'care and cooperation',3:'expression and learning',4:'structure and original thinking',5:'curiosity and adaptability',6:'care and responsibility',7:'reflection and deeper understanding',8:'patience and steady effort',9:'courage and purposeful action'}
export function NameEnergyReading({name,dob,mulank,bhagyank,nameNumber,total,calculation}: {name:string;dob:string;mulank:number;bhagyank:number;nameNumber:number;total:number;isChild?:boolean;calculation?:ReactNode}) {
 const numbers = [mulank,bhagyank,nameNumber]
 const unique = [...new Set(numbers)]
 const repeated = unique.filter(number => numbers.filter(value => value === number).length > 1)
 return <section className="mt-7 space-y-6" aria-label={`Number reading for ${name}`}>
  <header className="rounded-2xl border border-[#eadfd4] bg-white p-5 sm:p-6">
   <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#886634]">Your name · Your numbers · Your story</p>
   <h3 className="mt-3 break-words font-serif text-3xl leading-tight text-[#64263B] sm:text-4xl">{name}</h3>
   <ProfileDob dob={dob} />
   <p className="mt-4 max-w-2xl text-sm leading-6 text-[#766b67]">Three numbers. Different sides of your story. Explore what they say together.</p>
  </header>
  {calculation}
  <div className="grid gap-4 md:grid-cols-3">{[
   {title:'Your birthday number · Mulank',number:mulank,label:'Your natural approach',detail:'From the day you were born.'},
   {title:'Your life path number · Bhagyank',number:bhagyank,label:'Your life-path theme',detail:'From your complete date of birth.'},
   {title:'Your name energy · Chaldean',number:nameNumber,label:'Your name’s traditional theme',detail:`From your chosen spelling · total ${total}.`},
  ].map(item => <article key={item.title} className="rounded-2xl border border-[#eadfd4] bg-[#FAF7F0] p-5">
   <p className="text-lg font-bold text-[#64263B]">{item.title}</p><div className="my-4 flex items-center gap-3"><strong className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#64263B] font-serif text-3xl text-[#EAD8AD]">{item.number}</strong><div><p className="text-lg font-bold text-[#64263B]">{grahas[item.number]}</p><p className="mt-1 text-xs leading-5 text-[#766b67]">{item.label}</p></div></div>
   <h4 className="mt-2 font-serif text-xl text-[#64263B]">{strengths[item.number].title}</h4><p className="mt-3 text-sm leading-6">{strengths[item.number].description}</p><p className="mt-4 border-t border-[#C5A15A]/25 pt-3 text-xs leading-6 text-[#766b67]">{item.detail}</p>
  </article>)}</div>
  <article className="rounded-2xl border-l-4 border-[#C5A15A] bg-[#FAF7F0] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#886634]">Your personality themes</p><h3 className="mt-3 font-serif text-2xl text-[#64263B]">This Is What Your Numbers Say Together</h3>
   <p className="mt-4 text-sm leading-7"><strong className="text-[#64263B]">{name}</strong>, your Mulank {mulank} brings a theme of {themes[mulank]}. Your Bhagyank {bhagyank} adds {themes[bhagyank]}, while your name number {nameNumber} highlights {themes[nameNumber]}.</p>
   {repeated.length > 0 ? <p className="mt-4 text-sm leading-7">{repeated.map(number => `Number ${number} appears in more than one part of your profile, bringing ${themes[number]} back into the reading.`).join(' ')} This is a recurring theme to reflect on, rather than a measure of how strongly you behave that way.</p> : <p className="mt-4 text-sm leading-7">Your three numbers bring different qualities into the reading. You may recognise one side of yourself when making decisions, another in relationships, and another in the way you express yourself.</p>}
   <div className="mt-6 border-t border-[#C5A15A]/40 pt-5"><h4 className="font-semibold text-[#64263B]">Bring this into everyday life</h4><p className="mt-3 text-sm leading-7">Notice when {themes[unique[0]]} feels natural to you{unique.length > 1 ? `, and when you draw on ${themes[unique[1]]}` : ''}. Which parts feel familiar? Which would you like to understand better?</p></div>
   <p className="mt-5 text-xs leading-6 text-[#766b67]">These traditional themes are for reflection. Your experience matters; a practitioner will discuss how the reading fits your life before recommending any change.</p>
  </article>

 </section>
}
