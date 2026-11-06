import Link from "next/link"

const relationships = [
  "Love & Marriage",
  "Friendship",
  "Family & In-laws",
  "Work & Business",
]

const possibilities = [
  "Improve Your Current Work",
  "Explore Suitable Professions",

]

const goldButton =
  "inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D2B577] px-6 py-3 font-semibold text-[#64263B]"

export default function ExploreSlider() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section id="relationships" className="scroll-mt-16 bg-[#64263B] px-2 pb-6 pt-2 text-center text-[#FAF0DE] md:px-6">
        <h2 className="font-serif text-2xl font-bold leading-tight md:text-5xl">Understand and Improve Your Relationships</h2>
        <p className="mx-auto mt-2 max-w-3xl text-[#FAF0DE]">Gain clarity, harmony and a deeper bond in the important relationships of your life.</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 text-left lg:grid-cols-4">
          {relationships.map((topic, index) => (
            <li key={topic} className="overflow-hidden rounded-xl border border-[#D2B577]/60">
              <Link href="/website/compatibility" className="block h-full hover:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2">
                <img src={`/website/home/${["love-marriage","friendship","family-inlaws","work-business"][index]}.webp`} alt="" width={234} height={169} loading="lazy" className="aspect-[234/169] w-full object-cover" />
                <span className="flex h-16 items-center justify-between gap-2 px-3 py-2 font-serif font-bold leading-tight md:text-xl">
                  {topic}<span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/website/compatibility" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#D2B577] px-6 py-3 font-semibold text-[#64263B]">
          Explore Relationship Insights <span className="ml-2" aria-hidden="true">→</span>
        </Link>
        <p className="mt-3 text-sm">Includes three complimentary compatibility previews.</p>
      </section>

      <section aria-labelledby="home-days-colours" className="bg-[#FAF7F0] px-5 py-10"><div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#D2B577]/60 bg-white shadow-sm md:grid-cols-2"><img src="/website/home/days-colours.webp" alt="Fabric colours beside a decorative calendar and silver jewellery" width={1200} height={800} loading="lazy" className="block h-auto w-full md:h-full md:object-cover" /><div className="flex flex-col justify-center p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-[#906C36]">Days &amp; Colours</p><h2 id="home-days-colours" className="mt-3 font-serif text-3xl text-[#64263B] sm:text-4xl">Your Days. Your Colours.</h2><p className="mt-4 leading-7 text-[#766B67]">Discover one complimentary colour for today, inspired by your birth details and numerology traditions.</p><p className="mt-3 text-sm leading-6 text-[#766B67]">Preview the upcoming paid calendar with three daily shades and optional metal accessories.</p><Link href="/website/days-colours" className="mt-6 inline-flex min-h-12 items-center justify-center self-start rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#FAF0DE]">Discover Today’s Colour →</Link></div></div></section>

      <section id="life-possibilities" className="scroll-mt-28 border-t border-[#D2B577]/50 bg-[#64263B] px-2 py-8 text-center text-[#FAF0DE] md:px-6">
        <h2 className="font-serif text-3xl font-bold md:text-5xl">Discover Your Life Possibilities</h2>
        <p className="mx-auto mt-2 max-w-3xl text-[#FAF0DE]">Explore practical guidance to make better choices, create new opportunities and move forward with confidence.</p>
        <ul className="mt-6 grid gap-3 lg:grid-cols-2">
          {possibilities.map((topic, index) => (
            <li key={topic} className="grid min-h-28 grid-cols-2 items-center overflow-hidden rounded-xl border border-[#D2B577] bg-[#64263B] text-left">
              <img src={"/website/home/" + ["work", "profession"][index] + ".webp"} alt="" loading="lazy" className="aspect-[6/5] h-full w-full object-cover" />
              <span className="px-3 py-4 font-serif text-lg font-bold leading-tight">{topic}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="name-energy" className="grid scroll-mt-28 items-center overflow-hidden border-y border-[#D2B577]/50 bg-[#64263B] text-[#FAF0DE] md:grid-cols-2">
        <img src="/website/home/name.webp" alt="A woman comparing her current and alternative name spellings" width={510} height={271} loading="lazy" className="block h-auto w-full" />
        <div className="px-5 py-8 md:px-8">
          <h2 className="font-serif text-3xl font-bold leading-tight md:text-5xl">Your name is how the world knows you.</h2>
          <p className="mt-3 text-[#FAF0DE]">Understand your name. Compare spellings. Choose what feels right.</p>
          <Link href="/website/name-discovery" className={`mt-5 ${goldButton}`}>
            Check My Name <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
