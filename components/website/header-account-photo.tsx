"use client"
import { useEffect, useState } from "react"
import { UserRound } from "lucide-react"
import { customerClient } from "@/lib/jeevansutra/customer-client"

export function HeaderAccountPhoto() {
 const [photo, setPhoto] = useState("")
 useEffect(() => {
  let active = true
  let revision = 0
  let objectUrl = ""
  let controller: AbortController | null = null
  function clear() {
   if (objectUrl) URL.revokeObjectURL(objectUrl)
   objectUrl = ""
   if (active) setPhoto("")
  }
  async function load() {
   const current = ++revision
   controller?.abort()
   const request = new AbortController()
   controller = request
   try {
    const session = await customerClient()?.auth.getSession()
    const token = session?.data.session?.access_token
    if (!active || current !== revision) return
    if (!token) { clear(); return }
    const response = await fetch("/api/website/customer-photo", { headers: { Authorization: "Bearer " + token }, cache: "no-store", signal: request.signal })
    if (!response.ok) { if (active && current === revision) clear(); return }
    const blob = await response.blob()
    if (!active || current !== revision) return
    clear()
    objectUrl = URL.createObjectURL(blob)
    setPhoto(objectUrl)
   } catch { if (active && current === revision) clear() }
  }
  const refresh = () => { void load() }
  window.addEventListener("jeevansutra-photo-updated", refresh)
  void load()
  return () => {
   active = false
   revision++
   controller?.abort()
   window.removeEventListener("jeevansutra-photo-updated", refresh)
   if (objectUrl) URL.revokeObjectURL(objectUrl)
  }
 }, [])
 return photo ? <img src={photo} alt="" width={32} height={32} onError={() => setPhoto("")} className="size-8 rounded-full border border-[#EAD8AD]/70 object-cover" /> : <UserRound size={24} strokeWidth={1.7} aria-hidden="true" />
}
