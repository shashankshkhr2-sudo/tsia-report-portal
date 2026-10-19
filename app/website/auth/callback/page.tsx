"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { customerClient } from "@/lib/jeevansutra/customer-client"
const allowed = ["/website/start", "/website/start?next=compatibility", "/website/start?next=name-guidance", "/website/start?next=shared-compatibility"]
async function finishGoogle(): Promise<string> {
 const url = new URL(window.location.href)
 window.history.replaceState(null, "", window.location.pathname)
 const raw = sessionStorage.getItem("js-google-return")
 sessionStorage.removeItem("js-google-return")
 if (!raw) throw new Error("Missing sign-in request")
 const pending = JSON.parse(raw)
 if (!allowed.includes(pending.path) || typeof pending.at !== "number" || Date.now()-pending.at > 1800000 || pending.at > Date.now()+60000) throw new Error("Expired sign-in request")
 if (url.searchParams.has("error") || new URLSearchParams(url.hash.slice(1)).has("error")) throw new Error("Google sign-in cancelled")
 const code = url.searchParams.get("code")
 const client = customerClient()
 if (!client || !code) throw new Error("Missing sign-in code")
 const result = await client.auth.exchangeCodeForSession(code)
 if (result.error || !result.data.session) throw new Error("Unable to complete sign-in")
 return pending.path
}
export default function GoogleCallbackPage() {
 const router = useRouter()
 const task = useRef<Promise<string>|null>(null)
 const [error,setError] = useState(false)
 useEffect(()=>{
  let active = true
  if (!task.current) task.current = finishGoogle()
  void task.current.then(path=>{if(active)router.replace(path)}).catch(()=>{if(active)setError(true)})
  return ()=>{active=false}
 },[router])
 return <main className="mx-auto max-w-xl px-5 py-12 text-[#64263B]"><h1 className="font-serif text-3xl">Jeevan Sutra</h1>{error?<><p role="alert" className="mt-5">Google sign-in could not be completed. Please try again in the same browser, or use an email verification code.</p><Link href="/website/start?next=shared-compatibility" className="mt-5 inline-block underline">Return to sign-in</Link></>:<p role="status" className="mt-5">Completing Google sign-in…</p>}</main>
}
