'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { customerClient } from '@/lib/jeevansutra/customer-client'
import { DobInput } from '@/components/dob-input'

const services = [
  'Personal Numerology Report',
  'Life Path Guidance',
  'Astrology Consultation',
  'Career & Professional Guidance',
  'Relationship & Family Guidance',
  'Personalized Remedies & Yantras',
]

const inputClass =
  'mt-2 w-full rounded-xl border border-[#ded4cb] bg-white p-3'

const buttonClass =
  'w-full rounded-xl bg-[#81243f] px-5 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'

function normalizeMobile(value: string): string {
  const cleaned = value.replace(/[\s()-]/g, '')

  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return cleaned.slice(3)
  }

  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return cleaned.slice(2)
  }

  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return cleaned.slice(1)
  }

  return cleaned
}

function validDob(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)

  if (!match) return false

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const now = new Date()
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    year >= 1900 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <= Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )
  )
}

export default function RegisterPage() {
  const router = useRouter()

  const [supabase] = useState(customerClient)

  const enabled =
    process.env.NEXT_PUBLIC_JS_REGISTRATION_ENABLED === 'true'

  const [birthName, setBirthName] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [sameWhatsapp, setSameWhatsapp] = useState(true)
  const [category, setCategory] =
    useState<'free' | 'other'>('free')
  const [selectedService, setSelectedService] = useState('')
  const [consent, setConsent] = useState(false)

  const [sentEmail, setSentEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = window.setTimeout(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000
    )

    return () => window.clearTimeout(timer)
  }, [cooldown])

  function validateDetails(): string | null {
    if (
      !birthName.trim() ||
      birthName.trim().length > 150 ||
      !currentName.trim() ||
      currentName.trim().length > 150
    ) {
      return 'Please enter your full birth and current names.'
    }

    if (!validDob(dob)) {
      return 'Please enter a valid date of birth as DD/MM/YYYY.'
    }

    if (!/^[6-9]\d{9}$/.test(normalizeMobile(mobile))) {
      return 'Please enter a valid Indian mobile number.'
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      return 'Please enter a valid email address.'
    }

    if (
      !sameWhatsapp &&
      whatsapp.trim() &&
      !/^[6-9]\d{9}$/.test(normalizeMobile(whatsapp))
    ) {
      return 'Please enter a valid WhatsApp number.'
    }

    if (
      category === 'other' &&
      !services.includes(selectedService)
    ) {
      return 'Please choose a service.'
    }

    if (!consent) {
      return 'Please give your consent before continuing.'
    }

    return null
  }

  async function sendOtp() {
    if (busy || cooldown > 0 || saved) return

    setError('')
    setMessage('')

    if (!enabled || !supabase) {
      setError('Registration is not available yet.')
      return
    }

    const validationError = validateDetails()

    if (validationError) {
      setError(validationError)
      return
    }

    const targetEmail = email.trim().toLowerCase()

    setBusy(true)

    try {
      const { error: sendError } =
        await supabase.auth.signInWithOtp({
          email: targetEmail,
          options: {
            shouldCreateUser: true,
            data: {
              full_name: currentName.trim(),
            },
          },
        })

      if (sendError) {
        setError(sendError.message)
        return
      }

      setEmail(targetEmail)
      setSentEmail(targetEmail)
      setOtp('')
      setAccessToken('')
      setCooldown(60)
      setMessage(
        'Check your email for the verification code, including Spam or Junk.'
      )
    } catch {
      setError('Unable to send the code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function saveRegistration(token: string) {
    const response = await fetch('/api/website/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        birthName: birthName.trim(),
        currentName: currentName.trim(),
        dob,
        gender,
        mobile: normalizeMobile(mobile),
        email: sentEmail,
        whatsapp: sameWhatsapp
          ? normalizeMobile(mobile)
          : normalizeMobile(whatsapp),
        category,
        selectedService:
          category === 'other' ? selectedService : '',
        consent,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    })

    const result: unknown =
      await response.json().catch(() => null)

    const data =
      result &&
      typeof result === 'object' &&
      !Array.isArray(result)
        ? result as Record<string, unknown>
        : null

    if (!response.ok || data?.success !== true) {
      if (response.status === 401) {
        setAccessToken('')
        setSentEmail('')
        setOtp('')
        setCooldown(0)
      }

      setError(
        typeof data?.error === 'string'
          ? data.error
          : 'Unable to confirm registration. Please try again.'
      )
      return
    }

    if (
      data.verificationStatus !== 'verified' ||
      typeof data.clientId !== 'string' ||
      typeof data.clientNumber !== 'string'
    ) {
      setError('Unable to confirm registration. Please try again.')
      return
    }

    setSaved(true)
    setMessage('Registration saved. Opening your welcome page.')
    router.push('/website/welcome')
  }

  async function verifyAndSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (busy || saved) return

    setError('')
    setMessage('')

    if (!enabled || !supabase) {
      setError('Registration is not available yet.')
      return
    }

    const validationError = validateDetails()

    if (validationError) {
      setError(validationError)
      return
    }

    if (!sentEmail || email.trim().toLowerCase() !== sentEmail) {
      setError('Please request a code for your email address.')
      return
    }

    if (!accessToken && !/^\d{6,10}$/.test(otp.trim())) {
      setError('Please enter the code from your email.')
      return
    }

    setBusy(true)

    try {
      let token = accessToken

      if (!token) {
        const { data, error: verificationError } =
          await supabase.auth.verifyOtp({
            email: sentEmail,
            token: otp.trim(),
            type: 'email',
          })

        if (verificationError) {
          setError(verificationError.message)
          return
        }

        if (
          !data.session?.access_token ||
          data.user?.email?.trim().toLowerCase() !== sentEmail
        ) {
          setError('Unable to confirm your email. Please request a new code.')
          return
        }

        token = data.session.access_token
        setAccessToken(token)
        setOtp('')
      }

      await saveRegistration(token)
    } catch {
      setError(
        'Unable to confirm the save. Retry to check or complete your registration.'
      )
    } finally {
      setBusy(false)
    }
  }

  function changeEmail() {
    setSentEmail('')
    setOtp('')
    setAccessToken('')
    setError('')
    setMessage('')
  }

  return (
    <main className="min-h-screen bg-[#faf6ef] text-[#392c30]">
      <header className="flex items-center justify-between gap-4 border-b border-[#e9ddcf] bg-white px-5 py-5">
        <Link href="/website" className="font-serif text-2xl font-bold text-[#81243f]">
          JEEVAN SUTRA
        </Link>
        <Link href="/website" className="text-sm text-[#81243f]">
          Home
        </Link>
      </header>

      <section className="bg-[#81243f] px-6 py-12 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f1c780]">
          The Complete Guidance Experience
        </p>
        <h1 className="mt-5 font-serif text-4xl font-bold">
          Begin Your Journey
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#f8e6e8]">
          Register your details to explore personalized guidance with Jeevan Sutra.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-9">
        <form
          onSubmit={verifyAndSave}
          className="rounded-3xl border border-[#e8dbce] bg-white p-6 shadow-sm"
        >
          <fieldset disabled={busy || saved} className="min-w-0">
            <h2 className="font-serif text-2xl font-bold text-[#81243f]">
              Personal Details
            </h2>

            <div className="mt-6 space-y-5">
              <label className="block text-sm font-medium">
                Full Name at Birth *
                <input
                  required
                  maxLength={150}
                  value={birthName}
                  onChange={(e) => setBirthName(e.target.value)}
                  className={inputClass}
                  placeholder="Enter full birth name"
                />
              </label>

              <label className="block text-sm font-medium">
                Current Full Name *
                <input
                  required
                  maxLength={150}
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  className={inputClass}
                  placeholder="Enter current name"
                />
              </label>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Date of Birth *
                </label>
                <DobInput value={dob} onChange={setDob} />
              </div>

              <label className="block text-sm font-medium">
                Gender
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </label>
            </div>

            <h2 className="mt-9 font-serif text-2xl font-bold text-[#81243f]">
              Contact Details
            </h2>

            <div className="mt-5 space-y-5">
              <label className="block text-sm font-medium">
                Mobile Number *
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={inputClass}
                  placeholder="Enter Indian mobile number"
                />
              </label>

              <label className="block text-sm font-medium">
                Email Address *
                <input
                  required
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  readOnly={Boolean(sentEmail)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="Enter email address"
                />
              </label>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={sameWhatsapp}
                  onChange={(e) => setSameWhatsapp(e.target.checked)}
                />
                WhatsApp number is the same as mobile
              </label>

              {!sameWhatsapp && (
                <label className="block text-sm font-medium">
                  WhatsApp Number
                  <input
                    type="tel"
                    maxLength={20}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={inputClass}
                  />
                </label>
              )}
            </div>

            <h2 className="mt-9 font-serif text-2xl font-bold text-[#81243f]">
              Select Your Service
            </h2>

            <div className="mt-5 space-y-4">
              <label className="flex items-center gap-3 rounded-xl border border-[#e8dbce] p-4">
                <input
                  type="radio"
                  name="serviceCategory"
                  checked={category === 'free'}
                  onChange={() => setCategory('free')}
                />
                Free Initial Consultation
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-[#e8dbce] p-4">
                <input
                  type="radio"
                  name="serviceCategory"
                  checked={category === 'other'}
                  onChange={() => setCategory('other')}
                />
                Explore Other Services
              </label>

              {category === 'other' && (
                <label className="block text-sm font-medium">
                  Choose a service *
                  <select
                    required
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Choose a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <label className="mt-7 flex items-start gap-3 text-sm leading-6">
              <input
                required
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
              />
              I consent to Jeevan Sutra using my information to contact me
              regarding my selected services.
            </label>

            {!sentEmail ? (
              <button
                type="button"
                onClick={sendOtp}
                disabled={!enabled || !supabase || cooldown > 0}
                className={`mt-8 ${buttonClass}`}
              >
                {busy
                  ? 'Sending code…'
                  : !enabled
                    ? 'Registration Opening Soon'
                    : cooldown > 0
                      ? `Send code in ${cooldown}s`
                      : 'Send Email Verification Code'}
              </button>
            ) : (
              <div className="mt-8 rounded-2xl border border-[#e8dbce] bg-[#faf6ef] p-4">
                <h2 className="font-serif text-xl font-bold text-[#81243f]">
                  Verify Your Email
                </h2>

                <p className="mt-2 break-all text-sm">
                  Verification email: {sentEmail}
                </p>

                {!accessToken && (
                  <label className="mt-4 block text-sm font-medium">
                    Email verification code *
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={10}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ''))
                      }
                      className={inputClass}
                      placeholder="Enter the code from your email"
                    />
                  </label>
                )}

                <button
                  type="submit"
                  disabled={!enabled || !supabase}
                  className={`mt-5 ${buttonClass}`}
                >
                  {busy
                    ? 'Please wait…'
                    : accessToken
                      ? 'Retry Save & Continue'
                      : 'Verify Email & Save'}
                </button>

                {!accessToken && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={cooldown > 0}
                    className="mt-4 text-sm font-medium text-[#81243f] disabled:opacity-50"
                  >
                    {cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : 'Resend code'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={changeEmail}
                  className="mt-4 block text-sm text-[#81243f] underline"
                >
                  Change email address
                </button>
              </div>
            )}
          </fieldset>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="mt-4 text-sm text-[#486443]">
              {message}
            </p>
          )}

          <p className="mt-4 text-center text-xs leading-5 text-[#817875]">
            Your registration is saved after successful email verification.
            Keep this page open while entering your code.
          </p>
        </form>
      </section>
    </main>
  )
}