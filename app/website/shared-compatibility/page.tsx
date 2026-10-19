"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
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
  const subscription = customerClient()?.auth.onAuthStateChange((_event,session)=>{ const next = session?.user.id||""; if (userId === undefined) { userId=next; return } if (next===userId) return; userId=next; revision.current++; setOpened(null); setItems([]); setSignedIn(false); setEmail(""); setTimeout(()=>{if(active)void load()},0) }).data.subscription
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
  if(busy||!invite)return;const current=++revision.current;setBusy(true);setError("")
  try {const accepted=await request("/api/website/shared-compatibility",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:invite,accepted:true})});if(current!==revision.current)return;if(accepted.accepted!==true||typeof accepted.id!=="string")throw Error("Unable to confirm invitation acceptance.");const data=await request("/api/website/shared-compatibility?id="+encodeURIComponent(accepted.id));if(current!==revision.current)return;try{sessionStorage.removeItem(storageKey)}catch{}setInvite("");setOpened(data)}
  catch(problem){if(current===revision.current)setError(problem instanceof Error?problem.message:"Unable to accept invitation.")}finally{setBusy(false)}
 }
 async function open(id:string) {
  if(busy)return;const current=++revision.current;setBusy(true);setOpened(null);setError("")
  try{const data=await request("/api/website/shared-compatibility?id="+encodeURIComponent(id));if(current===revision.current)setOpened(data)}catch(problem){if(current===revision.current)setError(problem instanceof Error?problem.message:"Unable to open insights.")}finally{setBusy(false)}
 }
 async function switchEmail(){
  if(busy)return;setBusy(true);setError("")
  try{const client=customerClient();if(!client)throw Error();const result=await client.auth.signOut({scope:"local"});if(result.error)throw result.error;revision.current++;setOpened(null);setItems([]);setSignedIn(false);router.push(signIn)}catch{setError("Unable to switch email. Please try again.")}finally{setBusy(false)}
 }
 return <main className="mx-auto min-h-screen max-w-3xl bg-[#FAF7F0] px-5 py-8 text-[#64263B] sm:px-8">
  <h1 className="font-serif text-3xl">Shared with me</h1><p className="mt-3 text-sm leading-7 text-[#766B67]">View insights shared by invitation. Opening them uses no compatibility credit.</p>
  {storageWarning&&<p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">{storageWarning}</p>}
  {error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
  {loading?<p role="status" className="mt-5">Checking shared insights…</p>:!signedIn?<section className="mt-6 rounded-2xl border border-[#E6DDD4] bg-white p-6 shadow-sm"><p className="leading-7">Sign in or register using the email address that received the invitation.</p><Link href={signIn} className={button+" mt-4 inline-block"}>Verify email &amp; continue</Link></section>:<>
   <div className="mt-6 flex flex-col items-start gap-2 rounded-2xl border border-[#E6DDD4] bg-white p-4"><p className="min-w-0 break-words text-sm leading-6 [overflow-wrap:anywhere]">Signed in as <strong>{email}</strong></p><button type="button" disabled={busy} onClick={()=>void switchEmail()} className="min-h-11 rounded-lg px-2 text-sm underline underline-offset-4">Use another email</button></div>
   {invite&&<section className="mt-6 rounded-2xl border border-[#E6DDD4] bg-white p-6 shadow-sm"><h2 className="font-serif text-2xl">You have an invitation</h2><p className="mt-3 text-sm leading-7">Accept to view the selected compatibility insights. Access expires seven days after the invitation was created and can be revoked by the sender.</p><button type="button" disabled={busy} onClick={()=>void accept()} className={button+" mt-4"}>{busy?"Please wait…":"Accept invitation"}</button></section>}
   <div className="mt-6 space-y-5">{items.map(item=>{
    const sender=item.senderName?.trim().split(/\s+/)[0]
    const relationship=item.preview.relationship
    const dating=relationship==="Dating / getting to know each other"
    const married=relationship==="Married"
    const en=dating?"Understand each other’s behaviour—how you express feelings, respond, and connect.":married?"Explore how you share responsibilities, support each other, and approach life together.":"Explore a new perspective on this connection."
    const hi=dating?"एक-दूसरे के व्यवहार को समझें—आप भावनाएँ कैसे जताते हैं, प्रतिक्रिया कैसे देते हैं और एक-दूसरे से कैसे जुड़ते हैं।":married?"समझें कि आप ज़िम्मेदारियाँ कैसे बाँटते हैं, एक-दूसरे का साथ कैसे देते हैं और जीवन में साथ कैसे आगे बढ़ते हैं।":"इस रिश्ते को एक नए नज़रिए से समझें।"
    return <section key={item.id} className="rounded-3xl border border-[#E6DDD4] bg-white p-5 shadow-sm sm:p-7">
     <p className="text-xs font-semibold uppercase tracking-widest text-[#987943]">{relationship||item.preview.kind}</p>
     <h2 className="mt-4 break-words font-serif text-2xl leading-snug">{sender?sender+" has explored your connection. Now it’s your turn to understand it better.":"A new perspective on your connection awaits."}</h2>
     {sender&&<p lang="hi" className="mt-3 text-base leading-7 text-[#766B67]">{sender} ने आपके रिश्ते को जानने की पहल की है। अब आपकी बारी है इसे और बेहतर समझने की।</p>}
     <div className="my-6 grid grid-cols-2 gap-4">{item.preview.people.map((person,index)=><div key={index} className="flex min-w-0 flex-col items-center gap-3 text-center"><SharedPersonPhoto id={item.id} person={index} name={person.name} expiresAt={item.expires_at} /><p className="break-words font-serif text-xl">{person.name}</p></div>)}</div>
     <p className="text-base leading-7 text-[#392E30]">{en}</p><p lang="hi" className="mt-3 text-base leading-7 text-[#766B67]">{hi}</p>
     <button type="button" disabled={busy} onClick={()=>void open(item.id)} className="mt-6 min-h-12 w-full rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B] disabled:opacity-50">{busy?"Please wait…":"Open shared insights →"}</button>
     <p className="mt-3 text-center text-xs text-[#766B67]">No compatibility credit used</p>
    </section>
   })}</div>
   {!items.length&&!opened&&<p className="mt-5 text-sm text-[#766B67]">Accepted invitations with current access will appear here.</p>}
   {offset!==null&&<button type="button" disabled={busy} onClick={()=>void load(offset,true)} className={button+" mt-4"}>Load more</button>}
   <button type="button" disabled={busy} onClick={()=>void load()} className="mt-4 min-h-11 px-2 underline">Refresh shared insights</button>
   {opened&&<article ref={report} tabIndex={-1} className="mt-8 scroll-mt-24 focus:outline-none">{opened.preview.version==="JS_COMPATIBILITY_V2_DRAFT_1"&&<p className="mb-5 rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950">STAGING DRAFT — interpretation tables are under review. Not a final customer reading.</p>}<CompatibilityReading reading={opened.preview}/></article>}
  </>}<Link href="/website/compatibility" className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl border border-[#64263B]/25 bg-white px-5 py-3 text-center font-medium">My Connections</Link>
 </main>
}
