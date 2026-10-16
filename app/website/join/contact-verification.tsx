'use client'
import { useState } from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
export type VerifiedContact = { token: string; fullName: string; email: string; mobile: string }
export default function ContactVerification({ onVerified }: { onVerified: (contact: VerifiedContact) => void }) {
  const [client] = useState<SupabaseClient>(() => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }))
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [mobile, setMobile] = useState('')
  const [sent, setSent] = useState(false); const [code, setCode] = useState(''); const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [retryAt, setRetryAt] = useState(0)
  const inputClass = 'mt-2 w-full rounded-xl border p-3'
  async function send() {
    if (Date.now() < retryAt) { setMessage('Please wait one minute before requesting another code.'); return }
    setBusy(true); setMessage('')
    try {
      const gate = await fetch('/api/website/practitioner-contact', { cache: 'no-store' }); const config = await gate.json()
      if (!gate.ok || !config.enabled) throw new Error('closed')
      const { error } = await client.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { shouldCreateUser: true } })
      if (error) throw error
      setSent(true); setRetryAt(Date.now() + 60000); setMessage('Check your email for the verification code. Enter it below. Employee access still requires approval.')
    } catch { setMessage('Unable to send a code. Applications may not be open yet; please check your email address or try again later.') }
    finally { setBusy(false) }
  }
  async function verify() {
    setBusy(true); setMessage('')
    try {
      const { data, error } = await client.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: 'email' })
      if (error || !data.session || !data.user?.email_confirmed_at) throw new Error('The code is invalid or expired. Request a new code.')
      const eligibility = await fetch('/api/website/practitioner-contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` }, body: '{}' })
      const checked = await eligibility.json()
      if (!eligibility.ok || !checked.success) throw new Error(checked.error || 'Unable to continue with this account.')
      const { error: passwordError } = await client.auth.updateUser({ password })
      if (passwordError) throw new Error('Email verified, but the password could not be saved. Use a stronger password and request a new code.')
      onVerified({ token: data.session.access_token, fullName: name.trim(), email: data.user.email!, mobile: mobile.trim() })
      setPassword('')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to verify.') }
    finally { setBusy(false) }
  }
  return <form onSubmit={e => { e.preventDefault(); void (sent ? verify() : send()) }} className="mt-8 space-y-5 rounded-3xl border bg-white p-6">
    <h3 className="font-serif text-2xl text-[#64263B]">First, verify your email</h3><p className="text-sm leading-7">We will send a code to confirm you control this email. Your mobile number is collected for contact and is not verified by this step.</p>
    <label className="block text-sm">Full name<input required maxLength={150} readOnly={sent} value={name} onChange={e => setName(e.target.value)} className={inputClass} /></label>
    <label className="block text-sm">Email<input type="email" required maxLength={254} readOnly={sent} value={email} onChange={e => setEmail(e.target.value)} className={inputClass} /></label>
    <label className="block text-sm">Mobile number<input type="tel" required maxLength={25} pattern="[+0-9 ()-]{7,25}" readOnly={sent} value={mobile} onChange={e => setMobile(e.target.value)} className={inputClass} /></label>
    {sent && <><label className="block text-sm">Email verification code<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" maxLength={10} value={code} onChange={e => setCode(e.target.value)} className={inputClass} /></label><label className="block text-sm">Choose a password for your future employee login<input type="password" required autoComplete="new-password" minLength={12} maxLength={256} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} /></label><p className="text-xs">Use at least 12 characters. It will work for employee access only after approval and activation.</p></>}
    <button disabled={busy} className="w-full rounded-xl bg-[#64263B] p-4 text-white disabled:opacity-50">{busy ? 'Please wait…' : sent ? 'Verify Email & Continue' : 'Send Email Code'}</button>
    {sent && <div className="flex gap-5 text-sm"><button type="button" disabled={busy} onClick={send} className="underline">Resend code</button><button type="button" disabled={busy} onClick={() => { setSent(false); setCode(''); setMessage('') }} className="underline">Change contact details</button></div>}
    {message && <p role="status" className="text-sm leading-7">{message}</p>}
  </form>
}
