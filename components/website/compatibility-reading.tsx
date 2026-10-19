import { BriefcaseBusiness, Heart, UsersRound, Sprout, Sparkles, MessageCircle, Scale } from 'lucide-react'
import type { CustomerReading } from '@/lib/jeevansutra/compatibility-contract'
import { compatibilityReadingCopy } from '@/lib/jeevansutra/compatibility-reading-copy'
import { compatibilityNameParts } from '@/lib/jeevansutra/compatibility-name-parts'

const colours = ['text-[#64263B]', 'text-[#815020]']
function displayName(name: string) {
 return name.replace(/\b[A-Za-z][A-Za-z'’-]*/g, word => word[0].toUpperCase()+word.slice(1).toLowerCase())
}
// Reuse the exact approved collection. CSS crops each quadrant above its baked-in caption.
function ConnectionArtwork({ category }: { category: 'love' | 'business' | 'family' | 'friendship' }) {
 const right = category === 'business' || category === 'friendship'
 const lower = category === 'family' || category === 'friendship'
 return <div aria-hidden="true" className="pointer-events-none relative mx-auto mb-5 w-full max-w-sm overflow-hidden" style={{ aspectRatio: '1.95 / 1' }}>
  {/* Decorative artwork: the category and people are provided as accessible live text below. */}
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img src="/website/illustrations/connection-collection.webp" alt="" width={1536} height={1024} decoding="async" className="absolute top-0 block h-auto max-w-none" style={{ width: '200%', left: right ? '-100%' : 0, transform: lower ? 'translateY(-50%)' : undefined }} />
 </div>
}

function PersonalText({ text, names }: { text: string; names: string[] }) {
 return <>{compatibilityNameParts(text,names).map((part,i) => part.person === null ? <span key={i}>{part.text}</span> : <strong key={i} className={`font-semibold ${colours[part.person] || colours[0]}`}>{displayName(part.text)}</strong>)}</>
}
export function CompatibilityReading({ reading, sharedSurface = false }: { reading: CustomerReading; sharedSurface?: boolean }) {
 const business = reading.kind === 'Business & Work' || /Business|Professional/.test(reading.kind)
 const family = reading.kind === 'Family'
 const friendship = reading.kind === 'Friendship'
 const Icon = business ? BriefcaseBusiness : family ? UsersRound : friendship ? Sprout : Heart
 const names = reading.people.map(p => p.name)
 const headings = business ? ['How you work together', 'What you bring to each other', 'How your strengths fit together', 'What you may build together', 'Where differences may arise'] : family ? ['How you relate to each other', 'What you bring to family life', 'How you complement each other', 'Your strengths as a family', 'Where differences may arise'] : friendship ? ['How you connect as friends', 'What you bring to each other', 'How you complement each other', 'What your friendship may grow into', 'Where differences may arise'] : ['How you connect', 'What you bring to each other', 'How you complement each other', 'What you may build together', 'Where differences may arise']
 const sectionIcons = [Icon,MessageCircle,Sprout,Sparkles,Scale]
 const sections = 'sections' in reading ? reading.sections : reading.observations.map((text,i) => ({ title: i === 0 ? 'Your earlier reading' : 'About this comparison', text }))
 return <div className="-mx-3 space-y-5 sm:mx-0">
  <header className="relative overflow-hidden rounded-2xl border-y border-[#D7B77A]/50 bg-[#FAF7F0] px-6 py-8 text-center sm:px-12 sm:py-10">
   <ConnectionArtwork category={business ? 'business' : family ? 'family' : friendship ? 'friendship' : 'love'} />
   <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#815020]">{business ? 'Your business connection' : family ? 'Your family connection' : friendship ? 'Your friendship' : 'Your connection'}</p>
   <div className="relative mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row sm:items-start sm:gap-5">
    {reading.people.map((person,i) => <div key={i} className="contents">{i > 0 && <span aria-hidden="true" className="font-serif text-2xl text-[#A17B42] sm:pt-1">&</span>}<div className="min-w-0 max-w-full sm:flex-1"><h3 className={`break-words font-serif text-[clamp(1.9rem,7vw,3rem)] leading-[1.15] sm:text-4xl ${colours[i] || colours[0]}`}>{displayName(person.name)}</h3>{'roles' in reading && reading.roles && <p className="mt-2 text-xs leading-5 text-[#766b67]">{i === 0 ? reading.roles.self : reading.roles.other}</p>}</div></div>)}
   </div>
   <div aria-hidden="true" className="mx-auto mt-5 h-px w-20 bg-[#C5A15A]/70" />
   <p className="mt-4 text-sm leading-6 text-[#69574E]">{'relationship' in reading ? reading.relationship : reading.kind}</p>
  </header>
  {'sections' in reading ? <><p className="mx-auto w-fit rounded-full border border-[#D7B77A]/50 bg-[#FAF4E8] px-4 py-1.5 text-[10px] tracking-wide text-[#765A37]">Draft · internal review</p><h3 className="px-2 py-2 text-center font-serif text-[clamp(1.3rem,5.3vw,1.8rem)] leading-snug text-[#64263B]">This is what your numbers say</h3></> : <p className="text-sm text-[#766b67]">Earlier saved preview · created with the previous method</p>}
  <div className="space-y-4">{sections.map((section,i) => {
   const SectionIcon = sectionIcons[i] || Sparkles
   const text = compatibilityReadingCopy(section.text)
   // Separate the two contributions without splitting initials or altering the reading.
   const splitAt = names[1] ? text.indexOf(`, while ${names[1]}`) : -1
   const paragraphs = splitAt >= 0 ? [text.slice(0,splitAt)+'.',text.slice(splitAt+8)] : [text]
   return <section key={`${section.title}-${i}`} className={sharedSurface ? "rounded-2xl border border-[#C5A15A]/30 bg-[#FAF7F0] p-5 sm:p-7" : "rounded-2xl border border-[#DCC9A8]/80 bg-gradient-to-br from-[#FFFEFB] to-[#FBF5EA] p-5 shadow-[0_8px_24px_rgba(100,38,59,0.07)] sm:p-7"}>
    <div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#C5A15A]/45 bg-[#FAF3E5] text-[#96733E]"><SectionIcon aria-hidden="true" size={20} strokeWidth={1.5} /></span><h4 className="min-w-0 border-l-2 border-[#C5A15A] pl-3 font-serif text-[1.3rem] leading-snug text-[#64263B] sm:text-2xl">{'sections' in reading ? headings[i] || section.title : section.title}</h4></div>
    <div className="mt-4 space-y-3 text-base leading-7 text-[#463B3B]">{paragraphs.map((paragraph,j) => <p key={j}><PersonalText text={paragraph} names={names} /></p>)}</div>
   </section>
  })}</div>
  <footer className="border-t border-[#C5A15A]/35 px-2 pt-4 text-center text-xs leading-6 text-[#766b67]">{'sections' in reading ? 'A traditional numerology reading for reflection. Your choices, communication and everyday actions shape your relationship.' : reading.limitation}</footer>
 </div>
}
