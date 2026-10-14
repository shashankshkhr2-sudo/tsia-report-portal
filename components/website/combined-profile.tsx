'use client'
import { useState } from 'react'
import type { NumerologyCalculationResult, NumerologyDigit, PatternResult } from '@/lib/numerology/types'
import { buildNumerologyEvidence } from '@/lib/numerology/evidenceengine'
const themes: Record<NumerologyDigit,string> = {1:'taking initiative',2:'understanding others',3:'learning and sharing ideas',4:'organising things in your own way',5:'talking with people and trying new things',6:'caring for people',7:'thinking things through',8:'staying committed',9:'acting on what matters'}
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
 <p>Your profile brings together your birthday, full date of birth, name and Personal Lo Shu. In this traditional reading, {strongest.map(n=>themes[n.number]).join(', ')} stand out together. See how these themes fit your own experience.</p>
 {strongest.map(n=><article key={n.number} className="rounded-xl bg-[#f9f5ef] p-4"><h4 className="font-semibold">A theme to recognise: {themes[n.number]}</h4><p className="mt-2">{n.isMulank && n.isBhagyank ? 'Your birthday and life path share this number, bringing the same theme into both parts of your reading.' : n.isMulank ? 'Your birthday brings this theme into your everyday style.' : n.isBhagyank ? 'Your full date of birth brings this theme into your broader reading.' : n.isNameNumber ? 'Your name brings this theme into how you express yourself.' : 'This theme is supported by the patterns in your grid.'} {n.isNameNumber && (n.isMulank || n.isBhagyank) ? 'Your name number supports it too.' : ''} {n.loShuCount>1 ? `Number ${n.number} appears ${n.loShuCount} times (${String(n.number).repeat(n.loShuCount)}) in your Personal Lo Shu. Our current rules read repetition as reinforcement; the exact count is shown without assuming that more means better.` : ''}</p><details className="mt-3 text-sm text-[#766b67]"><summary className="cursor-pointer">Why this appears</summary><p className="mt-2">Number {n.number}: {Array.from(new Set(n.evidence.map(e=>names[e.source]))).join(', ')}.</p></details></article>)}
 <details className="rounded-xl border border-[#eadfd4] p-4"><summary className="cursor-pointer font-semibold">Your rows, columns and Rajyogs</summary><div className="mt-4 space-y-4">{patterns.map(([title,p,theme])=><article key={title}><h4 className="font-semibold">{title}</h4><p className="mt-1">{p.presentCount}/3 numbers present · {p.status==='complete'?'Complete':p.status==='partial'?'Partial':'Not formed'}</p><p className="mt-2">{p.status==='complete'?`All three numbers appear, bringing together ${theme}.`:p.status==='partial'?`Two numbers appear: ${p.present.join(', ')}. Number ${p.missing.join(', ')} does not appear, so the full combination is not formed.`:`Present: ${p.present.join(', ') || 'none'}. This combination is not formed in your grid.`} {p.status!=='complete'?'This is not a judgement of your ability or potential.':''}</p></article>)}</div><p className="mt-4 text-sm text-[#766b67]">Rajyog describes a traditional number pattern, not a promise of wealth or success.</p></details>
 <fieldset className="rounded-xl border border-[#eadfd4] p-4"><legend className="px-1 font-semibold">Does this sound like you? · Optional</legend><div className="flex flex-wrap gap-2">{['Yes, mostly','Some parts','Not really'].map(answer=><button key={answer} type="button" aria-pressed={feedback===answer} onClick={()=>setFeedback(answer)} className={`rounded-lg border px-3 py-2 text-sm ${feedback===answer?'border-[#64263B] bg-[#64263B] text-white':'border-[#ded4cb] bg-white'}`}>{answer}</button>)}</div><p className="mt-3 text-sm text-[#766b67]">{feedback?'Thank you for reflecting. Your experience matters more than fitting every description.':'There is no right answer. Notice what feels familiar to you.'} This answer stays on this page for now; it is not saved or used to change your calculations.</p></fieldset>
 </section>
}
