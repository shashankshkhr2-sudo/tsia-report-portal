"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"
export function HomeConnections({compact}: {compact?: boolean}) {
  const [status,setStatus]=useState("loading")
  const [remaining,setRemaining]=useState<number|null>(null)
  useEffect(()=>{
    const client=customerClient(); if(!client){setStatus("error");return}
    let active=true, revision=0
    async function load(){
      const current=++revision; if(active){setRemaining(null);setStatus("loading")}
      try {
        const session=await client!.auth.getSession(); if(session.error)throw session.error
        if(!active||current!==revision)return
        const token=session.data.session?.access_token
        if(!token){setStatus("guest");return}
        const response=await fetch("/api/website/compatibility?summary=1&offset=0",{headers:{Authorization:"Bearer "+token},cache:"no-store"})
        const data=await response.json()
        if(!response.ok||!Number.isInteger(data.remaining)||data.remaining<0)throw Error()
        if(active&&current===revision){setRemaining(data.remaining);setStatus("ready")}
      }catch{if(active&&current===revision)setStatus("error")}
    }
    void load()
    const listener=client.auth.onAuthStateChange(()=>{setTimeout(()=>{if(active)void load()},0)})
    const refresh=()=>{void load()}; window.addEventListener("focus",refresh)
    return ()=>{active=false;revision++;listener.data.subscription.unsubscribe();window.removeEventListener("focus",refresh)}
  },[])
  return <section aria-label="Your connections" className="rounded-3xl border border-[#C5A15A]/50 bg-[#64263B] p-6 text-[#FAF7F0] sm:p-7"><h2 className="font-serif text-2xl sm:text-3xl">Your Connections</h2><p role="status" className="mt-3 text-base leading-7 text-[#EAD8AD]">{status==="loading"?"Checking your complimentary tests…":status==="guest"?"Sign in to see your remaining complimentary tests.":status==="error"?"Your balance is unavailable. Open your connections to try again.":remaining===0?"No complimentary tests remaining. You can revisit your saved insights.":remaining+" complimentary compatibility "+(remaining===1?"test":"tests")+" remaining"}</p><Link href={status==="guest"?"/website/start?next=compatibility":"/website/compatibility"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#EAD8AD] bg-[#EAD8AD] px-4 py-3 text-center font-semibold text-[#64263B] hover:bg-[#F1DFB5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAD8AD]">Explore my connections →</Link></section>
}
