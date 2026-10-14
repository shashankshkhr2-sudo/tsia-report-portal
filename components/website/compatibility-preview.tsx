'use client'
import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { customerClient } from '@/lib/jeevansutra/customer-client'
import { launchKinds, type LaunchPreview } from '@/lib/jeevansutra/compatibility-launch'
type Saved = { id: string; preview: LaunchPreview; created_at: string }
const field = 'mt-2 w-full rounded-xl border border-[#eadfd4] bg-white p-3'
export function CompatibilityPreview() {
 const [kind, setKind] = useState<string>(launchKinds[0])
 const [name, setName] = useState(''); const [dob, setDob] = useState('')
 const [permission, setPermission] = useState(false)
 const [history, setHistory] = useState<Saved[]>([]); const [remaining, setRemaining] = useState(3)
 const [signedIn, setSignedIn] = useState(false); const [loading, setLoading] = useState(true)
 const [busy, setBusy] = useState(false); const [error, setError] = useState('')
 const [preview, setPreview] = useState<LaunchPreview | null>(null)
 async function token() { return (await customerClient()?.auth.getSession())?.data.session?.access_token }
 async function load() {
  try {
   const access = await token(); if (!access) { setSignedIn(false); return }
   const response = await fetch('/api/website/compatibility', { headers: { Authorization: `Bearer ${access}` }, cache: 'no-store' })
   const data = await response.json()
   if (!response.ok) { setError(data.error); setSignedIn(false); return }
   setSignedIn(true); setHistory(data.history); setRemaining(data.remaining)
  } catch { setError('Unable to load your previews. Please reload to try again.') }
  finally { setLoading(false) }
 }
 useEffect(() => { void load() }, [])
 async function submit(event: FormEvent) {
  event.preventDefault(); setError(''); setBusy(true)
  try {
   const access = await token(); if (!access) { setSignedIn(false); setError('Please sign in again.'); return }
   const response = await fetch('/api/website/compatibility', { method: 'POST', headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, name, dob, permission }) })
   const data = await response.json()
   if (!response.ok) { setError(data.error || 'Unable to save preview.'); return }
   setPreview(data.preview); setRemaining(data.remaining); await load()
  } catch { setError('Unable to confirm the save. Retry with the same details to check it without using an extra preview.') }
  finally { setBusy(false) }
 }
 return <section className="mt-8 rounded-3xl border border-[#eadfd4] bg-white p-6">
  <h2 className="font-serif text-3xl">Your launch gift</h2>
  <p className="mt-3 leading-7">Explore three complimentary compatibility previews with your verified account. Your details come from your saved profile. Reopening saved previews is free.</p>
  {error && <p role="alert" className="mt-4 text-red-800">{error}</p>}
  {loading ? <p role="status" className="mt-4">Loading your previews…</p> : !signedIn ? <div className="mt-5 flex flex-wrap gap-5"><Link href="/website/welcome" className="underline">Sign in / My Profile</Link><Link href="/website/start" className="underline">Start with Email</Link></div> : <>
   <p role="status" className="mt-4 font-semibold">{remaining} of 3 complimentary previews remaining</p>
   {remaining > 0 && <form onSubmit={submit} className="mt-5">
    <label className="block">Comparison type<select className={field} value={kind} onChange={e => setKind(e.target.value)}>{launchKinds.map(item => <option key={item}>{item}</option>)}</select></label>
    <label className="mt-4 block">Other person’s name in English<input required maxLength={120} className={field} value={name} onChange={e => setName(e.target.value)} /></label>
    <label className="mt-4 block">Other person’s DOB — DD/MM/YYYY (optional)<input inputMode="numeric" maxLength={10} placeholder="DD/MM/YYYY" className={field} value={dob} onChange={e => { const digits = e.target.value.replace(/\D/g, '').slice(0,8); setDob([digits.slice(0,2),digits.slice(2,4),digits.slice(4,8)].filter(Boolean).join('/')) }} /></label>
    <label className="mt-5 flex items-start gap-3"><input required type="checkbox" checked={permission} onChange={e => setPermission(e.target.checked)} className="mt-1" />I have permission to use and save the other person’s name and optional date of birth for this comparison.</label>
    <button disabled={busy} className="mt-5 rounded-xl bg-[#762b40] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Use a complimentary preview'}</button>
   </form>}
   <h3 className="mt-7 font-serif text-2xl">My saved compatibility previews</h3>
   {!history.length && <p className="mt-3">Your saved comparisons will appear here.</p>}
   <div className="mt-3 space-y-3">{history.map(item => <button key={item.id} className="block w-full rounded-xl border border-[#eadfd4] p-4 text-left" onClick={() => setPreview(item.preview)}>{item.preview.people[1].name} · {item.preview.kind}<span className="mt-1 block text-sm underline">Open saved preview — no credit used</span></button>)}</div>
   {preview && <article className="mt-7 space-y-4 border-t border-[#eadfd4] pt-6" aria-live="polite"><h3 className="font-serif text-2xl">{preview.kind}</h3><p className="text-sm text-[#a57a40]">COMPLIMENTARY PREVIEW · SAVED TO YOUR ACCOUNT</p><div className="grid gap-4 sm:grid-cols-2">{preview.people.map((person,i) => <div key={i} className="rounded-xl bg-[#f9f5ef] p-4"><h4 className="font-semibold">{person.name}</h4><p>Chaldean name number: {person.nameNumber}</p><p className="mt-2">Symbolic theme: {person.theme}</p>{'mulank' in person && <p>Mulank: {person.mulank} · Bhagyank: {person.bhagyank}</p>}</div>)}</div>{preview.observations.map(item => <p key={item}>{item}</p>)}<h4 className="font-semibold">A question to discuss</h4><p>{preview.question}</p><h4 className="font-semibold">One practical next step</h4><p>{preview.action}</p><p className="text-sm text-[#766b67]">{preview.limitation}</p><p className="text-sm">Full reports, additional comparisons and practitioner consultations are separate paid services. Checkout is not open yet.</p></article>}
  </>}
 </section>
}
