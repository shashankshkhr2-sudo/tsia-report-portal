"use client"
import { useEffect, useState } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"
import { ColourCalendar } from "@/components/website/colour-calendar"

export function TestColourCalendar() {
  const [dob, setDob] = useState("")
  const [error, setError] = useState("")
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
      setError("")
      try {
        if (!client) return
        const session = await client.auth.getSession()
        if (!active || current !== sequence) return
        if (session.error) throw Error("Unable to check calendar access.")
        const token = session.data.session?.access_token
        if (!token) return
        const response = await fetch("/api/website/colour-calendar-access", {
          headers: { Authorization: "Bearer " + token }, cache: "no-store", signal
        })
        if (!active || current !== sequence) return
        if (response.status === 401 || response.status === 403) return
        const data = await response.json()
        if (!active || current !== sequence) return
        if (!response.ok) throw Error("Unable to check calendar access. Please try again.")
        if (data.access !== "tester" || typeof data.dob !== "string" || !data.dob) throw Error("Unable to read calendar access.")
        setDob(data.dob)
      } catch {
        if (active && current === sequence && !signal.aborted) setError("Unable to check calendar test access. Please try again.")
      }
    }
    void load()
    const subscription = client?.auth.onAuthStateChange(() => {
      sequence++
      controller?.abort()
      setDob("")
      setError("")
      window.setTimeout(() => { if (active) void load() }, 0)
    }).data.subscription
    return () => { active = false; sequence++; controller?.abort(); subscription?.unsubscribe() }
  }, [attempt])
  if (error) return <div className="rounded-xl border border-[#D2B577] bg-white p-4"><p role="alert">{error}</p><button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-2 min-h-11 px-3 text-[#64263B] underline">Retry calendar access</button></div>
  if (!dob) return null
  return <div><p className="text-sm font-semibold text-[#906C36]">TEST ACCESS · Your saved birth details</p><ColourCalendar key={dob} dob={dob} /></div>
}
