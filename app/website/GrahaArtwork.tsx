type Graha = {
  n: number
  hindi: string
  english: string
  x: number
  y: number
  tone: string
  shadow?: boolean
  glyph?: string
}

const grahas: Graha[] = [
  {
    n: 1,
    hindi: 'सूर्य',
    english: 'Surya',
    x: 300,
    y: 74,
    tone: '#EF9A32',
  },
  {
    n: 2,
    hindi: 'चंद्र',
    english: 'Chandra',
    x: 142,
    y: 139,
    tone: '#E8EDF4',
  },
  {
    n: 3,
    hindi: 'गुरु',
    english: 'Guru',
    x: 76,
    y: 296,
    tone: '#E8BD35',
  },
  {
    n: 4,
    hindi: 'राहु',
    english: 'Rahu',
    x: 460,
    y: 140,
    tone: '#718096',
    shadow: true,
    glyph: '☊',
  },
  {
    n: 5,
    hindi: 'बुध',
    english: 'Budh',
    x: 220,
    y: 526,
    tone: '#27965A',
  },
  {
    n: 6,
    hindi: 'शुक्र',
    english: 'Shukra',
    x: 382,
    y: 526,
    tone: '#FFF4E0',
  },
  {
    n: 7,
    hindi: 'केतु',
    english: 'Ketu',
    x: 140,
    y: 460,
    tone: '#A87955',
    shadow: true,
    glyph: '☋',
  },
  {
    n: 8,
    hindi: 'शनि',
    english: 'Shani',
    x: 524,
    y: 296,
    tone: '#354A91',
  },
  {
    n: 9,
    hindi: 'मंगल',
    english: 'Mangal',
    x: 460,
    y: 460,
    tone: '#D94732',
  },
]

