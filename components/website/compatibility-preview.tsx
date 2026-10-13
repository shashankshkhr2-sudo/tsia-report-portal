'use client'

import { useState, type FormEvent } from 'react'
import { calculateChaldeanName } from '@/lib/numerology/chaldean'
import { calculateNumerologyV2 } from '@/lib/numerology/calculations'

type Person = { name: string; dob: string }
type Profile = { name: string; nameNumber: number; mulank?: number; bhagyank?: number }
const field = 'mt-2 w-full rounded-xl border border-[#eadfd4] bg-white p-3'
function profile(person: Person): Profile {
 const name = person.name.trim()
 if (!/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/.test(name) || name.length > 120) throw new Error('Enter each name in English letters, using spaces, apostrophes or hyphens only.')
 if (!person.dob.trim()) return { name, nameNumber: calculateChaldeanName(name).finalNumber }
 if (!/^\d{2}\/\d{2}\/\d{4}$/.test(person.dob.trim())) throw new Error('Enter dates as DD/MM/YYYY, for example 15/06/1995.')
 const [day, month, year] = person.dob.trim().split('/')
 if (`${year}-${month}-${day}` > new Date().toISOString().slice(0,10)) throw new Error('Date of birth cannot be in the future.')
 const calculation = calculateNumerologyV2({ fullName: name, dateOfBirth: person.dob.trim() })
 return { name, nameNumber: calculation.nameNumber.finalNumber, mulank: calculation.mulank.final, bhagyank: calculation.bhagyank.final }
}

export function CompatibilityPreview() {
 const [kind, setKind] = useState('Personal')
 const [people, setPeople] = useState<Person[]>([{ name: '', dob: '' }, { name: '', dob: '' }])
 const [permission, setPermission] = useState(false)
 const [error, setError] = useState('')
 const [result, setResult] = useState<{ kind: string; profiles: Profile[] } | null>(null)
 function update(index: number, key: keyof Person, value: string) {
  setPeople(previous => previous.map((person, i) => i === index ? { ...person, [key]: value } : person))
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
  <h2 className="font-serif text-3xl">Try a free comparison preview</h2>
  <p className="mt-3 leading-7">See your numbers side by side. Enter dates of birth when available. Your details stay in this page and clear when you reload.</p>
  <form onSubmit={submit} className="mt-5">
   <label className="block">Relationship type<select className={field} value={kind} onChange={event => { setKind(event.target.value); setResult(null) }}><option>Personal</option><option>Professional</option></select></label>
   <div className="mt-5 grid gap-6 sm:grid-cols-2">{people.map((person, index) => <fieldset key={index} className="min-w-0"><legend className="font-semibold">{index === 0 ? 'Your details' : 'Other person’s details'}</legend><label className="mt-3 block">Name in English<input required maxLength={120} autoComplete="off" className={field} value={person.name} onChange={event => update(index, 'name', event.target.value)} /></label><label className="mt-3 block">Date of birth (optional)<input inputMode="numeric" maxLength={10} placeholder="DD/MM/YYYY" className={field} value={person.dob} onChange={event => update(index, 'dob', event.target.value)} /></label></fieldset>)}</div>
   <label className="mt-5 flex items-start gap-3"><input type="checkbox" required checked={permission} onChange={event => { setPermission(event.target.checked); setResult(null) }} className="mt-1" />I have permission to use the other person’s details for this preview.</label>
   {error && <p role="alert" className="mt-4 text-[#762b40]">{error}</p>}
   <button className="mt-5 rounded-xl bg-[#762b40] px-5 py-3 font-semibold text-white" type="submit">Show free preview</button>
  </form>
  {result && <div className="mt-7 border-t border-[#eadfd4] pt-6" aria-live="polite"><h3 className="font-serif text-2xl">Your {result.kind.toLowerCase()} comparison preview</h3><div className="mt-4 overflow-x-auto"><table className="w-full text-left"><caption className="sr-only">Traditional numerology numbers for both people</caption><thead><tr><th className="p-2">Number</th>{result.profiles.map((person, i) => <th key={i} className="break-words p-2">{person.name}</th>)}</tr></thead><tbody>{(['Name number','Mulank','Bhagyank'] as const).map((label, index) => <tr key={label} className="border-t"><th className="p-2">{label}</th>{result.profiles.map((person, i) => <td key={i} className="p-2">{[person.nameNumber, person.mulank, person.bhagyank][index] ?? 'DOB needed'}</td>)}</tr>)}</tbody></table></div><p className="mt-4 leading-7">{result.profiles[0].nameNumber === result.profiles[1].nameNumber ? 'Your names reduce to the same Chaldean number. This is a shared calculation pattern; it does not establish compatibility.' : 'Your names reduce to different Chaldean numbers. Different numbers do not establish a conflict or an unsuitable relationship.'}</p><h4 className="mt-4 font-semibold">A conversation to start</h4><p className="mt-2 leading-7">{result.kind === 'Personal' ? 'How do you each prefer to communicate, share responsibilities and resolve disagreements?' : 'How do you each prefer to make decisions, divide responsibilities and give feedback?'}</p><p className="mt-4 text-sm leading-6">This free preview shows calculations and a discussion prompt. It is not a full compatibility assessment or a score. Traditional numerology does not verify feelings, loyalty, competence or future outcomes. Paid reports, saved comparisons and checkout are not available yet.</p></div>}
 </section>
}
