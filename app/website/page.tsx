import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Personal Numerology",
    description:
      "Explore your personal numbers, strengths, opportunities and practical guidance.",
  },
  {
    number: "02",
    title: "Life Path Guidance",
    description:
      "Personalized guidance combining numerological understanding with Vedic astrology.",
  },
  {
    number: "03",
    title: "Professional Guidance",
    description:
      "Explore career direction, professional decisions and areas for development.",
  },
  {
    number: "04",
    title: "Ambition & Manifestation",
    description:
      "Turn personal ambitions into thoughtful goals and practical action plans.",
  },
  {
    number: "05",
    title: "Personalized Guidance",
    description:
      "Receive relevant guidance and follow-up support through your personal journey.",
  },
  {
    number: "06",
    title: "Art & Remedy Products",
    description:
      "Discover selected numerology-inspired artwork, yantras and remedy products.",
  },
];

export default function WebsiteHomePage() {
  return (
    <main className="min-h-screen bg-[#FFF9F1] text-[#341321]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#E9D8C3] bg-[#FFF9F1]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4">
          <Link href="/website" className="min-w-0">
            <div className="font-serif text-xl font-semibold tracking-wide text-[#57172F] sm:text-2xl">
              JEEVAN SUTRA
            </div>
            <div className="text-[9px] font-semibold tracking-[0.13em] text-[#A77B46] sm:text-[10px]">
              THE COMPLETE GUIDANCE EXPERIENCE
            </div>
          </Link>

          <Link
            href="/website/register"
            className="shrink-0 rounded-full bg-[#57172F] px-4 py-3 text-center text-xs font-semibold text-white sm:px-6 sm:text-sm"
          >
            Register Free
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#3A1023] via-[#55172E] to-[#2A0B19] px-6 py-20 text-center text-white sm:py-28">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full border border-[#DAB478]/20" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full border border-[#DAB478]/20" />

        <div className="relative mx-auto max-w-4xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#E6BE80]">
            Welcome to Jeevan Sutra
          </p>

          <h1 className="font-serif text-5xl leading-tight sm:text-7xl">
            Discover Your Path.
            <br />
            <span className="text-[#E6BE80]">
              Shape Your Tomorrow.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-[#F3DFE4] sm:text-lg">
            A personalized guidance experience bringing together
            numerology, Vedic astrology, professional direction
            and meaningful action.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/website/register"
              className="rounded-full bg-[#E6BE80] px-8 py-4 font-semibold text-[#351020] transition hover:bg-[#F3D39F]"
            >
              Register for Free Consultation
            </Link>

            <a
              href="#services"
              className="rounded-full border border-[#D9AE75] px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Our Services
            </a>
          </div>

          <p className="mt-8 text-xs tracking-wide text-[#E5C5CF]">
            Your journey begins with a conversation.
          </p>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#A77B46]">
            The Jeevan Sutra Experience
          </p>

          <h2 className="font-serif text-4xl text-[#57172F] sm:text-5xl">
            Guidance That Understands You
          </h2>

          <p className="mt-7 text-base leading-8 text-[#6B5960]">
            Every individual has different questions, aspirations
            and circumstances. Jeevan Sutra is being developed
            to offer a more connected guidance experience,
            where consultations, personal insights and future
            support come together in one place.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F4EBDD] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A77B46]">
              Getting Started
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#57172F]">
              Three Simple Steps
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Register",
                text: "Create your client profile and choose Free Consultation or another service.",
              },
              {
                step: "02",
                title: "Connect",
                text: "Discuss your questions with our consultation team and explore suitable guidance.",
              },
              {
                step: "03",
                title: "Continue Your Journey",
                text: "Access relevant services and build on your guidance over time.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-[#E4D4BE] bg-[#FFFDF9] p-8 shadow-sm"
              >
                <div className="font-serif text-4xl text-[#B88B52]">
                  {item.step}
                </div>

                <h3 className="mt-5 font-serif text-2xl text-[#57172F]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-[#6B5960]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A77B46]">
              Explore Jeevan Sutra
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#57172F] sm:text-5xl">
              Our Guidance Experiences
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#6B5960]">
              A growing collection of personalized services
              designed around different areas of life.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="rounded-2xl border border-[#E9D8C3] bg-white p-7 shadow-sm transition hover:shadow-md"
              >
                <div className="text-sm font-bold tracking-widest text-[#B88B52]">
                  {service.number}
                </div>

                <h3 className="mt-5 font-serif text-2xl text-[#57172F]">
                  {service.title}
                </h3>

                <p className="mt-4 min-h-24 leading-7 text-[#6B5960]">
                  {service.description}
                </p>

                <Link
                  href="/website/register"
                  className="mt-6 inline-block font-semibold text-[#8A3D4D]"
                >
                  Enquire About This Service →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FREE CONSULTATION */}
      <section className="bg-[#57172F] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6BE80]">
            Begin With Us
          </p>

          <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
            Your First Consultation Is Complimentary
          </h2>

          <p className="mt-7 leading-8 text-[#F1DCE3]">
            Register for an introductory consultation
            and share what you would like guidance about.
            Our team will help you understand the next steps.
          </p>

          <Link
            href="/website/register"
            className="mt-9 inline-block rounded-full bg-[#E6BE80] px-9 py-4 font-semibold text-[#351020]"
          >
            Register for Free Consultation
          </Link>
        </div>
      </section>

      {/* PEOPLE */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A77B46]">
              The People & Purpose
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#57172F]">
              Vision, Research & Guidance
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl bg-[#F4EBDD] p-8 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A77B46]">
                Founder · Jeevan Sutra
              </p>

              <h3 className="mt-5 font-serif text-4xl text-[#57172F]">
                Shashank Shekhar
              </h3>

              <p className="mt-6 leading-8 text-[#6B5960]">
                Leading the vision, research and technology
                development of Jeevan Sutra. His work focuses
                on exploring numerological approaches from
                around the world and identifying respected
                sources of ancient Vedic astrology.
              </p>
            </article>

            <article className="rounded-2xl bg-[#F4EBDD] p-8 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A77B46]">
                Principal Numerologist
              </p>

              <h3 className="mt-5 font-serif text-4xl text-[#57172F]">
                Pranita Ghode
              </h3>

              <p className="mt-6 leading-8 text-[#6B5960]">
                Principal Numerologist, Jeevan Sutra.
                Founder, The Swastik Indian Art.
              </p>

              <p className="mt-4 leading-8 text-[#6B5960]">
                Leading Jeevan Sutra&apos;s free consultation
                team and guiding the development of its
                numerology consultation experience.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* PARTNER */}
      <section className="bg-[#F4EBDD] px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A77B46]">
            Remedy Products Partner
          </p>

          <h2 className="mt-5 font-serif text-3xl text-[#57172F] sm:text-4xl">
            The Swastik Indian Art
          </h2>

          <p className="mt-6 leading-8 text-[#6B5960]">
            Jeevan Sutra collaborates with The Swastik Indian Art
            for selected artistic remedy products, including
            personalized numerology artwork and yantras.
          </p>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-4xl text-[#57172F]">
            Start Your Jeevan Sutra Journey
          </h2>

          <p className="mt-6 leading-8 text-[#6B5960]">
            Whether you are seeking an introductory conversation
            or exploring a personalized service, begin by
            creating your client registration.
          </p>

          <Link
            href="/website/register"
            className="mt-9 inline-block rounded-full bg-[#57172F] px-9 py-4 font-semibold text-white"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2A0B19] px-6 py-10 text-center text-white">
        <h2 className="font-serif text-2xl tracking-wide text-[#E6BE80]">
          JEEVAN SUTRA
        </h2>

        <p className="mt-2 text-xs tracking-[0.16em] text-[#E9CFD7]">
          THE COMPLETE GUIDANCE EXPERIENCE
        </p>

        <p className="mt-7 text-sm text-[#D9BFC8]">
          An independent guidance platform.
        </p>

        <p className="mt-4 text-xs text-[#C8AEB7]">
          © 2026 Jeevan Sutra. All rights reserved.
        </p>
      </footer>
    </main>
  );
}