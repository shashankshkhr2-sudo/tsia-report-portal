
import Link from 'next/link'

/*
  JEEVAN SUTRA — APPROVED HOMEPAGE
  File: app/website/page.tsx
  Branch: website-development

  PART 1 OF 2

  Locked design:
  - Sober burgundy, ivory and muted gold
  - India-facing Earth
  - Nine numbered Navgrahas
  - Rahu and Ketu as Chhaya Grahas
  - Responsive mobile and desktop
*/

const benefits = [
  {
    symbol: '✦',
    title: 'Personal Strengths',
    detail: 'Explore the qualities associated with your numbers.',
  },
  {
    symbol: '◇',
    title: 'Career Guidance',
    detail: 'Reflect on professional direction and working style.',
  },
  {
    symbol: '♡',
    title: 'Relationships',
    detail: 'Explore patterns of connection and communication.',
  },
  {
    symbol: '◎',
    title: 'Money & Opportunities',
    detail: 'Consider traditional themes around planning and opportunity.',
  },
  {
    symbol: '❋',
    title: 'Personal Growth',
    detail: 'Build greater self-awareness through guided reflection.',
  },
]

const services = [
  {
    number: '01',
    title: 'Detailed Numerology Reports',
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

const grahas = [
  { n: 1, hindi: 'सूर्य', english: 'Surya', x: 300, y: 66, tone: '#D9AA6D' },
  { n: 2, hindi: 'चंद्र', english: 'Chandra', x: 135, y: 135, tone: '#C7C9C9' },
  { n: 3, hindi: 'गुरु', english: 'Guru', x: 66, y: 300, tone: '#C6A47E' },
  {
    n: 4,
    hindi: 'राहु',
    english: 'Rahu',
    x: 135,
    y: 465,
    tone: '#998C9B',
    shadow: true,
    glyph: '☊',
  },
  { n: 5, hindi: 'बुध', english: 'Budh', x: 220, y: 530, tone: '#90AAA0' },
  { n: 6, hindi: 'शुक्र', english: 'Shukra', x: 380, y: 530, tone: '#D5B9A4' },
  {
    n: 7,
    hindi: 'केतु',
    english: 'Ketu',
    x: 465,
    y: 135,
    tone: '#998C9B',
    shadow: true,
    glyph: '☋',
  },
  { n: 8, hindi: 'शनि', english: 'Shani', x: 534, y: 300, tone: '#AFA08B' },
  { n: 9, hindi: 'मंगल', english: 'Mangal', x: 465, y: 465, tone: '#B8796C' },
]

function GrahaArtwork() {
  return (
    <div className="w-full">
      <svg
        viewBox="0 0 600 640"
        className="h-auto w-full"
        role="img"
        aria-labelledby="js-graha-title js-graha-desc"
      >
        <title id="js-graha-title">
          Jeevan Sutra Navgraha Illustration
        </title>
        <desc id="js-graha-desc">
          India-facing Earth surrounded by nine numbered Grahas.
          Rahu and Ketu are distinct shadow Grahas positioned opposite
          each other.
        </desc>

        <defs>
          <radialGradient id="js-soft-sphere" cx="30%" cy="25%" r="80%">
            <stop stopColor="#F4E1BE" />
            <stop offset="0.35" stopColor="#CBB49B" />
            <stop offset="0.8" stopColor="#8C7774" />
            <stop offset="1" stopColor="#493846" />
          </radialGradient>

          <radialGradient id="js-soft-sun">
            <stop stopColor="#FFF3D2" />
            <stop offset="0.5" stopColor="#E5BD7C" />
            <stop offset="1" stopColor="#AE754B" />
          </radialGradient>

          <radialGradient id="js-earth-fallback">
            <stop stopColor="#74B2C3" />
            <stop offset="1" stopColor="#173D5A" />
          </radialGradient>

          <clipPath id="js-earth-clip">
            <circle cx="300" cy="300" r="102" />
          </clipPath>
        </defs>

        {/* Quiet orbital geometry */}
        {[144, 174, 204, 242, 272].map((r) => (
          <circle
            key={r}
            cx="300"
            cy="300"
            r={r}
            fill="none"
            stroke="#C5A15A"
            strokeWidth={r === 204 ? 1.15 : 0.8}
            opacity={r === 204 ? 0.48 : 0.24}
          />
        ))}

        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * Math.PI) / 12
          return (
            <line
              key={i}
              x1={300 + 276 * Math.cos(a)}
              y1={300 + 276 * Math.sin(a)}
              x2={300 + 282 * Math.cos(a)}
              y2={300 + 282 * Math.sin(a)}
              stroke="#D8B475"
              strokeWidth="1"
              opacity="0.35"
            />
          )
        })}

        {/* Exact Rahu-Ketu opposite axis */}
        <line
          x1="135"
          y1="465"
          x2="465"
          y2="135"
          stroke="#D8B475"
          strokeWidth="1"
          strokeDasharray="4 7"
          opacity="0.4"
        />

        {/* Earth frame */}
        <circle
          cx="300"
          cy="300"
          r="113"
          fill="none"
          stroke="#D8B475"
          strokeWidth="1.3"
          opacity="0.55"
        />

        <circle
          cx="300"
          cy="300"
          r="102"
          fill="url(#js-earth-fallback)"
        />

        {/*
          Real India-facing Earth asset.
          Upload to public/images/earth-india.png.
        */}
        <image
          href="/images/earth-india.png"
          x="198"
          y="198"
          width="204"
          height="204"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#js-earth-clip)"
        />

        <circle
          cx="300"
          cy="300"
          r="102"
          fill="none"
          stroke="#E5CCA0"
          strokeWidth="1.5"
          opacity="0.7"
        />

        <text
          x="300"
          y="425"
          textAnchor="middle"
          fontSize="12"
          letterSpacing="3"
          fill="#EAD8AD"
        >
          EARTH
        </text>

        {/* Seven celestial Grahas + two Chhaya Grahas */}
        {grahas.map((g) => (
          <g key={g.n}>
            <circle
              cx={g.x}
              cy={g.y}
              r="33"
              fill="#482032"
              stroke="#D4B580"
              strokeWidth="1.15"
            />

            {'shadow' in g && g.shadow ? (
              <>
                <circle
                  cx={g.x}
                  cy={g.y}
                  r="25"
                  fill="#5B4A5A"
                  fillOpacity="0.35"
                  stroke="#E0C99E"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                />
                <text
                  x={g.x}
                  y={g.y - 4}
                  textAnchor="middle"
                  fontSize="21"
                  fill="#EAD8AD"
                >
                  {g.glyph}
                </text>
                <text
                  x={g.x}
                  y={g.y + 19}
                  textAnchor="middle"
                  fontSize="19"
                  fontFamily="serif"
                  fill="#FFF2D9"
                >
                  {g.n}
                </text>
              </>
            ) : (
              <>
                <circle
                  cx={g.x}
                  cy={g.y}
                  r="25"
                  fill={
                    g.n === 1
                      ? 'url(#js-soft-sun)'
                      : 'url(#js-soft-sphere)'
                  }
                />
                <circle
                  cx={g.x}
                  cy={g.y}
                  r="25"
                  fill={g.tone}
                  opacity="0.28"
                />
                {g.n === 8 && (
                  <ellipse
                    cx={g.x}
                    cy={g.y}
                    rx="36"
                    ry="12"
                    transform={`rotate(-24 ${g.x} ${g.y})`}
                    fill="none"
                    stroke="#E0C99E"
                    strokeWidth="2.5"
                    opacity="0.8"
                  />
                )}
                <text
                  x={g.x}
                  y={g.y + 8}
                  textAnchor="middle"
                  fontSize="24"
                  fontFamily="serif"
                  fill="#382434"
                >
                  {g.n}
                </text>
              </>
            )}

            <text
              x={g.x}
              y={g.y + 47}
              textAnchor="middle"
              fontSize="14"
              fill="#F4E5CD"
            >
              {g.hindi}
            </text>
            <text
              x={g.x}
              y={g.y + 63}
              textAnchor="middle"
              fontSize="12"
              fill="#E1C79F"
            >
              {g.english}
            </text>

            {'shadow' in g && g.shadow && (
              <text
                x={g.x}
                y={g.y + 77}
                textAnchor="middle"
                fontSize="10"
                fill="#E1C79F"
              >
                Chhaya Graha
              </text>
            )}
          </g>
        ))}
      </svg>

      <p className="mx-auto max-w-md px-4 text-center text-xs leading-6 text-[#EAD8AD]">
        Rahu (4) and Ketu (7) are Chhaya Grahas —
        lunar nodes, not physical planets.
      </p>
    </div>
  )
}

