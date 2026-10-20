'use client'
import { AccountPhoto } from "./account-photo"
import { LaunchGift } from './launch-gift'
import { ProfileDob } from './profile-dob'
import { ProfileLoShuGrid } from './profile-loshu-grid'
import { useEffect, useState } from 'react'
import { BasicNumerologyProfile } from './basic-numerology-profile'
import { LockedGuidanceServices } from './locked-guidance-services'
import Link from 'next/link'
import { customerClient } from '@/lib/jeevansutra/customer-client'
import { type Intake, type GuidanceTopic } from '@/lib/jeevansutra/intake'
import type { NumerologyCalculationResult } from '@/lib/numerology/types'
type Preview = { scope: string; insights: { title: string; explanation: string; basis: string }[]; question: string; action: string; limitation: string }
type Saved = { id: string; topic: string; intake: Intake; preview: Preview; created_at: string }
type Profile = { profile: { name: string; dob: string }; calculation: NumerologyCalculationResult; history: Saved[] }
const labels: Record<string, string> = { career: 'Career & professional life', business: 'Business direction', money: 'Money habits & direction', family: 'Family & relationships', personal_direction: 'Purpose & personal direction' }
const button = 'rounded-xl bg-[#762b40] px-5 py-3 font-semibold text-white disabled:opacity-50'
const input = 'mt-2 w-full rounded-xl border border-[#ded4cb] bg-white p-3 text-base text-[#392e30]'
const humanLabel = (value: string) => value.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase())
export function CustomerGuidance({ demo }: { demo?: { profile: Profile; previews: Record<GuidanceTopic, Preview> } }) {
 const [profile, setProfile] = useState<Profile | null>(null)
 const [loading, setLoading] = useState(true); const [error, setError] = useState('')
 async function load() {
  if (demo) { setProfile(demo.profile); setLoading(false); return }
  setLoading(true)
  try {
   const client = customerClient(); const session = await client?.auth.getSession()
   const token = session?.data.session?.access_token
   if (!token) return
   const response = await fetch('/api/website/guidance', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
   const data = await response.json()
   if (!response.ok) { setError(data.error || 'Unable to load your profile.'); return }
   setProfile(data)
  } catch { setError('Unable to connect. Please try again.') } finally { setLoading(false) }
 }
 useEffect(() => { void load() }, [])
 function reset() { setError('') }
 return <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6">
  {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
  {loading ? <p role="status">Loading your saved profile…</p> : !profile ? <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 sm:p-7">
   <h2 className="font-serif text-3xl">Your personal profile starts here</h2><p className="mt-3">Verify your email to open your saved profile or create a new one.</p><Link href="/website/start" className={`${button} mt-5 inline-block`}>Start with Email / Sign in</Link>
  </div> : <>
   <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 sm:p-7">
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">{!demo && <AccountPhoto name={profile.profile.name} invitation />}<div className="min-w-0 col-span-1"><p className="text-sm text-[#a57a40]">{demo ? 'FICTIONAL TEST PROFILE' : null}</p><h2 className="break-words font-serif text-xl capitalize sm:text-3xl">Welcome, {profile.profile.name}</h2><ProfileDob dob={profile.profile.dob} /></div></div><div className="mt-3"></div>
    <nav aria-label="Profile sections" className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[#64263B]">{[['#your-numbers','Your numbers'],['#grid-patterns','Rajyogs & grid'],['#combined-reading','Your reading']].map(([href,label])=><a key={href} href={href} className="rounded-full border border-[#ded4cb] px-3 py-2 hover:bg-[#FAF7F0]">{label}</a>)}</nav>
    <ProfileLoShuGrid calculation={profile.calculation} />
    <p className="mt-4 text-sm text-[#766b67]">These calculations follow traditional numerology. Your experiences and choices matter when interpreting them.</p>
   </div>
   <div className="mt-6 rounded-2xl border border-[#eadfd4] bg-white p-5 sm:p-7"><BasicNumerologyProfile calculation={profile.calculation} /></div>
   <div className="mt-6"><LaunchGift /></div>
   <LockedGuidanceServices />
  </>}
 </section>
}
