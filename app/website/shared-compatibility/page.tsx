"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { customerClient } from "@/lib/jeevansutra/customer-client"
import { CompatibilityReading } from "@/components/website/compatibility-reading"
import type { CustomerReading } from "@/lib/jeevansutra/compatibility-contract"
type Shared = { id: string; expires_at: string; preview: Pick<CustomerReading, "kind" | "people"> }
const signIn = "/website/start?next=shared-compatibility"
const storageKey = "js-pending-compatibility-invite"
const button = "min-h-12 rounded-xl border border-[#64263B] px-4 py-3 text-[#64263B] disabled:opacity-50"
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
   const profile = await request("/api/website/profile"); if (current !== revision.current) return
   if (profile.needsProfile) { router.replace(signIn); return }
   setSignedIn(true); setEmail(profile.email || "")
   const data = await request("/api/website/shared-compatibility?offset="+position); if (current !== revision.current) return
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
 return <main className="mx-auto max-w-3xl px-5 py-8 text-[#64263B]">
  <h1 className="font-serif text-3xl">Shared with me</h1><p className="mt-3 text-sm leading-7 text-[#766B67]">View insights shared by invitation. Opening them uses no compatibility credit.</p>
  {storageWarning&&<p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">{storageWarning}</p>}
  {error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
  {loading?<p role="status" className="mt-5">Checking shared insights…</p>:!signedIn?<section className="mt-5 rounded-2xl border border-[#D7B77A] bg-[#FAF7F0] p-5"><p className="leading-7">Sign in or register using the email address that received the invitation.</p><Link href={signIn} className={button+" mt-4 inline-block"}>Verify email &amp; continue</Link></section>:<>
   <div className="mt-5 flex flex-wrap items-center gap-3"><p className="break-all text-sm">Signed in as <strong>{email}</strong></p><button type="button" disabled={busy} onClick={()=>void switchEmail()} className="min-h-11 px-2 underline">Use another email</button></div>
   {invite&&<section className="mt-5 rounded-2xl border border-[#D7B77A] bg-[#FAF7F0] p-5"><h2 className="font-serif text-2xl">You have an invitation</h2><p className="mt-3 text-sm leading-7">Accept to view the selected compatibility insights. Access expires seven days after the invitation was created and can be revoked by the sender.</p><button type="button" disabled={busy} onClick={()=>void accept()} className={button+" mt-4"}>{busy?"Please wait…":"Accept invitation"}</button></section>}
   <div className="mt-6 space-y-3">{items.map(item=><button key={item.id} type="button" disabled={busy} onClick={()=>void open(item.id)} className={button+" block w-full bg-[#FFFDFA] text-left"}><span className="block break-words font-serif text-xl">{item.preview.people.map(person=>person.name).join(" & ")}</span><span className="mt-2 block text-sm">{item.preview.kind}</span></button>)}</div>
   {!items.length&&!opened&&<p className="mt-5 text-sm text-[#766B67]">Accepted invitations with current access will appear here.</p>}
   {offset!==null&&<button type="button" disabled={busy} onClick={()=>void load(offset,true)} className={button+" mt-4"}>Load more</button>}
   <button type="button" disabled={busy} onClick={()=>void load()} className="mt-4 min-h-11 px-2 underline">Refresh shared insights</button>
   {opened&&<article ref={report} tabIndex={-1} className="mt-8 scroll-mt-24 focus:outline-none">{opened.preview.version==="JS_COMPATIBILITY_V2_DRAFT_1"&&<p className="mb-5 rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950">STAGING DRAFT — interpretation tables are under review. Not a final customer reading.</p>}<CompatibilityReading reading={opened.preview}/></article>}
  </>}<Link href="/website/compatibility" className="mt-6 inline-block min-h-11 py-2 underline">My Connections</Link>
 </main>
}