export default function GrahaArtwork() {
  return (
    <div className="w-full">
      <svg
        viewBox="0 0 600 640"
        className="h-auto w-full"
        role="img"
        aria-labelledby="navgraha-title navgraha-description"
      >
        <title id="navgraha-title">
          India-facing Earth and the nine Grahas
        </title>

        <desc id="navgraha-description">
          A circular Earth with India visible at the centre.
          Seven physical celestial Grahas surround it.
          Rahu is at the upper right and Ketu at the lower left,
          represented as translucent Chhaya Graha symbols,
          exactly opposite through the centre of Earth.
          This is a symbolic illustration.
        </desc>

        <defs>
          <radialGradient id="js-colour-shading" cx="30%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.48" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
          </radialGradient>
          <radialGradient id="js-soft-backdrop">
            <stop stopColor="#773449" stopOpacity="0.26" />
            <stop
              offset="1"
              stopColor="#3F1527"
              stopOpacity="0"
            />
          </radialGradient>

          <radialGradient
            id="js-sphere"
            cx="32%"
            cy="26%"
            r="76%"
          >
            <stop stopColor="#FAE6BE" />
            <stop offset="0.24" stopColor="#D7C0A3" />
            <stop offset="0.73" stopColor="#947C72" />
            <stop offset="1" stopColor="#4E3942" />
          </radialGradient>

          <radialGradient id="js-sun-soft">
            <stop stopColor="#FFF3C9" />
            <stop offset="0.48" stopColor="#EBC88B" />
            <stop offset="1" stopColor="#B97E4A" />
          </radialGradient>

          <clipPath id="js-earth-clip">
            <circle cx="300" cy="300" r="104" />
          </clipPath>
        </defs>

        <circle
          cx="300"
          cy="300"
          r="289"
          fill="url(#js-soft-backdrop)"
        />

        {[144, 173, 204, 242, 272].map((radius) => (
          <circle
            key={radius}
            cx="300"
            cy="300"
            r={radius}
            fill="none"
            stroke="#C5A15A"
            strokeWidth={radius === 204 ? 1.2 : 0.75}
            opacity={radius === 204 ? 0.5 : 0.22}
          />
        ))}

        {Array.from({ length: 24 }, (_, index) => {
          const angle = (index * Math.PI) / 12

          return (
            <line
              key={index}
              x1={300 + 276 * Math.cos(angle)}
              y1={300 + 276 * Math.sin(angle)}
              x2={300 + 281 * Math.cos(angle)}
              y2={300 + 281 * Math.sin(angle)}
              stroke="#D8B475"
              strokeWidth="1"
              opacity="0.4"
            />
          )
        })}

        {/* Rahu and Ketu share midpoint (300, 300). */}
        <line
          x1="460"
          y1="140"
          x2="140"
          y2="460"
          stroke="#D8B475"
          strokeDasharray="3 7"
          opacity="0.35"
        />

        <circle
          cx="300"
          cy="300"
          r="114"
          fill="none"
          stroke="#D8B475"
          strokeWidth="1.3"
          opacity="0.55"
        />

        <circle
          cx="300"
          cy="300"
          r="107"
          fill="#132F48"
        />

        <image
          href="/images/earth-india-home.png"
          x="196"
          y="196"
          width="208"
          height="208"
          clipPath="url(#js-earth-clip)"
          preserveAspectRatio="xMidYMid meet"
        />

        <circle
          cx="300"
          cy="300"
          r="104"
          fill="none"
          stroke="#E4C998"
          strokeWidth="1.6"
          opacity="0.72"
        />

        <text
          x="300"
          y="429"
          textAnchor="middle"
          fill="#EAD8AD"
          fontSize="12"
          letterSpacing="3"
        >
          EARTH
        </text>

        {grahas.map((graha) => (
          <g key={graha.n}>
            <circle
              cx={graha.x}
              cy={graha.y}
              r="34"
              fill="#471E31"
              stroke="#D9B778"
              strokeWidth="1.15"
              opacity="0.95"
            />

            {graha.shadow ? (
              <>
                <circle
                  cx={graha.x}
                  cy={graha.y}
                  r="26"
                  fill={graha.tone}
                  fillOpacity="0.38"
                  stroke="#D9B778"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />

                <text
                  x={graha.x}
                  y={graha.y - 4}
                  textAnchor="middle"
                  fill="#E9D7B9"
                  fontSize="20"
                  fontFamily="serif"
                >
                  {graha.glyph}
                </text>

                <text
                  x={graha.x}
                  y={graha.y + 19}
                  textAnchor="middle"
                  fill={graha.shadow || [5, 8, 9].includes(graha.n) ? "#FFF4E0" : "#382432"}
                  fontSize="19"
                  fontFamily="serif"
                >
                  {graha.n}
                </text>
              </>
            ) : (
              <>
                <circle
                  cx={graha.x}
                  cy={graha.y}
                  r="26"
                  fill={graha.tone}
                />

                <circle
                  cx={graha.x}
                  cy={graha.y}
                  r="26"
                  fill="url(#js-colour-shading)"
                />

                {graha.n === 8 && (
                  <ellipse
                    cx={graha.x}
                    cy={graha.y}
                    rx="37"
                    ry="12"
                    transform={`rotate(-24 ${graha.x} ${graha.y})`}
                    fill="none"
                    stroke="#E2C69A"
                    strokeWidth="3"
                    opacity="0.85"
                  />
                )}

                <text
                  x={graha.x}
                  y={graha.y + 8}
                  textAnchor="middle"
                  fill={graha.shadow || [5, 8, 9].includes(graha.n) ? "#FFF4E0" : "#382432"}
                  fontSize="24"
                  fontFamily="serif"
                >
                  {graha.n}
                </text>
              </>
            )}

            <text
              x={graha.x}
              y={graha.y + 48}
              textAnchor="middle"
              fill="#F3E3C9"
              fontSize="14"
              fontWeight="500"
            >
              {graha.hindi}
            </text>

            <text
              x={graha.x}
              y={graha.y + 64}
              textAnchor="middle"
              fill="#DCC49D"
              fontSize="12"
            >
              {graha.english}
            </text>

            {graha.shadow && (
              <text
                x={graha.x}
                y={graha.y + 78}
                textAnchor="middle"
                fill="#DCC49D"
                fontSize="10"
              >
                Chhaya Graha
              </text>
            )}
          </g>
        ))}
      </svg>

      <div className="mx-auto max-w-md px-3 text-center text-xs leading-6 text-[#EAD8AD]/90">
        <p className="font-medium">
          Rahu and Ketu — The Chhaya Grahas (Shadow Grahas)
        </p>

        <p className="mt-2">
          In Vedic astrology, Rahu and Ketu are known as
          Chhaya Grahas, or Shadow Grahas. Unlike the other
          seven Grahas, they have no physical planetary form.
          They represent two significant points associated
          with the Moon’s orbital path and are always
          positioned opposite each other.
        </p>
      </div>
    </div>
  )
}
