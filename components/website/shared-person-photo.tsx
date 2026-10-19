"use client"
import { useEffect, useRef, useState } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"
export function SharedPersonPhoto({id,person,name,expiresAt}:{id:string;person:number;name:string;expiresAt:string}) {
 const root=useRef<HTMLSpanElement>(null);const [photo,setPhoto]=useState("")
 useEffect(()=>{
  let active=true;let url="";const controller=new AbortController();let timeout:ReturnType<typeof setTimeout>|undefined
  setPhoto("");const remaining=Date.parse(expiresAt)-Date.now();if(!(remaining>0))return
  const expiry=setTimeout(()=>{active=false;controller.abort();setPhoto("");if(url)URL.revokeObjectURL(url)},Math.min(remaining,2147483647))
  async function load(){
   timeout=setTimeout(()=>controller.abort(),10000)
   try{const session=await customerClient()?.auth.getSession();const token=session?.data.session?.access_token;if(!active||!token)return
    const response=await fetch("/api/website/shared-compatibility-photo?id="+encodeURIComponent(id)+"&person="+person,{headers:{Authorization:"Bearer "+token},cache:"no-store",priority:"low",signal:controller.signal})
    if(!response.ok)return;const blob=await response.blob();if(active&&!controller.signal.aborted){url=URL.createObjectURL(blob);setPhoto(url)}
   }catch{}finally{if(timeout)clearTimeout(timeout)}
  }
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();void load()}},{rootMargin:"100px"});if(root.current)observer.observe(root.current)
  return()=>{active=false;observer.disconnect();controller.abort();clearTimeout(expiry);if(timeout)clearTimeout(timeout);if(url)URL.revokeObjectURL(url)}
 },[id,person,expiresAt])
 const initials=name.trim().split(/\s+/).slice(0,2).map(part=>Array.from(part)[0]).join("").toUpperCase()
 return <span ref={root} className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#64263B] font-serif text-2xl text-[#EAD8AD]">{photo?<img src={photo} alt={name} width={80} height={80} decoding="async" className="size-20 rounded-full object-cover" onError={()=>setPhoto("")}/>:<span aria-hidden="true">{initials}</span>}</span>
}
