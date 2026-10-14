'use client'
import { useEffect, useState } from 'react'
import { BasicNumerologyProfile } from './basic-numerology-profile'
import { LockedGuidanceServices } from './locked-guidance-services'
import Link from 'next/link'
import { customerClient } from '@/lib/jeevansutra/customer-client'
import { questionsFor, type Intake, type GuidanceTopic } from '@/lib/jeevansutra/intake'
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
 const [email, setEmail] = useState(''); const [code, setCode] = useState(''); const [sentEmail, setSentEmail] = useState('')
 const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [cooldown, setCooldown] = useState(0)
 useEffect(() => { if (!cooldown) return; const t = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t) }, [cooldown])
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
 async function signIn() {
  const client = customerClient(); if (!client) { setError('Sign-in is unavailable.'); return }
  setBusy(true); setError('')
  try {
   if (!sentEmail) {
    const address = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { setError('Enter a valid email.'); return }
    const { error } = await client.auth.signInWithOtp({ email: address, options: { shouldCreateUser: false } })
    if (error) { setError('Unable to send a code. Check your email or register first.'); return }
    setSentEmail(address); setCooldown(60)
   } else {
    const { error } = await client.auth.verifyOtp({ email: sentEmail, token: code.trim(), type: 'email' })
    if (error) { setError('The code is invalid or expired.'); return }
    await load()
   }
  } catch { setError('Unable to sign in. Please try again.') } finally { setBusy(false) }
 }
 function reset() { setError('') }
 return <section className="mx-auto max-w-4xl px-5 py-10">
  {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
  {loading ? <p role="status">Loading your saved profile…</p> : !profile ? <div className="rounded-3xl border border-[#eadfd4] bg-white p-6">
   <h2 className="font-serif text-3xl">Your personal guidance starts here</h2><p className="mt-3">Sign in with your registered email. New here? <Link className="underline" href="/website/register">Create your profile</Link>.</p>
   <label className="mt-5 block">Email address<input className={input} type="email" autoComplete="email" value={email} disabled={Boolean(sentEmail)} onChange={e => setEmail(e.target.value)} /></label>
   {sentEmail && <label className="mt-4 block">Email verification code<input className={input} inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value)} /></label>}
   <button className={`${button} mt-5`} disabled={busy} onClick={() => void signIn()}>{busy ? 'Please wait…' : sentEmail ? 'Verify & continue' : 'Send sign-in code'}</button>
   {sentEmail && <button className="ml-4 underline" disabled={busy || cooldown > 0} onClick={() => { setSentEmail(''); setCode('') }}>{cooldown ? `Request another code in ${cooldown}s` : 'Use another email or resend'}</button>}
  </div> : <>
   <div className="rounded-3xl border border-[#eadfd4] bg-white p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-[#a57a40]">{demo ? 'FICTIONAL TEST PROFILE' : 'YOUR SAVED PROFILE'}</p><h2 className="font-serif text-3xl">Welcome, {profile.profile.name}</h2><p className="mt-2">Date of birth: {profile.profile.dob}</p></div><button hidden={Boolean(demo)} className="text-sm underline" onClick={async () => { await customerClient()?.auth.signOut({ scope: 'local' }); setProfile(null); reset() }}>Sign out</button></div>
    <div className="mt-6 grid grid-cols-3 gap-3">{[['Mulank', profile.calculation.mulank.final], ['Bhagyank', profile.calculation.bhagyank.final], ['Name number', profile.calculation.nameNumber.finalNumber]].map(([label, number]) => <div key={label} className="rounded-xl bg-[#f9f5ef] p-3 text-center"><p className="text-sm">{label}</p><p className="mt-2 font-serif text-3xl">{number}</p></div>)}</div>
    <details className="mt-5"><summary className="cursor-pointer font-semibold">Explore your Lo Shu grid</summary><div className="mt-4 grid grid-cols-2 gap-4">{['Standard', 'Personal'].map(title => <div key={title}><p className="mb-2 text-center">{title} Lo Shu</p><div className="grid grid-cols-3 gap-1">{[4,9,2,3,5,7,8,1,6].map(n => <div key={n} className="flex aspect-square items-center justify-center border border-[#d8c7ae] bg-[#f9f5ef] text-lg font-semibold">{title === 'Standard' ? n : String(n).repeat(profile.calculation.loShu.counts[n as keyof typeof profile.calculation.loShu.counts])}</div>)}</div></div>)}</div></details>
    <p className="mt-4 text-sm text-[#766b67]">These calculations follow traditional numerology. Your experiences and choices matter when interpreting them.</p>
   </div>
   <div className="mt-6 rounded-3xl border border-[#eadfd4] bg-white p-6"><BasicNumerologyProfile calculation={profile.calculation} /></div>
   <Link href="/website/compatibility" className="mt-6 inline-block rounded-xl bg-[#762b40] px-5 py-3 font-semibold text-white">Explore my three complimentary compatibility previews</Link>
   <LockedGuidanceServices />
  </>}
 </section>
}
