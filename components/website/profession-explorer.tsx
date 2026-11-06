"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"
import type { buildProfessionReading } from "@/lib/jeevansutra/profession-reading"
import { ProfessionReadingView } from "./profession-reading-view"
import { ProfessionWorkForm } from "./profession-work-form"

type Result = {
  profile: { name: string }
  reading: ReturnType<typeof buildProfessionReading>
}

export function ProfessionExplorer() {
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<"loading" | "signin" | "ready" | "unavailable" | "error">("loading")
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
      setResult(null)
      setStatus("loading")
      try {
        if (!client) throw Error("Sign-in unavailable")
        const session = await client.auth.getSession()
        if (!active || current !== sequence) return
        if (session.error) throw Error("Session check failed")
        const token = session.data.session?.access_token
        if (!token) { setStatus("signin"); return }
        const response = await fetch("/api/website/professions", {
          headers: { Authorization: "Bearer " + token },
          cache: "no-store",
          signal
        })
        if (!active || current !== sequence) return
        if (response.status === 401) { setStatus("signin"); return }
        if (response.status === 403) { setStatus("unavailable"); return }
        if (!response.ok) throw Error("Reading failed")
        const data = await response.json()
        if (!active || current !== sequence) return
        if (typeof data.profile?.name !== "string" ||
            data.reading?.version !== "JS_PROFESSION_READING_DRAFT_1" ||
            !Array.isArray(data.reading?.findings)) throw Error("Invalid reading")
        setResult(data)
        setStatus("ready")
      } catch {
        if (active && current === sequence && !signal.aborted) setStatus("error")
      }
    }

    void load()
    const subscription = client?.auth.onAuthStateChange(() => {
      sequence++
      controller?.abort()
      setResult(null)
      setStatus("loading")
      window.setTimeout(() => { if (active) void load() }, 0)
    }).data.subscription
    return () => {
      active = false
      sequence++
      controller?.abort()
      subscription?.unsubscribe()
    }
  }, [attempt])

  if (status === "ready" && result) return <>
    <p className="mb-4 text-sm text-[#766B67]">Reading for <span className="font-semibold text-[#64263B]">{result.profile.name}</span></p>
    <ProfessionReadingView reading={result.reading} />
    {result.reading.findings.length > 0 && <ProfessionWorkForm />}
  </>

  return <section className="rounded-3xl border border-[#D2B577]/60 bg-white p-5 text-[#64263B] sm:p-8">
    <h1 className="font-serif text-3xl">Explore Suitable Professions</h1>
    {status === "loading" ? <p role="status" className="mt-4">Preparing your reading…</p>
      : status === "signin" ? <>
        <p className="mt-4 leading-7">Sign in and complete your name and date of birth to explore your qualities and profession suggestions.</p>
        <Link href="/website/start?next=professions" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#FAF0DE]">Continue →</Link>
      </> : status === "unavailable" ? <p className="mt-4 leading-7">Profession exploration is not available here yet.</p> : <>
        <p role="alert" className="mt-4">Unable to prepare your reading. Please try again.</p>
        <button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-4 min-h-11 rounded-xl border border-[#D2B577] px-4 py-2">Try again</button>
      </>}
  </section>
}
