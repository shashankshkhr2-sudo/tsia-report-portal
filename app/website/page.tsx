import ExploreSlider from "@/components/website/explore-slider"
export const metadata = {
  "title": "Jeevan Sutra | Numerology, Name Numbers & Lo Shu Grid",
  "description": "Explore traditional numerology with Jeevan Sutra. Discover your Mulank, Bhagyank, Chaldean name numbers, Lo Shu grid and compatibility previews.",
  "alternates": {
    "canonical": "https://www.jeevansutra.co.in/website"
  }
}

import { NameDiscoveryFeature, NameCorrectionCard } from '@/components/website/name-discovery-feature'
import Link from 'next/link'
import { Star, BriefcaseBusiness, Heart, Compass, Sprout } from 'lucide-react'
import { HomeConnections as LaunchGift } from "@/components/website/home-connections"
import GrahaArtwork from './GrahaArtwork'

const benefits = [
  {
    icon: Star,
    title: 'Personal Strengths',
    detail: 'Explore the qualities associated with your numbers.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Career & Work',
    detail: 'Reflect on professional direction and working style.',
  },
  {
    icon: Heart,
    title: 'Love & Relationships',
    detail: 'Explore patterns of connection and communication.',
  },
  {
    icon: Compass,
    title: 'Money & Opportunities',
    detail: 'Consider traditional themes around planning and opportunity.',
  },
  {
    icon: Sprout,
    title: 'Personal Growth',
    detail: 'Build greater self-awareness through guided reflection.',
  },
]

const services = [
  {
    number: '01',
    title: 'Detailed Numerology Insights',
    description:
      'Personalized analysis of Mulank, Bhagyank, Lo Shu, Graha associations and name numbers.',
  },
  {
    number: '02',
    title: 'Birth Name & Current Name Analysis',
    description:
      'Explore Chaldean name numbers and interpretations of different name spellings.',
  },
  {
    number: '03',
    title: 'Career & Professional Direction',
    description:
      'Reflect on strengths, working preferences and career-related numerology themes.',
  },
  {
    number: '04',
    title: 'Relationships & Family Guidance',
    description:
      'Explore communication, relationships and family dynamics through a structured framework.',
  },
  {
    number: '05',
    title: 'Premium Life Path & Vedic Astrology',
    description:
      'In-depth guidance with optional birth-chart analysis when accurate birth details are available.',
  },
  {
    number: '06',
    title: 'Grahapurti Yantram & Personalized Art',
    description:
      'Mathematical yantras and individually developed traditional artwork with specialist artists.',
  },
]

