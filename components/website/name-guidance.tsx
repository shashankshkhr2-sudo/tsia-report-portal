"use client"

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { NameEnergyReading } from './name-energy-reading'
import { DobInput } from '@/components/dob-input'
import { Baby, Building2, Fingerprint, Package, PenLine, Ruler, Signature, Tag, ArrowRight, Check, FileText } from 'lucide-react'
import { customerClient } from '@/lib/jeevansutra/customer-client'

const services = [
 { id: 'personal', title: 'Personal Name Change & Correction', short: 'Personal name', icon: PenLine, text: 'Explore the name you carry, another spelling or a new beginning.' },
 { id: 'child', title: 'Baby & Child Naming', short: 'Baby & child', icon: Baby, text: 'Choose a meaningful name your family will love.' },
 { id: 'business', title: 'Business Naming', short: 'Business name', icon: Building2, text: 'A name for the business you are building.' },
 { id: 'brand', title: 'Brand Naming', short: 'Brand name', icon: Tag, text: 'Give your brand a memorable identity.' },
 { id: 'project', title: 'Project Naming', short: 'Project name', icon: Ruler, text: 'Give your vision a name people connect with.' },
 { id: 'product', title: 'Product Naming', short: 'Product name', icon: Package, text: 'Express what your product brings to the world.' },
 { id: 'signature', title: 'Personalised Signature Design', short: 'Signature design', icon: Signature, text: 'A signature for your current name or your chosen new name.' },
] as const
const nameChoices = [
 ['current','Current name'],['birth','Birth name'],['nickname','Nickname / name used by loved ones'],['after_marriage','Name after marriage'],['professional','Professional / screen name'],['considering','New name or spelling I am considering'],['other','Another name'],
] as const
const nameLabel = (type:string) => nameChoices.find(([key])=>key===type)?.[1] || type
const values: Record<string, number> = Object.fromEntries(
 Object.entries({ '1': 'AIJQY', '2': 'BKR', '3': 'CGLS', '4': 'DMT', '5': 'EHNX', '6': 'UVW', '7': 'OZ', '8': 'FP' })
 .flatMap(([value, letters]) => [...letters].map(letter => [letter, Number(value)])),
)
function reduce(value: number): number { while (value > 9) value = [...String(value)].reduce((sum, digit) => sum + Number(digit), 0); return value }
function calculate(name: string) {
 const letters = [...name.trim().toUpperCase()].filter(letter => /[A-Z]/.test(letter))
 const total = letters.reduce((sum, letter) => sum + values[letter], 0)
 return { letters, total, number: reduce(total) }
}
function birthNumbers(dob: string) {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null
 const [year, month, day] = dob.split('-').map(Number)
 const date = new Date(Date.UTC(year, month - 1, day))
 if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || dob > new Date().toISOString().slice(0, 10) || year < 1900) return null
 return { mulank: reduce(day), bhagyank: reduce([...dob.replaceAll('-', '')].reduce((sum, digit) => sum + Number(digit), 0)) }
}
const input = 'mt-2 min-h-12 w-full rounded-xl border border-[#C5A15A]/40 bg-white px-4 py-3 text-[#42353A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B]'
const card = 'rounded-3xl border border-[#C5A15A]/30 bg-[#FFFCF7] p-6 shadow-[0_12px_40px_-25px_#64263B55] sm:p-8'
const heading = 'font-serif text-3xl leading-tight text-[#64263B] sm:text-4xl'

