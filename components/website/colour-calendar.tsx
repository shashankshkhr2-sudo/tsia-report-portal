"use client"
import { useEffect, useState } from "react"
import { getColourDay, type Colour } from "@/lib/jeevansutra/colour-calendar"

function Swatches({ colours }: { colours: Colour[] }) {
  return <ul className="grid grid-cols-3 gap-1.5">{colours.map(colour => <li key={colour.name} className="min-w-0 text-center">
    <div aria-hidden="true" style={{ backgroundColor: colour.hex }} className="h-14 rounded-xl sm:h-16 border border-black/15 shadow-sm" />
    <span className="mt-2 block min-h-8 text-[11px] leading-4 text-[#514047] sm:text-xs" style={{ wordBreak: "normal", overflowWrap: "normal" }}>{colour.name}</span>
  </li>)}</ul>
}
const metalAccessories: Record<string, { image: string; label: string; alt: string }> = {
  Gold: { image: "gold-accessory", label: "Jewellery", alt: "Gold bangle and pendant on ivory fabric" },
  Silver: { image: "silver-accessory", label: "Jewellery", alt: "Silver bangle and pendant on ivory fabric" },
  Bronze: { image: "bronze-accessory", label: "Bag charm", alt: "Bronze bag charm with a clasp" },
  Iron: { image: "iron-accessory", label: "Keyring", alt: "Dark iron keyring with a rounded tag" },
  Copper: { image: "copper-accessory", label: "Water bottle", alt: "Hammered copper water bottle" }
}
function MetalAccessory({ metal }: { metal: string }) {
  const choices = metal === "Gold or copper" ? ["Gold", "Copper"] : [metal]
  return <div className="min-w-0 space-y-3">
    {choices.length > 1 && <p className="text-center text-xs text-[#766B67]">Choose either metal</p>}
    {choices.map(name => {
      const item = metalAccessories[name]
      if (!item) return null
      return <figure key={name} className="min-w-0">
        <img src={`/website/metals/${item.image}.webp`} alt={item.alt} width={600} height={600} loading="lazy" className="block aspect-[5/4] w-full rounded-xl object-cover" />
        <figcaption className="mt-1.5 text-center text-xs font-medium leading-5 text-[#64263B] sm:text-sm">{name} · {item.label}</figcaption>
      </figure>
    })}
  </div>
}
function indiaDate() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date())
  const part = (type: string) => parts.find(item => item.type === type)?.value || ""
  return [part("year"), part("month"), part("day")].join("-")
}
function addDays(value: string, count: number) {
  const date = new Date(value + "T12:00:00Z")
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error("Invalid date")
  date.setUTCDate(date.getUTCDate() + count)
  return date.toISOString().slice(0, 10)
}
function dateLabel(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(value + "T12:00:00Z"))
}
export function ColourCalendar({ dob }: { dob: string }) {
  const [today, setToday] = useState("")
  const [start, setStart] = useState("")
  const [dateText, setDateText] = useState("")
  useEffect(() => {
    const refresh = () => setToday(indiaDate())
    refresh()
    const timer = window.setInterval(refresh, 60000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    if (today) {
      setStart(today)
      setDateText(today.split("-").reverse().join("/"))
    }
  }, [today])
  function changeDate(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8)
    setDateText([digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join("/"))
    setStart(digits.length === 8 ? digits.slice(4) + "-" + digits.slice(2, 4) + "-" + digits.slice(0, 2) : "")
  }
  let days: ReturnType<typeof getColourDay>[] = []
  let error = ""
  if (start) {
    try {
      days = Array.from({ length: 7 }, (_, index) => getColourDay(dob, addDays(start, index)))
    } catch { error = "Please choose a valid date on or after your birth date, on or before 25 December 2200." }
  }
  function canMoveWeek(offset: number) {
    if (days.length !== 7) return false
    try {
      const next = addDays(start, offset)
      getColourDay(dob, next)
      getColourDay(dob, addDays(next, 6))
      return true
    } catch { return false }
  }
  function moveWeek(offset: number) {
    if (!canMoveWeek(offset)) return
    const next = addDays(start, offset)
    setStart(next)
    setDateText(next.split("-").reverse().join("/"))
  }
  const personalColours = days[0]?.personalColours
  return <section aria-labelledby="colour-calendar-title" className="my-6 overflow-hidden rounded-[28px] border border-[#D2B577]/60 bg-[#FAF7F0] shadow-sm">
    <header className="bg-[#64263B] px-5 py-8 text-[#FAF0DE] sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D2B577]">Jeevan Sutra · Personal inspiration</p>
      <h2 id="colour-calendar-title" className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Your Personal Days &amp; Colours</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#FAF0DE]/90">A little colour. A little inspiration. Choose what feels like you.</p>
    </header>
    <div className="space-y-6 p-4 sm:p-8">
      {personalColours && <article className="rounded-2xl border border-[#E4D8C4] bg-white p-5">
        <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-widest text-[#906C36]">Always yours</p><h3 className="mt-1 font-serif text-2xl text-[#64263B]">Your personal palette</h3><p className="mt-2 text-sm text-[#766B67]">Familiar shades to enjoy on any day.</p></div>
        <ul className="grid max-w-md grid-cols-3 gap-2">{personalColours.map(colour => <li key={colour.name} className="min-w-0 text-center"><div aria-hidden="true" style={{ backgroundColor: colour.hex }} className="h-12 rounded-xl border border-black/15 shadow-sm" /><span className="mt-2 block text-xs leading-5 text-[#514047]">{colour.name}</span></li>)}</ul>
        <div className="mt-5 flex items-center gap-3 overflow-hidden rounded-2xl border border-[#D2B577] bg-[#64263B] p-3 text-[#FAF0DE] sm:gap-5 sm:p-5">
          <div className="min-w-0 flex-1">
            <h4 className="text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-[#D2B577]">Your signature metal</h4>
            <p className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">{days[0]?.personalMetal}</p>

          </div>
          {days[0]?.personalMetal === "Silver" && <img src="/website/metals/silver.webp" alt="Silver bracelet and pendant on ivory fabric" width={880} height={480} loading="lazy" className="block h-auto w-1/2 max-w-56 shrink-0 rounded-xl" />}
        </div>
      </article>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h3 className="font-serif text-2xl text-[#64263B]">Seven days of colour</h3>{days.length > 0 && <p className="mt-1 text-sm text-[#766B67]">{dateLabel(days[0].date, { day: "numeric", month: "short", year: "numeric" })} – {dateLabel(days[6].date, { day: "numeric", month: "short", year: "numeric" })}</p>}</div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block text-sm font-medium text-[#64263B]">Starting date<input type="text" inputMode="numeric" placeholder="DD/MM/YYYY" aria-label="Calendar starting date, day month year" autoComplete="off" value={dateText} onChange={event => changeDate(event.target.value)} className="mt-1 block min-h-11 max-w-full rounded-xl border border-[#D2B577] bg-white px-3 py-2 text-base text-[#392E30]" /></label>
          <button type="button" disabled={!today} onClick={() => { setStart(today); setDateText(today.split("-").reverse().join("/")) }} className="min-h-11 rounded-xl border border-[#D2B577] px-4 py-2 text-sm font-semibold text-[#64263B]">Today</button>
        </div>
      </div>
      <nav aria-label="Colour calendar weeks" className="flex items-center justify-between gap-3">
        <button type="button" disabled={!canMoveWeek(-7)} onClick={() => moveWeek(-7)} className="min-h-11 rounded-xl border border-[#D2B577] px-3 py-2 text-sm font-semibold text-[#64263B] disabled:cursor-not-allowed disabled:opacity-40">← Previous 7 days</button>
        <button type="button" disabled={!canMoveWeek(7)} onClick={() => moveWeek(7)} className="min-h-11 rounded-xl border border-[#D2B577] px-3 py-2 text-sm font-semibold text-[#64263B] disabled:cursor-not-allowed disabled:opacity-40">Next 7 days →</button>
      </nav>
      {!today && <p role="status" className="text-sm text-[#766B67]">Preparing your calendar…</p>}
      {today && !start && <p className="text-sm text-[#766B67]">Enter all eight digits: DD/MM/YYYY.</p>}
      {error && <p role="alert" className="rounded-xl bg-white p-4 text-[#8A303A]">{error}</p>}
      <div className="grid grid-cols-1 gap-3">{days.map(day => {
        const isToday = day.date === today
        return <article key={day.date} aria-label={dateLabel(day.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} className={isToday ? "rounded-2xl border-2 border-[#B89143] bg-[#FFF8E8] p-3 shadow-sm sm:p-4" : "rounded-2xl border border-[#E4D8C4] bg-white p-3 sm:p-4"}>
          <header className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#D2B577]/50 pb-2">
            <h4 className="font-serif text-xl leading-7 text-[#64263B] sm:text-2xl">{dateLabel(day.date, { weekday: "long" })} · {dateLabel(day.date, { day: "numeric", month: "short" })}</h4>
            {isToday && <span className="shrink-0 rounded-full bg-[#64263B] px-2 py-1 text-[10px] font-semibold text-white">TODAY</span>}
          </header>
          <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-3 sm:gap-5">
            <Swatches colours={day.dailyColours} />
            <MetalAccessory metal={day.jewelleryMetal} />
          </div>
        </article>
      })}</div>
      <div className="rounded-2xl bg-[#EFE7D9] p-4 text-sm leading-6 text-[#65544D]"><p>Choose any one of these three shades for your outfit or an accessory. Wear what feels comfortable and natural to you.</p></div>
      <p className="text-center text-xs leading-5 text-[#766B67]">Guided by numerology traditions. Choose what feels right for you.<br />Metal accessory suggestions are optional and inspired by planetary traditions. Wear what suits your comfort and preferences.<br />Calendar dates follow India Standard Time.</p>
    </div>
  </section>
}