export default function JeevanSutraHomePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#42353A]">
      {/* HEADER */}


      {/* HERO */}
        <section className="bg-[#64263B] text-[#FAF0DE]">
        <div id="personality" className="bg-[#64263B] text-[#FAF0DE]">
          <div className="mx-auto grid max-w-7xl items-center md:grid-cols-2">
            <div className="order-2 px-5 py-9 sm:px-10 md:order-1">
              <h1 className="font-serif text-4xl font-bold leading-tight lg:text-6xl">Discover Your Personality</h1>
              <p className="mt-3 max-w-md leading-relaxed text-[#FAF0DE]">Gain a deeper understanding of who you are, why you think and feel the way you do, and how to make the most of your unique nature.</p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                <div><dt className="font-serif text-xl font-bold">Strengths</dt><dd className="mt-1 text-sm text-[#FAF0DE]">Know your natural talents and advantages.</dd></div>
                <div><dt className="font-serif text-xl font-bold">Challenges</dt><dd className="mt-1 text-sm text-[#FAF0DE]">Understand your key hurdles and patterns.</dd></div>
                <div><dt className="font-serif text-xl font-bold">Growth</dt><dd className="mt-1 text-sm text-[#FAF0DE]">Get practical direction for a more balanced and fulfilling life.</dd></div>
              </dl>
              <Link href="/website/start" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#D2B577] px-7 py-3 font-semibold text-[#64263B]">Start Free →</Link>
            </div>
            <img src="/website/home/mirror.webp" alt="A woman looking at her reflection in a brass mirror" width={1440} height={1080} className="order-1 md:order-2 block h-auto w-full" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-5 md:px-10">

            <div className="mt-7 border-t border-[#D8B475]/30 pt-5">
              <p className="text-sm leading-7 text-[#F0E4E5]">
                Are you an astrologer or numerologist?
              </p>

              <Link
                href="/website/join"
                className="mt-2 inline-flex items-center gap-3 font-medium text-[#EAD8AD] underline underline-offset-4 hover:text-[#FFF0CA]"
              >
                Join Jeevan Sutra
                <span aria-hidden="true">→</span>
              </Link>
            <hr className="mt-5 border-0 border-t border-[#D8B475]/40" />
            </div>
          </div>
      </section>

      <div className="bg-[#64263B] px-5 pb-6 pt-0 md:px-10 md:pt-4"><ExploreSlider /></div>
      <section aria-labelledby="home-days-colours" className="bg-[#FAF7F0] px-5 py-10"><div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#D2B577]/60 bg-white shadow-sm md:grid-cols-2"><img src="/website/home/days-colours.webp" alt="Fabric colours beside a decorative calendar and silver jewellery" width={1200} height={800} loading="lazy" className="block h-auto w-full md:h-full md:object-cover" /><div className="flex flex-col justify-center p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-[#906C36]">Days &amp; Colours</p><h2 id="home-days-colours" className="mt-3 font-serif text-3xl text-[#64263B] sm:text-4xl">Your Days. Your Colours.</h2><p className="mt-4 leading-7 text-[#766B67]">Discover one complimentary colour for today, inspired by your birth details and numerology traditions.</p><p className="mt-3 text-sm leading-6 text-[#766B67]">Preview the upcoming paid calendar with three daily shades and optional metal accessories.</p><Link href="/website/days-colours" className="mt-6 inline-flex min-h-12 items-center justify-center self-start rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#FAF0DE]">Discover Today’s Colour →</Link></div></div></section>