function Brand() {
  return (
    <Link
      href="/website"
      aria-label="Jeevan Sutra homepage"
      className="flex min-w-0 items-center gap-3"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D8B475] font-serif text-xl text-[#EAD8AD] sm:h-13 sm:w-13">
        JS
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap font-serif text-[17px] tracking-[0.04em] text-[#F5E2BA] sm:text-2xl">
          JEEVAN SUTRA
        </span>
        <span className="mt-1 block text-[7px] tracking-[0.06em] text-[#EAD8AD] sm:text-[10px]">
          THE COMPLETE GUIDANCE EXPERIENCE
        </span>
      </span>
    </Link>
  )
}

const navigation = [
  ['Home', '/website'],
  ['About', '#about'],
  ['Free Discovery', '#free-discovery'],
  ['How It Works', '#how-it-works'],
  ['Services', '#services'],
  ['Leadership', '#leadership'],
]

export default function JeevanSutraHomePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#42353A]">
      {/* HEADER */}
      <header className="relative z-20 border-b border-[#C5A15A]/30 bg-[#64263B]">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="hidden items-center justify-between gap-5 py-5 lg:flex">
            <Brand />
            <nav className="flex items-center gap-5">
              {navigation.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-[#F4E7D7] hover:text-[#EAD8AD]"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/website/register"
                className="rounded-full bg-[#EAD8AD] px-6 py-3 text-sm font-medium text-[#64263B]"
              >
                Register
              </Link>
            </nav>
          </div>

          {/* Mobile menu expands naturally */}
          <details className="group lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8B475] font-serif text-xl text-[#EAD8AD]">
                  JS
                </span>
                <span className="min-w-0">
                  <span className="block whitespace-nowrap font-serif text-[17px] text-[#F5E2BA]">
                    JEEVAN SUTRA
                  </span>
                  <span className="block text-[7px] tracking-[0.05em] text-[#EAD8AD]">
                    THE COMPLETE GUIDANCE EXPERIENCE
                  </span>
                </span>
              </span>
              <span className="rounded-full border border-[#C5A15A]/60 p-3 text-[#EAD8AD]">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </span>
            </summary>

            <nav
              aria-label="Mobile navigation"
              className="grid gap-1 border-t border-[#C5A15A]/30 pb-5 pt-3"
            >
              {navigation.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="rounded-lg px-4 py-3 text-sm text-[#F4E7D7] hover:bg-white/10"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/website/register"
                className="mt-2 rounded-lg bg-[#EAD8AD] px-4 py-3 text-center text-sm font-medium text-[#64263B]"
              >
                Register
              </Link>
            </nav>
          </details>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#64263B] via-[#551F35] to-[#351020] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 pb-14 pt-12 md:grid-cols-2 md:gap-5 md:px-10 md:py-16">
          <div className="min-w-0">
            <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-[#EAD8AD]">
              Your Personal Numerology Journey
            </p>

            <h1 className="font-serif text-[clamp(1.9rem,6vw,3.4rem)] font-normal leading-[1.18] text-[#FFF8EB]">
              <span className="block">Your Name.</span>
              <span className="block">Your Date of Birth.</span>
              <span className="block">Your Personal Discovery.</span>
            </h1>

            <div className="my-7 h-px w-28 bg-[#C5A15A]" />

            <div
              lang="hi"
              className="font-serif text-[clamp(1.45rem,4.5vw,2.3rem)] font-normal leading-[1.55] text-[#EAD8AD]"
            >
              <p>आपका नाम।</p>
              <p>आपकी जन्म तिथि।</p>
              <p>आपकी व्यक्तिगत खोज।</p>
            </div>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#F0E4E5]">
              Discover your personal numbers, explore your
              strengths and begin a thoughtful journey through
              traditional numerology. Your name and date of
              birth are enough to get started.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/website/register"
                className="inline-flex items-center justify-center rounded-full bg-[#EAD8AD] px-7 py-4 text-center font-medium text-[#64263B] hover:bg-[#FFF0CA]"
              >
                Discover My Numbers — Free
                <span className="ml-3">→</span>
              </Link>
              <a
                href="#free-discovery"
                className="inline-flex items-center justify-center rounded-full border border-[#D7B57B] px-7 py-4 text-center font-medium text-[#FAF1E1] hover:bg-white/10"
              >
                What Will I Discover?
              </a>
            </div>

            <p className="mt-6 text-sm leading-7 text-[#EAD8AD]">
              ✓ No birth time required
              <span className="mx-2">•</span>
              ✓ Free personal discovery
            </p>
          </div>

          <div className="mx-auto w-full max-w-[600px]">
            <GrahaArtwork />
          </div>
        </div>
      </section>

      {/* PART 2 STARTS IMMEDIATELY BELOW */}

      {/* BENEFITS */}
      <section className="bg-[#FAF7F0] px-5 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A17B42]">
              Discover Your Potential
            </p>
            <h2 className="mt-4 font-serif text-3xl font-normal text-[#64263B] md:text-5xl">
              Explore Different Aspects of Your Life
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#E7D8C4] bg-white px-5 py-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D8B475] bg-[#FAF3E8] font-serif text-3xl text-[#9E753E]">
                  {item.symbol}
                </div>
                <h3 className="mt-5 font-serif text-xl text-[#64263B]">
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
                <span className="font-serif text-3xl text-[#B18A53]">
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
              href="/website/register"
              className="inline-flex items-center rounded-full bg-[#64263B] px-9 py-4 font-medium text-white hover:bg-[#4D1930]"
            >
              Discover My Numbers — Free
              <span className="ml-3">→</span>
            </Link>
            <p className="mt-4 text-sm text-[#665B55]">
              No birth time or place required for introductory numerology.
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
                  'Complete verification using your selected email or mobile OTP method.',
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
                  'Discover optional reports, consultations and other services.',
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

      {/* NAME DISCOVERY */}
      <section className="bg-[#64263B] px-5 py-20 text-white md:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#EAD8AD]">
              The Power of a Name
            </p>
            <h2 className="mt-5 font-serif text-4xl font-normal leading-tight md:text-5xl">
              Why Do Some Celebrities Change Their Names?
            </h2>
            <p className="mt-6 text-lg leading-9 text-[#F1E1D8]">
              Names and spelling changes have long attracted
              interest in numerology. Jeevan Sutra helps you
              explore the traditional number associations
              of your birth name and current name.
            </p>
            <p className="mt-5 leading-8 text-[#EAD8AD]">
              A name number is a traditional interpretation,
              not a guarantee of success or a prediction.
            </p>
          </div>

          <div className="rounded-3xl border border-[#D8B475]/50 bg-[#FFF9EF] p-8 text-center text-[#64263B] md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C5A15A] font-serif text-4xl">
              5
            </div>
            <h3 className="mt-6 font-serif text-3xl">
              Your Name Has a Number
            </h3>
            <p className="mt-5 leading-8 text-[#665B55]">
              Discover how the Chaldean system assigns
              numerical values to letters and how different
              names can produce different results.
            </p>
            <div className="mt-8 border-t border-[#E4D4BD] pt-7">
              <Link
                href="/website/register"
                className="inline-block rounded-full bg-[#64263B] px-7 py-4 font-medium text-white"
              >
                Explore My Name Number
              </Link>
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
                className="flex flex-col rounded-2xl border border-[#E6D8C7] bg-white p-8 shadow-sm"
              >
                <span className="font-serif text-3xl text-[#B18A53]">
                  {service.number}
                </span>
                <h3 className="mt-5 font-serif text-2xl text-[#64263B]">
                  {service.title}
                </h3>
                <p className="mt-4 flex-1 leading-8 text-[#665B55]">
                  {service.description}
                </p>
                <Link
                  href="/website/register"
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
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-br from-[#64263B] to-[#3D1329] px-5 py-20 text-center text-white md:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#EAD8AD]">
            Your Discovery Begins Here
          </p>
          <h2 className="mt-6 font-serif text-4xl font-normal leading-tight md:text-5xl">
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
            className="mt-9 inline-flex items-center rounded-full bg-[#EAD8AD] px-9 py-4 font-medium text-[#64263B]"
          >
            Discover My Numbers — Free
            <span className="ml-3">→</span>
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
