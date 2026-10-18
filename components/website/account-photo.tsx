"use client"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { customerClient } from "@/lib/jeevansutra/customer-client"
export function AccountPhoto({ name }: { name: string }) {
 const [photo, setPhoto] = useState("")
 const [busy, setBusy] = useState(false)
 const [message, setMessage] = useState("")
 const alive = useRef(false)
 const working = useRef(false)
 useEffect(() => {
  alive.current = true
  const controller = new AbortController()
  let active = true
  async function load() {
   try {
    const session = await customerClient()?.auth.getSession()
    const token = session?.data.session?.access_token
    if (!token) return
    const response = await fetch("/api/website/customer-photo", {headers:{Authorization:"Bearer " + token},cache:"no-store",signal:controller.signal})
    if (response.status === 404) return
    if (!response.ok) throw new Error("Load failed")
    const blob = await response.blob()
    if (active) setPhoto(URL.createObjectURL(blob))
   } catch { if (active) setMessage("Unable to load your photo. Reopen your account to retry.") }
  }
  void load()
  return () => { active = false; alive.current = false; controller.abort() }
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
   if (alive.current) { setPhoto(URL.createObjectURL(file)); setMessage("Photo saved.") }
  } catch (error) { if (alive.current) setMessage(error instanceof Error ? error.message : "Unable to save your photo. Please try again.") }
  finally { working.current = false; if (alive.current) setBusy(false) }
 }
 const initials = name.trim().split(/\s+/).slice(0,2).map(part => Array.from(part)[0]).join("").toUpperCase()
 return <div className="flex w-24 shrink-0 flex-col items-center gap-1">
  {photo ? <img src={photo} alt="Your profile photo" width={64} height={64} className="size-16 rounded-full object-cover" /> : <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-[#64263B] text-xl font-semibold text-[#EAD8AD]">{initials}</span>}
  <label className="relative flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg px-1 py-2 text-center text-xs font-semibold underline underline-offset-4 focus-within:outline-2 focus-within:outline-[#64263B]">{busy ? "Saving…" : photo ? "Change photo" : "Add photo"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event => void upload(event)} aria-label={photo ? "Change profile photo" : "Add profile photo"} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait" /></label>
  <p className="text-center text-[11px] text-[#766b67]">Optional · up to 2 MB</p>
  {message && <p role="status" className="break-words text-center text-xs leading-5">{message}</p>}
 </div>
}
