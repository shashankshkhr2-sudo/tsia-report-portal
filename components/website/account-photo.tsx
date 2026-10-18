"use client"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { loadCustomerPhoto, clearCustomerPhoto } from "./customer-photo-loader"
import { customerClient } from "@/lib/jeevansutra/customer-client"
export function AccountPhoto({ name, invitation = false }: { name: string; invitation?: boolean }) {
 const [loaded, setLoaded] = useState(false)
 const viewer = useRef<HTMLDialogElement>(null)
 const [photo, setPhoto] = useState("")
 const [busy, setBusy] = useState(false)
 const [message, setMessage] = useState("")
 const alive = useRef(false)
 const working = useRef(false)
 useEffect(() => {
  alive.current = true
  const controller = new AbortController()
  let active = true
  let revision = 0
  async function load() {
   const current = ++revision
   try {
    const session = await customerClient()?.auth.getSession()
    const token = session?.data.session?.access_token
    if (!token) return
    const response = await loadCustomerPhoto(token)
    if (response.status === 404) return
    if (!response.ok) throw new Error("Load failed")
    const blob = await response.blob()
    if (active && current === revision && !working.current) setPhoto(URL.createObjectURL(blob))
   } catch { if (active && current === revision) setMessage("Unable to load your photo. Reopen your account to retry.") }
  }
  const refresh = () => { void load() }
  window.addEventListener("jeevansutra-photo-updated", refresh)
  void load().finally(() => { if (active) setLoaded(true) })
  return () => { window.removeEventListener("jeevansutra-photo-updated", refresh); revision++; active = false; alive.current = false; controller.abort() }
 }, [])
 useEffect(() => { return () => { if (photo) URL.revokeObjectURL(photo) } }, [photo])
 async function upload(event: ChangeEvent<HTMLInputElement>) {
  const file = event.currentTarget.files?.[0]
  event.currentTarget.value = ""
  if (!file || working.current) return
  if (!["image/jpeg","image/png","image/webp"].includes(file.type) || !file.size || file.size > 2097152) { setMessage("Choose a JPEG, PNG or WebP photo up to 2 MB."); return }
  working.current = true; setBusy(true); setMessage("")
  try {
   const image = await createImageBitmap(file)
   image.close()
   const session = await customerClient()?.auth.getSession()
   const token = session?.data.session?.access_token
   if (!token) throw new Error("Please sign in again.")
   const response = await fetch("/api/website/customer-photo", {method:"POST",headers:{Authorization:"Bearer " + token,"Content-Type":file.type},body:file})
   const data = await response.json()
   if (!response.ok || data.saved !== true) throw new Error(data.error || "Unable to save your photo.")
   if (alive.current) { setPhoto(URL.createObjectURL(file)); setMessage("Photo saved."); clearCustomerPhoto(); window.dispatchEvent(new Event("jeevansutra-photo-updated")) }
  } catch (error) { if (alive.current) setMessage(error instanceof Error ? error.message : "Unable to save your photo. Please try again.") }
  finally { working.current = false; if (alive.current) setBusy(false) }
 }
 const initials = name.trim().split(/\s+/).slice(0,2).map(part => Array.from(part)[0]).join("").toUpperCase()
 return <>{invitation && loaded && !photo && <div className="mb-4 rounded-xl bg-[#EAD8AD]/30 p-4 text-[#64263B]"><p className="font-serif text-xl font-semibold">Let your profile reflect you</p><p className="mt-2 text-sm leading-6">Your personality is more than a photograph. Add a photo to make this space feel more like you as you explore your strengths, confidence and self-expression.</p><p className="mt-2 text-xs">Optional—you can add it anytime.</p></div>}<div className="flex w-24 shrink-0 flex-col items-center gap-1">
  {photo ? <button type="button" onClick={() => viewer.current?.showModal()} aria-label="View larger profile photo" aria-haspopup="dialog" className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B]"><img src={photo} alt="Your profile photo" width={64} height={64} className="size-16 rounded-full object-cover" /></button> : <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-[#64263B] text-xl font-semibold text-[#EAD8AD]">{initials}</span>}
  <label className="relative flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg px-1 py-2 text-center text-xs font-semibold underline underline-offset-4 focus-within:outline-2 focus-within:outline-[#64263B]">{busy ? "Saving…" : photo ? "Change photo" : "Add your photo"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event => void upload(event)} aria-label={photo ? "Change profile photo" : "Add profile photo"} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait" /></label>

  {message && <p role="status" className="break-words text-center text-xs leading-5">{message}</p>}
 </div>
 <dialog ref={viewer} aria-label="Your profile photo" onClick={event => { if (event.target === event.currentTarget) viewer.current?.close() }} className="fixed inset-0 m-auto max-h-[90dvh] w-[min(90vw,36rem)] max-w-none overflow-auto rounded-2xl border border-[#C5A15A]/40 bg-[#FAF7F0] p-4 text-[#64263B] shadow-xl backdrop:bg-black/70">
  <div className="mb-3 flex items-center justify-between gap-3"><p className="font-semibold">Your profile photo</p><button type="button" autoFocus onClick={() => viewer.current?.close()} aria-label="Close photo viewer" className="flex size-11 items-center justify-center rounded-lg text-2xl hover:bg-[#EAD8AD]/30 focus-visible:outline-2 focus-visible:outline-[#64263B]">×</button></div>
  {photo && <img src={photo} alt={name + " profile photo"} className="mx-auto max-h-[70dvh] max-w-full rounded-lg object-contain" />}
 </dialog></>
}
