"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ReceivedInvitations } from "@/components/website/received-invitations"
import { SentInvitations } from "@/components/website/sent-invitations"
import { SharedPersonPhoto } from "@/components/website/shared-person-photo"
import { useRouter } from "next/navigation"
import { customerClient } from "@/lib/jeevansutra/customer-client"
import { CompatibilityReading } from "@/components/website/compatibility-reading"
import type { CustomerReading } from "@/lib/jeevansutra/compatibility-contract"
type Shared = { id: string; senderName?: string|null; expires_at: string; preview: Pick<CustomerReading, "kind" | "people"> & { relationship?: string|null } }
const signIn = "/website/start?next=shared-compatibility"
const storageKey = "js-pending-compatibility-invite"
const button = "min-h-12 rounded-xl border border-[#64263B]/25 px-5 py-3 font-medium text-[#64263B] transition-colors hover:bg-[#F3EBE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B] disabled:opacity-50"
export default function SharedPage() {
 const router = useRouter(); const revision = useRef(0)
 const [view,setView] = useState<"received"|"sent">("received")
 const [inviteId,setInviteId] = useState("")
 const [inboxVersion,setInboxVersion] = useState(0)
 const [consent,setConsent] = useState(false)
 const [notice,setNotice] = useState("")
 const [dob,setDob] = useState("")
 const [invite,setInvite] = useState(""); const [email,setEmail] = useState("")
 const [signedIn,setSignedIn] = useState(false); const [loading,setLoading] = useState(true)
 const [busy,setBusy] = useState(false); const [error,setError] = useState("")
 const [items,setItems] = useState<Shared[]>([]); const [offset,setOffset] = useState<number|null>(null)
 const [opened,setOpened] = useState<{ preview: CustomerReading; expires_at: string }|null>(null)
 const [storageWarning,setStorageWarning] = useState("")
 const report = useRef<HTMLElement>(null)
 async function request(path: string, init: RequestInit = {}) {
  const session = await customerClient()?.auth.getSession(); const token = session?.data.session?.access_token
  if (!token) throw new Error("Sign in using the invited email address.")
  const response = await fetch(path,{...init,headers:{...init.headers,Authorization:"Bearer "+token},cache:"no-store",signal:AbortSignal.timeout(30000)})
  const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load shared insights."); return data
 }
 async function load(position = 0, append = false) {
  const current = ++revision.current; setOpened(null); setError(""); setLoading(true)
  try {
   const session = await customerClient()?.auth.getSession(); if (current !== revision.current) return
   if (!session?.data.session) { setSignedIn(false); setEmail(""); setItems([]); return }
   const [profileResult,listResult] = await Promise.allSettled([request("/api/website/profile"),request("/api/website/shared-compatibility?offset="+position)]); if (current !== revision.current) return; if(profileResult.status!=="fulfilled")throw profileResult.reason; const profile=profileResult.value
   if (profile.needsProfile) { router.replace(signIn); return }
   setSignedIn(true); setEmail(profile.email || "")
   if(listResult.status!=="fulfilled")throw listResult.reason; const data=listResult.value
   if (current !== revision.current) return
   setItems(previous => append ? Array.from(new Map([...previous,...data.history].map((item: Shared)=>[item.id,item])).values()) : data.history); setOffset(data.nextOffset)
  } catch (problem) { if (current === revision.current) setError(problem instanceof Error ? problem.message : "Unable to load shared insights.") }
  finally { if (current === revision.current) setLoading(false) }
 }
 useEffect(()=>{
  const token = new URLSearchParams(window.location.hash.slice(1)).get("invite")
  if (token !== null) {
   const valid = /^[a-f0-9]{64}$/.test(token); setInvite(valid ? token : "")
   try { sessionStorage.removeItem(storageKey); if (valid) sessionStorage.setItem(storageKey,token); window.history.replaceState(null,"",window.location.pathname+window.location.search) } catch { setStorageWarning("Your browser cannot remember this invitation. After signing in, reopen the original invitation link in the same browser.") }
   if (!valid) setStorageWarning("This invitation link is incomplete. Reopen the full link shared by the sender.")
  } else { try { const stored=sessionStorage.getItem(storageKey)||""; if (/^[a-f0-9]{64}$/.test(stored)) setInvite(stored) } catch {} }
  let active = true; let userId: string|undefined
  const subscription = customerClient()?.auth.onAuthStateChange((_event,session)=>{ const next = session?.user.id||""; if (userId === undefined) { userId=next; return } if (next===userId) return; userId=next; revision.current++; setOpened(null); setItems([]); setInviteId(""); setDob(""); setConsent(false); setSignedIn(false); setEmail(""); setTimeout(()=>{if(active)void load()},0) }).data.subscription
  const refresh=()=>{if(active)void load()}; window.addEventListener("focus",refresh); void load()
  return ()=>{active=false;revision.current++;subscription?.unsubscribe();window.removeEventListener("focus",refresh)}
 },[])
 useEffect(()=>{
  if (!opened) return; const delay=Date.parse(opened.expires_at)-Date.now()
  if (!(delay>0)) {setOpened(null);setError("Access to these insights has expired.");return}
  report.current?.focus({preventScroll:true});report.current?.scrollIntoView({block:"start",behavior:"auto"})
  const timer=setTimeout(()=>{setOpened(null);setError("Access to these insights has expired.")},Math.min(delay,2147483647));return()=>clearTimeout(timer)
 },[opened])
 async function accept() {
  if(busy||(!invite&&!inviteId))return;if(!consent){setError("Confirm that you want to view these shared insights.");return}setNotice("");if(!/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(dob)){setError("Enter your date of birth as DD/MM/YYYY.");return}const [day,month,year]=dob.split("/");const fullDob=year+"-"+month+"-"+day;const parsed=new Date(fullDob+"T00:00:00Z");if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==fullDob||fullDob>new Date().toISOString().slice(0,10)){setError("Enter a valid date of birth.");return}const current=++revision.current;setBusy(true);setError("")
  try {const accepted=await request("/api/website/shared-compatibility",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...(inviteId?{id:inviteId}:{token:invite}),accepted:true,consent:true,dob:fullDob})});if(current!==revision.current)return;if(accepted.accepted!==true||typeof accepted.id!=="string")throw Error("Unable to confirm invitation acceptance.");const data=await request("/api/website/shared-compatibility?id="+encodeURIComponent(accepted.id));if(current!==revision.current)return;try{sessionStorage.removeItem(storageKey)}catch{}setInvite("");setInviteId("");setDob("");setConsent(false);setInboxVersion(value=>value+1);setNotice("Verification successful. Invitation accepted.");setOpened(data)}
  catch(problem){if(current===revision.current)setError(problem instanceof Error?problem.message:"Unable to accept invitation.")}finally{setBusy(false)}
 }
 async function open(id:string) {
  if(busy)return;const current=++revision.current;setBusy(true);setOpened(null);setError("")
  try{const data=await request("/api/website/shared-compatibility?id="+encodeURIComponent(id));if(current===revision.current)setOpened(data)}catch(problem){if(current===revision.current)setError(problem instanceof Error?problem.message:"Unable to open insights.")}finally{setBusy(false)}
 }
 async function decline(){
  if(busy||(!invite&&!inviteId)||!window.confirm("Decline this invitation? No explanation is required, and the sender will see that it was declined."))return
  const current=++revision.current;setBusy(true);setError("");setNotice("")
  try{const result=await request("/api/website/shared-compatibility",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...(inviteId?{id:inviteId}:{token:invite}),action:"decline",confirmed:true})});if(current!==revision.current)return;if(result.declined!==true)throw Error("Unable to confirm the invitation was declined.");try{sessionStorage.removeItem(storageKey)}catch{}setInvite("");setInviteId("");setDob("");setConsent(false);setInboxVersion(value=>value+1);setNotice("Invitation declined. No insights were opened.")}catch(problem){if(current===revision.current)setError(problem instanceof Error?problem.message:"Unable to decline this invitation.")}finally{setBusy(false)}
 }
 async function switchEmail(){
  if(busy)return;setBusy(true);setError("")
  try{const client=customerClient();if(!client)throw Error();const result=await client.auth.signOut({scope:"local"});if(result.error)throw result.error;revision.current++;setOpened(null);setItems([]);setSignedIn(false);router.push(signIn)}catch{setError("Unable to switch email. Please try again.")}finally{setBusy(false)}
 }
 return <main className="mx-auto min-h-screen max-w-3xl bg-[#FAF7F0] px-5 py-8 text-[#64263B] sm:px-8">
  <h1 className="font-serif text-3xl">Your Invitations</h1><p className="mt-3 text-sm leading-7 text-[#766B67]">Manage invitations you receive and send. Opening shared insights uses no compatibility credit.</p>
  {notice&&<p role="status" className="mt-4 rounded-xl border border-[#C5A15A]/35 bg-[#EAD8AD]/25 p-4 text-sm">{notice}</p>}
  {storageWarning&&<p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">{storageWarning}</p>}
  {error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
  {loading?<p role="status" className="mt-5">Checking shared insights…</p>:!signedIn?<section className="mt-6 rounded-2xl border border-[#C5A15A]/35 bg-[#FAF7F0] p-6"><p className="leading-7">Sign in or register using the email address that received the invitation.</p><Link href={signIn} className={button+" mt-4 inline-block"}>Verify email &amp; continue</Link></section>:<>
  <div aria-label="Invitation views" className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-[#64263B]">{(["received","sent"] as const).map(value=><button key={value} type="button" aria-pressed={view===value} disabled={busy} onClick={()=>{setView(value);setOpened(null);setError("")}} className={"min-h-12 px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C5A15A] disabled:opacity-50 "+(view===value?"bg-[#64263B] text-[#FAF7F0]":"bg-[#FFFDFA] text-[#64263B]")}>{value==="received"?"Received":"Sent"}</button>)}</div>
  {view==="sent"&&<SentInvitations />}
  <div hidden={view!=="received"}>
  {(invite||inviteId)&&<section id="invitation-review" tabIndex={-1} className="mt-6 rounded-2xl border border-[#C5A15A]/35 bg-[#FAF7F0] p-6"><div className="mb-3 flex justify-end"><button type="button" disabled={busy} onClick={()=>{setInvite("");setInviteId("");setDob("");setConsent(false);setError("");setNotice("");try{sessionStorage.removeItem(storageKey)}catch{}}} className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50" aria-label="Close invitation review">Close ×</button></div><h2 className="font-serif text-2xl">You have an invitation</h2><p className="mt-3 text-sm leading-7">Verify your email and enter your own date of birth to open the shared insights. Your date must match the person in this comparison.</p><p className="mt-2 text-xs leading-6 text-[#766B67]">Access expires seven days after the invitation was created and can be stopped by the sender.</p><form onSubmit={event=>{event.preventDefault();void accept()}} className="mt-4"><label className="block text-sm font-semibold">Your date of birth (DD/MM/YYYY)<input type="text" inputMode="numeric" placeholder="DD/MM/YYYY" maxLength={10} pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" required value={dob} disabled={busy} onChange={event=>{const digits=event.target.value.replace(/\D/g,"").slice(0,8);setDob(digits.slice(0,2)+(digits.length>2?"/"+digits.slice(2,4):"")+(digits.length>4?"/"+digits.slice(4):""))}} className="mt-2 min-h-12 w-full rounded-xl border border-[#DCCFC3] bg-white p-3 text-base text-[#64263B] focus-visible:outline-2 focus-visible:outline-[#64263B]" /></label><p className="mt-2 text-xs leading-5 text-[#766B67]">For your privacy, the expected date is never displayed. Attempts are limited.</p><label className="mt-4 flex items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={consent} disabled={busy} onChange={event=>setConsent(event.target.checked)} className="mt-1 size-5 shrink-0 accent-[#64263B]" /><span>I choose to view these shared compatibility insights. Accepting does not indicate romantic interest or agreement with the insights.</span></label>{error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</p>}{busy&&<p role="status" className="mt-3 text-sm leading-6">Checking your invitation. Please wait…</p>}<button type="submit" disabled={busy||dob.length!==10||!consent} className="mt-4 min-h-12 w-full rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#FAF7F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B] disabled:opacity-50">{busy?"Verifying…":"Verify & accept invitation"}</button></form><button type="button" disabled={busy} onClick={()=>void decline()} className="mt-3 min-h-11 w-full rounded-xl border border-[#64263B]/25 px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">Decline invitation</button><p className="mt-2 text-center text-xs text-[#766B67]">No explanation required.</p></section>}
   <ReceivedInvitations key={email} busy={busy} refreshKey={inboxVersion} onOpen={open} onReview={id=>{setInviteId(id);setDob("");setConsent(false);setOpened(null);setError("");setNotice("");setTimeout(()=>{const panel=document.getElementById("invitation-review");panel?.focus({preventScroll:true});panel?.scrollIntoView({block:"start",behavior:"smooth"})},0)}} />
   {opened&&<article ref={report} tabIndex={-1} className="mt-8 scroll-mt-24 focus:outline-none">{opened.preview.version==="JS_COMPATIBILITY_V2_DRAFT_1"&&<p className="mb-5 rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950">STAGING DRAFT — interpretation tables are under review. Not a final customer reading.</p>}{notice&&<p role="status" className="mb-5 rounded-xl border border-[#C5A15A]/35 bg-[#EAD8AD]/25 p-4 text-sm leading-6">{notice}</p>}<CompatibilityReading reading={opened.preview} sharedSurface/><section className="mt-8 rounded-3xl border border-[#C5A15A]/30 bg-[#F5EFE3] px-5 py-7 text-center sm:p-8"><h2 className="font-serif text-2xl font-medium leading-relaxed">Your story has more to discover</h2><p lang="hi" className="mt-3 font-serif text-2xl font-medium leading-relaxed">अब खुद को और करीब से जानें।</p><p className="mt-5 text-base leading-7 text-[#392E30]">Explore your personal insights and the connections that matter to you.</p><p lang="hi" className="mt-3 text-base leading-7 text-[#392E30]">खुद को जानें और अपने खास रिश्तों को एक नए नज़रिए से देखें।</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/website/welcome" className="flex min-h-12 items-center justify-center rounded-xl bg-[#64263B] px-5 py-3 text-center font-semibold text-[#FAF7F0] transition-colors hover:bg-[#522031] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B]">Discover my insights →</Link><Link href="/website/compatibility" className="flex min-h-12 items-center justify-center rounded-xl bg-[#64263B] px-5 py-3 text-center font-semibold text-[#FAF7F0] transition-colors hover:bg-[#522031] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B]">Explore my connections →</Link></div></section><button type="button" onClick={()=>{setOpened(null);window.scrollTo({top:0,behavior:"smooth"})}} className="mt-5 min-h-12 px-2 text-sm underline underline-offset-4">← Back to received invitations</button></article>}
  </div></>}<Link href="/website/compatibility" className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl border border-[#64263B]/25 bg-[#FAF7F0] px-5 py-3 text-center font-medium">My Connections</Link>
 </main>
}
