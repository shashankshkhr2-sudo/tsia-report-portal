
import Link from 'next/link'

const services = [
  {
    number: '01',
    title: 'Personal Numerology Guidance',
    description:
      'Explore your core numbers, personal strengths, relationship patterns and practical directions through a structured numerology consultation.',
  },
  {
    number: '02',
    title: 'Personalized Numerology Reports',
    description:
      'Receive an individually prepared numerology report with Lo Shu analysis, Mulank, Bhagyank, Graha associations and personalized recommendations.',
  },
  {
    number: '03',
    title: 'Life Path Guidance',
    description:
      'Explore career, family, relationships, personal development and important life decisions through our integrated guidance approach.',
  },
  {
    number: '04',
    title: 'Vedic Astrology Guidance',
    description:
      'Explore traditional birth-chart interpretations, planetary periods and personalized guidance based on Vedic astrology principles.',
  },
  {
    number: '05',
    title: 'Career & Professional Direction',
    description:
      'Reflect on your professional strengths, working style, business interests and areas of personal development.',
  },
  {
    number: '06',
    title: 'Grahapurti Yantram & Art',
    description:
      'Discover personalized mathematical yantras and spiritually inspired artwork developed in collaboration with specialist artists.',
  },
]

const values = [
  {
    title: 'Personalized',
    description:
      'Every individual receives attention based on their own information and circumstances.',
  },
  {
    title: 'Structured',
    description:
      'Our guidance combines defined calculation methods, interpretation frameworks and quality checks.',
  },
  {
    title: 'Respectful',
    description:
      'We respect personal beliefs, privacy and individual decision-making.',
  },
]

