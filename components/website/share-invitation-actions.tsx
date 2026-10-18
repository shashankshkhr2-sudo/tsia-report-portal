"use client"
import { useEffect, useState } from "react"
type Invite = { link:string; text:string; recipient_email:string; expires_at:string }
export function ShareInvitationActions({invite}:{invite:Invite}) {
 const [notice,setNotice]=useState("");const [expired,setExpired]=useState(Date.parse(invite.expires_at)<=Date.now());const [native,setNative]=useState(false)
 useEffect(()=>{setNative(typeof navigator.share==="function");const delay=Date.parse(invite.expires_at)-Date.now();setExpired(delay<=0);if(delay<=0)return;const timer=setTimeout(()=>setExpired(true),Math.min(delay,2147483647));return()=>clearTimeout(timer)},[invite])
 const style="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#64263B] bg-white px-4 py-3 text-sm font-semibold text-[#64263B]"
 async function copy(){try{await navigator.clipboard.writeText(invite.link);setNotice("Invitation link copied.")}catch{setNotice("Select the invitation link below and copy it manually.")}}
 async function share(){try{await navigator.share({title:"Jeevan Sutra | Your life at the centre.",text:invite.text});setNotice("Share menu closed. Check your chosen app to confirm sending.")}catch(problem){if(problem instanceof Error&&problem.name==="AbortError")return;setNotice("Sharing is unavailable here. Use WhatsApp, Messages or Copy link.")}}
 if(expired)return <p role="status" className="mt-4 text-sm">This invitation has expired. Create a new invitation to share.</p>
 return <div className="mt-4 rounded-xl border border-[#C5A15A] bg-[#FFFDFA] p-4">
  <p className="font-serif text-xl text-[#64263B]">Jeevan Sutra</p><p className="mt-1 text-sm text-[#766B67]">Your life at the centre.</p>
  <p className="mt-3 break-words text-sm leading-6">Only <strong>{invite.recipient_email}</strong> can accept after verifying this email. Choose the same person in your messaging app. Creating a link does not send it.</p>
  <div className="mt-4 flex flex-wrap gap-3">
   <a className={style} href={"https://wa.me/?text="+encodeURIComponent(invite.text)} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">WhatsApp</a>
   <a className={style} href={"sms:"+(/iPad|iPhone|iPod/.test(typeof navigator!=="undefined"?navigator.userAgent:"")?"&":"?")+"body="+encodeURIComponent(invite.text)}>Messages / SMS</a>
   <button type="button" className={style} onClick={()=>void copy()}>Copy invitation link</button>
   {native&&<button type="button" className={style} onClick={()=>void share()}>Share via…</button>}
  </div>
  <label className="mt-4 block text-sm font-semibold">Private invitation link<input readOnly value={invite.link} onFocus={event=>event.target.select()} className="mt-2 min-h-12 w-full rounded-lg border border-[#DCCFC3] bg-white p-3 text-sm"/></label>
  <details className="mt-4"><summary className="cursor-pointer py-2 text-sm font-semibold">Preview invitation message</summary><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">{invite.text}</p></details>
  {notice&&<p role="status" className="mt-3 text-sm leading-6">{notice}</p>}
 </div>
}
