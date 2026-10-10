
import Link from 'next/link'

/* ==========================================
   JEEVAN SUTRA — HOMEPAGE
   PART 1 OF 2

   File: app/website/page.tsx
   Branch: website-development
========================================== */

const benefits = [
  {
    symbol: '✦',
    title: 'Personal Strengths',
    detail:
      'Explore the qualities associated with your numbers.',
  },
  {
    symbol: '◇',
    title: 'Career Guidance',
    detail:
      'Reflect on professional direction and working style.',
  },
  {
    symbol: '♡',
    title: 'Relationships',
    detail:
      'Explore traditional patterns of connection and communication.',
  },
  {
    symbol: '◎',
    title: 'Money & Opportunities',
    detail:
      'Consider numerological themes around planning and opportunity.',
  },
  {
    symbol: '❋',
    title: 'Personal Growth',
    detail:
      'Build greater self-awareness through guided reflection.',
  },
]

const services = [
  {
    number: '01',
    title: 'Detailed Numerology Reports',
    description:
      'Personalized analysis of your Mulank, Bhagyank, Lo Shu grid, Graha associations and name numbers.',
  },
  {
    number: '02',
    title: 'Birth Name & Current Name Analysis',
    description:
      'Explore Chaldean name numbers and traditional interpretations of different name spellings.',
  },
  {
    number: '03',
    title: 'Career & Professional Direction',
    description:
      'Reflect on your strengths, working preferences and career-related numerology themes.',
  },
  {
    number: '04',
    title: 'Relationships & Family Guidance',
    description:
      'Explore personal communication, relationships and family dynamics through a structured framework.',
  },
  {
    number: '05',
    title: 'Premium Life Path & Vedic Astrology',
    description:
      'In-depth guidance with optional birth-chart analysis when accurate birth time and place are available.',
  },
  {
    number: '06',
    title: 'Grahapurti Yantram & Personalized Art',
    description:
      'Mathematical yantras and individually developed traditional artwork with specialist artists.',
  },
]

/*
  NINE-GRAHA POSITIONS

  Earth centre: (300, 300)

  Rahu: (134, 466)
  Ketu: (466, 134)

  Their midpoint is (300, 300).
  They are diametrically opposite and
  equidistant from the centre.

  This is a static symbolic numerology
  illustration, not an astronomical chart.
*/

const grahas = [
  {
    n: 1,
    hindi: 'सूर्य',
    english: 'Surya',
    x: 300,
    y: 65,
    fill: '#F6B93F',
  },
  {
    n: 2,
    hindi: 'चंद्र',
    english: 'Chandra',
    x: 134,
    y: 134,
    fill: '#C5D0D6',
  },
  {
    n: 3,
    hindi: 'गुरु',
    english: 'Guru',
    x: 65,
    y: 300,
    fill: '#CFA66C',
  },
  {
    n: 4,
    hindi: 'राहु',
    english: 'Rahu',
    x: 134,
    y: 466,
    fill: '#8A8E9E',
  },
  {
    n: 5,
    hindi: 'बुध',
    english: 'Budh',
    x: 220,
    y: 530,
    fill: '#90AE87',
  },
  {
    n: 6,
    hindi: 'शुक्र',
    english: 'Shukra',
    x: 380,
    y: 530,
    fill: '#E0B9A5',
  },
  {
    n: 7,
    hindi: 'केतु',
    english: 'Ketu',
    x: 466,
    y: 134,
    fill: '#9A899B',
  },
  {
    n: 8,
    hindi: 'शनि',
    english: 'Shani',
    x: 535,
    y: 300,
    fill: '#B8A16B',
  },
  {
    n: 9,
    hindi: 'मंगल',
    english: 'Mangal',
    x: 466,
    y: 466,
    fill: '#C97456',
  },
]

/* ==========================================
   STATIC NINE-GRAHA ARTWORK
========================================== */