export default function JeevanSutraHomePage() {
  return (
    <main className="min-h-screen bg-[#faf6ef] text-[#342c30]">
      {/* HEADER */}
      <header className="border-b border-[#e8dccd] bg-[#fffaf3]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-10">
          <Link
            href="/website"
            className="flex flex-col"
          >
            <span className="font-serif text-2xl font-bold tracking-wide text-[#81243f] md:text-3xl">
              JEEVAN SUTRA
            </span>
            <span className="mt-1 text-[9px] font-semibold tracking-[0.18em] text-[#a17b42] md:text-[11px]">
              THE COMPLETE GUIDANCE EXPERIENCE
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center gap-4 text-sm font-medium"
          >
            <a
              href="#about"
              className="hover:text-[#81243f]"
            >
              About
            </a>
            <a
              href="#services"
              className="hover:text-[#81243f]"
            >
              Services
            </a>
            <a
              href="#leadership"
              className="hover:text-[#81243f]"
            >
              Leadership
            </a>
            <Link
              href="/website/register"
              className="rounded-full bg-[#81243f] px-5 py-3 font-semibold text-white transition hover:bg-[#681b32]"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#81243f] text-white">
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full border border-[#d5ae75]/20" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full border border-[#d5ae75]/20" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-[#e7c58c]">
              The Complete Guidance Experience
            </p>

            <h1 className="font-serif text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Understand Yourself.
              <span className="mt-3 block text-[#efd09a]">
                Discover Your Direction.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#f2e4e7]">
              Welcome to Jeevan Sutra — a personalized
              guidance platform bringing together
              numerology, Vedic astrology, life path
              interpretation and thoughtful human
              consultation.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/website/register"
                className="rounded-xl bg-[#e7c58c] px-7 py-4 text-center font-bold text-[#562035] transition hover:bg-[#f3d8aa]"
              >
                Register for Free Consultation
              </Link>

              <a
                href="#services"
                className="rounded-xl border border-[#e7c58c]/70 px-7 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Explore Our Services
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e7c58c]/40 bg-white/10 p-8 shadow-2xl backdrop-blur-sm md:p-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#e7c58c] font-serif text-4xl font-bold text-[#efd09a]">
              JS
            </div>

            <div className="mt-8 text-center">
              <h2 className="font-serif text-3xl font-bold text-[#efd09a]">
                JEEVAN SUTRA
              </h2>
              <p className="mt-3 text-xs font-semibold tracking-[0.2em] text-[#f2dfbd]">
                THE COMPLETE GUIDANCE EXPERIENCE
              </p>
            </div>

            <div className="my-8 h-px bg-[#e7c58c]/40" />

            <p className="text-center text-lg leading-8 text-[#f7eaf0]">
              Ancient knowledge.
              <br />
              Structured interpretation.
              <br />
              Modern technology.
              <br />
              Personalized human guidance.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-24 px-6 py-20 md:px-10"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a17b42]">
            About Jeevan Sutra
          </p>

          <h2 className="mt-5 font-serif text-4xl font-bold text-[#81243f] md:text-5xl">
            A New Approach to Personal Guidance
          </h2>

          <p className="mx-auto mt-8 max-w-4xl text-lg leading-9 text-[#655c5e]">
            Jeevan Sutra is an independent guidance
            platform being developed to bring
            traditional numerological and astrological
            knowledge together with modern technology,
            structured reporting and experienced
            practitioners.
          </p>

          <p className="mx-auto mt-5 max-w-4xl text-lg leading-9 text-[#655c5e]">
            Our aim is to help people reflect on their
            personal strengths, relationships,
            professional direction and important life
            choices through meaningful consultations
            and individually prepared reports.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="scroll-mt-24 bg-[#f1e9dd] px-6 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a17b42]">
              Our Services
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold text-[#81243f] md:text-5xl">
              Guidance for Every Stage of Life
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#655c5e]">
              Explore our developing range of personal
              guidance services and specialist reports.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="rounded-2xl border border-[#e6d8c7] bg-[#fffaf3] p-8 shadow-sm"
              >
                <span className="font-serif text-3xl font-bold text-[#b18a53]">
                  {service.number}
                </span>

                <h3 className="mt-5 font-serif text-2xl font-bold text-[#81243f]">
                  {service.title}
                </h3>

                <p className="mt-4 leading-8 text-[#655c5e]">
                  {service.description}
                </p>

                <Link
                  href="/website/register"
                  className="mt-7 inline-block font-semibold text-[#81243f] underline underline-offset-4"
                >
                  Register Your Interest
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a17b42]">
              Our Approach
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold text-[#81243f]">
              Guidance With Care and Clarity
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#e6d8c7] bg-white p-8 text-center"
              >
                <h3 className="font-serif text-2xl font-bold text-[#81243f]">
                  {item.title}
                </h3>
                <p className="mt-4 leading-8 text-[#655c5e]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section
        id="leadership"
        className="scroll-mt-24 bg-[#fffaf3] px-6 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a17b42]">
              Leadership
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold text-[#81243f]">
              The People Behind Jeevan Sutra
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <article className="rounded-2xl border border-[#e8dccd] bg-[#faf6ef] p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#a17b42]">
                Founder, Jeevan Sutra
              </p>

              <h3 className="mt-4 font-serif text-3xl font-bold text-[#81243f]">
                Shashank Shekhar
              </h3>

              <p className="mt-5 leading-8 text-[#655c5e]">
                Leads the vision, research and
                technology development of Jeevan Sutra,
                including the study of global
                numerological traditions, selection
                of traditional Vedic astrology sources,
                and development of structured digital
                guidance systems.
              </p>
            </article>

            <article className="rounded-2xl border border-[#e8dccd] bg-[#faf6ef] p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#a17b42]">
                Principal Numerologist
              </p>

              <h3 className="mt-4 font-serif text-3xl font-bold text-[#81243f]">
                Pranita Ghode
              </h3>

              <p className="mt-2 font-semibold text-[#a17b42]">
                Founder, The Swastik Indian Art
              </p>

              <p className="mt-5 leading-8 text-[#655c5e]">
                Serves as Principal Numerologist of
                Jeevan Sutra and The Swastik Indian Art,
                contributing specialist numerology
                guidance and practitioner expertise.
              </p>
            </article>
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-center leading-8 text-[#655c5e]">
            Jeevan Sutra is building a collaborative
            network of numerologists, astrologers,
            artists and other specialist practitioners.
          </p>
        </div>
      </section>

      {/* HOW TO BEGIN */}
      <section className="bg-[#81243f] px-6 py-20 text-center text-white md:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e7c58c]">
            Begin Your Journey
          </p>

          <h2 className="mt-5 font-serif text-4xl font-bold md:text-5xl">
            Start With a Free Consultation
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-[#f3e4e9]">
            Register your interest and take the first
            step towards exploring Jeevan Sutra's
            personalized guidance services.
          </p>

          <Link
            href="/website/register"
            className="mt-9 inline-block rounded-xl bg-[#e7c58c] px-9 py-4 font-bold text-[#562035] transition hover:bg-[#f3d8aa]"
          >
            Register Now
          </Link>

          <p className="mt-6 text-sm text-[#ead4da]">
            Registration and consultation availability
            are subject to confirmation.
          </p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-[#faf6ef] px-6 py-10 md:px-10">
        <p className="mx-auto max-w-5xl text-center text-sm leading-7 text-[#756c6e]">
          Jeevan Sutra provides interpretive and
          reflective guidance based on traditional
          numerology and astrology practices.
          These services do not replace professional
          medical, legal, psychological or financial
          advice. Individual outcomes cannot be
          guaranteed.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e6d8c7] bg-[#fffaf3] px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-serif text-2xl font-bold text-[#81243f]">
              JEEVAN SUTRA
            </p>
            <p className="mt-2 text-xs font-semibold tracking-widest text-[#a17b42]">
              THE COMPLETE GUIDANCE EXPERIENCE
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-[#655c5e]">
            <Link href="/website">
              Home
            </Link>
            <a href="#about">
              About
            </a>
            <a href="#services">
              Services
            </a>
            <Link href="/website/register">
              Register
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-[#e6d8c7] pt-6 text-center text-sm text-[#756c6e]">
          © {new Date().getFullYear()} Jeevan Sutra.
          All rights reserved.
        </div>
      </footer>
    </main>
  )
}
