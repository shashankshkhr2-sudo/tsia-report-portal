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
  const guest = status === "guest"
  const balance = status === "ready" ? remaining : null
  return <section aria-label="Complimentary compatibility tests" className="overflow-hidden rounded-3xl border border-[#C5A15A]/50 bg-[#64263B] text-[#FFF8ED] shadow-xl">
    <div className="px-5 pt-7 pb-5 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#EAD8AD]">✦ Your Launch Gift</p>
      <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">Numerology Brings People Closer</h2>
      <p className="mt-3 text-sm leading-7 text-[#F2DFE5]">Discover meaningful connections in love, friendship and business.</p>
      <div className="mx-auto mt-5 max-w-sm overflow-hidden rounded-2xl border border-[#C5A15A]/40"><img src="/website/illustrations/compatibility-human-numerology.webp" alt="Two people connected through symbolic numerology circles" width={500} height={590} loading="lazy" decoding="async" className="block h-auto w-full" /></div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-[#F7E6D4]">
        <span className="rounded-xl border border-[#C5A15A]/40 p-3">♡ Love</span>
        <span className="rounded-xl border border-[#C5A15A]/40 p-3">♧ Friendship</span>
        <span className="rounded-xl border border-[#C5A15A]/40 p-3">◇ Business</span>
      </div>
    </div>
    <div className="mx-4 mb-4 rounded-2xl bg-[#FFF7E9] p-5 text-[#64263B] sm:mx-8 sm:p-7">
      <h3 className="font-serif text-2xl">{status === "ready" ? "Your Complimentary Compatibility Tests" : "3 Complimentary Compatibility Tests"}</h3>
      <p role="status" className="mt-3 text-sm leading-6 text-[#765366]">{guest ? "Three complimentary tests are available with your free verified account." : status === "loading" ? "Checking your complimentary tests…" : status === "error" ? "Your balance is temporarily unavailable. Please try again." : balance === 0 ? "No complimentary tests remaining. Your saved comparisons remain available." : balance === null ? "Your complimentary tests" : balance + " of 3 complimentary tests remaining"}</p>
      <div className="mt-4 flex justify-center gap-3" aria-hidden="true">{[0,1,2].map(i => <span key={i} className={"flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A15A] text-lg " + (guest || (balance !== null && i < balance) ? "bg-[#64263B] text-white" : "bg-white text-[#947C82]")}>{i+1}</span>)}</div>
      <Link href={status === "ready" ? "/website/compatibility" : "/website/start?next=compatibility"} className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-[#64263B] px-5 py-3 text-center font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B]">Check Compatibility →</Link>
      <p className="mt-3 text-center text-xs leading-5 text-[#765366]">Use your tests across supported categories. Revisit saved comparisons without using another test.</p>
    </div>
  </section>
}