function GrahaArtwork() {
  return (
    <svg
      viewBox="0 0 600 640"
      className="h-auto w-full"
      role="img"
      aria-label="Nine numbered Grahas surrounding Earth, with Rahu and Ketu opposite each other"
    >
      <defs>
        <radialGradient id="js-earth">
          <stop stopColor="#7EC1C2" />
          <stop
            offset="0.55"
            stopColor="#347B9B"
          />
          <stop
            offset="1"
            stopColor="#123754"
          />
        </radialGradient>

        <radialGradient id="js-sun">
          <stop stopColor="#FFF5B7" />
          <stop
            offset="0.6"
            stopColor="#FFC44F"
          />
          <stop
            offset="1"
            stopColor="#BD621C"
          />
        </radialGradient>

        <radialGradient id="js-bg">
          <stop stopColor="#873B42" />
          <stop
            offset="1"
            stopColor="#3C1024"
          />
        </radialGradient>
      </defs>

      {/* Background */}
      <circle
        cx="300"
        cy="300"
        r="285"
        fill="url(#js-bg)"
        stroke="#C5A15A"
        strokeOpacity="0.6"
      />

      {/* Circular gold rings */}
      {[110, 154, 190, 228, 265].map((r) => (
        <circle
          key={r}
          cx="300"
          cy="300"
          r={r}
          fill="none"
          stroke="#D8B475"
          strokeWidth={r === 228 ? 1.7 : 0.8}
          strokeOpacity={r === 228 ? 0.75 : 0.35}
        />
      ))}

      {/* Decorative radial lines */}
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i * Math.PI) / 18

        return (
          <line
            key={i}
            x1={300 + 272 * Math.cos(angle)}
            y1={300 + 272 * Math.sin(angle)}
            x2={300 + 281 * Math.cos(angle)}
            y2={300 + 281 * Math.sin(angle)}
            stroke="#D8B475"
            strokeOpacity="0.65"
          />
        )
      })}

      {/* Rahu-Ketu opposite axis */}
      <line
        x1="134"
        y1="466"
        x2="466"
        y2="134"
        stroke="#D5B277"
        strokeWidth="1.5"
        strokeDasharray="5 7"
        strokeOpacity="0.6"
      />

      {/* Earth halo */}
      <circle
        cx="300"
        cy="300"
        r="88"
        fill="#D9AD5E"
        opacity="0.13"
      />

      {/* Earth */}
      <circle
        cx="300"
        cy="300"
        r="73"
        fill="url(#js-earth)"
        stroke="#D7BA84"
        strokeWidth="2"
      />

      {/* Decorative continents */}
      <path
        d="M274 241q25 4 20 24l25 10-9 19-17 4-12 24-20-12 4-20-17-17 13-16zM324 308l19-5 17 14-9 23-15 7-10-15z"
        fill="#9BBE8E"
        opacity="0.75"
      />

      <text
        x="300"
        y="393"
        textAnchor="middle"
        fill="#F6E3B6"
        fontSize="15"
        letterSpacing="3"
      >
        EARTH
      </text>

      {/* Nine numbered Grahas */}
      {grahas.map((graha) => (
        <g key={graha.n}>
          <circle
            cx={graha.x}
            cy={graha.y}
            r="30"
            fill="#3A1527"
            stroke="#E2C58D"
            strokeWidth="1.5"
          />

          <circle
            cx={graha.x}
            cy={graha.y}
            r="21"
            fill={
              graha.n === 1
                ? 'url(#js-sun)'
                : graha.fill
            }
          />

          <text
            x={graha.x}
            y={graha.y + 5}
            textAnchor="middle"
            fontWeight="bold"
            fontSize="17"
            fill="#251322"
          >
            {graha.n}
          </text>

          <text
            x={graha.x}
            y={graha.y + 44}
            textAnchor="middle"
            fill="#FFF3DC"
            fontSize="14"
            fontWeight="600"
          >
            {graha.hindi}
          </text>

          <text
            x={graha.x}
            y={graha.y + 60}
            textAnchor="middle"
            fill="#F0D29B"
            fontSize="12"
          >
            {graha.english}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ==========================================
   JEEVAN SUTRA BRAND
========================================== */

function Brand() {
  return (
    <Link
      href="/website"
      className="flex min-w-0 items-center gap-2 sm:gap-3"
      aria-label="Jeevan Sutra homepage"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D8B475] font-serif text-xl text-[#EAD8AD] sm:h-14 sm:w-14">
        JS
      </span>

      <span className="flex min-w-0 flex-col">
        <span className="whitespace-nowrap font-serif text-[17px] font-semibold tracking-[0.06em] text-[#F5E2BA] sm:text-2xl">
          JEEVAN SUTRA
        </span>

        <span className="mt-1 text-[7px] tracking-[0.06em] text-[#EAD8AD] sm:text-[10px] sm:tracking-[0.15em]">
          THE COMPLETE GUIDANCE EXPERIENCE
        </span>
      </span>
    </Link>
  )
}

/* ==========================================
   HOMEPAGE COMPONENT
========================================== */

export default function JeevanSutraHomePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#42353A]">

      {/* HEADER — VALID MOBILE MENU */}
      <header className="relative z-20 border-b border-[#C5A15A]/40 bg-[#64263B]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">

          <details className="group">

            {/* Summary must be first child */}
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-4 [&::-webkit-details-marker]:hidden">

              {/* Brand presentation */}
              <span className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D8B475] font-serif text-xl text-[#EAD8AD] sm:h-14 sm:w-14">
                  JS
                </span>

                <span className="flex min-w-0 flex-col">
                  <span className="whitespace-nowrap font-serif text-[17px] font-semibold tracking-[0.06em] text-[#F5E2BA] sm:text-2xl">
                    JEEVAN SUTRA
                  </span>

                  <span className="mt-1 text-[7px] tracking-[0.06em] text-[#EAD8AD] sm:text-[10px] sm:tracking-[0.15em]">
                    THE COMPLETE GUIDANCE EXPERIENCE
                  </span>
                </span>
              </span>

              {/* Menu icon */}
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C5A15A]/60 text-[#EAD8AD]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </span>

            </summary>

            {/* Menu expands below header */}
            <nav
              aria-label="Main navigation"
              className="border-t border-[#C5A15A]/30 pb-5 pt-3"
            >
              <div className="grid gap-1 sm:grid-cols-3">
                {[
                  ['Home', '/website'],
                  ['About', '#about'],
                  ['Free Discovery', '#free-discovery'],
                  ['How It Works', '#how-it-works'],
                  ['Services', '#services'],
                  ['Leadership', '#leadership'],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-[#FAF1E1] hover:bg-white/10"
                  >
                    {label}
                  </a>
                ))}

                <Link
                  href="/website/register"
                  className="mt-2 block rounded-lg bg-[#EAD8AD] px-4 py-3 text-center text-sm font-bold text-[#64263B]"
                >
                  Register
                </Link>
              </div>
            </nav>

          </details>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#64263B] via-[#5A2037] to-[#320C1D] text-white">

        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full border border-[#C5A15A]/20" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-12 md:grid-cols-2 md:gap-8 md:px-10 md:py-20">

          {/* English headline */}
          <div className="relative z-10 min-w-0">

            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#EAD8AD] sm:text-xs sm:tracking-[0.22em]">
              Your Personal Numerology Journey
            </p>

            <h1 className="font-serif text-[clamp(1.95rem,7.5vw,3.2rem)] font-semibold leading-[1.16] tracking-tight text-[#FFF8EB] md:text-[clamp(2.7rem,4vw,4rem)]">
              <span className="block">
                Your Name.
              </span>

              <span className="block">
                Your Date of Birth.
              </span>

              <span className="block">
                Your Personal Discovery.
              </span>
            </h1>

            <div className="my-7 h-px w-28 bg-[#C5A15A]" />

            {/* Hindi headline */}
            <div
              lang="hi"
              className="font-serif text-[clamp(1.65rem,6vw,2.5rem)] font-medium leading-[1.6] text-[#F2D9A9] md:text-[clamp(2rem,3vw,3rem)]"
            >
              <p>आपका नाम।</p>
              <p>आपकी जन्म तिथि।</p>
              <p>आपकी व्यक्तिगत खोज।</p>
            </div>

            {/* Hero description */}
            <p className="mt-7 max-w-xl text-base leading-8 text-[#F2E5E5]">
              Discover your personal numbers, explore
              your strengths and begin a thoughtful
              journey through traditional numerology.
              Your name and date of birth are enough
              to get started.
            </p>

            {/* Hero buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/website/register"
                className="inline-flex items-center justify-center rounded-full bg-[#EAD8AD] px-6 py-4 text-center font-bold text-[#64263B] shadow-lg transition hover:bg-[#FFF0CA]"
              >
                Discover My Numbers — Free
                <span className="ml-2">
                  →
                </span>
              </Link>

              <a
                href="#free-discovery"
                className="inline-flex items-center justify-center rounded-full border border-[#D7B57B] px-6 py-4 text-center font-medium text-[#FAF1E1] hover:bg-white/10"
              >
                What Will I Discover?
              </a>

            </div>

            {/* Trust line */}
            <p className="mt-6 text-sm leading-7 text-[#EAD8AD]">
              ✓ No birth time required
              <span className="mx-2">•</span>
              ✓ Free personal discovery
            </p>

          </div>

          {/* Graha illustration */}
          <div className="relative mx-auto w-full max-w-[600px]">
            <GrahaArtwork />

            <p className="mt-1 text-center text-xs text-[#EAD8AD]/80">
              Nine Grahas • Traditional numerology
              associations • Symbolic illustration
            </p>
          </div>

        </div>
      </section>

      {/* PART 2 CONTINUES HERE */}

      {/* BENEFITS */}
      <section className="bg-[#FAF7F0] px-5 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A17B42]">
              Discover Your Potential
            </p>

            <h2 className="mt-4 font-serif text-3xl font-bold text-[#64263B] md:text-5xl">
              Explore Different Aspects of Your Life
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#E7D8C4] bg-white px-5 py-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D8B475] bg-[#FAF3E8] font-serif text-4xl text-[#9E753E]">
                  {item.symbol}
                </div>

                <h3 className="mt-5 font-serif text-xl font-bold text-[#64263B]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#665B55]">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FREE NUMEROLOGY DISCOVERY */}
      <section
        id="free-discovery"
        className="scroll-mt-20 bg-[#F1E9DD] px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A17B42]">
              Complimentary Personal Discovery
            </p>

            <h2 className="mt-5 font-serif text-4xl font-bold text-[#64263B] md:text-5xl">
              What Will Your Free Numerology Reveal?
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#665B55]">
              Begin with your birth name, current name
              and date of birth. Jeevan Sutra uses
              defined numerological calculations to
              prepare your personalized introductory
              discovery.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Mulank — Birth Number',
                description:
                  'Explore the traditional qualities associated with your reduced birth-day number.',
              },
              {
                number: '02',
                title: 'Bhagyank — Life Path Number',
                description:
                  'Discover your numerological number calculated from your complete date of birth.',
              },
              {
                number: '03',
                title: 'Personal Lo Shu Grid',
                description:
                  'Explore number repetitions, missing numbers and important patterns in your individual grid.',
              },
              {
                number: '04',
                title: 'Birth Name Number',
                description:
                  'Discover the Chaldean numerology number associated with your original birth name.',
              },
              {
                number: '05',
                title: 'Current Name Number',
                description:
                  'Compare the traditional numerical interpretations of your birth name and current name.',
              },
              {
                number: '06',
                title: 'Strengths & Personal Insights',
                description:
                  'Explore strengths, potential development areas and practical reflective suggestions.',
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-[#E4D5C2] bg-[#FFFCF7] p-7 shadow-sm"
              >
                <span className="font-serif text-3xl font-bold text-[#B18A53]">
                  {item.number}
                </span>

                <h3 className="mt-4 font-serif text-2xl font-bold text-[#64263B]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-[#665B55]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          {/* LO SHU REFERENCE */}
          <div className="mt-12 grid items-center gap-10 rounded-3xl border border-[#E0CDAE] bg-white p-7 shadow-sm md:grid-cols-2 md:p-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A17B42]">
                Traditional Numerology
              </p>

              <h3 className="mt-4 font-serif text-3xl font-bold text-[#64263B]">
                Your Personal Lo Shu Grid
              </h3>

              <p className="mt-5 leading-8 text-[#665B55]">
                The Lo Shu grid is a traditional
                numerical arrangement used in
                numerological interpretation.
              </p>

              <p className="mt-4 leading-8 text-[#665B55]">
                Your personal grid will be calculated
                from the non-zero digits of your date
                of birth, together with your final
                Mulank and Bhagyank.
              </p>

              <p className="mt-4 leading-8 text-[#665B55]">
                Present numbers, repetitions, missing
                numbers, rows, columns and traditional
                Rajyog combinations are interpreted
                individually.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[350px]">
              <p className="mb-5 text-center font-serif text-xl font-bold text-[#64263B]">
                Standard Lo Shu Reference
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[4, 9, 2, 3, 5, 7, 8, 1, 6].map(
                  (number) => (
                    <div
                      key={number}
                      className="flex aspect-square items-center justify-center rounded-lg border border-[#C5A15A] bg-[#FAF3E8] font-serif text-4xl font-bold text-[#64263B]"
                    >
                      {number}
                    </div>
                  )
                )}
              </div>

              <p className="mt-5 text-center text-sm leading-6 text-[#756C6E]">
                Reference grid only. Your personalized
                grid will contain numbers calculated
                from your own information.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/website/register"
              className="inline-flex items-center justify-center rounded-full bg-[#64263B] px-9 py-4 font-bold text-white transition hover:bg-[#4D1930]"
            >
              Discover My Numbers — Free
              <span className="ml-3">→</span>
            </Link>

            <p className="mt-4 text-sm text-[#665B55]">
              No birth time or birth place required
              for your initial numerology discovery.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-[#FAF7F0] px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A17B42]">
              Simple Personal Discovery
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold text-[#64263B] md:text-5xl">
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
                  'Complete verification using your selected email or mobile OTP method.',
              },
              {
                step: '03',
                title: 'Discover Your Numbers',
                description:
                  'Explore your calculated numerology numbers, Lo Shu grid and personalized explanations.',
              },
              {
                step: '04',
                title: 'Explore Deeper Guidance',
                description:
                  'Discover optional reports, consultations and other services relevant to your interests.',
              },
            ].map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-[#E6D8C7] bg-white p-7 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#64263B] font-serif text-2xl font-bold text-[#EAD8AD]">
                  {item.step}
                </div>

                <h3 className="mt-6 font-serif text-2xl font-bold text-[#64263B]">
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

      {/* NAME DISCOVERY */}
      <section className="bg-[#64263B] px-5 py-20 text-white md:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#EAD8AD]">
              The Power of a Name
            </p>

            <h2 className="mt-5 font-serif text-4xl font-bold leading-tight md:text-5xl">
              Why Do Some Celebrities Change Their Names?
            </h2>

            <p className="mt-6 text-lg leading-9 text-[#F1E1D8]">
              Names and spelling changes have long
              attracted interest in numerology.
              Jeevan Sutra helps you explore the
              traditional number associations of
              your birth name and current name.
            </p>

            <p className="mt-5 leading-8 text-[#EAD8AD]">
              A name number is a traditional
              interpretation, not a guarantee of
              success or a prediction of an outcome.
            </p>
          </div>

          <div className="rounded-3xl border border-[#D8B475]/50 bg-[#FFF9EF] p-8 text-[#64263B] shadow-xl md:p-12">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#C5A15A] font-serif text-4xl font-bold">
                5
              </div>

              <h3 className="mt-6 font-serif text-3xl font-bold">
                Your Name Has a Number
              </h3>

              <p className="mt-5 leading-8 text-[#665B55]">
                Discover how the Chaldean system
                assigns numerical values to letters
                and how different names can produce
                different results.
              </p>

              <div className="mt-8 border-t border-[#E4D4BD] pt-7">
                <Link
                  href="/website/register"
                  className="inline-block rounded-full bg-[#64263B] px-7 py-4 font-bold text-white"
                >
                  Explore My Name Number
                </Link>
              </div>
            </div>
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
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A17B42]">
              Beyond Your Free Discovery
            </p>

            <h2 className="mt-5 font-serif text-4xl font-bold text-[#64263B] md:text-5xl">
              Explore Premium Guidance
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#665B55]">
              Your free numerology discovery is just
              the beginning. Explore additional
              personalized services whenever you
              are ready.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="flex flex-col rounded-2xl border border-[#E6D8C7] bg-white p-8 shadow-sm"
              >
                <span className="font-serif text-3xl font-bold text-[#B18A53]">
                  {service.number}
                </span>

                <h3 className="mt-5 font-serif text-2xl font-bold text-[#64263B]">
                  {service.title}
                </h3>

                <p className="mt-4 flex-1 leading-8 text-[#665B55]">
                  {service.description}
                </p>

                <Link
                  href="/website/register"
                  className="mt-7 inline-block font-semibold text-[#64263B] underline underline-offset-4"
                >
                  Register Your Interest
                </Link>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-[#756C6E]">
            Premium services are being developed.
            Availability, pricing and delivery will
            be confirmed before purchase.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-20 bg-[#F1E9DD] px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A17B42]">
            Our Vision
          </p>

          <h2 className="mt-5 font-serif text-4xl font-bold text-[#64263B] md:text-5xl">
            About Jeevan Sutra
          </h2>

          <p className="mt-8 text-lg leading-9 text-[#665B55]">
            Jeevan Sutra is an independent personal
            guidance platform bringing together
            traditional numerology, Vedic astrology,
            structured interpretation and modern
            technology.
          </p>

          <p className="mt-5 text-lg leading-9 text-[#665B55]">
            We aim to make personalized guidance
            more accessible through clear explanations,
            defined calculation methods, responsible
            interpretation and collaboration with
            experienced practitioners.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Personalized',
                description:
                  'Guidance based on individual information.',
              },
              {
                title: 'Structured',
                description:
                  'Defined methods and calculation checks.',
              },
              {
                title: 'Respectful',
                description:
                  'Privacy, personal beliefs and individual choice.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E4D5C2] bg-white p-7"
              >
                <h3 className="font-serif text-2xl font-bold text-[#64263B]">
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
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A17B42]">
              Leadership
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold text-[#64263B] md:text-5xl">
              The People Behind Jeevan Sutra
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <article className="rounded-2xl border border-[#E8DCCD] bg-[#FAF7F0] p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#A17B42]">
                Founder, Jeevan Sutra
              </p>

              <h3 className="mt-4 font-serif text-3xl font-bold text-[#64263B]">
                Shashank Shekhar
              </h3>

              <p className="mt-5 leading-8 text-[#665B55]">
                Leads the vision, research and
                technology development of Jeevan Sutra,
                including the study of global
                numerological traditions, selection
                of traditional Vedic astrology sources
                and development of structured digital
                guidance systems.
              </p>
            </article>

            <article className="rounded-2xl border border-[#E8DCCD] bg-[#FAF7F0] p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#A17B42]">
                Principal Numerologist
              </p>

              <h3 className="mt-4 font-serif text-3xl font-bold text-[#64263B]">
                Pranita Ghode
              </h3>

              <p className="mt-2 font-semibold text-[#A17B42]">
                Founder, The Swastik Indian Art
              </p>

              <p className="mt-5 leading-8 text-[#665B55]">
                Serves as Principal Numerologist of
                Jeevan Sutra and The Swastik Indian Art,
                contributing specialist numerology
                guidance and practitioner expertise.
              </p>
            </article>
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-center leading-8 text-[#665B55]">
            Jeevan Sutra is developing a collaborative
            network of numerologists, astrologers,
            artists and other specialist practitioners.
          </p>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-gradient-to-br from-[#64263B] to-[#3D1329] px-5 py-20 text-center text-white md:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#EAD8AD]">
            Your Discovery Begins Here
          </p>

          <h2 className="mt-6 font-serif text-4xl font-bold leading-tight md:text-5xl">
            Every Name Has a Number.
            <span className="mt-3 block text-[#EAD8AD]">
              Every Journey Has a Beginning.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-[#F1E1D8]">
            Begin exploring your personal numerology
            through your name and date of birth.
          </p>

          <Link
            href="/website/register"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-[#EAD8AD] px-9 py-4 font-bold text-[#64263B] transition hover:bg-[#FFF0CA]"
          >
            Discover My Numbers — Free
            <span className="ml-3">→</span>
          </Link>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-[#FAF7F0] px-5 py-10 md:px-10">
        <p className="mx-auto max-w-5xl text-center text-sm leading-7 text-[#756C6E]">
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
      <footer className="border-t border-[#E6D8C7] bg-[#FFF9F0] px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-serif text-2xl font-bold tracking-wide text-[#64263B]">
              JEEVAN SUTRA
            </p>

            <p className="mt-2 text-[10px] font-semibold tracking-[0.15em] text-[#A17B42]">
              THE COMPLETE GUIDANCE EXPERIENCE
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-6 text-sm font-medium text-[#665B55]"
          >
            <Link href="/website">Home</Link>
            <a href="#about">About</a>
            <a href="#free-discovery">Free Discovery</a>
            <a href="#services">Services</a>
            <Link href="/website/register">Register</Link>
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