<section aria-label="Earth and Navagraha" className="bg-[#64263B] px-5 py-12 text-[#FAF0DE]">
        <div className="mx-auto w-full max-w-[600px]">
            <GrahaArtwork />
          </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#FAF7F0] px-5 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A17B42]">
              Discover Your Potential
            </p>

            <h2 className="mt-4 font-serif text-3xl font-normal text-[#64263B] md:text-5xl">
              Discover Your Strengths & Connections
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map(({ title, detail, icon: Icon }) => (
              <article
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-[#DCC9A8] bg-gradient-to-br from-white to-[#FFFAF0] p-5 shadow-[0_6px_20px_rgba(100,38,59,0.05)] sm:p-6"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#C5A15A]/40 bg-[#64263B] text-[#EAD8AD] shadow-sm">
                  <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
                </div>

                <div className="min-w-0"><h3 className="font-serif text-xl leading-snug text-[#64263B]">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#665B55]">
                  {detail}
                </p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FREE DISCOVERY */}
      <section
        id="free-discovery"
        className="scroll-mt-20 bg-[#F1E9DD] px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A17B42]">
              Complimentary Personal Discovery
            </p>

            <h2 className="mt-5 font-serif text-4xl font-normal text-[#64263B] md:text-5xl">
              What Will Your Free Numerology Reveal?
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#665B55]">
              Begin with your birth name, current name and date
              of birth. Jeevan Sutra uses defined numerological
              calculations to prepare your personalized
              introductory discovery.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Mulank — Birth Number',
                description:
                  'Explore traditional qualities associated with your reduced birth-day number.',
              },
              {
                number: '02',
                title: 'Bhagyank — Life Path Number',
                description:
                  'Discover your number calculated from your complete date of birth.',
              },
              {
                number: '03',
                title: 'Personal Lo Shu Grid',
                description:
                  'Explore number repetitions, missing numbers and important patterns.',
              },
              {
                number: '04',
                title: 'Birth Name Number',
                description:
                  'Discover the Chaldean number associated with your original birth name.',
              },
              {
                number: '05',
                title: 'Current Name Number',
                description:
                  'Compare traditional interpretations of your birth and current names.',
              },
              {
                number: '06',
                title: 'Strengths & Personal Insights',
                description:
                  'Explore strengths, development areas and reflective suggestions.',
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-[#E4D5C2] bg-[#FFFCF7] p-7 shadow-sm"
              >
                <span className="inline-flex size-16 items-center justify-center rounded-full border border-[#C5A15A]/30 bg-[#64263B] font-serif text-3xl text-[#EAD8AD] shadow-sm">
                  {item.number}
                </span>

                <h3 className="mt-4 font-serif text-2xl text-[#64263B]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-[#665B55]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          {/* LO SHU REFERENCE */}
          <div className="mt-12 grid items-center gap-10 rounded-3xl border border-[#E0CDAE] bg-white p-7 md:grid-cols-2 md:p-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#A17B42]">
                Traditional Numerology
              </p>

              <h3 className="mt-4 font-serif text-3xl text-[#64263B]">
                Your Personal Lo Shu Grid
              </h3>

              <p className="mt-5 leading-8 text-[#665B55]">
                The Lo Shu grid is a traditional numerical
                arrangement used in numerological interpretation.
              </p>

              <p className="mt-4 leading-8 text-[#665B55]">
                Your personal grid will be calculated from the
                non-zero digits of your date of birth, together
                with your final Mulank and Bhagyank.
              </p>

              <p className="mt-4 leading-8 text-[#665B55]">
                Present numbers, repetitions, missing numbers,
                rows, columns and Rajyog combinations are
                interpreted individually.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[350px]">
              <p className="mb-5 text-center font-serif text-xl text-[#64263B]">
                Standard Lo Shu Reference
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((n) => (
                  <div
                    key={n}
                    className="flex aspect-square items-center justify-center rounded-lg border border-[#C5A15A] bg-[#FAF3E8] font-serif text-4xl text-[#64263B]"
                  >
                    {n}
                  </div>
                ))}
              </div>

              <p className="mt-5 text-center text-sm leading-6 text-[#756C6E]">
                Reference grid only. Your personal grid will
                use your own calculated numbers.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/website/start"
              className="inline-flex items-center rounded-full bg-[#64263B] px-9 py-4 font-medium text-[#FAF0DE] hover:bg-[#4D1930]"
            >
              Discover Your Personality
              <span className="ml-3" aria-hidden="true">→</span>
            </Link>

            <p className="mt-4 text-sm text-[#665B55]">
              No birth time or place required for introductory numerology.
            </p>
          </div>
        </div>
      </section>

      <NameDiscoveryFeature showCorrection={false} />

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-[#FAF7F0] px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A17B42]">
              Simple Personal Discovery
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#64263B] md:text-5xl">
              How Jeevan Sutra Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Enter Your Details',
                description:
                  'Provide your birth name, current name and date of birth.',
              },
              {
                step: '02',
                title: 'Verify Your Account',
                description:
                  'Complete verification using an email OTP. Mobile verification is planned for a later release.',
              },
              {
                step: '03',
                title: 'Discover Your Numbers',
                description:
                  'Explore calculated numerology numbers, Lo Shu and personalized explanations.',
              },
              {
                step: '04',
                title: 'Explore Deeper Guidance',
                description:
                  'Discover optional insights, consultations and other services.',
              },
            ].map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-[#E6D8C7] bg-white p-7 text-center"
              >
                <div className="mx-auto flex h-15 w-15 items-center justify-center rounded-full bg-[#64263B] font-serif text-2xl text-[#EAD8AD]">
                  {item.step}
                </div>

                <h3 className="mt-6 font-serif text-2xl text-[#64263B]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-[#665B55]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM SERVICES */}
      <section
        id="services"
        className="scroll-mt-20 bg-[#FAF7F0] px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A17B42]">
              Beyond Your Free Discovery
            </p>

            <h2 className="mt-5 font-serif text-4xl text-[#64263B] md:text-5xl">
              Explore Premium Guidance
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#665B55]">
              Your free numerology discovery is just the
              beginning. Explore additional personalized
              services whenever you are ready.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="group flex flex-col rounded-3xl border border-[#E6D8C7] bg-gradient-to-br from-white to-[#FBF5E9] p-7 shadow-[0_8px_28px_rgba(100,38,59,0.05)] transition-shadow hover:shadow-[0_14px_36px_rgba(100,38,59,0.12)]"
              >
                <span className="inline-flex size-16 items-center justify-center rounded-full border border-[#C5A15A]/30 bg-[#64263B] font-serif text-3xl text-[#EAD8AD] shadow-sm">
                  {service.number}
                </span>

                <h3 className="mt-5 font-serif text-2xl text-[#64263B]">
                  {service.title}
                </h3>

                <p className="mt-4 flex-1 leading-8 text-[#665B55]">
                  {service.description}
                </p>

                <Link
                  href="/website/start"
                  className="mt-7 font-medium text-[#64263B] underline underline-offset-4"
                >
                  Register Your Interest
                </Link>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-[#756C6E]">
            Premium services are being developed.
            Availability, pricing and delivery will be
            confirmed before purchase.
          </p>
        </div>
      </section>

      {/* PRACTITIONER RECRUITMENT */}
      <section
        id="join-jeevan-sutra"
        className="scroll-mt-20 border-y border-[#D8B475]/40 bg-[#F1E9DD] px-5 py-16 md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#A17B42]">
                For Astrologers & Numerologists
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight text-[#64263B] md:text-5xl">
                Join Jeevan Sutra
              </h2>

              <p className="mt-5 font-serif text-2xl leading-9 text-[#64263B]">
                Bring your knowledge.
                <br />
                Build your practice. Reach more people.
              </p>

              <p className="mt-6 text-base leading-8 text-[#665B55]">
                Whether you have guided clients for years or are
                beginning your professional journey, explore a
                platform being built to help you understand clients
                better, deliver thoughtful guidance and create
                more opportunities to earn.
              </p>

              <Link
                href="/website/join"
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#64263B] px-8 py-4 font-medium text-[#FAF0DE] hover:bg-[#4D1930]"
              >
                Apply to Join — Free
                <span aria-hidden="true">→</span>
              </Link>
            <hr className="mt-5 border-0 border-t border-[#D8B475]/40" />

              <p className="mt-4 text-sm leading-7 text-[#665B55]">
                No registration or practitioner subscription fee.
                Continue your independent practice.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  number: '01',
                  title: 'A Fuller Understanding of Your Clients',
                  description:
                    'Organized client information, insights and consultation history to support better preparation and more personal guidance.',
                },
                {
                  number: '02',
                  title: 'Paid Consultation Opportunities',
                  description:
                    'Approved practitioners can be considered for assignments matched to their expertise, languages and availability.',
                },
                {
                  number: '03',
                  title: 'Experience and Emerging Talent Welcome',
                  description:
                    'We welcome established practitioners and promising beginners who can demonstrate knowledge, clear communication and responsible guidance.',
                },
              ].map((item) => (
                <article
                  key={item.number}
                  className="rounded-2xl border border-[#E4D5C2] bg-[#FFFCF7] p-6 sm:p-7"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-serif text-2xl text-[#B18A53]">
                      {item.number}
                    </span>

                    <div>
                      <h3 className="font-serif text-xl leading-7 text-[#64263B]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-[#665B55]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <p className="mt-8 text-sm leading-7 text-[#756C6E]">
            Applications are reviewed before approval. Assignments
            and earnings depend on suitability, customer demand,
            availability and agreed payment terms.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-20 bg-[#F1E9DD] px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-[#A17B42]">
            Our Vision
          </p>

          <h2 className="mt-5 font-serif text-4xl text-[#64263B] md:text-5xl">
            About Jeevan Sutra
          </h2>

          <p className="mt-8 text-lg leading-9 text-[#665B55]">
            Jeevan Sutra is an independent personal guidance
            platform bringing together traditional numerology,
            Vedic astrology, structured interpretation and
            modern technology.
          </p>

          <p className="mt-5 text-lg leading-9 text-[#665B55]">
            We aim to make personalized guidance more accessible
            through clear explanations, defined calculation
            methods, responsible interpretation and collaboration
            with experienced practitioners.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Personalized',
                description: 'Guidance based on individual information.',
              },
              {
                title: 'Structured',
                description: 'Defined methods and calculation checks.',
              },
              {
                title: 'Respectful',
                description: 'Privacy, personal beliefs and individual choice.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E4D5C2] bg-white p-7"
              >
                <h3 className="font-serif text-2xl text-[#64263B]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-[#665B55]">
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
        className="scroll-mt-20 bg-[#FFF9F0] px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A17B42]">
              Leadership
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#64263B] md:text-5xl">
              The People Behind Jeevan Sutra
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <article className="rounded-2xl border border-[#E8DCCD] bg-[#FAF7F0] p-8 md:p-10">
              <p className="text-xs uppercase tracking-widest text-[#A17B42]">
                Founder, Jeevan Sutra
              </p>

              <h3 className="mt-4 font-serif text-3xl text-[#64263B]">
                Shashank Shekhar
              </h3>

              <p className="mt-5 leading-8 text-[#665B55]">
                Leads the vision, research and technology
                development of Jeevan Sutra, including the
                study of global numerological traditions,
                selection of traditional Vedic astrology
                sources and development of structured
                digital guidance systems.
              </p>
            </article>

            <article className="rounded-2xl border border-[#E8DCCD] bg-[#FAF7F0] p-8 md:p-10">
              <p className="text-xs uppercase tracking-widest text-[#A17B42]">
                Principal Numerologist
              </p>

              <h3 className="mt-4 font-serif text-3xl text-[#64263B]">
                Pranita Ghode
              </h3>

              <p className="mt-2 font-medium text-[#A17B42]">
                Founder, The Swastik Indian Art
              </p>

              <p className="mt-5 leading-8 text-[#665B55]">
                Serves as Principal Numerologist of
                Jeevan Sutra and The Swastik Indian Art,
                contributing specialist numerology guidance
                and practitioner expertise.
              </p>
            </article>
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-center leading-8 text-[#665B55]">
            Jeevan Sutra is developing a collaborative
            network of numerologists, astrologers,
            artists and other specialist practitioners.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/website/join"
              className="inline-flex items-center gap-3 font-medium text-[#64263B] underline underline-offset-4"
            >
              Join Our Practitioner Network
              <span aria-hidden="true">→</span>
            </Link>
            <hr className="mt-5 border-0 border-t border-[#D8B475]/40" />
          </div>
        </div>
      </section>

      {/* FINAL CUSTOMER CTA */}
      <section className="bg-gradient-to-br from-[#64263B] to-[#3D1329] px-5 py-20 text-center text-[#FAF0DE] md:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#EAD8AD]">
            Your Discovery Begins Here
          </p>

          <h2 className="mt-6 font-serif text-3xl font-normal leading-tight md:text-5xl">
            Your journey begins with understanding yourself.
          </h2>

          <p lang="hi" className="mx-auto mt-5 max-w-3xl font-serif text-2xl leading-relaxed text-[#EAD8AD] md:text-3xl">
            खुद को समझने से शुरू होती है आपकी यात्रा।
          </p>

          <Link
            href="/website/start"
            className="mt-9 inline-flex items-center rounded-full bg-[#EAD8AD] px-9 py-4 font-medium text-[#64263B]"
          >
            Discover Your Personality
            <span className="ml-3" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-[#FAF7F0] px-5 py-10 md:px-10">
        <p className="mx-auto max-w-5xl text-center text-sm leading-7 text-[#756C6E]">
          Jeevan Sutra provides interpretive and reflective
          guidance based on traditional numerology and astrology.
          These services do not replace professional medical,
          legal, psychological or financial advice.
          Individual outcomes cannot be guaranteed.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E6D8C7] bg-[#FFF9F0] px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-serif text-2xl tracking-wide text-[#64263B]">
              JEEVAN SUTRA
            </p>

            <p className="mt-2 text-[10px] tracking-[0.15em] text-[#A17B42]">
              THE COMPLETE GUIDANCE EXPERIENCE
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-6 text-sm text-[#665B55]"
          >
            <Link href="/website">Home</Link>
            <a href="#about">About</a>
            <a href="#free-discovery">Free Discovery</a>
            <Link href="/website/services">Services</Link>
            <Link href="/website/compatibility">Compatibility</Link>
            <Link href="/website/start">Start with Email</Link>
            <Link href="/website/welcome">Sign in / My Profile</Link>
            <Link
              href="/website/join"
              className="font-medium text-[#64263B]"
            >
              Join Jeevan Sutra
            </Link>
            <hr className="mt-5 border-0 border-t border-[#D8B475]/40" />
          </nav>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-[#E6D8C7] pt-6 text-center text-sm text-[#756C6E]">
          © {new Date().getFullYear()} Jeevan Sutra.
          All rights reserved.
        </div>
      </footer>
    </main>
  )
}
