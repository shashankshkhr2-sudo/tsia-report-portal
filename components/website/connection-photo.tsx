"use client"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"
export function ConnectionPhoto({ id, name, children, footer, actions }: { id: string; name: string; children: (photo: string) => ReactNode; footer?: ReactNode; actions?: ReactNode }) {
 const root = useRef<HTMLDivElement>(null)
 const input = useRef<HTMLInputElement>(null)
 const objectUrl = useRef("")
 const revision = useRef(0)
 const [photo, setPhoto] = useState("")
 const [ready, setReady] = useState(false)
 const [busy, setBusy] = useState(false)
 const [error, setError] = useState("")
 function show(blob: Blob | null) {
  const old = objectUrl.current
  objectUrl.current = blob ? URL.createObjectURL(blob) : ""
  setPhoto(objectUrl.current)
  if (old) URL.revokeObjectURL(old)
 }
 useEffect(() => {
  const element = root.current
  if (!element) return
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect() } }, { rootMargin: "100px" })
  observer.observe(element)
  return () => observer.disconnect()
 }, [])
 useEffect(() => {
  if (!ready) return
  const client = customerClient()
  if (!client) return
  let active = true
  let controller: AbortController | undefined
  async function load() {
   const current = ++revision.current
   controller?.abort()
   const requestController = new AbortController()
   controller = requestController
   const timer = setTimeout(() => requestController.abort(), 10000)
   try {
    const session = await client!.auth.getSession()
    const access = session.data.session?.access_token
    if (!active || current !== revision.current || !access) return
    const response = await fetch("/api/website/connection-photo?id=" + encodeURIComponent(id), { headers: { Authorization: "Bearer " + access }, cache: "no-store", priority: "low", signal: requestController.signal })
    if (!response.ok) return
    const blob = await response.blob()
    if (active && current === revision.current) show(blob)
   } catch {} finally { clearTimeout(timer) }
  }
  let user: string | undefined
  const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
   const next = session?.user.id || ""
   if (user === next) return
   user = next
   revision.current++
   controller?.abort()
   show(null)
   setTimeout(() => { if (active && next) void load() }, 0)
  })
  void load()
  return () => { active = false; revision.current++; controller?.abort(); subscription.unsubscribe(); if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); objectUrl.current = "" }
 }, [id, ready])
 async function change(file: File | null) {
  if (busy) return
  if (file && (file.size > 2097152 || !["image/jpeg","image/png","image/webp"].includes(file.type))) { setError("Choose a JPEG, PNG or WebP photo up to 2 MB."); return }
  if (!file && !window.confirm("Remove this connection photo? The saved insights will stay.")) return
  if (file && !window.confirm("I have permission to upload and store this person’s photo privately in my account.")) return
  setBusy(true); setError(""); const current = ++revision.current
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30000)
  try {
   const access = (await customerClient()?.auth.getSession())?.data.session?.access_token
   if (!access) throw new Error("Please sign in again.")
   const response = await fetch("/api/website/connection-photo?id=" + encodeURIComponent(id), { method: file ? "POST" : "DELETE", headers: { Authorization: "Bearer " + access, ...(file ? { "Content-Type": file.type } : {}) }, body: file || undefined, signal: controller.signal })
   const data = await response.json()
   if (!response.ok) throw new Error(data.error || "Unable to update the photo.")
   if (current === revision.current) show(file)
  } catch (problem) { if (current === revision.current) setError(problem instanceof Error && problem.name !== "AbortError" ? problem.message : "Unable to confirm the update. Reload to check the photo.") }
  finally { clearTimeout(timer); setBusy(false) }
 }
 return <div ref={root} className="rounded-2xl border border-[#D7B77A]/60 bg-[#FFFDFA] p-4 text-[#64263B] sm:p-5">
  {children(photo)}
  <div className="mt-2 flex flex-wrap gap-2 border-t border-[#C5A15A]/25 pt-3">
   <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label={"Choose photo for " + name} disabled={busy} onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void change(file) }} />
   <button type="button" disabled={busy} onClick={() => input.current?.click()} className="min-h-11 rounded-lg bg-[#64263B] px-4 py-2 text-sm font-semibold text-[#FAF7F0] focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">{busy ? "Updating photo…" : photo ? "Change photo" : "Add photo"}</button>
   {photo && <button type="button" disabled={busy} onClick={() => void change(null)} className="min-h-11 rounded-lg px-2 py-2 text-sm text-[#64263B] underline focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">Remove photo</button>}
   {actions && <div className="ml-auto flex items-center">{actions}</div>}
  </div>
  {footer}
  {error && <p role="alert" className="px-4 text-sm text-red-800">{error}</p>}
 </div>
}
