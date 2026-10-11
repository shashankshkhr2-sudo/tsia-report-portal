'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Heart,
  Sparkles,
  UserRound,
} from 'lucide-react'

const services = [
  {
    title: 'Personal Numerology',
    description:
      'Discover your core numbers, strengths and personal guidance.',
    icon: Sparkles,
  },
  {
    title: 'Life Path Guidance',
    description:
      'Explore important areas of life through personalized guidance.',
    icon: Compass,
  },
  {
    title: 'Career & Professional Guidance',
    description:
      'Explore career direction, professional strengths and opportunities.',
    icon: UserRound,
  },
  {
    title: 'Relationships & Family',
    description:
      'Explore relationship patterns, communication and family harmony.',
    icon: Heart,
  },
]

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#f9f5ef] text-[#392e30]">
      <header className="border-b border-[#eadfd4] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link
            href="/website"
            className="font-serif text-2xl font-semibold tracking-wide text-[#762b40]"
          >
            JEEVAN SUTRA
          </Link>

          <Link
            href="/website"
            className="text-sm font-medium text-[#762b40]"
          >
            Home
          </Link>
        </div>
      </header>

      <section className="bg-[#762b40] px-5 py-16 text-center text-white sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e8c894]">
          The Complete Guidance Experience
        </p>

        <h1 className="mt-5 font-serif text-4xl font-semibold sm:text-5xl">
          Welcome to Jeevan Sutra
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/80">
          Your journey towards greater self-understanding,
          personal growth and meaningful guidance begins here.
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-sm leading-7 text-white/90">
            Explore our guidance services and discover how
            Jeevan Sutra can support your personal journey.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a57a40]">
            Begin Here
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#762b40]">
            Start With a Free Consultation
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#766b67]">
            Connect with our numerology guidance team for an
            introductory consultation and explore your next steps.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-[#eadfd4] bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f7e9d5] text-[#a57a40]">
            <CalendarDays className="size-7" />
          </div>

          <h3 className="mt-5 font-serif text-2xl font-semibold text-[#762b40]">
            Complimentary Numerology Consultation
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#766b67]">
            Our consultation team, led by our Principal
            Numerologist, will help you begin your
            Jeevan Sutra experience.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#e8dcc9] bg-[#fbf7ee] px-5 py-3 text-sm text-[#806d55]">
            Consultation booking will be available soon.
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a57a40]">
              Our Services
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#762b40]">
              Explore Personalized Guidance
            </h2>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {services.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#eadfd4] bg-[#fdfaf6] p-7"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#f4e5d4] text-[#762b40]">
                  <Icon className="size-6" />
                </div>

                <h3 className="mt-5 font-serif text-xl font-semibold text-[#762b40]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#766b67]">
                  {description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#a57a40]">
                  Service information
                  <ArrowRight className="size-4" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 text-center">
        <h2 className="font-serif text-3xl font-semibold text-[#762b40]">
          Your Journey, Your Guidance
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#766b67]">
          Jeevan Sutra brings together traditional knowledge,
          personalized interpretation and modern technology
          to support informed personal reflection.
        </p>

        <Link
          href="/website"
          className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#762b40] px-7 py-4 font-semibold text-white transition hover:bg-[#602235]"
        >
          Explore Jeevan Sutra
          <ArrowRight className="size-5" />
        </Link>
      </section>

      <footer className="border-t border-[#eadfd4] px-5 py-7 text-center text-xs text-[#91837d]">
        © Jeevan Sutra · The Complete Guidance Experience
      </footer>
    </main>
  )
}