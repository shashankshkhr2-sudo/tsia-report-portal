'use client'
import { useState } from 'react'
import type { NumerologyCalculationResult, NumerologyDigit, PatternResult } from '@/lib/numerology/types'
import { buildNumerologyEvidence } from '@/lib/numerology/evidenceengine'
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
const names:Record<string,string>={mulank:'your birthday number',bhagyank:'your life path number',nameNumber:'your name number',loshu:'your Personal Lo Shu',repetition:'a repeated number',row:'a complete row',column:'a complete column',goldenRajyog:'complete Golden Rajyog',silverRajyog:'complete Silver Rajyog'}
export function CombinedProfile({ calculation:c }: { calculation:NumerologyCalculationResult }) {
 const evidence=buildNumerologyEvidence(c)
 const strongest=evidence.rankedNumbers.filter(n=>n.score>0).slice(0,3)
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
 <h3 className="font-serif text-2xl">What stands out in your profile</h3>
 <p>Your reading highlights {strongest.map(n=>themes[n.number]).join(', ')}. Together, these offer a few sides of yourself to explore. Notice which ones feel familiar in everyday life.</p>
 {strongest.map(n=><article key={n.number} className="rounded-xl bg-[#f9f5ef] p-4"><h4 className="font-semibold">{personal[n.number].title}</h4><p className="mt-2 leading-7">{personal[n.number].description}</p><p className="mt-2 text-sm text-[#766b67]">{n.isMulank && n.isBhagyank ? 'Your birthday and life path both highlight this side of you.' : n.isMulank ? 'Your birthday number highlights this side of you.' : n.isBhagyank ? 'Your life path number highlights this side of you.' : n.isNameNumber ? 'Your name number highlights this side of you.' : 'Your Lo Shu patterns highlight this side of you.'} {n.isNameNumber && (n.isMulank || n.isBhagyank) ? 'Your name number points to it too.' : ''}</p><details className="mt-3 text-sm text-[#766b67]"><summary className="cursor-pointer">Why this appears</summary><p className="mt-2">Number {n.number} is supported by {Array.from(new Set(n.evidence.map(e=>names[e.source]))).join(', ')}.</p><p className="mt-2">{n.isMulank ? `Mulank: ${n.number}. ` : ''}{n.isBhagyank ? `Bhagyank: ${n.number}. ` : ''}{n.isNameNumber ? `Name number: ${n.number}. ` : ''}Number {n.number} appears {n.loShuCount} {n.loShuCount===1?'time':'times'} in your Personal Lo Shu{n.loShuCount>1?` (${String(n.number).repeat(n.loShuCount)})`:''}.</p></details></article>)}
 <details className="rounded-xl border border-[#eadfd4] p-4"><summary className="cursor-pointer font-semibold">Your rows, columns and Rajyogs</summary><div className="mt-4 space-y-4">{patterns.map(([title,p,theme])=><article key={title}><h4 className="font-semibold">{title}</h4><p className="mt-1">{p.presentCount}/3 numbers present · {p.status==='complete'?'Complete':p.status==='partial'?'Partial':'Not formed'}</p><p className="mt-2">{p.status==='complete'?`All three numbers appear, bringing together ${theme}.`:p.status==='partial'?`Two numbers appear: ${p.present.join(', ')}. Number ${p.missing.join(', ')} does not appear, so the full combination is not formed.`:`Present: ${p.present.join(', ') || 'none'}. This combination is not formed in your grid.`} {p.status!=='complete'?'This is not a judgement of your ability or potential.':''}</p></article>)}</div><p className="mt-4 text-sm text-[#766b67]">Rajyog describes a traditional number pattern, not a promise of wealth or success.</p></details>
 <fieldset className="rounded-xl border border-[#eadfd4] p-4"><legend className="px-1 font-semibold">Does this sound like you? · Optional</legend><div className="flex flex-wrap gap-2">{['Yes, mostly','Some parts','Not really'].map(answer=><button key={answer} type="button" aria-pressed={feedback===answer} onClick={()=>setFeedback(answer)} className={`rounded-lg border px-3 py-2 text-sm ${feedback===answer?'border-[#64263B] bg-[#64263B] text-white':'border-[#ded4cb] bg-white'}`}>{answer}</button>)}</div><p className="mt-3 text-sm text-[#766b67]">{feedback?'Thank you for reflecting. Your experience matters more than fitting every description.':'There is no right answer. Notice what feels familiar to you.'} This answer stays on this page for now; it is not saved or used to change your calculations.</p></fieldset>
 </section>
}
