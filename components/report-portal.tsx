'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
type Report = typeof import('@/app/report-data').reports[number]
type Client = typeof import('@/app/report-data').clients[number]
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  Fingerprint,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  : null

type View = 'dashboard' | 'clients' | 'reports' | 'new-client' | 'generate' | 'client-detail'

type PortalData = { reports: readonly Report[]; clients: readonly Client[] }
const PortalDataContext = createContext<PortalData | null>(null)
function usePortalData() {
  const data = useContext(PortalDataContext)
  if (!data) throw new Error('Portal data is unavailable')
  return data
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
]

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c49a5a]/60 bg-[#24354c] text-[#d9b56e]">
        <span className="font-serif text-lg font-semibold">ॐ</span>
        <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#c49a5a] text-[9px] font-bold text-[#24354c]">✦</span>
      </div>
      {!compact && <div><p className="font-serif text-[15px] font-semibold tracking-[0.16em] text-[#24354c]">TSIA</p><p className="text-[9px] uppercase tracking-[0.22em] text-[#9a7b4f]">Report Portal</p></div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const ready = status === 'Ready'
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${ready ? 'bg-[#e7f1e8] text-[#3f7650]' : 'bg-[#fff3dc] text-[#a26a1b]'}`}><span className={`size-1.5 rounded-full ${ready ? 'bg-[#5e9a68]' : 'bg-[#d68a29]'}`} />{status}</span>
}

function Sidebar({ view, setView, open, setOpen, fullName, initials, onSignOut }: { view: View; setView: (v: View) => void; open: boolean; setOpen: (v: boolean) => void; fullName: string; initials: string; onSignOut: () => Promise<void> }) {
  return <>
    {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-[#24354c]/25 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#e8dfd3] bg-[#fbf8f2] px-5 py-7 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-12 flex items-center justify-between px-2"><Logo /><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="size-5" /></button></div>
      <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad9a84]">Workspace</p>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setView(id); setOpen(false) }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${view === id ? 'bg-[#24354c] font-medium text-white shadow-sm' : 'text-[#6d665d] hover:bg-[#f0e9de]'}`}><Icon className="size-[18px]" />{label}</button>)}
      </nav>
      <div className="mt-auto flex flex-col gap-1 border-t border-[#e8dfd3] pt-5">
        <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d] hover:bg-[#f0e9de]"><Settings className="size-[18px]" />Settings</button>
        <button onClick={() => void onSignOut()} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d] hover:bg-[#f0e9de]"><LogOut className="size-[18px]" />Sign out</button>
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f0e9de]/70 p-3"><div className="flex size-8 items-center justify-center rounded-full bg-[#d6b47b] text-xs font-semibold text-[#24354c]">{initials}</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#3e3a35]">{fullName}</p><p className="text-[10px] text-[#9a8b7b]">Administrator</p></div><ChevronDown className="ml-auto size-3.5 text-[#a79582]" /></div>
      </div>
    </aside>
  </>
}

