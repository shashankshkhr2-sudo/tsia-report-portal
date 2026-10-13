'use client'

import { useState, type FormEvent } from 'react'
import { calculateChaldeanName } from '@/lib/numerology/chaldean'
import { calculateNumerologyV2 } from '@/lib/numerology/calculations'
import { CompatibilityReport, reportKinds, questionsByKind, type ReportProfile } from './compatibility-report'

type Person = { name: string; dob: string }
type Profile = ReportProfile
const field = 'mt-2 w-full rounded-xl border border-[#eadfd4] bg-white p-3'
function formatDob(value: string): string {
 const digits = value.replace(/\D/g, '').slice(0, 8)
 return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/')
}
function profile(person: Person): Profile {
 const name = person.name.trim()
 if (!/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/.test(name) || name.length > 120) throw new Error('Enter each name in English letters, using spaces, apostrophes or hyphens only.')
 const nameEnergy = calculateChaldeanName(name)
 if (!person.dob.trim()) return { name, nameNumber: nameEnergy.finalNumber, compound: nameEnergy.compoundTotal }
 if (!/^\d{2}\/\d{2}\/\d{4}$/.test(person.dob.trim())) throw new Error('Enter dates as DD/MM/YYYY, for example 15/06/1995.')
 const [day, month, year] = person.dob.trim().split('/')
 if (`${year}-${month}-${day}` > new Date().toISOString().slice(0,10)) throw new Error('Date of birth cannot be in the future.')
 const calculation = calculateNumerologyV2({ fullName: name, dateOfBirth: person.dob.trim() })
 return { name, nameNumber: calculation.nameNumber.finalNumber, compound: nameEnergy.compoundTotal, mulank: calculation.mulank.final, bhagyank: calculation.bhagyank.final, calculation }
}

export function CompatibilityPreview() {
 const [kind, setKind] = useState<string>(reportKinds[0])
 const [people, setPeople] = useState<Person[]>([{ name: '', dob: '' }, { name: '', dob: '' }])
 const [answers, setAnswers] = useState<Record<string,string>>({})
 const [adult, setAdult] = useState(false)
 const [permission, setPermission] = useState(false)
 const [error, setError] = useState('')
 const [result, setResult] = useState<{ kind: string; profiles: Profile[] } | null>(null)
 function update(index: number, key: keyof Person, value: string) {
  setPeople(previous => previous.map((person, i) => i === index ? { ...person, [key]: key === 'dob' ? formatDob(value) : value } : person))
  setResult(null); setError('')
 }
 function submit(event: FormEvent) {
  event.preventDefault(); setError(''); setResult(null)
  try {
   if (!permission) throw new Error('Confirm permission to use the other person’s details.')
   setResult({ kind, profiles: people.map(profile) })
  } catch (cause) { setError(cause instanceof Error ? cause.message : 'Check your details and try again.') }
 }
 return <section className="mt-8 rounded-3xl border border-[#eadfd4] bg-white p-6">
  <h2 className="font-serif text-3xl">Explore the compatibility report</h2>
  <p className="mt-3 leading-7">Development preview of the report experience. See your Name Energy and numerology patterns. Enter dates of birth when available. Your details stay in this page and clear when you reload.</p>
  <form onSubmit={submit} className="mt-5">
   <label className="block">Relationship type<select className={field} value={kind} onChange={event => { setKind(event.target.value); setAnswers({}); setAdult(false); setResult(null) }}>{reportKinds.map(item => <option key={item}>{item}</option>)}</select></label>
   <div className="mt-5 grid gap-6 sm:grid-cols-2">{people.map((person, index) => <fieldset key={index} className="min-w-0"><legend className="font-semibold">{index === 0 ? 'Your details' : 'Other person’s details'}</legend><label className="mt-3 block">Name in English<input required maxLength={120} autoComplete="off" className={field} value={person.name} onChange={event => update(index, 'name', event.target.value)} /></label><label className="mt-3 block">Date of birth — DD/MM/YYYY (optional)<input inputMode="numeric" maxLength={10} aria-label={index === 0 ? "Your date of birth in DD/MM/YYYY" : "Other person’s date of birth in DD/MM/YYYY"} placeholder="DD/MM/YYYY" className={field} value={person.dob} onChange={event => update(index, 'dob', event.target.value)} /></label></fieldset>)}</div>
   <details className="mt-6"><summary className="cursor-pointer font-semibold">Optional context from each person</summary><p className="mt-3 text-sm">Each person should provide their own answers. Leave the other person’s answers blank when unknown.</p>{questionsByKind[kind].map((question,i)=><fieldset className="mt-4" key={question}><legend className="font-semibold">{question}</legend>{people.map((person,j)=><label className="mt-2 block" key={j}>{j===0?'Your answer':'Other person’s own answer'}<textarea maxLength={600} className={field} value={answers[`${i}-${j}`]||''} onChange={event=>{setAnswers(previous=>({...previous,[`${i}-${j}`]:event.target.value}));setResult(null)}} /></label>)}</fieldset>)}{kind===reportKinds[0] && <div className="mt-4"><label className="flex gap-3"><input type="checkbox" checked={adult} onChange={event=>{setAdult(event.target.checked);setAnswers(previous=>({...previous,'intimacy-0':'','intimacy-1':''}));setResult(null)}} />Both people are 18 or older and choose to share optional intimacy context.</label>{adult && people.map((person,j)=><label key={j} className="mt-3 block">{j===0?'Your':'Other person’s own'} needs about affection, closeness, desire and boundaries (optional)<textarea maxLength={600} className={field} value={answers[`intimacy-${j}`]||''} onChange={event=>{setAnswers(previous=>({...previous,[`intimacy-${j}`]:event.target.value}));setResult(null)}} /></label>)}</div>}</details>
   <label className="mt-5 flex items-start gap-3"><input type="checkbox" required checked={permission} onChange={event => { setPermission(event.target.checked); setResult(null) }} className="mt-1" />I have permission to use the other person’s details for this preview.</label>
   {error && <p role="alert" className="mt-4 text-[#762b40]">{error}</p>}
   <button className="mt-5 rounded-xl bg-[#762b40] px-5 py-3 font-semibold text-white" type="submit">Show report preview</button>
  </form>
  {result && <CompatibilityReport kind={result.kind} profiles={result.profiles} answers={answers} />}
 </section>
}
