"use client"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"
import { PERSONAL_COMPATIBILITY_REPORT_VERSION, type PersonalCompatibilityReport } from "@/lib/jeevansutra/compatibility-personal-report-contract"
import { CompatibilityPersonalReport } from "./compatibility-personal-report"

export function CompatibilityPersonalReview() {
  const [report, setReport] = useState<PersonalCompatibilityReport | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const pending = useRef<AbortController | null>(null)
  const form = useRef<HTMLFormElement | null>(null)
  const reportTop = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const client = customerClient()
    const subscription = client?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN" || event === "USER_UPDATED") {
        pending.current?.abort()
        pending.current = null
        setReport(null)
        setError("")
        setBusy(false)
        form.current?.reset()
      }
    })
    return () => { pending.current?.abort(); subscription?.data.subscription.unsubscribe() }
  }, [])
  useEffect(() => { if (report) reportTop.current?.focus() }, [report])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const controller = new AbortController()
    pending.current = controller
    setBusy(true)
    setReport(null)
    setError("")
    const values = new FormData(event.currentTarget)
    const details = {
      self: { name: String(values.get("firstName") || ""), dob: String(values.get("firstDob") || "") },
      other: { name: String(values.get("secondName") || ""), dob: String(values.get("secondDob") || "") },
    }
    const timeout = window.setTimeout(() => controller.abort(), 30000)
    try {
      const client = customerClient()
      if (!client) throw new Error("Customer sign-in is unavailable in this browser.")
      const { data, error: sessionError } = await client.auth.getSession()
      if (controller.signal.aborted) return
      if (sessionError || !data.session) throw new Error("Sign in with your review account, then return to this page.")
      const response = await fetch("/api/website/compatibility-review", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify(details),
        cache: "no-store",
        signal: controller.signal,
      })
      const body = await response.json()
      if (controller.signal.aborted) return
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Unable to generate the review.")
      if (body.reviewOnly !== true || body.report?.version !== PERSONAL_COMPATIBILITY_REPORT_VERSION || !Array.isArray(body.report.people) || body.report.people.length !== 2) throw new Error("Unexpected review response.")
      setReport(body.report)
    } catch (caught) {
      if (pending.current === controller) setError(controller.signal.aborted ? "The review request timed out. Please try again." : caught instanceof Error ? caught.message : "Unable to generate the review.")
    } finally {
      window.clearTimeout(timeout)
      if (pending.current === controller) { pending.current = null; setBusy(false) }
    }
  }

  return <main className="min-h-screen bg-[#FAF7F0] px-3 py-8 text-[#463B3B] sm:px-6">
    <section className="mx-auto mb-8 max-w-3xl rounded-2xl border border-[#DCC9A8] bg-white p-5 sm:p-8">
      <h1 className="font-serif text-3xl text-[#64263B]">Compatibility design review</h1>
      <p className="mt-3 leading-6">Considering marriage · Internal draft. This form generates a review without saving a comparison or using a test allowance.</p>
      <p className="mt-2 text-sm leading-6">Use your authorised customer account. The draft currently supports only the reviewed numerical combinations.</p>
      <a href="/website/start" className="mt-3 inline-block underline underline-offset-4">Open customer sign-in</a>
      <form ref={form} onSubmit={submit} className="mt-6 space-y-5">
        <fieldset disabled={busy} className="grid gap-6 disabled:opacity-60 sm:grid-cols-2">
          <legend className="sr-only">Details for the two people</legend>
          {[{ prefix: "first", label: "First person" }, { prefix: "second", label: "Second person" }].map(person => <div key={person.prefix} className="space-y-3">
            <h2 className="font-semibold text-[#64263B]">{person.label}</h2>
            <label className="block text-sm" htmlFor={`${person.prefix}Name`}>Full name in English</label>
            <input id={`${person.prefix}Name`} name={`${person.prefix}Name`} required maxLength={120} autoComplete="off" className="w-full rounded-lg border border-[#B9A88E] bg-white p-3" />
            <label className="block text-sm" htmlFor={`${person.prefix}Dob`}>Date of birth · DD/MM/YYYY</label>
            <input id={`${person.prefix}Dob`} name={`${person.prefix}Dob`} required maxLength={10} placeholder="DD/MM/YYYY" autoComplete="off" className="w-full rounded-lg border border-[#B9A88E] bg-white p-3" />
          </div>)}
        </fieldset>
        <p role="status" aria-live="polite" className="text-sm">{busy ? "Preparing your review…" : ""}</p>
        {error && <p role="alert" className="text-sm text-[#8B2032]">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy} className="rounded-lg bg-[#64263B] px-5 py-3 font-semibold text-white disabled:opacity-60">Generate review</button>
          <button type="button" disabled={busy} onClick={() => { setReport(null); setError(""); form.current?.reset() }} className="rounded-lg border border-[#B9A88E] px-5 py-3 disabled:opacity-60">Clear details and report</button>
        </div>
      </form>
    </section>
    {report && <div ref={reportTop} tabIndex={-1} aria-label="Generated compatibility review"><CompatibilityPersonalReport report={report} /></div>}
  </main>
}