function Header({ title, setOpen, fullName, initials }: { title: string; setOpen: (v: boolean) => void; fullName: string; initials: string }) {
  return <header className="flex h-[76px] items-center justify-between border-b border-[#e8dfd3] bg-[#fffdf9] px-5 sm:px-8 lg:px-10"><div className="flex items-center gap-4"><button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="size-5 text-[#24354c]" /></button><div><p className="text-[11px] uppercase tracking-[0.18em] text-[#a79582]">TSIA Report Portal</p><h1 className="font-serif text-xl font-semibold text-[#24354c]">{title}</h1></div></div><div className="flex items-center gap-3"><button className="relative rounded-full p-2.5 text-[#7a7065] hover:bg-[#f4ede2]" aria-label="Notifications"><Bell className="size-[18px]" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#b86b4d]" /></button><div className="hidden h-7 w-px bg-[#e8dfd3] sm:block" /><div className="hidden items-center gap-2 sm:flex"><div className="flex size-8 items-center justify-center rounded-full bg-[#d6b47b] text-xs font-semibold text-[#24354c]">{initials}</div><span className="text-sm font-medium text-[#4b4741]">{fullName}</span></div></div></header>
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) { return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">{eyebrow}</p><h2 className="font-serif text-[30px] font-medium leading-tight text-[#24354c]">{title}</h2>{description && <p className="mt-2 max-w-xl text-sm leading-6 text-[#81776b]">{description}</p>}</div>{action}</div> }

function Dashboard({ setView, firstName }: { setView: (v: View) => void; firstName: string }) {
  const { reports } = usePortalData()
  return <div className="p-5 sm:p-8 lg:p-10"><PageIntro eyebrow="Thursday, 19 September 2024" title={`Good morning, ${firstName}`} description="Keep your client insights moving with clarity and intention." action={<Button onClick={() => setView('new-client')} className="h-11 rounded-xl bg-[#24354c] px-5 text-sm text-white hover:bg-[#30445f]"><Plus data-icon="inline-start" />New client</Button>} />
    <section className="grid gap-4 sm:grid-cols-3"><Metric icon={Users} label="Total clients" value="128" note="12 added this month" /><Metric icon={FileText} label="Reports generated" value="246" note="18 this month" /><Metric icon={Clock3} label="In progress" value="06" note="Across 4 clients" /></section>
    <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_300px]"><div className="rounded-2xl border border-[#e8dfd3] bg-white"><div className="flex items-center justify-between border-b border-[#eee7dc] px-5 py-5 sm:px-6"><div><h3 className="font-serif text-lg font-semibold text-[#24354c]">Recent reports</h3><p className="mt-1 text-xs text-[#9a8d7e]">Your latest client reports</p></div><button onClick={() => setView('reports')} className="flex items-center gap-1 text-xs font-semibold text-[#ad7b40] hover:text-[#805526]">View all <ArrowRight className="size-3.5" /></button></div><div className="divide-y divide-[#f1ebe2]">{reports.slice(0, 4).map((report) => <ReportRow key={report.client} report={report} setView={setView} />)}</div></div><div className="rounded-2xl bg-[#24354c] p-6 text-white"><div className="mb-7 flex size-10 items-center justify-center rounded-xl bg-[#d6b47b]/15 text-[#d6b47b]"><Sparkles className="size-5" /></div><h3 className="font-serif text-xl">Create a new report</h3><p className="mt-2 text-sm leading-6 text-[#c6cbd1]">Turn your client&apos;s numbers into a thoughtful, personal story.</p><Button onClick={() => setView('generate')} className="mt-7 h-11 w-full rounded-xl bg-[#d6b47b] font-semibold text-[#24354c] hover:bg-[#e6c98f]">Generate report <ArrowRight data-icon="inline-end" /></Button><div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-[11px] text-[#b9c0c9]"><Check className="size-3.5 text-[#d6b47b]" /> Secure &amp; confidential workspace</div></div></section>
  </div>
}

function Metric({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: string; note: string }) { return <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5"><div className="flex items-start justify-between"><div><p className="text-xs text-[#8e8478]">{label}</p><p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">{value}</p></div><div className="flex size-9 items-center justify-center rounded-xl bg-[#f3eadc] text-[#ad7b40]"><Icon className="size-[18px]" /></div></div><p className="mt-4 text-[11px] text-[#7d9579]">{note}</p></div> }
function ReportRow({ report, setView }: { report: Report; setView: (v: View) => void }) { return <div className="flex items-center gap-3 px-5 py-4 sm:px-6"><div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${report.tone === 'plum' ? 'bg-[#eee3ee] text-[#76536f]' : report.tone === 'terracotta' ? 'bg-[#f6e5dd] text-[#a55f46]' : report.tone === 'olive' ? 'bg-[#e7eddf] text-[#66805c]' : 'bg-[#e2e9f0] text-[#526b84]'}`}>{report.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#3e3a35]">{report.client}</p><p className="mt-0.5 text-[11px] text-[#9a8d7e]">{report.version} · {report.date}</p></div><StatusBadge status={report.status} /><button onClick={() => setView('reports')} className="hidden rounded-lg p-2 text-[#958778] hover:bg-[#f6f0e7] sm:block" aria-label={`Open ${report.client} report`}><ArrowRight className="size-4" /></button></div> }

function ReportsPage({ setView }: { setView: (v: View) => void }) { const { reports } = usePortalData(); return <div className="p-5 sm:p-8 lg:p-10"><PageIntro eyebrow="Workspace" title="Reports" description="Review, download, and manage all client reports." action={<Button onClick={() => setView('generate')} className="h-11 rounded-xl bg-[#24354c] px-5 text-sm text-white hover:bg-[#30445f]"><Sparkles data-icon="inline-start" />Generate report</Button>} /><div className="mb-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3.5 top-3 size-4 text-[#aa9c8c]" /><input placeholder="Search reports..." className="h-10 w-full rounded-xl border border-[#e8dfd3] bg-white pl-10 pr-4 text-sm outline-none ring-[#d6b47b] placeholder:text-[#b1a597] focus:ring-2" /></div><button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e8dfd3] bg-white px-4 text-sm text-[#6f665b]"><CalendarDays className="size-4" /> Date range <ChevronDown className="size-3.5" /></button></div><div className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white"><div className="min-w-[650px]"><div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] border-b border-[#eee7dc] bg-[#fcfaf6] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#aa9c8c]"><span>Client</span><span>Date of birth</span><span>Version</span><span>Status</span><span className="text-right">Action</span></div>{reports.map((report) => <div key={report.client} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] items-center border-b border-[#f1ebe2] px-5 py-4 last:border-0"><div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-full bg-[#eee3ee] text-[10px] font-semibold text-[#76536f]">{report.initials}</div><span className="text-sm font-medium text-[#3e3a35]">{report.client}</span></div><span className="text-xs text-[#81776b]">{report.dob}</span><span className="text-xs text-[#81776b]">{report.version}</span><span><StatusBadge status={report.status} /></span><div className="flex justify-end">{report.status === 'Ready' ? <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#ad7b40] hover:bg-[#f6f0e7]"><Download className="size-3.5" />Download</button> : <span className="text-xs text-[#ad9f91]">In progress</span>}</div></div>)}</div></div></div> }

function ClientsPage({ setView }: { setView: (v: View) => void }) { const { clients } = usePortalData(); return <div className="p-5 sm:p-8 lg:p-10"><PageIntro eyebrow="Workspace" title="Clients" description="Your client relationships, all in one considered space." action={<Button onClick={() => setView('new-client')} className="h-11 rounded-xl bg-[#24354c] px-5 text-sm text-white hover:bg-[#30445f]"><Plus data-icon="inline-start" />New client</Button>} /><div className="mb-5 flex items-center gap-3"><div className="relative flex-1"><Search className="absolute left-3.5 top-3 size-4 text-[#aa9c8c]" /><input placeholder="Search clients..." className="h-10 w-full rounded-xl border border-[#e8dfd3] bg-white pl-10 pr-4 text-sm outline-none ring-[#d6b47b] placeholder:text-[#b1a597] focus:ring-2" /></div><span className="hidden text-xs text-[#9a8d7e] sm:block">128 clients</span></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{clients.map((client) => <button key={client.name} onClick={() => setView('client-detail')} className="text-left rounded-2xl border border-[#e8dfd3] bg-white p-5 transition-shadow hover:shadow-md"><div className="flex items-start justify-between"><div className={`flex size-11 items-center justify-center rounded-full text-xs font-semibold ${client.tone === 'plum' ? 'bg-[#eee3ee] text-[#76536f]' : client.tone === 'terracotta' ? 'bg-[#f6e5dd] text-[#a55f46]' : 'bg-[#e7eddf] text-[#66805c]'}`}>{client.initials}</div><ArrowRight className="size-4 text-[#b4a697]" /></div><h3 className="mt-5 font-serif text-lg font-semibold text-[#24354c]">{client.name}</h3><p className="mt-1 text-xs text-[#8d8275]">{client.email}</p><div className="mt-5 flex items-center justify-between border-t border-[#f1ebe2] pt-4 text-[11px] text-[#9a8d7e]"><span>{client.phone}</span><span>Joined {client.joined}</span></div></button>)}</div></div> }

function FormPage({ setView, clientDetail = false }: { setView: (v: View) => void; clientDetail?: boolean }) { const { reports } = usePortalData(); return <div className="p-5 sm:p-8 lg:p-10"><button onClick={() => setView(clientDetail ? 'clients' : 'dashboard')} className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f] hover:text-[#805526]">← Back to {clientDetail ? 'clients' : 'dashboard'}</button><PageIntro eyebrow={clientDetail ? 'Client profile' : 'Client management'} title={clientDetail ? 'Ananya Sharma' : 'Add a new client'} description={clientDetail ? 'A clear view of client details and report history.' : 'Capture the essentials before creating a personal report.'} />{clientDetail ? <div className="grid gap-6 xl:grid-cols-[320px_1fr]"><div className="rounded-2xl border border-[#e8dfd3] bg-white p-6"><div className="flex size-16 items-center justify-center rounded-full bg-[#eee3ee] font-serif text-xl font-semibold text-[#76536f]">AS</div><h3 className="mt-5 font-serif text-xl font-semibold text-[#24354c]">Ananya Sharma</h3><p className="mt-1 text-sm text-[#8d8275]">ananya.s@email.com</p><div className="mt-6 flex flex-col gap-4 border-t border-[#f1ebe2] pt-5 text-sm"><div><p className="text-[10px] uppercase tracking-wider text-[#aa9c8c]">Date of birth</p><p className="mt-1 text-[#4f4840]">14 August 1992</p></div><div><p className="text-[10px] uppercase tracking-wider text-[#aa9c8c]">Mobile</p><p className="mt-1 text-[#4f4840]">+91 98765 43210</p></div></div><Button onClick={() => setView('generate')} className="mt-7 h-11 w-full rounded-xl bg-[#24354c] text-white hover:bg-[#30445f]"><Sparkles data-icon="inline-start" />Generate new report</Button></div><div className="rounded-2xl border border-[#e8dfd3] bg-white"><div className="border-b border-[#eee7dc] px-6 py-5"><h3 className="font-serif text-lg font-semibold text-[#24354c]">Previous reports</h3></div>{reports.filter(r => r.client === 'Ananya Sharma').concat(reports.slice(2, 3)).map(r => <ReportRow key={r.client + r.version} report={r} setView={setView} />)}</div></div> : <div className="max-w-2xl rounded-2xl border border-[#e8dfd3] bg-white p-5 sm:p-7"><div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d] sm:col-span-2">Full name<input className="h-11 rounded-xl border border-[#e8dfd3] px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]" placeholder="e.g. Ananya Sharma" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Date of birth<input type="date" className="h-11 rounded-xl border border-[#e8dfd3] px-3 text-sm font-normal text-[#6d665d] outline-none focus:ring-2 focus:ring-[#d6b47b]" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Mobile number<input className="h-11 rounded-xl border border-[#e8dfd3] px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]" placeholder="+91" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d] sm:col-span-2">Email address<input type="email" className="h-11 rounded-xl border border-[#e8dfd3] px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]" placeholder="name@email.com" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d] sm:col-span-2">Notes <textarea rows={4} className="resize-none rounded-xl border border-[#e8dfd3] px-3 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]" placeholder="Anything important to remember about this client..." /></label></div><div className="mt-6 flex justify-end gap-3 border-t border-[#f1ebe2] pt-5"><Button variant="outline" onClick={() => setView('dashboard')} className="h-10 rounded-xl border-[#e8dfd3]">Cancel</Button><Button onClick={() => setView('clients')} className="h-10 rounded-xl bg-[#24354c] text-white hover:bg-[#30445f]">Save client</Button></div></div>}</div> }

function GeneratePage({ setView }: { setView: (v: View) => void }) { return <div className="p-5 sm:p-8 lg:p-10"><button onClick={() => setView('dashboard')} className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]">← Back to dashboard</button><PageIntro eyebrow="Report studio" title="Generate a report" description="Choose a client and report version. Calculation and PDF generation are handled securely by the backend." /><div className="max-w-2xl rounded-2xl border border-[#e8dfd3] bg-white p-5 sm:p-7"><div className="flex flex-col gap-5"><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Select client<select className="h-11 rounded-xl border border-[#e8dfd3] bg-white px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]"><option>Ananya Sharma — 14 Aug 1992</option><option>Rohan Mehta — 03 Feb 1988</option><option>Priya Nair — 27 Nov 1995</option></select></label><fieldset><legend className="mb-3 text-xs font-semibold text-[#5f574d]">Report version</legend><div className="grid gap-3 sm:grid-cols-2"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#d6b47b] bg-[#fcf7ed] p-4"><input type="radio" name="version" defaultChecked className="accent-[#24354c]" /><span><span className="block text-sm font-semibold text-[#3f3932]">Version 3</span><span className="mt-1 block text-xs text-[#958878]">Comprehensive client report</span></span><Check className="ml-auto size-4 text-[#ad7b40]" /></label><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e8dfd3] p-4"><input type="radio" name="version" className="accent-[#24354c]" /><span><span className="block text-sm font-semibold text-[#3f3932]">Version 2</span><span className="mt-1 block text-xs text-[#958878]">Essential client report</span></span></label></div></fieldset><div className="flex items-start gap-3 rounded-xl bg-[#f5f0e8] p-4 text-xs leading-5 text-[#7c6d5b]"><CircleHelp className="mt-0.5 size-4 shrink-0 text-[#ad7b40]" /><p>Your report will be securely processed. You can continue working while it is being prepared.</p></div></div><div className="mt-7 flex justify-end border-t border-[#f1ebe2] pt-5"><Button onClick={() => setView('reports')} className="h-11 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"><Sparkles data-icon="inline-start" />Generate report</Button></div></div></div> }

export function ReportPortal({ onSignOut, userId, reportItems, clientItems }: { onSignOut: () => Promise<void>; userId: string; reportItems: readonly Report[]; clientItems: readonly Client[] }) {
  const [view, setView] = useState<View>('dashboard')
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('Team member')
  const titles: Record<View, string> = { dashboard: 'Dashboard', clients: 'Clients', reports: 'Reports', 'new-client': 'New client', generate: 'Generate report', 'client-detail': 'Client detail' }

  useEffect(() => {
    let active = true
    const loadProfile = async () => {
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== userId || !active) return
      const { data: profile, error } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      if (!active) return
      if (error) { setFullName('Team member'); return }
      setFullName(profile?.full_name?.trim() || 'Team member')
    }
    void loadProfile()
    return () => { active = false }
  }, [userId])

  const initials = useMemo(() => fullName.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase(), [fullName])
  const firstName = fullName.split(' ')[0] || 'there'
  return <PortalDataContext.Provider value={{ reports: reportItems, clients: clientItems }}><div className="min-h-screen bg-[#f7f3ed] text-[#3e3a35]"><div className="flex min-h-screen"><Sidebar view={view} setView={setView} open={open} setOpen={setOpen} fullName={fullName} initials={initials} onSignOut={onSignOut} /><div className="min-w-0 flex-1"><Header title={titles[view]} setOpen={setOpen} fullName={fullName} initials={initials} /><main>{view === 'dashboard' && <Dashboard setView={setView} firstName={firstName} />}{view === 'clients' && <ClientsPage setView={setView} />}{view === 'reports' && <ReportsPage setView={setView} />}{view === 'new-client' && <FormPage setView={setView} />}{view === 'generate' && <GeneratePage setView={setView} />}{view === 'client-detail' && <FormPage setView={setView} clientDetail />}</main></div></div></div></PortalDataContext.Provider>
}

export function LoginPage({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) { const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const submit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setError(''); setLoading(true); const formData = new FormData(event.currentTarget); try { await onLogin(String(formData.get('email') ?? ''), String(formData.get('password') ?? '')) } catch (error) { setError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.') } finally { setLoading(false) } }; return <main className="flex min-h-screen bg-[#24354c]"><div className="hidden flex-1 flex-col justify-between overflow-hidden p-10 lg:flex"><Logo compact={false} /><div className="relative max-w-lg pb-10"><div className="absolute -left-24 -top-32 size-96 rounded-full border border-[#d6b47b]/20" /><div className="absolute -bottom-20 -right-24 size-72 rounded-full border border-[#d6b47b]/15" /><p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#d6b47b]">The Swastik Indian Art</p><h1 className="font-serif text-6xl leading-[1.05] text-[#fffdf9]">Insights<br /><span className="text-[#d6b47b]">with intention.</span></h1><p className="mt-6 max-w-sm text-sm leading-7 text-[#bdc5cd]">A considered space for creating meaningful numerology reports for every client story.</p></div><p className="text-[10px] uppercase tracking-[0.18em] text-[#8997a6]">© 2024 TSIA · Private workspace</p></div><div className="flex w-full items-center justify-center bg-[#fffdf9] px-6 py-10 sm:px-12 lg:max-w-[520px]"><div className="w-full max-w-[360px]"><div className="mb-12 lg:hidden"><Logo /></div><div className="mb-9"><div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#f3eadc] text-[#ad7b40]"><Fingerprint className="size-6" /></div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">Welcome back</p><h2 className="font-serif text-3xl font-semibold text-[#24354c]">Sign in to your portal</h2><p className="mt-3 text-sm leading-6 text-[#81776b]">Use your TSIA team credentials to continue.</p></div><form onSubmit={submit} className="flex flex-col gap-5"><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Email address<input required type="email" name="email" placeholder="you@tsia.in" className="h-12 rounded-xl border border-[#e8dfd3] bg-white px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Password<input required name="password" type="password" placeholder="Enter your password" className="h-12 rounded-xl border border-[#e8dfd3] bg-white px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b]" /></label><div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-[#81776b]"><input type="checkbox" className="accent-[#24354c]" /> Remember me</label><button type="button" className="font-semibold text-[#ad7b40]">Forgot password?</button></div><Button type="submit" className="mt-2 h-12 rounded-xl bg-[#24354c] text-white hover:bg-[#30445f]">Sign in <ArrowRight data-icon="inline-end" /></Button>{error && <p role="alert" className="text-sm text-[#a55f46]">{error}</p>}</form><p className="mt-10 text-center text-[11px] leading-5 text-[#aa9c8c]">This is a private workspace for authorized TSIA team members.<br />Need access? Contact your administrator.</p></div></div></main> }

export default function PortalApp() { const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null); const [authLoading, setAuthLoading] = useState(true); useEffect(() => { if (!supabase) { setAuthLoading(false); return } let active = true; void supabase.auth.getSession().then(({ data }) => { if (active) { setSession(data.session); setAuthLoading(false) } }); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => { if (active) setSession(nextSession) }); return () => { active = false; subscription.unsubscribe() } }, []); const signIn = async (email: string, password: string) => { if (!supabase) throw new Error('Authentication is unavailable. Please try again later.'); const { data, error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; if (!data.session) throw new Error('Sign in did not create a session. Please try again.'); setSession(data.session) }; const signOut = async () => { if (!supabase) return; const { error } = await supabase.auth.signOut(); if (error) throw error; setSession(null) }; if (authLoading) return <div className="min-h-screen bg-[#24354c]" />; return session ? <ReportPortal key={session.user.id} userId={session.user.id} onSignOut={signOut} /> : <LoginPage onLogin={signIn} /> }

export { BookOpen, BarChart3, ClipboardList }
