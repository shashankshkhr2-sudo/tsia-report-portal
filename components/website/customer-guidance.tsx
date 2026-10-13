'use client'
import { useEffect, useState } from 'react'
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
 const [topic, setTopic] = useState<GuidanceTopic>('career'); const [answers, setAnswers] = useState<Intake>({}); const [step, setStep] = useState(0)
 const [preview, setPreview] = useState<Preview | null>(null); const [requestId, setRequestId] = useState('')
 const questions = questionsFor(topic, answers); const question = questions[step]
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
 async function savePreview() {
  if (demo) {
   const result = demo.previews[topic]
   setPreview(result)
   setProfile(current => current ? { ...current, history: [{ id: crypto.randomUUID(), topic, intake: { ...answers }, preview: result, created_at: new Date().toISOString() }, ...current.history] } : current)
   return
  }
  setBusy(true); setError('')
  try {
   const session = await customerClient()?.auth.getSession(); const token = session?.data.session?.access_token
   if (!token) { setError('Please sign in again.'); return }
   const id = requestId || crypto.randomUUID(); setRequestId(id)
   const response = await fetch('/api/website/guidance', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, intake: answers, requestId: id }) })
   const data = await response.json()
   if (!response.ok) { setError(data.error || 'Unable to save your preview.'); return }
   setPreview(data.preview); await load()
  } catch { setError('Unable to save. Your answers are still here; please retry.') } finally { setBusy(false) }
 }
 function reset() { setAnswers({}); setStep(0); setPreview(null); setRequestId(''); setError('') }
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
   <div className="mt-6 rounded-3xl border border-[#eadfd4] bg-white p-6">
    <h2 className="font-serif text-3xl">What matters to you today?</h2>
    <div className="mt-4 flex flex-wrap gap-2">{Object.entries(labels).map(([id,label]) => <button key={id} aria-pressed={topic===id} className={`rounded-full border px-4 py-2 ${topic===id ? 'bg-[#762b40] text-white' : ''}`} onClick={() => { setTopic(id as GuidanceTopic); reset() }}>{label}</button>)}</div>
    {preview ? <div className="mt-6" aria-live="polite"><p className="text-sm text-[#a57a40]">{demo ? 'DEMO PREVIEW · NOT SAVED TO DATABASE' : 'YOUR FREE PREVIEW · SAVED TO YOUR ACCOUNT'}</p><p className="mt-3">{preview.scope}</p>{preview.insights.map((insight,index) => <article key={index} className="mt-4 rounded-xl bg-[#f9f5ef] p-4"><h3 className="font-serif text-xl">{insight.title}</h3><p className="mt-2 leading-7">{insight.explanation}</p><p className="mt-2 text-xs">{insight.basis === 'V3_SUPPORTED' ? 'Supported by the numerology engine’s rules' : 'Traditional association to reflect on'}</p></article>)}<p className="mt-5 font-semibold">A question to reflect on</p><p>{preview.question}</p>{preview.action && <><p className="mt-4 font-semibold">One practical next step</p><p>{preview.action}</p></>}<p className="mt-5 text-sm text-[#766b67]">{preview.limitation}</p><button className={`${button} mt-5`} onClick={reset}>Explore another concern</button></div> : <div className="mt-6">
     <p className="text-sm text-[#a57a40]">Question {step+1} of {questions.length}</p><label className="mt-3 block font-semibold">{question.label}{question.options ? <select className={input} value={answers[question.id] || ''} onChange={e => { setAnswers(a => ({ ...a, [question.id]: e.target.value })); setRequestId('') }}><option value="">Choose an option</option>{question.options.map(option => <option key={option} value={option}>{humanLabel(option)}</option>)}</select> : <textarea className={input} rows={3} maxLength={800} value={answers[question.id] || ''} onChange={e => { setAnswers(a => ({ ...a, [question.id]: e.target.value })); setRequestId('') }} />}</label>
     {question.help && <p className="mt-2 text-sm text-[#766b67]">{question.help}</p>}<div className="mt-5 flex gap-3">{step>0 && <button disabled={busy} className="rounded-xl border px-5 py-3" onClick={() => setStep(s=>s-1)}>Back</button>}<button className={button} disabled={busy || (!question.optional && !answers[question.id]?.trim())} onClick={() => step < questions.length-1 ? setStep(s=>s+1) : void savePreview()}>{busy ? 'Saving your preview…' : step===questions.length-1 ? (demo ? 'Show demo preview' : 'Show & save my free preview') : question.optional && !answers[question.id] ? 'Skip' : 'Continue'}</button></div>
    </div>}
   </div>
   {profile.history.length>0 && <div className="mt-6 rounded-3xl border border-[#eadfd4] bg-white p-6"><h2 className="font-serif text-2xl">{demo ? 'Previews from this demo visit' : 'My saved previews'}</h2>{profile.history.map(item => <button key={item.id} className="mt-3 block w-full rounded-xl border p-4 text-left" onClick={() => { setTopic(item.topic as GuidanceTopic); setAnswers(item.intake); setPreview(item.preview); setRequestId('') }}>{labels[item.topic]} · {new Date(item.created_at).toLocaleDateString('en-IN')}</button>)}</div>}
  </>}
 </section>
}
