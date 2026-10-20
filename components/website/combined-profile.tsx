'use client'
import { patternReading } from "@/lib/jeevansutra/lo-shu-pattern-reading"
import { MissingNumberGrowth } from './missing-number-growth'
import { useState } from 'react'
import type { NumerologyCalculationResult, NumerologyDigit, PatternResult } from '@/lib/numerology/types'
import { freeV3Profile } from '@/lib/jeevansutra/free-v3-profile'
const themes: Record<NumerologyDigit,string> = {1:'taking initiative',2:'understanding others',3:'learning and sharing ideas',4:'organising things in your own way',5:'talking with people and trying new things',6:'caring for people',7:'thinking things through',8:'staying committed',9:'acting on what matters'}
const personal: Record<NumerologyDigit, { title:string; description:string }> = {
 1:{title:'You like taking the first step',description:'You may enjoy starting something new and making your own choices. Having room to try your ideas can bring out your confidence.'},
 2:{title:'You notice how people feel',description:'You may pick up on the little things that matter to others. Listening and making someone feel understood can come naturally to you.'},
 3:{title:'You enjoy learning and sharing ideas',description:'You may enjoy explaining something you understand or bringing a fresh idea into a conversation. When a subject interests you, your enthusiasm can show.'},
 4:{title:'You can find your own way of doing things',description:'You may notice a different approach to a familiar problem. Making sense of things and giving your ideas a clear shape can feel satisfying.'},
 5:{title:'You are curious about new experiences',description:'You may enjoy meeting people, asking questions and trying something different. Variety can give you something to look forward to.'},
 6:{title:'You want others to feel cared for',description:'You may enjoy making people feel welcome. The comfort of your home and the people close to you can mean a lot to you.'},
 7:{title:'You like thinking things through',description:'You may enjoy looking beyond the first answer. A little quiet time can help you understand a question more deeply.'},
 8:{title:'You value keeping your word',description:'You may feel good about seeing something through. Patience and steady effort can be qualities you recognise in yourself.'},
 9:{title:'You put your heart into what matters',description:'When you care about something, you may feel ready to act. Helping someone or standing up for a cause can bring out your energy.'},
}
// Describe the whole combination separately from the customer's formation status.
// Show approved interpretations and practitioner guidance only for complete Rajyogs.
const rajyogDescriptions: Record<string,string> = {
  "4–5–6": "Golden Rajyog is present in your grid. In numerology, this combination is traditionally associated with good luck, favourable opportunities, name and recognition, financial progress, career achievement and material comforts. If you are facing persistent problems, repeated setbacks, or a lack of progress despite sincere effort, speak with a numerology practitioner for a fuller understanding of your profile.",
  "2–5–8": "Silver Rajyog is present in your grid. In numerology, this combination is traditionally associated with opportunities to acquire property, build tangible assets and strengthen material security. Property gains may come alongside periods of fluctuation. If you are facing persistent difficulties in acquiring or retaining property, or repeated setbacks in building assets despite sincere effort, consider speaking with a numerology practitioner for a fuller understanding of your profile."
}

