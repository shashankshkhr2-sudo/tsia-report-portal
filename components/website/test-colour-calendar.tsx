"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"
import { ColourCalendar } from "@/components/website/colour-calendar"

const signIn = "/website/start?next=days-colours"

export function TestColourCalendar() {
  const router = useRouter()
  const [dob, setDob] = useState("")
  const [status, setStatus] = useState<"loading" | "signin" | "denied" | "ready" | "error">("loading")
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    let sequence = 0
    let controller: AbortController | undefined
    const client = customerClient()

    async function load() {
      const current = ++sequence
      controller?.abort()
      controller = new AbortController()
      const signal = controller.signal
      setDob("")
      setStatus("loading")
      try {
        if (!client) throw Error("Sign-in unavailable")
        const session = await client.auth.getSession()
        if (!active || current !== sequence) return
        if (session.error) throw Error("Session check failed")
        const token = session.data.session?.access_token
        if (!token) {
          setStatus("signin")
          router.replace(signIn)
          return
        }
        const response = await fetch("/api/website/colour-calendar-access", {
          headers: { Authorization: "Bearer " + token },
          cache: "no-store",
          signal
        })
        if (!active || current !== sequence) return
        if (response.status === 401) {
          setStatus("signin")
          return
        }
        if (response.status === 403) {
          setStatus("denied")
          return
        }
        if (!response.ok) throw Error("Access check failed")
        const data = await response.json()
        if (!active || current !== sequence) return
        if (data.access !== "tester" || typeof data.dob !== "string" || !data.dob) throw Error("Invalid response")
        setDob(data.dob)
        setStatus("ready")
      } catch {
        if (active && current === sequence && !signal.aborted) setStatus("error")
      }
    }

    void load()
    const subscription = client?.auth.onAuthStateChange(() => {
      sequence++
      controller?.abort()
      setDob("")
      setStatus("loading")
      window.setTimeout(() => { if (active) void load() }, 0)
    }).data.subscription
    return () => {
      active = false
      sequence++
      controller?.abort()
      subscription?.unsubscribe()
    }
  }, [attempt, router])

  if (status === "ready" && dob) return <ColourCalendar key={dob} dob={dob} />
  return <section className="my-6 rounded-2xl border border-[#D2B577]/60 bg-white p-5 text-[#64263B]">
    {status === "loading" ? <p role="status">Opening your calendar…</p>
      : status === "signin" ? <>
        <p>Please sign in or complete your profile to continue.</p>
        <Link href={signIn} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#FAF0DE]">Continue to sign-in →</Link>
      </> : status === "denied" ? <>
        <h2 className="font-serif text-2xl">Calendar access</h2>
        <p className="mt-3 leading-6">The full calendar is currently available to approved testers on our Preview website. Access is not available for this account here.</p>
        <Link href="/website" className="mt-4 inline-flex min-h-11 items-center underline">Back to home</Link>
      </> : <>
        <p role="alert">Unable to check calendar access. Please try again.</p>
        <button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-3 min-h-11 rounded-xl border border-[#D2B577] px-4 py-2">Try again</button>
      </>}
  </section>
}
