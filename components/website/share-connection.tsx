"use client"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { ShareInvitationActions } from "./share-invitation-actions"
import { customerClient } from "@/lib/jeevansutra/customer-client"
type Invitation = { id:string; recipient_email:string; expires_at:string; revoked_at:string|null; accepted_at:string|null; email_sent_at:string|null; ready_at:string|null; delivery_channel:"email"|"manual" }
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
  const current=revision.current;const data=await request("/api/website/compatibility-shares?id="+encodeURIComponent(id));if(current===revision.current){setInvitations(data.invitations);setGenerated(previous=>previous&&data.invitations.some((item:Invitation)=>item.id===previous.id&&!item.revoked_at&&Date.parse(item.expires_at)>Date.now())?previous:null)}
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
 async function revoke(invitation:Invitation){
  if(locked.current||!window.confirm("Revoke access for "+invitation.recipient_email+"?"))return
  locked.current=true;setBusy(true);setError("");setNotice("");const current=revision.current
  try{await request("/api/website/compatibility-shares?id="+encodeURIComponent(invitation.id),{method:"DELETE"});if(current!==revision.current)return;setGenerated(previous=>previous?.id===invitation.id?null:previous);setNotice("Access revoked.");await refresh()}catch(problem){if(current===revision.current)setError(problem instanceof Error?problem.message:"Unable to revoke access.")}finally{locked.current=false;setBusy(false)}
 }
 return <section className="mt-2 text-[#64263B]">
  <button type="button" disabled={busy} aria-expanded={expanded} onClick={()=>void toggle()} className="min-h-11 rounded-lg px-4 py-2 text-sm font-semibold underline focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">Invite to view / Manage sharing</button>
  {expanded&&<div className="mt-2 rounded-2xl border border-[#D7B77A] bg-[#FAF7F0] p-4">
   <h3 className="font-serif text-xl">Share insights with {name}</h3><p className="mt-2 text-sm leading-6 text-[#766B67]">Invite the other person to view this reading. Their email must be verified. Photos and practitioner notes stay private. Access lasts seven days and can be revoked.</p>
   <form onSubmit={send} className="mt-4"><fieldset disabled={busy} className="min-w-0">
    <label className="block text-sm font-semibold">Recipient email<input type="email" required maxLength={254} autoComplete="off" value={email} onChange={event=>{setEmail(event.target.value);setGenerated(null);setConfirmed(false);setNotice("")}} className="mt-2 min-h-12 w-full rounded-xl border border-[#DCCFC3] bg-white p-3 text-base"/></label>
    <label className="mt-4 block text-sm font-semibold">How would you like to share?<select value={delivery} onChange={event=>{setDelivery(event.target.value as "email"|"manual");setNotice("")}} className="mt-2 min-h-12 w-full rounded-xl border border-[#DCCFC3] bg-white p-3 text-base"><option value="email">Email invitation</option><option value="manual">WhatsApp, Messages, Copy link or Share via…</option></select></label>
    <label className="mt-4 flex items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={confirmed} onChange={event=>setConfirmed(event.target.checked)} className="mt-1"/><span>I confirm that <strong className="break-all">{email.trim()||"the email entered above"}</strong> belongs to the person in this comparison, and I want to share this reading with them.</span></label>
    <button disabled={busy||!confirmed} className="mt-4 min-h-12 rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#EAD8AD] disabled:opacity-50">{busy?"Please wait…":delivery==="email"?"Send email invitation":"Create private invitation"}</button>
   </fieldset></form>
   {error&&<p role="alert" className="mt-4 text-sm leading-6 text-red-800">{error}</p>}{notice&&<p role="status" className="mt-4 text-sm leading-6">{notice}</p>}
   {generated&&<ShareInvitationActions key={generated.id} invite={generated}/>}
   <h4 className="mt-5 font-semibold">Invitations</h4>
   {!invitations.length&&<p className="mt-2 text-sm text-[#766B67]">No invitations yet.</p>}
   <ul className="mt-2 space-y-3">{invitations.map(item=>{const expired=Date.parse(item.expires_at)<=Date.now();const status=item.revoked_at?"Revoked":expired?"Expired":!item.ready_at?"Invitation not confirmed":item.accepted_at?"Accepted":item.delivery_channel==="manual"?"Link created — awaiting acceptance":"Email submitted — awaiting acceptance";return <li key={item.id} className="rounded-xl border border-[#E5D8C6] bg-white p-3"><p className="break-all text-sm font-semibold">{item.recipient_email}</p><p className="mt-1 text-sm text-[#766B67]">{status}</p>{!item.revoked_at&&!expired&&<button type="button" disabled={busy} onClick={()=>void revoke(item)} className="mt-1 min-h-11 px-2 text-sm underline disabled:opacity-50">Revoke access</button>}</li>})}</ul>
   <button type="button" disabled={busy} onClick={async()=>{if(locked.current)return;locked.current=true;setBusy(true);setError("");try{await refresh()}catch{setError("Unable to refresh invitations.")}finally{locked.current=false;setBusy(false)}}} className="mt-3 min-h-11 px-2 text-sm underline">Refresh invitations</button>
  </div>}
 </section>
}