function rajyogStatus(p:PatternResult) {
 const present=p.present.join('–') || 'none'
 const missing=p.missing.join('–') || 'none'
 if(p.status==='complete')return `All three numbers are present: this Rajyog is complete. Read its combined theme alongside the rest of your profile.`
 if(p.status==='partial')return `This Rajyog is partial. Present: ${present}. Missing: ${missing}. The full three-number combination is not formed.`
 return `This Rajyog is not formed. Present: ${present}. Missing: ${missing}. This combination is not active in your grid.`
}
const names:Record<string,string>={mulank:'your birthday number',bhagyank:'your life path number',nameNumber:'your name number',loshu:'your Personal Lo Shu',repetition:'a repeated number',row:'a complete row',column:'a complete column',goldenRajyog:'complete Golden Rajyog',silverRajyog:'complete Silver Rajyog'}
export function CombinedProfile({ calculation:c }: { calculation:NumerologyCalculationResult }) {
 const v3=freeV3Profile(c)
 const strongest=v3.findings
 const [feedback,setFeedback]=useState('')
 const patterns:[string,PatternResult,string][]=[
 ['Thinking and ideas · 4–9–2',c.rows.mental,'organising ideas, taking purposeful action and noticing how people feel'],
 ['Expression and reflection · 3–5–7',c.rows.emotionalWill,'sharing ideas, adapting and thinking things through'],
 ['Everyday responsibility · 8–1–6',c.rows.practicalMaterial,'staying committed, taking initiative and caring for others'],
 ['Organisation and learning · 4–3–8',c.columns.first,'organising, expressing ideas and following through'],
 ['Action and communication · 9–5–1',c.columns.middle,'acting with purpose, communicating and taking initiative'],
 ['Care and understanding · 2–7–6',c.columns.third,'listening, reflecting and caring for people'],
 ['Golden Rajyog · 4–5–6',c.rajyog.golden,'the traditional Golden Rajyog combination'],
 ['Silver Rajyog · 2–5–8',c.rajyog.silver,'the traditional Silver Rajyog combination'],
 ]
 return <section className="space-y-5">
 <details open id="grid-patterns" className="rounded-2xl border border-[#eadfd4] p-4 sm:p-5"><summary className="cursor-pointer font-semibold">Your Lo Shu Grid Patterns</summary><div className="mt-4 space-y-5">{[["Rajyogs",patterns.slice(6)],["Columns",patterns.slice(3,6)],["Rows",patterns.slice(0,3)]].map(([group,items])=><section key={group as string}><h4 className="mb-3 text-lg font-bold text-[#64263B]">{group as string}</h4><div className="grid gap-3 sm:grid-cols-2">{(items as typeof patterns).map(([title,p,theme])=>{
 const rajyog=title.includes('Rajyog')
  const reading = rajyog ? null : patternReading(p)
 const qualities=p.present.map(n=>themes[n])
 const joined=qualities.length>1?`${qualities.slice(0,-1).join(', ')} and ${qualities.at(-1)}`:qualities[0]
 return <article key={title} className="rounded-2xl border-l-4 border-[#C5A15A] bg-[#FAF7F0] p-4"><h4 className="font-bold text-[#64263B]">{title.includes('Rajyog')?'':patterns.indexOf(patterns.find(item=>item[0]===title)!)>=3?'Column · ':'Row · '}{reading?.title ?? title}</h4>
 <details className="mt-3 text-sm text-[#766b67]"><summary className="cursor-pointer">See your numbers</summary><p className="mt-2">{reading && <span className="block mb-1">{reading.plane}</span>}Pattern: {p.numbers.join('–')} · {p.presentCount}/3 present · {p.status==='complete'?'Complete':p.status==='partial'?'Partial':'Not formed'}</p><p className="mt-1">Present: {p.present.join(', ') || 'none'}. Missing: {p.missing.join(', ') || 'none'}.</p></details>
  {reading ? <><p className="mt-2 text-sm leading-6">{reading.meaning}</p><p className="mt-2 text-sm leading-6">{reading.example}</p><p className="mt-3 text-sm leading-6"><strong>Try this:</strong> {reading.habit}</p></> : <p className="mt-2 text-sm leading-6">{p.status === "complete" ? rajyogDescriptions[p.numbers.join("-")] : null}</p>}
 {rajyog && <p className="mt-2 text-sm text-[#766b67]">{rajyogStatus(p)}</p>}
 </article>
 })}</div></section>)}</div><p className="mt-4 text-sm leading-6 text-[#766b67]">An incomplete pattern does not mean you lack these qualities. Rajyogs describe traditional number combinations; they do not guarantee wealth or success.</p></details>
 <h3 id="combined-reading" className="font-serif text-2xl text-[#64263B]">A Little More About You</h3>
 <p>Your reading highlights {strongest.map(n=>themes[n.number]).join(', ')}. Together, these offer a few sides of yourself to explore. Notice which ones feel familiar in everyday life.</p>
 {strongest.map(n=><article key={n.number} className="rounded-2xl border-l-4 border-[#C5A15A] bg-[#FAF7F0] p-4"><h4 className="font-semibold text-[#64263B]">{personal[n.number].title}</h4><p className="mt-2 text-sm leading-6">{personal[n.number].description}</p>{(n.conclusion.resolution==='MODERATE' || n.conclusion.resolution==='TENSION' || n.conclusion.strength==='CONTEXT_DEPENDENT') && <p className="mt-2 text-sm">Other parts of your reading add a different side to this theme. How it shows up may depend on the situation.</p>}<p className="mt-2 text-sm text-[#766b67]">{n.isMulank && n.isBhagyank ? 'Your birthday and life path both highlight this side of you.' : n.isMulank ? 'Your birthday number highlights this side of you.' : n.isBhagyank ? 'Your life path number highlights this side of you.' : n.isNameNumber ? 'Your name number highlights this side of you.' : 'Your Lo Shu patterns highlight this side of you.'} {n.isNameNumber && (n.isMulank || n.isBhagyank) ? 'Your name number points to it too.' : ''}</p><details className="mt-3 text-sm text-[#766b67]"><summary className="cursor-pointer">Why this appears</summary><p className="mt-2">Number {n.number} is supported by {Array.from(new Set(n.evidence.map(e=>({MULANK:'your birthday number',BHAGYANK:'your life path number',NAME_NUMBER:'your name number',LO_SHU_PRESENT:'your Personal Lo Shu',REPETITION:'a repeated number',ROW:'a complete row',COLUMN:'a complete column',RAJYOG:'a complete Rajyog'} as Record<string,string>)[e.layer] || 'another part of your profile'))).join(', ')}.</p><p className="mt-2">{n.isMulank ? `Mulank: ${n.number}. ` : ''}{n.isBhagyank ? `Bhagyank: ${n.number}. ` : ''}{n.isNameNumber ? `Name number: ${n.number}. ` : ''}Number {n.number} appears {n.loShuCount} {n.loShuCount===1?'time':'times'} in your Personal Lo Shu{n.loShuCount>1?` (${String(n.number).repeat(n.loShuCount)})`:''}.</p></details></article>)}
 {v3.repetitions.length>0 && <section className="space-y-3"><h4 className="font-semibold text-[#64263B]">Your Repeated Numbers</h4>{v3.repetitions.map(rule=><article key={`${rule.number}:${rule.count}`} className="rounded-2xl border border-[#eadfd4] bg-[#FAF7F0] p-4"><p className="text-sm font-bold text-[#64263B]">{String(rule.number).repeat(rule.count)} · {c.grahas[rule.number]}</p><h5 className="mt-2 font-semibold">{rule.title}</h5>{rule.strength && <p className="mt-2 text-sm leading-6">{rule.strength}</p>}{rule.balance && <p className="mt-2 text-sm leading-6">{rule.balance}</p>}<p className="mt-3 text-xs text-[#766b67]">Read alongside your main numbers and grid patterns, rather than as a fixed description of you.</p></article>)}</section>}
 {v3.combinations.length>0 && <details className="rounded-xl border border-[#eadfd4] p-4"><summary className="cursor-pointer font-semibold">How your strengths work together</summary><div className="mt-3 space-y-3">{v3.combinations.slice(0,2).map(pair=><p key={pair.id}>{(() => { const a=strongest.find(n=>n.conclusion.functionalQualityId===pair.qualityA)!; const b=strongest.find(n=>n.conclusion.functionalQualityId===pair.qualityB)!; return pair.relationship==='COMPLEMENT' ? `Your reading brings ${themes[a.number]} together with ${themes[b.number]}. These are different qualities that can support one another.` : `Your reading connects ${themes[a.number]} with ${themes[b.number]}. One can add balance or a different perspective to the other.` })()}</p>)}</div></details>}

 <MissingNumberGrowth calculation={c} />
 <fieldset className="rounded-xl border border-[#eadfd4] p-4"><legend className="px-1 font-semibold">Does this sound like you? · Optional</legend><div className="flex flex-wrap gap-2">{['Yes, mostly','Some parts','Not really'].map(answer=><button key={answer} type="button" aria-pressed={feedback===answer} onClick={()=>setFeedback(answer)} className={`rounded-lg border px-3 py-2 text-sm ${feedback===answer?'border-[#64263B] bg-[#64263B] text-white':'border-[#ded4cb] bg-white'}`}>{answer}</button>)}</div><p className="mt-3 text-sm text-[#766b67]">{feedback?'Thank you for reflecting. Your experience matters more than fitting every description.':'There is no right answer. Notice what feels familiar to you.'} This answer stays on this page for now; it is not saved or used to change your calculations.</p></fieldset>
 </section>
}
