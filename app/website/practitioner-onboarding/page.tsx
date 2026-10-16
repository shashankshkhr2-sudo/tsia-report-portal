'use client'
import { useEffect, useState, type FormEvent } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
export default function PractitionerOnboarding() {
  const [invite, setInvite] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => { setInvite(new URLSearchParams(window.location.hash.slice(1)).get('invite') || '') }, [])
  async function submit(event: FormEvent<HTMLFormElement>, signup: boolean) {
    event.preventDefault(); setBusy(true); setMessage('')
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
    try {
      if (signup) {
        const { error } = await client.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/website/practitioner-onboarding` } })
        if (error) throw new Error(error.message)
        setMessage('Check your email and confirm the account. Then reopen your original onboarding link and choose Sign In & Activate. If you already have an account, use Sign In & Activate.')
        return
      }
      const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password })
      if (error || !data.session) throw new Error('Unable to sign in. Check your password and confirm your email first.')
      const response = await fetch('/api/website/practitioner-onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` }, body: JSON.stringify({ invite }) })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to activate.')
      setPassword(''); setDone(true); setInvite(''); window.history.replaceState(null, '', window.location.pathname)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to continue.') }
    finally { setBusy(false); await client.auth.signOut({ scope: 'local' }) }
  }
  return <main className="min-h-screen bg-[#FAF7F0] px-5 py-14 text-[#64263B]"><div className="mx-auto max-w-lg rounded-3xl border bg-white p-7"><p className="text-xs uppercase tracking-widest">Jeevan Sutra · Practitioner Onboarding</p><h1 className="mt-4 font-serif text-3xl">Join your team workspace</h1>{done ? <div role="status"><p className="mt-6">Your employee profile is active. Sign in to the employee portal with this email and password.</p><Link href="/login" className="mt-5 inline-block underline">Go to employee sign in →</Link></div> : <><p className="mt-4 text-sm leading-7">Use the same email as your approved application. Create an account, confirm your email, then return to your original private link to activate access.</p><form onSubmit={e => submit(e, false)} className="mt-6 space-y-5"><label className="block text-sm">Email<input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="mt-2 w-full rounded-xl border p-3" /></label><label className="block text-sm">Password (at least 12 characters)<input type="password" required minLength={12} maxLength={256} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border p-3" /></label><button type="submit" disabled={busy || !/^[a-f0-9]{64}$/.test(invite)} className="w-full rounded-xl bg-[#64263B] p-4 text-white disabled:opacity-50">{busy ? 'Please wait…' : 'Sign In & Activate'}</button></form>{!invite && <p className="mt-5 text-sm">Open the complete private link supplied by your administrator.</p>}{message && <p role="status" className="mt-5 text-sm leading-7">{message}</p>}</>}</div></main>
}