export function NameGuidance() {
 const [service, setService] = useState<string>('personal')
 const [action, setAction] = useState('review')
 const [name, setName] = useState('')
 const [alternative, setAlternative] = useState('')
 const [selectedNames,setSelectedNames]=useState<string[]>(['current'])
 const [nameEntries,setNameEntries]=useState<Record<string,string>>({})
 const [dob, setDob] = useState('')
 const [gender, setGender] = useState('')
 const [purpose, setPurpose] = useState('')
 const [usage, setUsage] = useState('Current name')
 const [context, setContext] = useState('')
 const [preferences, setPreferences] = useState('')
 const [signatureName, setSignatureName] = useState('current')
 const [error, setError] = useState('')
 const [saveConsent,setSaveConsent]=useState(false)
 const [saving,setSaving]=useState(false)
 const [saveMessage,setSaveMessage]=useState('')
 const [needsSignIn,setNeedsSignIn]=useState(false)
 const [reading, setReading] = useState<{ name: string; alternative: string; dob: string; names?:{type:string;name:string}[] } | null>(null)
 const [profileNote, setProfileNote] = useState('')
 const [savedProfile, setSavedProfile] = useState<{name:string;dob:string} | null>(null)
 const personal = service === 'personal' || service === 'signature'
 const human = personal || service === 'child'
 const selected = services.find(item => item.id === service)!
 useEffect(() => {
  let active = true
  async function loadProfile() {
   try {
    const session = await customerClient()?.auth.getSession()
    const token = session?.data.session?.access_token
    if (!token) return
    const response = await fetch('/api/website/name-guidance/profile', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
    if (!response.ok) return
    const data = await response.json()
    // Only consume known string fields; never modify the saved customer profile here.
    const profile = data.profile || data
    if (!active) return
    if (typeof profile.name === 'string' && typeof profile.dob === 'string') setSavedProfile({name:profile.name,dob:profile.dob})
    if (typeof profile.name === 'string') setName(current => current || profile.name)
    if (typeof profile.dob === 'string') {
     const raw = profile.dob
     const iso = /^\d{2}\/\d{2}\/\d{4}$/.test(raw) ? raw.split('/').reverse().join('-') : raw
     if (birthNumbers(iso)) setDob(current => current || iso)
    }
    setProfileNote('If your saved details appear below, check them before exploring. Your saved profile will not be changed.')
   } catch { /* Public exploration remains available without a profile. */ }
  }
  void loadProfile()
  return () => { active = false }
 }, [])
 function changeService(id: string) { if(saving)return; setSaveMessage('');setSaveConsent(false);setNeedsSignIn(false); setSelectedNames(['current']);setNameEntries({});setAction('review');setService(id); setName(id === 'personal' || id === 'signature' ? savedProfile?.name || '' : ''); setAlternative(''); setDob(id === 'personal' || id === 'signature' ? savedProfile?.dob || '' : ''); setGender(''); setContext(''); setPurpose(''); setPreferences(''); setReading(null); setError(''); setUsage('Current name') }
 async function saveInterest() {
  if(saving)return
  setSaving(true);setError('');setSaveMessage('');setNeedsSignIn(false)
  try {
   const session=await customerClient()?.auth.getSession();const token=session?.data.session?.access_token
   if(!token){setNeedsSignIn(true);setError('Verify your email and complete your profile before saving. Your entries remain here while this page stays open.');return}
   const response=await fetch('/api/website/name-guidance/interest',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({service,action:service==='personal'&&action!=='new'?'review':action,name,alternative,dob,gender,purpose,usage,context,preferences,signatureName,names:service==='personal'&&action!=='new'?selectedNames.map(type=>({type,name:type==='current'?(nameEntries[type]??name):(nameEntries[type]??'')})):undefined,consent:saveConsent})})
   const data=await response.json()
   if(response.status===401)setNeedsSignIn(true)
   if(!response.ok||data.saved!==true){setError(data.error||'Unable to confirm the save. Please retry.');return}
   setSaveMessage('Thank you for your interest! We’ll get in touch when practitioner sessions open. We look forward to guiding you.')
  }catch{setError('Unable to confirm the save. Your entries are still here; please retry.')}finally{setSaving(false)}
 }
 function explore(event: FormEvent<HTMLFormElement>) {
  event.preventDefault(); setError(''); setReading(null)
  if (!purpose.trim()) { setError('Tell us why you are exploring this name.'); return }
  if (service === 'signature' || action === 'new') { setError('New name suggestions and signature designs require practitioner guidance. Consultations are coming soon. You can save your interest below.'); return }
  if (service === 'personal') {
   const names=selectedNames.map(type=>({type,name:(type==='current'?(nameEntries[type]??name):(nameEntries[type]??'')).trim()}))
   if(!names.length || names.some(item=>!item.name || !/^[A-Za-z .’'—–-]+$/.test(item.name) || !calculate(item.name).total)){setError('Select at least one name and enter the English spelling for every selected name.');return}
   if(!birthNumbers(dob)){setError('Enter a valid date of birth.');return}
   setReading({name:names[0].name,alternative:'',dob,names})
   requestAnimationFrame(()=>document.getElementById('name-reading')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}))
   return
  }
  if (!name.trim() || !/^[A-Za-z .’'—–-]+$/.test(name.trim()) || !calculate(name).total) { setError('Enter the exact English spelling using A–Z, spaces, apostrophes, hyphens or full stops.'); return }
  if (action === 'compare' && (!alternative.trim() || !/^[A-Za-z .’'—–-]+$/.test(alternative.trim()) || !calculate(alternative).total)) { setError('Enter a second name using the same spelling rules.'); return }
  if (human && !birthNumbers(dob)) { setError('Enter a valid date of birth.'); return }
  setReading({ name: name.trim(), alternative: action === 'compare' ? alternative.trim() : '', dob: human ? dob : '' })
  requestAnimationFrame(() => document.getElementById('name-reading')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }))
 }
 function nameCard(exactName: string) {
  const result = calculate(exactName)
  return <article className={card}><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#886634]">Exact spelling explored</p><h3 className="mt-4 break-words font-serif text-4xl text-[#64263B] sm:text-5xl">{exactName}</h3><div className="mt-6 flex flex-wrap gap-2" aria-label="Letter values">{result.letters.map((letter, index) => <span key={index} className="flex w-12 flex-col items-center rounded-lg border border-[#C5A15A]/30 bg-[#F5EDDD] py-2"><span className="font-serif text-xl">{letter}</span><span className="text-sm text-[#886634]">{values[letter]}</span></span>)}</div><p className="mt-6 font-serif text-3xl text-[#64263B]">{result.total} <span aria-hidden="true">→</span> {result.number}</p><p className="mt-2 text-sm text-[#766b67]">Compound total: {result.total} · Reduced name number: {result.number}</p><p className="mt-4 text-sm leading-7">This shows how your spelling is calculated in Chaldean numerology. A practitioner will explain its traditional interpretation in your context.</p></article>
 }
 return <main className="bg-[#FAF7F0] text-[#42353A]">
  <section className="relative overflow-hidden bg-[#64263B] px-5 py-14 text-[#FAF7F0] sm:py-20">
   <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-8 rotate-[-18deg] text-[#EAD8AD]/10"><PenLine size={320} strokeWidth={0.5} /></div>
   <div className="relative mx-auto max-w-6xl"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EAD8AD]">Jeevan Sutra · Name Guidance</p><h1 className="mt-7 max-w-3xl font-serif text-4xl leading-[1.2] sm:text-6xl">Your Name.<br />Your Dignity.<br />Your Identity.</h1><div className="my-7 h-px w-24 bg-[#C5A15A]" /><p lang="hi" className="text-2xl leading-relaxed text-[#EAD8AD] sm:text-3xl">आपका नाम। आपका सम्मान। आपकी पहचान।</p><p className="mt-6 max-w-xl text-lg leading-8">Your name carries your story—how loved ones call you, how you introduce yourself, and how the world remembers you.</p><a href="#explore-name" className="mt-8 inline-flex min-h-12 items-center gap-5 rounded-full bg-[#EAD8AD] px-7 py-4 font-semibold text-[#64263B]">Explore Your Name <ArrowRight size={18} /></a></div>
  </section>
  <div className="mx-auto max-w-6xl space-y-12 px-5 py-12 sm:space-y-16 sm:py-16">
   <section id="explore-name" className="scroll-mt-28" aria-labelledby="service-title"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#886634]">A name for every new beginning</p><h2 id="service-title" className={`${heading} mt-3`}>What would you like guidance with?</h2><fieldset disabled={saving} className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3"><legend className="sr-only">Choose one service</legend>{services.map(item => <label key={item.id} className={`relative cursor-pointer rounded-2xl border p-4 transition sm:p-6 ${service === item.id ? 'border-[#886634] bg-[#F2E5CA] ring-1 ring-[#886634]' : 'border-[#C5A15A]/30 bg-[#FFFCF7] hover:border-[#886634]'}`}><input type="radio" name="service" value={item.id} checked={service === item.id} onChange={() => changeService(item.id)} className="sr-only peer" /><span className="absolute inset-0 rounded-2xl peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#64263B]" /><item.icon aria-hidden="true" className="mb-4 text-[#886634]" size={36} strokeWidth={1.2} /><span className="block font-serif text-xl text-[#64263B]">{item.short}</span><span className="mt-2 block text-xs leading-6 sm:text-sm">{item.text}</span>{service === item.id && <Check aria-hidden="true" className="absolute right-3 top-3 text-[#64263B]" size={16} />}</label>)}</fieldset></section>
   <section className={card} aria-labelledby="request-title"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#886634]">Your personal exploration</p><h2 id="request-title" className={`${heading} mt-3`}>{selected.title}</h2><p className="mt-4 leading-7">Explore the calculations here. Personal recommendations and signature designs follow a practitioner’s review.</p><p className="mt-3 text-sm leading-6 text-[#766b67]">Explore your reading, then choose “Request a Practitioner Session” when you would like personal guidance. Your registered profile will not be changed.</p>{profileNote && <p className="mt-3 text-sm leading-6">{profileNote}</p>}
    <form onSubmit={explore} onChange={() => {setReading(null);setError('');setSaveMessage('')}} className="mt-7"><fieldset disabled={saving} className="min-w-0 space-y-6">
     {service !== 'signature' ? <fieldset><legend className="font-semibold">What brings you here?</legend><div className="mt-3 flex flex-wrap gap-2">{(service==='personal'?[['review','Evaluate my selected names'],['new','Suggest new names']]:[['review','Review an existing name'],['compare','Compare names'],['new','Suggest new names']]).map(([value,label]) => <label key={value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#C5A15A]/40 px-4 py-3"><input type="radio" name="action" value={value} checked={action === value} onChange={() => { setAction(value); setReading(null) }} className="accent-[#64263B]" />{label}</label>)}</div></fieldset> : <label className="block font-semibold">Which name is your signature for?<select value={signatureName} onChange={event => setSignatureName(event.target.value)} className={input}><option value="current">My current name</option><option value="chosen">My newly chosen name</option></select></label>}
     {service === 'personal' && action !== 'new' && <fieldset><legend className="font-semibold">Which names would you like to explore?</legend><p className="mt-2 text-sm leading-6">Select one or more. Only selected names will be calculated and saved.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{nameChoices.map(([type,label])=><div key={type} className={`rounded-2xl border p-4 ${selectedNames.includes(type)?'border-[#C5A15A] bg-[#F5EDDD]':'border-[#C5A15A]/30 bg-white'}`}><label className="flex items-start gap-3 font-semibold text-[#64263B]"><input type="checkbox" checked={selectedNames.includes(type)} onChange={event=>{setSelectedNames(current=>event.target.checked?[...current,type]:current.filter(key=>key!==type));setReading(null)}} className="mt-1 accent-[#64263B]" />{label}</label>{selectedNames.includes(type)&&<label className="mt-3 block text-sm">Exact English spelling<input required maxLength={120} value={type==='current'?(nameEntries[type]??name):(nameEntries[type]??'')} onChange={event=>setNameEntries(current=>({...current,[type]:event.target.value}))} className={input} autoComplete="off" /></label>}</div>)}</div></fieldset>}

     {service !== 'personal' && (action !== 'new' || service === 'signature') && <label className="block font-semibold">{service === 'child' ? 'Child’s name' : 'Exact name to explore'}<input value={name} onChange={event => setName(event.target.value)} maxLength={120} required className={input} autoComplete="off" /><span className="mt-2 block text-xs font-normal leading-6">Use the English spelling you want calculated. Apostrophes, spaces and punctuation have no numerical value.</span></label>}
     {action === 'compare' && service !== 'signature' && service !== 'personal' && <label className="block font-semibold">Second name or spelling<input value={alternative} onChange={event => setAlternative(event.target.value)} maxLength={120} required className={input} /></label>}
     {human && <div className="grid gap-5 sm:grid-cols-2"><label className="block font-semibold">{service === 'child' ? 'Child’s date of birth — DD/MM/YYYY' : 'Date of birth — DD/MM/YYYY'}<span className="mt-2 block"><DobInput value={dob} onChange={value => { setDob(value); setReading(null); setError('') }} required={action !== 'new' || service === 'signature'} /></span>{service === 'child' && <span className="mt-2 block text-xs font-normal">For a baby not yet born, suggestions need a later review using the actual birth date.</span>}</label>{personal && <label className="block font-semibold">Gender <span className="text-xs font-normal">(required)</span><select value={gender} onChange={event => setGender(event.target.value)} required className={input}><option value="">Select</option><option>Woman</option><option>Man</option><option>Another identity</option></select><span className="mt-2 block text-xs font-normal">Context for your discussion; it does not change letter values.</span></label>}</div>}
     {service === 'personal' && selectedNames.includes('after_marriage') && action !== 'new' && <label className="block font-semibold">Previous name and whether the new name is already used<textarea required value={context} onChange={event => setContext(event.target.value)} maxLength={600} className={input} /></label>}
     {!human && <label className="block font-semibold">What are you naming, and who is it for?<textarea required value={context} onChange={event => setContext(event.target.value)} maxLength={600} className={input} placeholder="Describe the business, audience and what the name should express." /></label>}
     <label className="block font-semibold">Your purpose <span className="text-xs font-normal">(required)</span><textarea required value={purpose} onChange={event => setPurpose(event.target.value)} maxLength={600} className={input} placeholder="Tell us why you are exploring this name and what matters to you." /></label>
     <label className="block font-semibold">Language, meaning or naming preferences <span className="text-xs font-normal">(optional)</span><textarea value={preferences} onChange={event => setPreferences(event.target.value)} maxLength={600} className={input} /></label>
     {personal && <div className="rounded-2xl border border-[#C5A15A]/40 bg-[#F5EDDD] p-5"><div className="flex items-center gap-3 font-semibold text-[#64263B]"><Signature aria-hidden="true" />Your signature is part of the review</div><p className="mt-3 text-sm leading-7">Before recommending a personal name change, your practitioner must review your current signature. Signature design is also available for a retained or newly chosen name. Children who do not yet sign can be marked not applicable.</p><p className="mt-2 text-sm leading-7">Current-signature analysis is compulsory before recommending a personal name change; no recommendation is generated here. Private signature upload will open with consultations. Please do not send a signature through public comments or social posts.</p></div>}
     {error && <p role="alert" className="rounded-xl bg-[#F5EDDD] p-4 text-sm leading-7 text-[#64263B]">{error}</p>}
     <button type="submit" className="inline-flex min-h-12 items-center gap-4 rounded-full bg-[#64263B] px-7 py-4 font-semibold text-white">{service === 'signature' || action === 'new' ? 'View next step' : 'Explore the calculation'}<ArrowRight aria-hidden="true" size={18} /></button>
     <div className="rounded-2xl border border-[#C5A15A]/35 bg-[#FAF7F0] p-5"><h3 className="font-serif text-2xl text-[#64263B]">Your next step: personal guidance</h3><p className="mt-3 text-sm leading-7">Would you like to explore your name with a practitioner? Share your interest and we’ll get in touch when sessions open. This request does not confirm a booking.</p><label className="mt-4 flex items-start gap-3 text-sm leading-7"><input type="checkbox" checked={saveConsent} onChange={event=>setSaveConsent(event.target.checked)} className="mt-2 accent-[#64263B]" />I agree to save these details with Jeevan Sutra for personalised name guidance.</label><button type="button" disabled={saving||!saveConsent} onClick={()=>void saveInterest()} className="mt-5 min-h-12 rounded-xl bg-[#64263B] px-6 py-3 font-semibold text-white disabled:opacity-50">{saving?'Sending your request…':'Request a Practitioner Session'}</button>{saveMessage&&<p role="status" className="mt-4 text-sm leading-7 text-[#64263B]">{saveMessage}</p>}{needsSignIn&&<Link href="/website/start?next=name-guidance" target="_blank" rel="noopener noreferrer" className="mt-4 block font-semibold text-[#64263B] underline">Verify your account in a new tab, then return here to save</Link>}</div>
    </fieldset></form>
   </section>
   {reading && <section id="name-reading" tabIndex={-1} className="scroll-mt-28" aria-labelledby="reading-title"><h2 id="reading-title" className={heading}>Understand the Name You Carry</h2>{reading.names ? <>{reading.names.length>1&&<div className="mt-5 rounded-2xl border border-[#eadfd4] bg-[#FAF7F0] p-5"><h3 className="font-serif text-2xl text-[#64263B]">Your names at a glance</h3><p className="mt-3 text-sm leading-6">Mulank and Bhagyank stay the same. Each spelling has its own name total; the numbers alone do not decide which name is best.</p><ul className="mt-4 space-y-3">{reading.names.map(item=><li key={item.type} className="break-words text-sm"><strong className="text-[#64263B]">{nameLabel(item.type)}</strong> · {item.name} · {calculate(item.name).total} → {calculate(item.name).number}</li>)}</ul></div>}{reading.names.map(item=><div key={item.type} className="mt-8"><p className="font-semibold text-[#886634]">{nameLabel(item.type)}</p><NameEnergyReading name={item.name} dob={reading.dob} mulank={birthNumbers(reading.dob)!.mulank} bhagyank={birthNumbers(reading.dob)!.bhagyank} nameNumber={calculate(item.name).number} total={calculate(item.name).total} calculation={<details className="rounded-2xl border border-[#C5A15A]/30 p-5"><summary className="cursor-pointer font-semibold text-[#64263B]">See the letter-by-letter calculation</summary><div className="mt-4">{nameCard(item.name)}</div></details>} /></div>)}</> : <>{!reading.dob && <details className="mt-6 rounded-2xl border border-[#C5A15A]/30 p-5"><summary className="cursor-pointer font-semibold text-[#64263B]">See the letter-by-letter calculation</summary><div className={`mt-6 grid gap-5 ${reading.alternative ? 'md:grid-cols-2' : ''}`}>{nameCard(reading.name)}{reading.alternative && nameCard(reading.alternative)}</div></details>}{reading.dob && birthNumbers(reading.dob) && <><NameEnergyReading isChild={service === 'child'} name={reading.name} calculation={<details className="rounded-2xl border border-[#C5A15A]/30 p-5"><summary className="cursor-pointer font-semibold text-[#64263B]">See the letter-by-letter calculation</summary><div className="mt-4">{nameCard(reading.name)}</div></details>} dob={reading.dob} mulank={birthNumbers(reading.dob)!.mulank} bhagyank={birthNumbers(reading.dob)!.bhagyank} nameNumber={calculate(reading.name).number} total={calculate(reading.name).total} />{reading.alternative && <NameEnergyReading isChild={service === 'child'} name={reading.alternative} calculation={<details className="rounded-2xl border border-[#C5A15A]/30 p-5"><summary className="cursor-pointer font-semibold text-[#64263B]">See the letter-by-letter calculation</summary><div className="mt-4">{nameCard(reading.alternative)}</div></details>} dob={reading.dob} mulank={birthNumbers(reading.dob)!.mulank} bhagyank={birthNumbers(reading.dob)!.bhagyank} nameNumber={calculate(reading.alternative).number} total={calculate(reading.alternative).total} />}</>}</>}</section>}
   <section className="grid gap-6 md:grid-cols-2"><div className={card}><Fingerprint className="text-[#886634]" aria-hidden="true" size={32} /><h2 className={`${heading} mt-4`}>What can a spelling change?</h2><p className="mt-5 leading-8">Different letters produce a different name total. In traditional numerology, that total is interpreted symbolically alongside your context. “Name energy” describes that traditional idea; it is not a measured physical force.</p></div><div className={card}><PenLine className="text-[#886634]" aria-hidden="true" size={32} /><h2 className={`${heading} mt-4`}>Keep the meaning. Keep yourself.</h2><p className="mt-5 leading-8">Meaning, comfortable pronunciation and personal connection matter. A review may recommend keeping your existing name. Signature interpretations cannot reliably establish personality.</p></div></section>
   <section id="practitioner" className="scroll-mt-28 overflow-hidden rounded-3xl bg-[#64263B] text-[#FAF7F0]"><div className="p-7 sm:p-10"><p className="text-xs uppercase tracking-[0.2em] text-[#EAD8AD]">Practitioner-led guidance</p><h2 className="mt-4 max-w-2xl font-serif text-3xl sm:text-5xl">A Name Should Feel Right to You.</h2><p className="mt-5 max-w-2xl leading-8">Discuss your story, preferences and purpose. Your practitioner checks the calculations and explains whether a change is worth considering.</p><ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{['Share your details','Explore your current name','Practitioner review','Explained recommendations'].map((step,index) => <li key={step} className="border-t border-[#EAD8AD]/30 pt-4"><span className="font-serif text-3xl text-[#EAD8AD]">0{index+1}</span><p className="mt-3 font-semibold">{step}</p></li>)}</ol><p className="mt-7 text-sm leading-7">Recommendations will include the calculation, pronunciation, meaning where verified, and the reason for the suggestion. Business and brand guidance will clearly state the scope of any domain or trademark checks.</p><p className="mt-7 inline-block rounded-full border border-[#EAD8AD]/50 px-6 py-3 font-semibold text-[#EAD8AD]">Practitioner consultations coming soon</p><p className="mt-3 text-sm leading-7 text-[#EAD8AD]">Service scope, pricing and delivery details will be confirmed before bookings open.</p></div></section>
   <section aria-labelledby="recommendation-title"><h2 id="recommendation-title" className={heading}>Your practitioner’s recommendation</h2><p className="mt-4 leading-8">After a consultation, this is where your reviewed suggestions and reasons will belong. No recommendation has been made on this page.</p><div className={`${card} mt-6`}><FileText aria-hidden="true" className="text-[#886634]" size={32} /><h3 className="mt-4 font-serif text-2xl text-[#64263B]">Where Will You Use Your New Name?</h3><p className="mt-3 text-sm leading-7">After the recommendation, a personalised checklist will distinguish public use from an official personal or registered business name change.</p><ul className="mt-5 space-y-3">{[['Update','Places confirmed for your chosen name.'],['Check requirements','Records needing verification against applicable official guidance.'],['No change needed','Records confirmed as able to remain unchanged.']].map(([status,description]) => <li key={status} className="rounded-xl border border-[#C5A15A]/30 p-4"><span className="font-semibold text-[#64263B]">{status}</span><p className="mt-1 text-sm leading-6">{description}</p></li>)}</ul><p className="mt-4 text-xs leading-6 text-[#766b67]">This explains the future checklist, not instructions to change any document. Actual items require verified guidance after your review.</p></div></section>
   <section className="rounded-3xl bg-[#64263B] px-6 py-10 text-center text-[#FAF7F0]"><h2 className="font-serif text-3xl sm:text-4xl">A Name That Feels Like You.</h2><p lang="hi" className="mt-4 text-xl text-[#EAD8AD]">एक नाम, जिसमें आप खुद को पहचानें।</p><p className="mx-auto mt-5 max-w-xl leading-8">Whether you keep the name you love or explore a new beginning, make the choice with understanding.</p><Link href="/website/start?next=name-guidance" className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#EAD8AD] px-6 py-3 font-semibold text-[#64263B]">Explore your free profile <ArrowRight size={18} /></Link></section>
   <p className="mx-auto max-w-3xl text-center text-xs leading-7 text-[#766b67]">Numerology offers traditional interpretations for reflection. A name or signature change does not guarantee particular life outcomes. Your choices and actions continue to matter.</p>
  </div>
 </main>
}
