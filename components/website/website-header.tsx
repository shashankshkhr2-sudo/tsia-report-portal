'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, UserRound, X, Home, BookOpen, UsersRound, ChevronRight } from 'lucide-react'

import { customerClient } from "@/lib/jeevansutra/customer-client"

import { HeaderAccountPhoto } from "./header-account-photo"
import { AccountPersonalPanel } from "./account-personal-panel"

const items = [
 { title: 'Home', href: '/website', icon: Home },
 { title: 'My Profile', href: '/website/welcome', icon: UserRound },
 { title: 'Services', href: '/website/services', icon: BookOpen },
 { title: 'Compatibility', href: '/website/compatibility', icon: UsersRound },
]
export function WebsiteHeader() {
 const [signedIn, setSignedIn] = useState(false)
 const [signingOut, setSigningOut] = useState(false)
 const [signOutError, setSignOutError] = useState("")
 useEffect(() => {
  const client = customerClient()
  if (!client) return
  let active = true
  let authChanged = false
  const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => { authChanged = true; if (active) setSignedIn(Boolean(session)) })
  void client.auth.getSession().then(({ data, error }) => { if (active && !authChanged) setSignedIn(!error && Boolean(data.session)) }).catch(() => {})
  return () => { active = false; subscription.unsubscribe() }
 }, [])
 async function signOutCustomer() {
  if (signingOut) return
  setSigningOut(true); setSignOutError("")
  try {
   const client = customerClient()
   if (!client) throw new Error("Unavailable")
   const result = await client.auth.signOut({ scope: "local" })
   if (result.error) throw result.error
   const remaining = await client.auth.getSession()
   if (remaining.error || remaining.data.session) throw new Error("Session remains")
   setSignedIn(false); closeMenu(); window.location.replace("/website")
  } catch { setSignOutError("Unable to sign out. Please try again.") }
  finally { setSigningOut(false) }
 }
 const pathname = usePathname()
 const accountDialog = useRef<HTMLDialogElement>(null)
 const [accountOpen, setAccountOpen] = useState(false)
 const dialog = useRef<HTMLDialogElement>(null)
 const [open, setOpen] = useState(false)
 const [logoAvailable, setLogoAvailable] = useState(true)
 function closeMenu() { dialog.current?.close(); accountDialog.current?.close(); setOpen(false); setAccountOpen(false) }
 function openAccount() { closeMenu(); accountDialog.current?.showModal(); setAccountOpen(true) }
 function openMenu() { closeMenu(); dialog.current?.showModal(); setOpen(true) }
 useEffect(() => { dialog.current?.close(); accountDialog.current?.close(); setOpen(false); setAccountOpen(false) }, [pathname])
 useEffect(() => {
  if (!open && !accountOpen) return
  const previous = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  return () => { document.body.style.overflow = previous }
 }, [open, accountOpen])
 const action = 'flex size-11 items-center justify-center rounded-lg text-[#EAD8AD] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAD8AD]'
 return <>
  <header className="sticky top-0 z-40 border-b border-[#C5A15A]/60 bg-[#64263B] shadow-sm">
   <div className="mx-auto grid h-16 max-w-6xl grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 px-3 sm:px-6">
    <button type="button" onClick={openMenu} aria-label="Open Jeevan Sutra menu" aria-haspopup="dialog" aria-controls="website-menu" aria-expanded={open} className={action}><Menu size={25} strokeWidth={1.7} aria-hidden="true" /></button>
    <Link href="/website" aria-label="Jeevan Sutra homepage" className="mx-auto flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-[#EAD8AD]">
     {logoAvailable && <img src="/images/jeevansutra-approved-logo.png" alt="" width={40} height={48} className="h-12 w-10 shrink-0 object-contain" onError={()=>setLogoAvailable(false)} />}
     <span className="truncate font-serif text-[17px] tracking-wide text-[#EAD8AD] sm:text-2xl">JEEVAN SUTRA</span>
    </Link>
    <button type="button" onClick={openAccount} aria-label="Open account menu" aria-haspopup="dialog" aria-controls="website-account-menu" aria-expanded={accountOpen} className={action}>{signedIn ? <HeaderAccountPhoto /> : <UserRound size={24} strokeWidth={1.7} aria-hidden="true" />}</button>
   </div>
  </header>
  <dialog ref={dialog} id="website-menu" aria-labelledby="website-menu-title" onClose={()=>setOpen(false)} onClick={event=>{if(event.target===event.currentTarget){const bounds=event.currentTarget.getBoundingClientRect();if(event.clientX<bounds.left || event.clientX>bounds.right || event.clientY<bounds.top || event.clientY>bounds.bottom)closeMenu()}}} className="fixed inset-x-0 bottom-auto top-16 m-0 max-h-[calc(100dvh-4rem)] w-full max-w-none overflow-y-auto border-0 border-b border-[#C5A15A]/40 bg-[#FAF7F0] p-0 text-[#64263B] shadow-xl backdrop:bg-black/35 md:inset-x-auto md:left-[max(1.5rem,calc((100vw-72rem)/2))] md:top-20 md:max-h-[calc(100dvh-6rem)] md:w-96 md:rounded-3xl md:border md:border-[#C5A15A]/50">
   <div className="mx-auto max-w-xl px-5 pb-7 pt-4 sm:px-8 md:px-6 md:pb-6">
    <div className="flex items-start justify-between gap-4"><h2 id="website-menu-title" className="py-3 font-serif text-2xl sm:text-3xl md:text-2xl">Explore Jeevan Sutra</h2><button type="button" autoFocus onClick={closeMenu} aria-label="Close menu" className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-[#EAD8AD]/40 focus-visible:outline-2 focus-visible:outline-[#64263B]"><X size={26} aria-hidden="true" /></button></div>
    <nav aria-label="Jeevan Sutra navigation" className="mt-3">{items.map(({title,href,icon:Icon})=><Link key={href} href={href} onClick={closeMenu} aria-current={pathname===href?'page':undefined} className={`flex min-h-16 items-center gap-4 border-b border-[#C5A15A]/30 px-2 py-4 font-serif text-xl md:min-h-14 md:rounded-xl md:px-3 md:py-3 md:text-lg focus-visible:outline-2 focus-visible:outline-[#64263B] ${pathname===href?'bg-[#EAD8AD]/30':'hover:bg-[#EAD8AD]/20'}`}><Icon size={23} strokeWidth={1.6} aria-hidden="true" /><span className="flex-1">{title}</span><ChevronRight size={20} aria-hidden="true" /></Link>)}</nav>
    <Link href="/website/start" onClick={closeMenu} className="mt-6 block rounded-xl bg-[#64263B] px-5 py-3 text-center font-semibold text-[#FAF7F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B]">My Profile / Sign in</Link>
    {signedIn && <button type="button" onClick={() => void signOutCustomer()} disabled={signingOut} className="mt-3 min-h-12 w-full rounded-xl border border-[#64263B]/30 px-5 py-3 text-center font-semibold text-[#64263B] hover:bg-[#EAD8AD]/30 focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">{signingOut ? "Signing out…" : "Sign out"}</button>}
    {signOutError && <p role="alert" className="mt-3 text-sm text-red-800">{signOutError}</p>}
   </div>
  </dialog>
  <dialog ref={accountDialog} id="website-account-menu" aria-labelledby="website-account-title" onClose={() => setAccountOpen(false)} onClick={event => { if (event.target === event.currentTarget) { const b = event.currentTarget.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) closeMenu() } }} className="fixed bottom-auto left-auto right-3 top-20 m-0 max-h-[calc(100dvh-6rem)] w-96 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-2xl border border-[#C5A15A]/40 bg-[#FAF7F0] p-5 text-[#64263B] shadow-xl backdrop:bg-black/35 sm:right-6">
   <div className="flex items-center justify-between gap-3"><h2 id="website-account-title" className="font-serif text-2xl">Your account</h2><button type="button" autoFocus onClick={closeMenu} aria-label="Close account menu" className="flex size-11 items-center justify-center rounded-lg hover:bg-[#EAD8AD]/30 focus-visible:outline-2 focus-visible:outline-[#64263B]"><X size={24} aria-hidden="true" /></button></div>
   {signedIn ? <AccountPersonalPanel onNavigate={closeMenu} actions={<>   <Link href="/website/start" onClick={closeMenu} className="mt-4 block min-h-12 rounded-xl bg-[#64263B] px-4 py-3 text-center font-semibold text-[#FAF7F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B]">{signedIn ? "My Profile" : "Sign in / Register"}</Link>
   {signedIn && <button type="button" onClick={() => void signOutCustomer()} disabled={signingOut} className="mt-3 min-h-12 w-full rounded-xl border border-[#64263B]/30 px-4 py-3 font-semibold hover:bg-[#EAD8AD]/30 focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">{signingOut ? "Signing out…" : "Sign out"}</button>}
   {signOutError && <p role="alert" className="mt-3 text-sm text-red-800">{signOutError}</p>}</>} /> : <>   <Link href="/website/start" onClick={closeMenu} className="mt-4 block min-h-12 rounded-xl bg-[#64263B] px-4 py-3 text-center font-semibold text-[#FAF7F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64263B]">{signedIn ? "My Profile" : "Sign in / Register"}</Link>
   {signedIn && <button type="button" onClick={() => void signOutCustomer()} disabled={signingOut} className="mt-3 min-h-12 w-full rounded-xl border border-[#64263B]/30 px-4 py-3 font-semibold hover:bg-[#EAD8AD]/30 focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">{signingOut ? "Signing out…" : "Sign out"}</button>}
   {signOutError && <p role="alert" className="mt-3 text-sm text-red-800">{signOutError}</p>}</>}
  </dialog>
 </>
}
