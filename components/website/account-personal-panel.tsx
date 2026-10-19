"use client"
import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { customerClient } from "@/lib/jeevansutra/customer-client"
import { ProfileDob } from "./profile-dob"
import { AccountPhoto } from "./account-photo"
type Profile = { name: string; dob: string }
const choices = ["Love & relationships", "Work & career", "Money & stability", "Family & personal life", "I’m feeling good"]
export function AccountPersonalPanel({ onNavigate, actions }: { onNavigate: () => void; actions: ReactNode }) {
 const [profile, setProfile] = useState<Profile | null>(null)
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState("")
 const [choice, setChoice] = useState("")
 const [email,setEmail] = useState("")
 const [switching,setSwitching] = useState(false)
 async function switchAccount(){if(switching)return;setSwitching(true);try{const client=customerClient();if(!client)throw Error();const result=await client.auth.signOut({scope:"local"});if(result.error)throw result.error;window.location.assign(window.location.pathname==="/website/shared-compatibility"?"/website/start?next=shared-compatibility":"/website/start")}catch{setError("Unable to switch account. Please try again.");setSwitching(false)}}
 useEffect(() => {
  const controller = new AbortController()
  let active = true
  async function load() {
   try {
    const session = await customerClient()?.auth.getSession()
    const token = session?.data.session?.access_token
    if (!token) throw new Error("Please sign in again.")
    const response = await fetch("/api/website/profile", { headers: { Authorization: "Bearer " + token }, cache: "no-store", signal: controller.signal })
    const data = await response.json()
    if (!response.ok) throw new Error("Unable to load your details. Please reopen your account.")
    if(active)setEmail(typeof data.email==="string"?data.email:"")
    if (active && data.profile && typeof data.profile.name === "string" && typeof data.profile.dob === "string") setProfile(data.profile)
   } catch { if (active) setError("Unable to load your details. Please reopen your account.") }
   finally { if (active) setLoading(false) }
  }
  void load()
  return () => { active = false; controller.abort() }
 }, [])
 return <div className="mt-4 space-y-4">
  {email&&<div className="border-b border-[#C5A15A]/25 pb-5 text-center"><p className="break-words text-sm leading-6 text-[#64263B] [overflow-wrap:anywhere]">{email}</p><button type="button" disabled={switching} onClick={()=>void switchAccount()} className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full border border-[#64263B]/60 px-6 py-2 text-sm font-medium text-[#64263B] transition-colors hover:bg-[#EAD8AD]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B] disabled:opacity-50">{switching?"Please wait…":"Change email"}</button></div>}
  {loading ? <p role="status" className="text-sm">Loading your details…</p> : error ? <p role="alert" className="text-sm text-red-800">{error}</p> : profile ? <div className="rounded-xl border border-[#C5A15A]/30 bg-white/60 p-3"><div className="flex flex-col items-center gap-2"><AccountPhoto name={profile.name} /><p className="min-w-0 w-full break-words text-center font-serif text-2xl font-semibold leading-tight capitalize">{profile.name}</p></div><div className="flex justify-center text-center"><ProfileDob dob={profile.dob} /></div></div> : <p className="text-sm">Complete your profile to add your name and date of birth.</p>}
  {actions}
  {profile && <p className="rounded-xl bg-[#EAD8AD]/40 px-4 py-4 text-xl font-semibold leading-8 text-[#64263B]">Whatever is on your mind,<br />we’re here to listen.</p>}
  {profile && <fieldset className="min-w-0 rounded-xl border border-[#C5A15A]/30 p-3"><legend className="px-1 text-base font-semibold">What in your life could use a little more clarity right now?</legend><div className="mt-2 flex flex-col gap-2">{choices.map(label => <button key={label} type="button" aria-pressed={choice === label} onClick={() => setChoice(label)} className={choice === label ? "min-h-11 rounded-lg border border-[#64263B] bg-[#64263B] px-3 py-2 text-left text-sm text-white" : "min-h-11 rounded-lg border border-[#C5A15A]/30 px-3 py-2 text-left text-sm hover:bg-[#EAD8AD]/30"}>{label}</button>)}</div>{choice && <div role="status" className="mt-3 text-sm leading-6">{choice === "I’m feeling good" ? <p>Glad to hear it. Take a moment to appreciate what is going well.</p> : <><p>You can take your time to explore what matters to you.</p><Link href="/website/services#chat_15" onClick={onNavigate} className="mt-2 inline-block underline underline-offset-4">Explore a conversation with a numerologist</Link></>}<p className="mt-2 text-xs text-[#766b67]">Optional. Your selection is not saved or sent to a practitioner.</p></div>}</fieldset>}
 </div>
}
