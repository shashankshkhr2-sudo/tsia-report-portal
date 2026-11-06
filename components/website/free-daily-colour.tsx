"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"

type DailyColour = { date: string; colour: { name: string; hex: string } }

export function FreeDailyColour() {
  const [result, setResult] = useState<DailyColour | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsSignIn, setNeedsSignIn] = useState(false)
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
      setLoading(true)
      setError("")
      setResult(null)
      setNeedsSignIn(false)
      try {
        if (!client) throw new Error("Sign-in is temporarily unavailable.")
        const session = await client.auth.getSession()
        if (!active || current !== sequence) return
        if (session.error) throw new Error("Unable to check your account. Please try again.")
        const token = session.data.session?.access_token
        if (!token) { setNeedsSignIn(true); return }
        const response = await fetch("/api/website/daily-colour", {
          headers: { Authorization: "Bearer " + token },
          cache: "no-store",
          signal
        })
        const data = await response.json()
        if (!active || current !== sequence) return
        if (response.status === 401) { setNeedsSignIn(true); return }
        if (!response.ok) throw new Error(data.error || "Unable to load your colour.")
        if (!/^#[0-9a-f]{6}$/i.test(data.colour?.hex || "") || typeof data.colour?.name !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date || "")) {
          throw new Error("Unable to read your colour. Please try again.")
        }
        setResult(data)
      } catch (cause) {
        if (active && current === sequence && !signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Unable to connect. Please try again.")
        }
      } finally {
        if (active && current === sequence) setLoading(false)
      }
    }

    void load()
    const subscription = client?.auth.onAuthStateChange(() => {
      sequence++
      controller?.abort()
      setResult(null)
      setLoading(true)
      window.setTimeout(() => { if (active) void load() }, 0)
    }).data.subscription
    let day = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata" }).format(new Date())
    const timer = window.setInterval(() => {
      const next = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata" }).format(new Date())
      if (next !== day) { day = next; void load() }
    }, 60000)
    return () => { active = false; sequence++; controller?.abort(); subscription?.unsubscribe(); window.clearInterval(timer) }
  }, [attempt])

  return <section aria-labelledby="free-colour-title" className="rounded-3xl border border-[#D2B577]/60 bg-white p-5 sm:p-8">
    <p className="text-xs font-semibold uppercase tracking-widest text-[#906C36]">Complimentary</p>
    <h2 id="free-colour-title" className="mt-2 font-serif text-3xl text-[#64263B]">Your colour for today</h2>
    <div aria-live="polite" className="mt-5">
      {loading ? <p role="status">Preparing your daily colour…</p> : needsSignIn ? <>
        <p className="leading-7 text-[#766B67]">Sign in or complete your profile to discover today’s colour using your saved date of birth.</p>
        <Link href="/website/start?next=days-colours" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#FAF0DE]">Discover my free colour →</Link>
      </> : error ? <>
        <p role="alert" className="text-[#8A303A]">{error}</p>
        <button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-3 min-h-11 rounded-xl border border-[#D2B577] px-4 py-2 text-[#64263B]">Try again</button>
      </> : result ? <>
        <p className="text-sm text-[#766B67]">{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(result.date + "T12:00:00Z"))}</p>
        <div aria-hidden="true" style={{ backgroundColor: result.colour.hex }} className="mt-4 h-20 w-full rounded-xl sm:h-24 border border-black/15 shadow-sm" />
        <h3 className="mt-3 font-serif text-3xl text-[#64263B]">{result.colour.name}</h3>
        <p className="mt-3 leading-7 text-[#766B67]">A small touch in your outfit or accessories.</p>
      </> : null}
    </div>
    <p className="mt-5 text-xs leading-5 text-[#766B67]">Inspired by numerology traditions. Updated daily using India Standard Time.</p>
  </section>
}
