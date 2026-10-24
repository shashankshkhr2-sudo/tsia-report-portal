'use client'
import { SavedConnections } from "./saved-connections"
import { loadCustomerPhoto } from "./customer-photo-loader"
import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CompatibilityReading } from './compatibility-reading'
import { compatibilitySignInPath } from '@/lib/jeevansutra/customer-destination'
import { LaunchGift } from './launch-gift'
import { customerClient } from '@/lib/jeevansutra/customer-client'
import { compatibilityKinds, relationships, priorities, type CompatibilityKind, type CustomerReading } from '@/lib/jeevansutra/compatibility-contract'
const legacyKinds = ['Personal Relationship Compatibility', 'Business Partnership Compatibility', 'Professional Compatibility', 'Interaction Guidance', "Family Compatibility"]
type Saved = { id: string; preview: Pick<CustomerReading, "kind" | "people">; created_at: string }
const field = 'mt-2 min-h-12 w-full rounded-xl border border-[#ded4cb] bg-[#FFFDFA] p-3 text-base text-[#392e30] focus:outline-2 focus:outline-offset-2 focus:outline-[#C5A15A]'
export function CompatibilityPreview() {
 const router = useRouter()
 const savedOpenRevision = useRef(0)
 const [connectionsView, setConnectionsView] = useState("saved")
 const [giftIdentity, setGiftIdentity] = useState({ name: "", dob: "", photo: "" })
 useEffect(() => {
  const client = customerClient(); if (!client) return
  let active = true, revision = 0, objectUrl = ""
  async function refresh() {
   const current = ++revision
   try {
    const session = await client!.auth.getSession(); const access = session.data.session?.access_token
    if (!active || current !== revision) return
    setGiftIdentity({ name: "", dob: "", photo: "" }); if (objectUrl) URL.revokeObjectURL(objectUrl); objectUrl = ""
    if (!access) return
    const headers = { Authorization: "Bearer " + access }
    await Promise.allSettled([
     (async () => { const response = await fetch("/api/website/profile", { headers, cache: "no-store" }); if (!response.ok) return; const data = await response.json(); if (!active || current !== revision) return; const name = typeof data.profile?.name === "string" ? data.profile.name.trim() : ""; const raw = typeof data.profile?.dob === "string" ? data.profile.dob : ""; const dob = /^\d{4}-\d{2}-\d{2}/.test(raw) ? raw.slice(0,10).split("-").reverse().join("/") : raw; setGiftIdentity(value => ({ ...value, name, dob })) })(),
     (async () => { const response = await loadCustomerPhoto(access); if (!response.ok) return; const blob = await response.blob(); if (!active || current !== revision) return; objectUrl = URL.createObjectURL(blob); setGiftIdentity(value => ({ ...value, photo: objectUrl })) })()
    ])
   } catch {}
  }
  const refreshPhoto = () => { void refresh() }
  let identityUser: string | undefined
  const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => { const user = session?.user.id || ""; if (user === identityUser) return; identityUser = user; revision++; setGiftIdentity({ name: "", dob: "", photo: "" }); setTimeout(() => { if (active) void refresh() }, 0) })
  window.addEventListener("jeevansutra-photo-updated", refreshPhoto); void refresh()
  return () => { active = false; revision++; subscription.unsubscribe(); window.removeEventListener("jeevansutra-photo-updated", refreshPhoto); if (objectUrl) URL.revokeObjectURL(objectUrl) }
 }, [])
 const [draft, setDraft] = useState(false)
 const [kind, setKind] = useState(legacyKinds[0]); const [relationship, setRelationship] = useState("")
 const [selfRole, setSelfRole] = useState(''); const [otherRole, setOtherRole] = useState('')
 const [selected, setSelected] = useState<string[]>([])
 const [name, setName] = useState(''); const [dob, setDob] = useState(''); const [permission, setPermission] = useState(false)
 const [history, setHistory] = useState<Saved[]>([]); const [remaining, setRemaining] = useState(3)
 const [signedIn, setSignedIn] = useState(false); const [loading, setLoading] = useState(true)
 const [busy, setBusy] = useState(false); const [error, setError] = useState('')
 const report = useRef<HTMLElement>(null); const [reportOpenCount, setReportOpenCount] = useState(0)
 const [preview, setPreview] = useState<CustomerReading | null>(null)
 const [reportNotice, setReportNotice] = useState('')
 function openReport(value: CustomerReading, saved = true) { setReportNotice(saved ? 'You’ve already checked this compatibility. Your saved compatibility insights are below. No additional test was used.' : 'Your compatibility insights have been saved. You can reopen it anytime without using another test.'); setPreview(value); setReportOpenCount(count => count + 1) }
 useEffect(() => { if (reportOpenCount) { report.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); report.current?.focus({ preventScroll: true }) } }, [reportOpenCount])
 async function openSaved(id: string) {
  const revision = ++savedOpenRevision.current; setError(""); setPreview(null)
  try {
   const access = await token(); if (!access) { router.replace(compatibilitySignInPath); return }
   const response = await fetch("/api/website/compatibility?id=" + encodeURIComponent(id), { headers: { Authorization: "Bearer " + access }, cache: "no-store" })
   const data = await response.json()
   if (revision !== savedOpenRevision.current) return
   if (!response.ok) { if (response.status === 401) router.replace(compatibilitySignInPath); setError(data.error || "Unable to open saved insights."); return }
   openReport(data.preview)
  } catch { if (revision === savedOpenRevision.current) setError("Unable to open saved insights. Please try again.") }
 }
 async function removeSaved(id: string) {
  if (!window.confirm("Remove these saved insights from your list? This will not restore a used test.")) return
  savedOpenRevision.current++; setError("")
  try {
   const access = await token(); if (!access) { router.replace(compatibilitySignInPath); return }
   const response = await fetch("/api/website/compatibility?id=" + encodeURIComponent(id), { method: "DELETE", headers: { Authorization: "Bearer " + access } })
   const data = await response.json()
   if (!response.ok) { setError(data.error || "Unable to remove saved insights."); return }
   setHistory(items => items.filter(item => item.id !== id)); setPreview(null)
  } catch { setError("Unable to confirm removal. Please reload and check your saved insights.") }
 }
 async function token() { return (await customerClient()?.auth.getSession())?.data.session?.access_token }
 async function load() {
  try {
   const access = await token(); if (!access) { setSignedIn(false); router.replace(compatibilitySignInPath); return }
   const collected: Saved[] = []; let offset: number | null = 0
   let data: { history: Saved[]; remaining: number; draftEnabled: boolean; nextOffset: number | null; error?: string }
   do {
    const response = await fetch("/api/website/compatibility?summary=1&offset=" + offset, { headers: { Authorization: "Bearer " + access }, cache: "no-store" })
    data = await response.json()
    if (!response.ok) { if (response.status === 401) { setSignedIn(false); router.replace(compatibilitySignInPath); return } setError(data.error || "Unable to load connections."); return }
    collected.push(...data.history); offset = data.nextOffset
   } while (offset !== null)
   setSignedIn(true); setHistory(Array.from(new Map(collected.map(item => [item.id, item])).values())); setRemaining(data.remaining)
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
   openReport(data.preview, data.reused === true); setRemaining(data.remaining); await load()
  } catch { setError('Unable to confirm the save. Retry with the same details to check without using an extra preview.') }
  finally { setBusy(false) }
 }
 if (loading || !signedIn) return <section className="mt-8 rounded-3xl border border-[#eadfd4] bg-white p-6">
  {error ? <><p role="alert" className="text-red-800">{error}</p><button type="button" className="mt-4 underline" onClick={() => { setError(''); setLoading(true); void load() }}>Try again</button></> : <p role="status">Checking your account and opening compatibility…</p>}
 </section>
 return <section className="mt-8 rounded-3xl border border-[#eadfd4] bg-white p-5 sm:p-7">
  <LaunchGift compact showLink={false} customerName={giftIdentity.name} customerDob={giftIdentity.dob} photoUrl={giftIdentity.photo} remaining={remaining} />
  <section aria-labelledby="connections-title" className="mt-6 text-[#64263B]"><h2 id="connections-title" className="font-serif text-3xl">My Connections</h2><Link href="/website/shared-compatibility" className="mt-3 inline-block min-h-11 py-2 text-sm font-semibold underline">Invitations</Link><p className="mt-2 text-sm leading-6 text-[#766B67]">Understand your connections. Revisit anytime.</p><div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-[#64263B]">{[["saved", "Saved insights (" + history.length + ")"],["new", "New comparison"]].map(([value,label]) => <button key={value} type="button" aria-pressed={connectionsView === value} onClick={() => { savedOpenRevision.current++; setConnectionsView(value); setPreview(null) }} className={"min-h-12 px-2 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C5A15A] " + (connectionsView === value ? "bg-[#64263B] text-white" : "bg-[#FFFDFA] text-[#64263B]")}>{label}</button>)}</div><div hidden={connectionsView !== "saved"}><SavedConnections history={history} onOpen={openSaved} onDelete={removeSaved} /></div></section>
  {draft && <p role="status" className="mt-5 rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950">STAGING DRAFT — interpretation tables are under review. Not a final customer reading. Draft saves use this staging account’s existing launch allowance. Reopening preserves the original roles and priorities.</p>}
  <p hidden={connectionsView !== "new"} className="mt-5 text-sm leading-7 text-[#766b67]">Your details come from your saved profile. Add someone you would like to understand better.</p>
  {error && <p role="alert" className="mt-4 text-red-800">{error}</p>}
  {loading ? <p role="status" className="mt-4">Loading your previews…</p> : !signedIn ? <div className="mt-5 flex flex-wrap gap-5"><Link href="/website/welcome" className="underline">My Profile</Link><Link href="/website/start" className="underline">Start with Email / Sign in</Link></div> : <>
   <form hidden={connectionsView !== "new"} onSubmit={submit} className="mt-5">
    <label className="block">Relationship category<select className={field} value={kind} onChange={e => { setKind(e.target.value); if (draft) setRelationship("") }}>{(draft ? compatibilityKinds : legacyKinds).map(item => <option key={item}>{item}</option>)}</select></label>
    {draft && <>
     <label className="mt-4 block">{kind === "Love & Marriage" ? "Which best describes your connection?" : "Relationship"}<select required className={field} value={relationship} onChange={e => setRelationship(e.target.value)}><option value="" disabled>Select your connection</option>{(relationships[kind as CompatibilityKind] || []).map(item => <option key={item}>{item}</option>)}</select></label>
     <div className="grid gap-4 sm:grid-cols-2"><label className="mt-4 block">Your role<input required maxLength={60} placeholder="For example, mother-in-law" className={field} value={selfRole} onChange={e => setSelfRole(e.target.value)} /></label><label className="mt-4 block">Other person’s role<input required maxLength={60} placeholder="For example, daughter-in-law" className={field} value={otherRole} onChange={e => setOtherRole(e.target.value)} /></label></div>
     <fieldset className="mt-5"><legend className="font-semibold">What matters most? <span className="text-sm font-normal">Optional · choose up to three</span></legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{priorities.map(p => <label key={p} className="flex items-start gap-2 text-sm"><input type="checkbox" checked={selected.includes(p)} disabled={!selected.includes(p) && selected.length >= 3} onChange={e => setSelected(items => e.target.checked ? [...items,p] : items.filter(x => x !== p))} />{p}</label>)}</div></fieldset>
    </>}
    <label className="mt-4 block">Other person’s name in English<input required maxLength={120} className={field} value={name} onChange={e => setName(e.target.value)} /></label>
    <label className="mt-4 block">Other person’s DOB — DD/MM/YYYY{!draft && ' (optional)'}<input required={draft} inputMode="numeric" maxLength={10} placeholder="DD/MM/YYYY" className={field} value={dob} onChange={e => { const digits = e.target.value.replace(/\D/g, '').slice(0,8); setDob([digits.slice(0,2),digits.slice(2,4),digits.slice(4,8)].filter(Boolean).join('/')) }} /></label>
    <label className="mt-5 flex items-start gap-3 text-sm leading-6"><input required type="checkbox" checked={permission} onChange={e => setPermission(e.target.checked)} className="mt-1" />I have permission to use and save the other person’s name and date of birth for this comparison and make it available to the authorised practitioner assigned to my account.</label>
    <button disabled={busy} className="mt-5 rounded-xl bg-[#762b40] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Check Compatibility'}</button>
    {remaining === 0 && <p className="mt-3 text-sm">Your launch allowance is used. You can still reopen a comparison by submitting the same details. Additional packages are coming soon.</p>}
   </form>
   {preview && <article ref={report} tabIndex={-1} aria-label="Your compatibility reading" className="mt-7 scroll-mt-24 space-y-5 border-t border-[#eadfd4] pt-6 focus:outline-none" aria-live="polite">
    <div role="status" className="rounded-2xl border border-[#C5A15A]/50 bg-[#F4EBD9] p-4 text-sm leading-7 text-[#64263B]">{reportNotice}</div>
    <CompatibilityReading reading={preview} />
    <section aria-label="Personal guidance with a Jeevan Sutra practitioner" className="overflow-hidden rounded-3xl border border-[#C5A15A]/50 bg-[#FAF7F0] text-[#463B3B] shadow-[0_12px_36px_rgba(100,38,59,0.08)]">
     <div className="bg-gradient-to-br from-[#762B40] to-[#4D1D30] px-5 py-7 text-center sm:px-8 sm:py-9">
      <div aria-hidden="true" className="mx-auto mb-4 h-px w-12 bg-[#C5A15A]" />
      <h4 className="font-serif text-[1.65rem] leading-tight text-[#FFF8E9] sm:text-3xl">Jeevan Sutra Will Guide You</h4>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#EAD8AD]">Understand your connection.<br />Make thoughtful choices. Grow together.</p>
     </div>
     <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
      {[
       ['Love & Marriage', 'Before you give your heart, take time to understand your connection. Explore your expectations, emotional needs and hopes for a life together.'],
       ['Business & Work', 'Choose your partners thoughtfully. Understand how you can share responsibilities, make decisions and support each other’s ambitions.'],
       ['Family', 'Care for your family bonds while making space for your own needs. Explore expectations, differences and boundaries with respect.'],
       ['Friendship', 'Understand the bond you share. Explore how you support each other and where your expectations may differ.'],
      ].map(([title, text], i) => <div key={title} className="min-w-0 overflow-hidden rounded-2xl border border-[#C5A15A]/35 bg-[#FFFDFA] shadow-[0_3px_12px_rgba(100,38,59,0.04)]">
       <div aria-hidden="true" className="pointer-events-none relative mx-auto w-full max-w-xs overflow-hidden bg-[#FAF7F0]" style={{ aspectRatio: '1.95 / 1' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/website/illustrations/connection-collection.webp" alt="" width={1536} height={1024} loading="lazy" decoding="async" className="absolute top-0 block h-auto max-w-none" style={{ width: '200%', left: i % 2 ? '-100%' : 0, transform: i >= 2 ? 'translateY(-50%)' : undefined }} />
       </div>
       <div className="p-5"><h5 className="font-serif text-[1.4rem] leading-snug text-[#64263B]">{title}</h5><div aria-hidden="true" className="mb-3 mt-3 h-px w-9 bg-[#C5A15A]/70" /><p className="text-sm leading-7">{text}</p></div>
      </div>)}
     </div>
     <div className="mx-4 mb-5 rounded-2xl border border-[#C5A15A]/40 bg-gradient-to-br from-[#FFF9EC] to-[#F3E4C9] p-5 sm:mx-6 sm:mb-6 sm:p-6">
      <h5 className="font-serif text-xl leading-snug text-[#64263B]">Your story deserves a personal conversation.</h5>
      <p className="mt-3 text-sm leading-7">A Jeevan Sutra practitioner will listen to your concerns, explore your reading with you and offer personalised guidance on communicating, supporting each other and working through differences.</p>
      <p className="mt-5 border-t border-[#C5A15A]/35 pt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#64263B]">Personal consultations — coming soon.</p>
     </div>
    </section>
   </article>}
  </>}
 </section>
}
