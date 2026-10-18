import Link from 'next/link'

export function LaunchGift({ showLink = true, compact = false, customerName = "", customerDob = "", photoUrl = "", remaining }: { showLink?: boolean; compact?: boolean; customerName?: string; customerDob?: string; photoUrl?: string; remaining?: number }) {
  return <div className={`relative overflow-hidden rounded-3xl border border-[#D7B77A] bg-gradient-to-br from-[#FFF9EC] via-[#F8EED8] to-[#F1DFC0] text-[#64263B] shadow-[0_12px_36px_rgba(100,38,59,0.08)] ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-9'}`}>
    <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full border border-[#C5A15A]/25" />
    <div className="relative">
      <p className="inline-flex items-center gap-2 rounded-full border border-[#C5A15A]/50 bg-white/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"><span aria-hidden="true">✦</span> Your Launch Gift</p>
      {customerName && <div className="mt-5 flex items-center gap-4"><span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C5A15A]/50 bg-[#64263B] text-xl font-semibold text-[#EAD8AD]">{photoUrl ? <img src={photoUrl} alt="Your profile photo" width={64} height={64} className="size-16 object-cover" /> : customerName.trim().split(/\s+/).slice(0,2).map(part => part[0]).join("").toUpperCase()}</span><div className="min-w-0"><p className="break-words font-serif text-2xl font-semibold capitalize leading-tight">{customerName}</p>{customerDob && <p className="mt-2 text-sm leading-6 text-[#6E514B]">Date of birth <span className="inline-block font-semibold">{customerDob}</span></p>}</div></div>}
      <h2 className={`mt-4 font-serif leading-tight ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>3 Complimentary<br />Compatibility Previews</h2>
      <p className="mt-4 text-base font-semibold">{customerName ? customerName.trim().split(/\s+/)[0] + ", explore your connections." : "A little gift. A deeper connection."}</p>
      <p className="mt-2 max-w-xl text-sm leading-7 text-[#6E514B]">Explore your connections in love, friendship and business. A launch gift for your verified account.</p>
      {showLink && <Link href="/website/compatibility" className="mt-5 inline-flex min-h-12 items-center justify-center gap-4 rounded-xl bg-[#64263B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#812F48] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#64263B]">Check Compatibility <span aria-hidden="true">→</span></Link>}
      <p className="mt-3 text-xs leading-6 text-[#725D50]">{remaining === undefined ? "Three previews per account." : remaining === 0 ? "You have used all 3 complimentary previews." : "You have " + remaining + " complimentary " + (remaining === 1 ? "preview" : "previews") + " remaining."} Revisit your saved previews at no extra cost.</p>
    </div>
  </div>
}
