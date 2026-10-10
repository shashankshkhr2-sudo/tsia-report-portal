
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DobInput } from '@/components/dob-input'

const services = [
  'Personal Numerology Report',
  'Life Path Guidance',
  'Astrology Consultation',
  'Career & Professional Guidance',
  'Relationship & Family Guidance',
  'Personalized Remedies & Yantras',
]

export default function RegisterPage() {
  const [birthName, setBirthName] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [sameWhatsapp, setSameWhatsapp] = useState(true)
  const [category, setCategory] = useState<'free' | 'other'>('free')
  const [selectedService, setSelectedService] = useState('')
  const [consent, setConsent] = useState(false)

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
        <div className="rounded-3xl border border-[#e8dbce] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-[#81243f]">
            Personal Details
          </h2>

          <div className="mt-6 space-y-5">
            <label className="block text-sm font-medium">
              Full Name at Birth *
              <input
                value={birthName}
                onChange={(e) => setBirthName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#ded4cb] p-3"
                placeholder="Enter full birth name"
              />
            </label>

            <label className="block text-sm font-medium">
              Current Full Name *
              <input
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#ded4cb] p-3"
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
                className="mt-2 w-full rounded-xl border border-[#ded4cb] bg-white p-3"
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
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#ded4cb] p-3"
                placeholder="Enter mobile number"
              />
            </label>

            <label className="block text-sm font-medium">
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#ded4cb] p-3"
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
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#ded4cb] p-3"
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
                checked={category === 'free'}
                onChange={() => setCategory('free')}
              />
              Free Initial Consultation
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-[#e8dbce] p-4">
              <input
                type="radio"
                checked={category === 'other'}
                onChange={() => setCategory('other')}
              />
              Explore Other Services
            </label>

            {category === 'other' && (
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full rounded-xl border border-[#ded4cb] bg-white p-3"
              >
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            )}
          </div>

          <label className="mt-7 flex items-start gap-3 text-sm leading-6">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            I consent to Jeevan Sutra using my information to contact me
            regarding my selected services.
          </label>

          <button
            type="button"
            disabled
            className="mt-8 w-full rounded-xl bg-[#81243f] px-5 py-4 font-semibold text-white opacity-60"
          >
            Save & Continue — Coming Soon
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-[#817875]">
            Registration submission will be enabled after secure database
            integration. No information is saved yet.
          </p>
        </div>
      </section>
    </main>
  )
}
