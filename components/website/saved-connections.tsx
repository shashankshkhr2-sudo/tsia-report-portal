"use client"
import { useState } from "react"
import { Search, ChevronRight } from "lucide-react"
import type { CustomerReading } from "@/lib/jeevansutra/compatibility-contract"
type Connection = { id: string; preview: Pick<CustomerReading, "kind" | "people">; created_at: string }
export function SavedConnections({ history, onOpen, onDelete }: { history: Connection[]; onOpen: (id: string) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
 const [opening, setOpening] = useState<string | null>(null)
 const [removing, setRemoving] = useState<string | null>(null)
 const [query, setQuery] = useState("")
 const [category, setCategory] = useState("All")
 const [count, setCount] = useState(10)
 const categories = ["All", ...Array.from(new Set(history.map(item => item.preview.kind)))]
 const matches = history.filter(item => (item.preview.people[1]?.name || "").toLowerCase().includes(query.trim().toLowerCase()) && (category === "All" || item.preview.kind === category)).sort((a,b) => b.created_at.localeCompare(a.created_at))
 return <div>
  {opening && <p role="status" className="mt-4 text-sm text-[#64263B]">Opening your saved insights…</p>}
  <label className="mt-5 flex min-h-12 items-center gap-3 rounded-xl border border-[#DCCFC3] bg-[#FFFDFA] px-4 focus-within:ring-2 focus-within:ring-[#C5A15A]"><Search size={20} aria-hidden="true" /><span className="sr-only">Search saved connections by name</span><input type="search" value={query} onChange={event => { setQuery(event.target.value); setCount(10) }} placeholder="Search by name" className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none" /></label>
  <div aria-label="Filter saved connections" className="mt-4 flex flex-wrap gap-2">{categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setCategory(value); setCount(10) }} className={"min-h-11 rounded-full border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-[#64263B] " + (category === value ? "border-[#64263B] bg-[#64263B] text-white" : "border-[#E5D8C6] bg-[#FAF7F0] text-[#64263B]")}>{value}</button>)}</div>
  <div className="mt-5 space-y-3">{matches.slice(0,count).map((item,index) => { const name = item.preview.people[1]?.name || "Saved connection"; const date = new Date(item.created_at); return <div key={item.id}><button type="button" disabled={removing !== null || opening !== null} onClick={async () => { setOpening(item.id); try { await onOpen(item.id) } finally { setOpening(null) } }} className="flex min-h-20 w-full items-center gap-3 rounded-2xl border border-[#EADFD4] bg-[#FFFDFA] p-4 text-left transition-colors hover:bg-[#FAF5E9] focus-visible:outline-2 focus-visible:outline-[#64263B]"><span aria-hidden="true" className={"flex size-12 shrink-0 items-center justify-center rounded-full font-serif text-lg font-semibold text-[#64263B] " + ["bg-[#F0DAD5]","bg-[#DDE5D8]","bg-[#DAE3EF]"][index % 3]}>{name.trim().split(/\s+/).slice(0,2).map(part => part[0]).join("").toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block break-words font-serif text-xl font-semibold capitalize text-[#64263B]">{name}</span><span className="mt-1 block text-sm leading-6 text-[#766B67]">{item.preview.kind}{!Number.isNaN(date.getTime()) && " · " + date.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kolkata"})}</span></span><ChevronRight size={22} className="shrink-0 text-[#64263B]" aria-hidden="true" /></button><button type="button" disabled={removing !== null || opening !== null} aria-label={"Delete saved insights for " + name} onClick={async () => { setRemoving(item.id); try { await onDelete(item.id) } finally { setRemoving(null) } }} className="mt-1 min-h-11 rounded-lg px-4 py-2 text-sm text-[#64263B] underline focus-visible:outline-2 focus-visible:outline-[#64263B] disabled:opacity-50">{removing === item.id ? "Removing…" : "Delete"}</button></div> })}</div>
  {!matches.length && <p role="status" className="py-6 text-sm text-[#766B67]">{history.length ? "No connections match your search." : "Your saved connections will appear here after your first comparison."}</p>}
  <p className="mt-5 text-center text-sm leading-6 text-[#766B67]">Opening saved insights uses no credit.</p>
  {matches.length > count && <button type="button" onClick={() => setCount(value => value + 10)} className="mt-4 min-h-12 w-full rounded-xl border border-[#64263B] px-4 py-3 font-semibold text-[#64263B] focus-visible:outline-2 focus-visible:outline-[#64263B]">Load more</button>}
 </div>
}
