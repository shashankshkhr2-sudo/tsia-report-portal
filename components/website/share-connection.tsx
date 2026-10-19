"use client"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { ShareInvitationActions } from "./share-invitation-actions"
import { customerClient } from "@/lib/jeevansutra/customer-client"
type Invitation = { id:string; created_at:string; recipient_email:string; expires_at:string; revoked_at:string|null; declined_at:string|null; accepted_at:string|null; email_sent_at:string|null; ready_at:string|null; delivery_channel:"email"|"manual" }
export function ShareConnection({id,name}:{id:string;name:string}) {
 const [expanded,setExpanded]=useState(false);const [email,setEmail]=useState("");const [confirmed,setConfirmed]=useState(false)
 const [invitations,setInvitations]=useState<Invitation[]>([]);const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [notice,setNotice]=useState("")
 const [delivery,setDelivery]=useState<"email"|"manual">("email");const [generated,setGenerated]=useState<{id:string;link:string;text:string;recipient_email:string;expires_at:string}|null>(null)
 const revision=useRef(0);const locked=useRef(false)
 async function request(path:string,init:RequestInit={}){
  const token=(await customerClient()?.auth.getSession())?.data.session?.access_token
  if(!token)throw Error("Please sign in again.")
  const response=await fetch(path,{...init,headers:{...init.headers,Authorization:"Bearer "+token},cache:"no-store",signal:AbortSignal.timeout(45000)})
  const data=await response.json();if(!response.ok)throw Error(data.error||"Unable to update invitations.");return data
 }
 async function refresh(){
  const current=revision.current;const collected:Invitation[]=[];let offset:number|null=0
  do { const page=await request("/api/website/compatibility-shares?id="+encodeURIComponent(id)+"&offset="+offset);if(current!==revision.current)return;collected.push(...page.invitations);const next=page.nextOffset??null;if(next!==null&&(!Number.isSafeInteger(next)||next<=offset))throw Error("Unable to load sharing history.");offset=next } while(offset!==null)
  if(current===revision.current){const rows=Array.from(new Map(collected.map(item=>[item.id,item])).values());setInvitations(rows);setGenerated(previous=>previous&&rows.some(item=>item.id===previous.id&&!item.revoked_at&&Date.parse(item.expires_at)>Date.now())?previous:null)}
 }
 useEffect(()=>{
  let userId:string|undefined
  const subscription=customerClient()?.auth.onAuthStateChange((_event,session)=>{const next=session?.user.id||"";if(userId===undefined){userId=next;return}if(next===userId)return;userId=next;revision.current++;setExpanded(false);setInvitations([]);setGenerated(null);setEmail("");setConfirmed(false);setNotice("");setError("")}).data.subscription
  return()=>{revision.current++;subscription?.unsubscribe()}
 },[])
 async function toggle(){
  if(locked.current)return
  if(expanded){setExpanded(false);return}setExpanded(true);setError("");locked.current=true;setBusy(true)
  const current=revision.current
  try{await refresh()}catch(problem){if(current===revision.current)setError(problem instanceof Error?problem.message:"Unable to load invitations.")}finally{locked.current=false;setBusy(false)}
 }
 async function send(event:FormEvent){
  event.preventDefault();if(locked.current||!confirmed)return
  locked.current=true;setBusy(true);setError("");setNotice("");const current=revision.current
  try{
   const result=await request("/api/website/compatibility-shares",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,email:email.trim().toLowerCase(),confirmed:true,delivery})})
   if(current!==revision.current)return
   if(delivery==="manual"){setGenerated(result);setNotice("Your private invitation is ready. Choose how to share it below.")}else{setGenerated(null);setNotice("Invitation submitted to the email provider. The recipient must verify this email address to accept.")}
   setConfirmed(false);await refresh()
  }catch(problem){if(current===revision.current){setError(problem instanceof Error?problem.message:"Unable to confirm invitation.");try{await refresh()}catch{}}}finally{locked.current=false;setBusy(false)}
 }
 async function revoke(recipient:string){
  if(locked.current||!window.confirm("Stop sharing these insights with "+recipient+"? All their existing invitations for this comparison will be revoked."))return
  locked.current=true;setBusy(true);setError("");setNotice("");const current=revision.current
  try{await request("/api/website/compatibility-shares?id="+encodeURIComponent(id)+"&recipient="+encodeURIComponent(recipient),{method:"DELETE"});if(current!==revision.current)return;setGenerated(previous=>previous?.recipient_email.trim().toLowerCase()===recipient?null:previous);setNotice("Sharing stopped for "+recipient+".");await refresh()}catch(problem){if(current===revision.current){setError(problem instanceof Error?problem.message:"Unable to confirm sharing has stopped. Refresh status to check.");try{await refresh()}catch{}}}finally{locked.current=false;setBusy(false)}
 }
 function active(item:Invitation){return !item.revoked_at&&Date.parse(item.expires_at)>Date.now()}
 function status(item:Invitation){return item.declined_at?"Declined":item.revoked_at?"Sharing stopped":Date.parse(item.expires_at)<=Date.now()?"Expired":!item.ready_at?"Invitation not confirmed":item.accepted_at?"Access accepted":item.delivery_channel==="manual"?"Link ready — awaiting acceptance":"Email submitted — awaiting acceptance"}
 const groups=Array.from(invitations.reduce((map,item)=>{const key=item.recipient_email.trim().toLowerCase();const rows=map.get(key)||[];rows.push(item);map.set(key,rows);return map},new Map<string,Invitation[]>()).entries()).map(([recipient,rows])=>{rows.sort((a,b)=>b.created_at.localeCompare(a.created_at)||b.id.localeCompare(a.id));const accepted=rows.filter(item=>active(item)&&item.ready_at&&item.accepted_at).sort((a,b)=>Date.parse(b.expires_at)-Date.parse(a.expires_at));const current=accepted[0]||rows.find(active)||rows[0];return {recipient,rows,current,hasActive:rows.some(active)}})
 return <section className="mt-2 text-[#64263B]">
  <button type="button" disabled={busy} aria-expanded={expanded} onClick={()=>void toggle()} className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#64263B] px-4 py-3 text-center text-sm font-semibold text-[#FAF7F0] focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">{expanded || invitations.some(item => !item.revoked_at && Date.parse(item.expires_at) > Date.now()) ? "Manage sharing" : "Share with your partner"}</button>
  {expanded&&<div className="mt-2 rounded-2xl border border-[#D7B77A] bg-[#FAF7F0] p-4">
   <h3 className="font-serif text-xl">Share with your partner</h3><p className="mt-2 text-sm leading-6 text-[#766B67]">Only the invited person can open these insights after verifying their email.</p>
   <p className="mt-3 break-words font-semibold">{name}</p><form onSubmit={send} className="mt-4"><fieldset disabled={busy} className="min-w-0">
    <label className="block text-sm font-semibold">Partner’s email<input placeholder="Enter email address" type="email" required maxLength={254} autoComplete="off" value={email} onChange={event=>{setEmail(event.target.value);setGenerated(null);setConfirmed(false);setNotice("")}} className="mt-2 min-h-12 w-full rounded-xl border border-[#DCCFC3] bg-white p-3 text-base"/></label>
    <fieldset className="mt-4"><legend className="text-sm font-semibold">Share using</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{([["email","Email invitation"],["manual","Share a private link"]] as const).map(([value,label])=><label key={value} className={"flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium "+(delivery===value?"border-[#64263B] bg-[#64263B] text-[#FAF7F0]":"border-[#C5A15A]/50 bg-white text-[#64263B]")}><input type="radio" name={"share-method-"+id} value={value} checked={delivery===value} onChange={()=>{setDelivery(value);setNotice("");setGenerated(null)}} className="accent-[#64263B]" />{label}</label>)}</div></fieldset>
    <label className="mt-4 flex items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={confirmed} onChange={event=>setConfirmed(event.target.checked)} className="mt-1"/><span>I confirm this email belongs to the person in this comparison.</span></label>
    <button disabled={busy||!confirmed} className="mt-4 min-h-12 w-full rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#FAF7F0] disabled:opacity-50">{busy?"Please wait…":delivery==="email"?"Send invitation":"Create private invitation"}</button>
   </fieldset></form>
   {error&&<p role="alert" className="mt-4 text-sm leading-6 text-red-800">{error}</p>}{notice&&<p role="status" className="mt-4 text-sm leading-6">{notice}</p>}
   {generated&&<ShareInvitationActions key={generated.id} invite={generated}/>}
   <h4 className="mt-6 border-t border-[#C5A15A]/40 pt-5 font-serif text-xl">Sharing status</h4>
   {!groups.length&&<p className="mt-2 text-sm text-[#766B67]">No invitations yet.</p>}
   <ul className="mt-3 space-y-3">{groups.map(group=><li key={group.recipient} className="rounded-xl border border-[#C5A15A]/40 bg-[#FFFDFA] p-3"><p className="break-words text-sm font-semibold [overflow-wrap:anywhere]">{group.recipient}</p><p className={"mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium "+(active(group.current)&&group.current.ready_at&&group.current.accepted_at?"bg-[#E6EEDC] text-[#35562E]":"bg-[#EAD8AD]/40 text-[#64263B]")}>{status(group.current)}</p>{active(group.current)&&<p className="mt-2 text-xs leading-5 text-[#766B67]">{group.current.ready_at&&group.current.accepted_at?"Access until ":"Invitation expires "}{new Date(group.current.expires_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kolkata"})}</p>}{group.hasActive&&<div className="mt-1 flex justify-end"><button type="button" disabled={busy} onClick={()=>void revoke(group.recipient)} className="min-h-11 rounded-lg px-2 py-2 text-sm font-medium text-[#9B353D] underline focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">Stop sharing</button></div>}{group.rows.length>1&&<details className="mt-3 border-t border-[#C5A15A]/25 pt-2"><summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">Sharing history ({group.rows.length-1})</summary><ul className="space-y-2">{group.rows.filter(item=>item.id!==group.current.id).map(item=><li key={item.id} className="border-t border-[#C5A15A]/20 py-2 text-xs leading-5 text-[#766B67]"><p>{status(item)}</p><p>{item.delivery_channel==="manual"?"Private link":"Email invitation"} · {new Date(item.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kolkata"})}</p></li>)}</ul></details>}</li>)}</ul>
   <p className="mt-4 text-xs leading-5 text-[#766B67]">Invitations expire after 7 days. Previous invitations remain in sharing history.</p>
   <button type="button" disabled={busy} onClick={async()=>{if(locked.current)return;locked.current=true;setBusy(true);setError("");try{await refresh()}catch{setError("Unable to refresh invitations.")}finally{locked.current=false;setBusy(false)}}} className="mt-3 min-h-11 px-2 text-sm underline">Refresh status</button>
  </div>}
 </section>
}
