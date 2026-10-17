'use client'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { compatibilitySignInPath } from '@/lib/jeevansutra/customer-destination'
import { LaunchGift } from './launch-gift'
import { customerClient } from '@/lib/jeevansutra/customer-client'
import { compatibilityKinds, relationships, priorities, type CompatibilityKind, type CustomerReading } from '@/lib/jeevansutra/compatibility-contract'
const legacyKinds = ['Personal Relationship Compatibility', 'Business Partnership Compatibility', 'Professional Compatibility', 'Interaction Guidance']
type Saved = { id: string; preview: CustomerReading; created_at: string }
const field = 'mt-2 min-h-12 w-full rounded-xl border border-[#ded4cb] bg-[#FFFDFA] p-3 text-base text-[#392e30] focus:outline-2 focus:outline-offset-2 focus:outline-[#C5A15A]'
export function CompatibilityPreview() {
 const router = useRouter()
 const [draft, setDraft] = useState(false)
 const [kind, setKind] = useState(legacyKinds[0]); const [relationship, setRelationship] = useState('Partners')
 const [selfRole, setSelfRole] = useState(''); const [otherRole, setOtherRole] = useState('')
 const [selected, setSelected] = useState<string[]>([])
 const [name, setName] = useState(''); const [dob, setDob] = useState(''); const [permission, setPermission] = useState(false)
 const [history, setHistory] = useState<Saved[]>([]); const [remaining, setRemaining] = useState(3)
 const [signedIn, setSignedIn] = useState(false); const [loading, setLoading] = useState(true)
 const [busy, setBusy] = useState(false); const [error, setError] = useState('')
 const report = useRef<HTMLElement>(null); const [reportOpenCount, setReportOpenCount] = useState(0)
 const [preview, setPreview] = useState<CustomerReading | null>(null)
 function openReport(value: CustomerReading) { setPreview(value); setReportOpenCount(count => count + 1) }
 useEffect(() => { if (reportOpenCount) { report.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); report.current?.focus({ preventScroll: true }) } }, [reportOpenCount])
 async function token() { return (await customerClient()?.auth.getSession())?.data.session?.access_token }
 async function load() {
  try {
   const access = await token(); if (!access) { setSignedIn(false); router.replace(compatibilitySignInPath); return }
   const response = await fetch('/api/website/compatibility', { headers: { Authorization: `Bearer ${access}` }, cache: 'no-store' })
   const data = await response.json()
   if (!response.ok) { if (response.status === 401) { setSignedIn(false); router.replace(compatibilitySignInPath); return } setError(data.error || 'Unable to load compatibility.'); return }
   setSignedIn(true); setHistory(data.history); setRemaining(data.remaining)
   setDraft(Boolean(data.draftEnabled)); setKind(current => data.draftEnabled ? (compatibilityKinds.includes(current as CompatibilityKind) ? current : compatibilityKinds[0]) : (legacyKinds.includes(current) ? current : legacyKinds[0]))
  } catch { setError('Unable to load your previews. Please reload to try again.') }
  finally { setLoading(false) }
 }
 useEffect(() => { void load() }, [])
 async function submit(event: FormEvent) {
  event.preventDefault(); setError(''); setBusy(true)
  try {
   const access = await token(); if (!access) { setSignedIn(false); router.replace(compatibilitySignInPath); return }
   const response = await fetch('/api/website/compatibility', { method: 'POST', headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, name, dob, permission, ...(draft ? { relationship, selfRole, otherRole, priorities: selected } : {}) }) })
   const data = await response.json()
   if (!response.ok) { setError(data.error || 'Unable to save preview.'); return }
   openReport(data.preview); setRemaining(data.remaining); await load()
  } catch { setError('Unable to confirm the save. Retry with the same details to check without using an extra preview.') }
  finally { setBusy(false) }
 }
 if (loading || !signedIn) return <section className="mt-8 rounded-3xl border border-[#eadfd4] bg-white p-6">
  {error ? <><p role="alert" className="text-red-800">{error}</p><button type="button" className="mt-4 underline" onClick={() => { setError(''); setLoading(true); void load() }}>Try again</button></> : <p role="status">Checking your account and opening compatibility…</p>}
 </section>
 return <section className="mt-8 rounded-3xl border border-[#eadfd4] bg-white p-5 sm:p-7">
  <LaunchGift showLink={false} />
  {draft && <p role="status" className="mt-5 rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950">STAGING DRAFT — interpretation tables are under review. Not a final customer reading. Draft saves use this staging account’s existing launch allowance. Reopening preserves the original roles and priorities.</p>}
  <p className="mt-5 text-sm leading-7 text-[#766b67]">Your details come from your saved profile. Add someone you would like to understand better.</p>
  {error && <p role="alert" className="mt-4 text-red-800">{error}</p>}
  {loading ? <p role="status" className="mt-4">Loading your previews…</p> : !signedIn ? <div className="mt-5 flex flex-wrap gap-5"><Link href="/website/welcome" className="underline">My Profile</Link><Link href="/website/start" className="underline">Start with Email / Sign in</Link></div> : <>
   <p role="status" className="mt-5 rounded-xl border border-[#C5A15A]/40 bg-[#FAF5E9] px-4 py-3 text-sm font-semibold text-[#64263B]">{remaining} of 3 launch gift previews remaining</p>
   <form onSubmit={submit} className="mt-5">
    <label className="block">Relationship category<select className={field} value={kind} onChange={e => { setKind(e.target.value); if (draft) setRelationship(relationships[e.target.value as CompatibilityKind][0]) }}>{(draft ? compatibilityKinds : legacyKinds).map(item => <option key={item}>{item}</option>)}</select></label>
    {draft && <>
     <label className="mt-4 block">Relationship<select className={field} value={relationship} onChange={e => setRelationship(e.target.value)}>{(relationships[kind as CompatibilityKind] || []).map(item => <option key={item}>{item}</option>)}</select></label>
     <div className="grid gap-4 sm:grid-cols-2"><label className="mt-4 block">Your role<input required maxLength={60} placeholder="For example, mother-in-law" className={field} value={selfRole} onChange={e => setSelfRole(e.target.value)} /></label><label className="mt-4 block">Other person’s role<input required maxLength={60} placeholder="For example, daughter-in-law" className={field} value={otherRole} onChange={e => setOtherRole(e.target.value)} /></label></div>
     <fieldset className="mt-5"><legend className="font-semibold">What matters most? <span className="text-sm font-normal">Optional · choose up to three</span></legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{priorities.map(p => <label key={p} className="flex items-start gap-2 text-sm"><input type="checkbox" checked={selected.includes(p)} disabled={!selected.includes(p) && selected.length >= 3} onChange={e => setSelected(items => e.target.checked ? [...items,p] : items.filter(x => x !== p))} />{p}</label>)}</div></fieldset>
    </>}
    <label className="mt-4 block">Other person’s name in English<input required maxLength={120} className={field} value={name} onChange={e => setName(e.target.value)} /></label>
    <label className="mt-4 block">Other person’s DOB — DD/MM/YYYY{!draft && ' (optional)'}<input required={draft} inputMode="numeric" maxLength={10} placeholder="DD/MM/YYYY" className={field} value={dob} onChange={e => { const digits = e.target.value.replace(/\D/g, '').slice(0,8); setDob([digits.slice(0,2),digits.slice(2,4),digits.slice(4,8)].filter(Boolean).join('/')) }} /></label>
    <label className="mt-5 flex items-start gap-3 text-sm leading-6"><input required type="checkbox" checked={permission} onChange={e => setPermission(e.target.checked)} className="mt-1" />I have permission to use and save the other person’s name and date of birth for this comparison and make it available to the authorised practitioner assigned to my account.</label>
    <button disabled={busy} className="mt-5 rounded-xl bg-[#762b40] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Check Compatibility'}</button>
    {remaining === 0 && <p className="mt-3 text-sm">Your launch allowance is used. You can still reopen a comparison by submitting the same details. Additional packages are coming soon.</p>}
   </form>
   <h3 className="mt-7 font-serif text-2xl">My saved compatibility readings</h3>
   {!history.length && <p className="mt-3">Your saved comparisons will appear here.</p>}
   <div className="mt-3 space-y-3">{history.map(item => <button key={item.id} className="block w-full rounded-xl border border-[#eadfd4] p-4 text-left" onClick={() => openReport(item.preview)}>{item.preview.people[1]?.name} · {item.preview.kind}<span className="mt-1 block text-sm underline">Open saved reading — no credit used</span></button>)}</div>
   {preview && <article ref={report} tabIndex={-1} aria-label="Your compatibility reading" className="mt-7 scroll-mt-24 space-y-5 border-t border-[#eadfd4] pt-6 focus:outline-none" aria-live="polite">
    <p className="text-xs font-semibold uppercase tracking-widest text-[#a57a40]">Saved compatibility reading</p>
    <h3 className="font-serif text-3xl text-[#64263B]">{preview.people.map(p => p.name).join(' & ')}</h3><p className="text-sm">{preview.kind}{'relationship' in preview ? ` · ${preview.relationship}` : ''}</p>
    {'sections' in preview ? <><p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">Draft interpretation — internal staging review</p>{preview.sections.map(s => <section key={s.title} className="rounded-2xl border border-[#eadfd4] bg-[#FFFCF7] p-5"><h4 className="font-serif text-xl text-[#64263B]">{s.title}</h4><p className="mt-3 text-sm leading-7">{s.text}</p></section>)}</> : <><p className="text-sm text-[#766b67]">Legacy preview · limited name-based scope</p>{preview.observations.map(item => <p key={item} className="leading-7">{item}</p>)}</>}
    <p className="text-xs leading-6 text-[#766b67]">{preview.limitation}</p>
    <div className="rounded-2xl border border-[#C5A15A]/50 bg-[#F4EBD9] p-5"><h4 className="font-serif text-xl text-[#64263B]">Explore your connection with a practitioner</h4><p className="mt-3 text-sm leading-7">Personalised guidance on how to communicate, support each other and work through difficulties belongs to a separate consultation. Consultation booking is coming soon.</p></div>
   </article>}
  </>}
 </section>
}
