'use client'

import { useState, useTransition } from 'react'
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Download,
  FileText,
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
import { Logo } from '@/components/portal-logo'
import { signOut } from '@/app/actions/auth'
import type { Client, Report, Tone } from '@/lib/portal-types'

type View = 'dashboard' | 'clients' | 'reports' | 'new-client' | 'generate'

const NOT_AVAILABLE = 'Not available yet'
const disabledControl = 'disabled:cursor-not-allowed disabled:opacity-50'

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
]

const toneClasses: Record<Tone, string> = {
  plum: 'bg-[#eee3ee] text-[#76536f]',
  terracotta: 'bg-[#f6e5dd] text-[#a55f46]',
  olive: 'bg-[#e7eddf] text-[#66805c]',
  navy: 'bg-[#e2e9f0] text-[#526b84]',
}

function getInitials(fullName: string) {
  return fullName.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

function StatusBadge({ status }: { status: Report['status'] }) {
  const ready = status === 'Ready'
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${ready ? 'bg-[#e7f1e8] text-[#3f7650]' : 'bg-[#fff3dc] text-[#a26a1b]'}`}><span className={`size-1.5 rounded-full ${ready ? 'bg-[#5e9a68]' : 'bg-[#d68a29]'}`} />{status}</span>
}

function EmptyState({ message }: { message: string }) {
  return <p className="px-5 py-10 text-center text-sm text-[#9a8d7e] sm:px-6">{message}</p>
}

function Sidebar({ view, setView, open, setOpen, fullName, initials }: { view: View; setView: (v: View) => void; open: boolean; setOpen: (v: boolean) => void; fullName: string; initials: string }) {
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const [signingOut, startSignOut] = useTransition()

  const handleSignOut = () => {
    setSignOutError(null)
    startSignOut(async () => {
      const result = await signOut()
      if (result?.error) setSignOutError(result.error)
    })
  }

  return <>
    {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-[#24354c]/25 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#e8dfd3] bg-[#fbf8f2] px-5 py-7 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-12 flex items-center justify-between px-2"><Logo /><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="size-5" /></button></div>
      <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad9a84]">Workspace</p>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setView(id); setOpen(false) }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${view === id ? 'bg-[#24354c] font-medium text-white shadow-sm' : 'text-[#6d665d] hover:bg-[#f0e9de]'}`}><Icon className="size-[18px]" />{label}</button>)}
      </nav>
      <div className="mt-auto flex flex-col gap-1 border-t border-[#e8dfd3] pt-5">
        <button disabled title={NOT_AVAILABLE} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d] hover:bg-[#f0e9de] ${disabledControl}`}><Settings className="size-[18px]" />Settings</button>
        <button onClick={handleSignOut} disabled={signingOut} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d] hover:bg-[#f0e9de] ${disabledControl}`}><LogOut className="size-[18px]" />{signingOut ? 'Signing out…' : 'Sign out'}</button>
        {signOutError && <p role="alert" className="px-3 text-xs text-[#a55f46]">{signOutError}</p>}
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f0e9de]/70 p-3"><div className="flex size-8 items-center justify-center rounded-full bg-[#d6b47b] text-xs font-semibold text-[#24354c]">{initials}</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#3e3a35]">{fullName}</p><p className="text-[10px] text-[#9a8b7b]">Administrator</p></div><ChevronDown aria-hidden className="ml-auto size-3.5 text-[#a79582]" /></div>
      </div>
    </aside>
  </>
}

function Header({ title, setOpen, fullName, initials }: { title: string; setOpen: (v: boolean) => void; fullName: string; initials: string }) {
  return <header className="flex h-[76px] items-center justify-between border-b border-[#e8dfd3] bg-[#fffdf9] px-5 sm:px-8 lg:px-10"><div className="flex items-center gap-4"><button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="size-5 text-[#24354c]" /></button><div><p className="text-[11px] uppercase tracking-[0.18em] text-[#a79582]">TSIA Report Portal</p><h1 className="font-serif text-xl font-semibold text-[#24354c]">{title}</h1></div></div><div className="flex items-center gap-3"><button disabled title={NOT_AVAILABLE} className={`relative rounded-full p-2.5 text-[#7a7065] hover:bg-[#f4ede2] ${disabledControl}`} aria-label="Notifications (not available yet)"><Bell className="size-[18px]" /></button><div className="hidden h-7 w-px bg-[#e8dfd3] sm:block" /><div className="hidden items-center gap-2 sm:flex"><div className="flex size-8 items-center justify-center rounded-full bg-[#d6b47b] text-xs font-semibold text-[#24354c]">{initials}</div><span className="text-sm font-medium text-[#4b4741]">{fullName}</span></div></div></header>
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) { return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">{eyebrow}</p><h2 className="font-serif text-[30px] font-medium leading-tight text-[#24354c]">{title}</h2>{description && <p className="mt-2 max-w-xl text-sm leading-6 text-[#81776b]">{description}</p>}</div>{action}</div> }

function Metric({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: string; note: string }) { return <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5"><div className="flex items-start justify-between"><div><p className="text-xs text-[#8e8478]">{label}</p><p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">{value}</p></div><div className="flex size-9 items-center justify-center rounded-xl bg-[#f3eadc] text-[#ad7b40]"><Icon className="size-[18px]" /></div></div><p className="mt-4 text-[11px] text-[#7d9579]">{note}</p></div> }

function ReportRow({ report, setView }: { report: Report; setView: (v: View) => void }) { return <div className="flex items-center gap-3 px-5 py-4 sm:px-6"><div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${toneClasses[report.tone]}`}>{report.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#3e3a35]">{report.client}</p><p className="mt-0.5 text-[11px] text-[#9a8d7e]">{report.version} · {report.date}</p></div><StatusBadge status={report.status} /><button onClick={() => setView('reports')} className="hidden rounded-lg p-2 text-[#958778] hover:bg-[#f6f0e7] sm:block" aria-label={`Open ${report.client} report`}><ArrowRight className="size-4" /></button></div> }

function Dashboard({ setView, firstName, reports }: { setView: (v: View) => void; firstName: string; reports: Report[] }) {
  return <div className="p-5 sm:p-8 lg:p-10"><PageIntro eyebrow="Thursday, 19 September 2024" title={`Good morning, ${firstName}`} description="Keep your client insights moving with clarity and intention." action={<Button onClick={() => setView('new-client')} className="h-11 rounded-xl bg-[#24354c] px-5 text-sm text-white hover:bg-[#30445f]"><Plus data-icon="inline-start" />New client</Button>} />
    <section className="grid gap-4 sm:grid-cols-3"><Metric icon={Users} label="Total clients" value="128" note="12 added this month" /><Metric icon={FileText} label="Reports generated" value="246" note="18 this month" /><Metric icon={Clock3} label="In progress" value="06" note="Across 4 clients" /></section>
    <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_300px]"><div className="rounded-2xl border border-[#e8dfd3] bg-white"><div className="flex items-center justify-between border-b border-[#eee7dc] px-5 py-5 sm:px-6"><div><h3 className="font-serif text-lg font-semibold text-[#24354c]">Recent reports</h3><p className="mt-1 text-xs text-[#9a8d7e]">Your latest client reports</p></div><button onClick={() => setView('reports')} className="flex items-center gap-1 text-xs font-semibold text-[#ad7b40] hover:text-[#805526]">View all <ArrowRight className="size-3.5" /></button></div><div className="divide-y divide-[#f1ebe2]">{reports.length === 0 ? <EmptyState message="No reports to show yet." /> : reports.slice(0, 4).map((report) => <ReportRow key={report.id} report={report} setView={setView} />)}</div></div><div className="rounded-2xl bg-[#24354c] p-6 text-white"><div className="mb-7 flex size-10 items-center justify-center rounded-xl bg-[#d6b47b]/15 text-[#d6b47b]"><Sparkles className="size-5" /></div><h3 className="font-serif text-xl">Create a new report</h3><p className="mt-2 text-sm leading-6 text-[#c6cbd1]">Turn your client&apos;s numbers into a thoughtful, personal story.</p><Button onClick={() => setView('generate')} className="mt-7 h-11 w-full rounded-xl bg-[#d6b47b] font-semibold text-[#24354c] hover:bg-[#e6c98f]">Generate report <ArrowRight data-icon="inline-end" /></Button><div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-[11px] text-[#b9c0c9]"><Check className="size-3.5 text-[#d6b47b]" /> Secure &amp; confidential workspace</div></div></section>
  </div>
}

function ReportsPage({ setView, reports }: { setView: (v: View) => void; reports: Report[] }) {
  return <div className="p-5 sm:p-8 lg:p-10"><PageIntro eyebrow="Workspace" title="Reports" description="Review, download, and manage all client reports." action={<Button onClick={() => setView('generate')} className="h-11 rounded-xl bg-[#24354c] px-5 text-sm text-white hover:bg-[#30445f]"><Sparkles data-icon="inline-start" />Generate report</Button>} /><div className="mb-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3.5 top-3 size-4 text-[#aa9c8c]" /><input disabled title={NOT_AVAILABLE} aria-label="Search reports (not available yet)" placeholder="Search reports..." className={`h-10 w-full rounded-xl border border-[#e8dfd3] bg-white pl-10 pr-4 text-sm outline-none ring-[#d6b47b] placeholder:text-[#b1a597] focus:ring-2 ${disabledControl}`} /></div><button disabled title={NOT_AVAILABLE} className={`flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e8dfd3] bg-white px-4 text-sm text-[#6f665b] ${disabledControl}`}><CalendarDays className="size-4" /> Date range <ChevronDown className="size-3.5" /></button></div><div className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white"><div className="min-w-[650px]"><div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] border-b border-[#eee7dc] bg-[#fcfaf6] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#aa9c8c]"><span>Client</span><span>Date of birth</span><span>Version</span><span>Status</span><span className="text-right">Action</span></div>{reports.length === 0 ? <EmptyState message="No reports to show yet." /> : reports.map((report) => <div key={report.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] items-center border-b border-[#f1ebe2] px-5 py-4 last:border-0"><div className="flex items-center gap-3"><div className={`flex size-8 items-center justify-center rounded-full text-[10px] font-semibold ${toneClasses[report.tone]}`}>{report.initials}</div><span className="text-sm font-medium text-[#3e3a35]">{report.client}</span></div><span className="text-xs text-[#81776b]">{report.dob}</span><span className="text-xs text-[#81776b]">{report.version}</span><span><StatusBadge status={report.status} /></span><div className="flex justify-end">{report.status === 'Ready' ? <button disabled title={NOT_AVAILABLE} className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#ad7b40] hover:bg-[#f6f0e7] ${disabledControl}`}><Download className="size-3.5" />Download</button> : <span className="text-xs text-[#ad9f91]">In progress</span>}</div></div>)}</div></div></div>
}

function ClientsPage({ setView, clients }: { setView: (v: View) => void; clients: Client[] }) {
  return <div className="p-5 sm:p-8 lg:p-10"><PageIntro eyebrow="Workspace" title="Clients" description="Your client relationships, all in one considered space." action={<Button onClick={() => setView('new-client')} className="h-11 rounded-xl bg-[#24354c] px-5 text-sm text-white hover:bg-[#30445f]"><Plus data-icon="inline-start" />New client</Button>} /><div className="mb-5 flex items-center gap-3"><div className="relative flex-1"><Search className="absolute left-3.5 top-3 size-4 text-[#aa9c8c]" /><input disabled title={NOT_AVAILABLE} aria-label="Search clients (not available yet)" placeholder="Search clients..." className={`h-10 w-full rounded-xl border border-[#e8dfd3] bg-white pl-10 pr-4 text-sm outline-none ring-[#d6b47b] placeholder:text-[#b1a597] focus:ring-2 ${disabledControl}`} /></div><span className="hidden text-xs text-[#9a8d7e] sm:block">128 clients</span></div>{clients.length === 0 ? <div className="rounded-2xl border border-[#e8dfd3] bg-white"><EmptyState message="No clients to show yet." /></div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{clients.map((client) => <div key={client.id} className="rounded-2xl border border-[#e8dfd3] bg-white p-5 text-left"><div className="flex items-start justify-between"><div className={`flex size-11 items-center justify-center rounded-full text-xs font-semibold ${toneClasses[client.tone]}`}>{client.initials}</div></div><h3 className="mt-5 font-serif text-lg font-semibold text-[#24354c]">{client.name}</h3><p className="mt-1 text-xs text-[#8d8275]">{client.email}</p><div className="mt-5 flex items-center justify-between border-t border-[#f1ebe2] pt-4 text-[11px] text-[#9a8d7e]"><span>{client.phone}</span><span>Joined {client.joined}</span></div></div>)}</div>}</div>
}

function NewClientPage({ setView }: { setView: (v: View) => void }) {
  return <div className="p-5 sm:p-8 lg:p-10"><button onClick={() => setView('dashboard')} className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f] hover:text-[#805526]">← Back to dashboard</button><PageIntro eyebrow="Client management" title="Add a new client" description="Capture the essentials before creating a personal report." /><div className="max-w-2xl rounded-2xl border border-[#e8dfd3] bg-white p-5 sm:p-7"><fieldset className="grid gap-5 sm:grid-cols-2">><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d] sm:col-span-2">Full name<input className="h-11 rounded-xl border border-[#e8dfd3] px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b] disabled:cursor-not-allowed" placeholder="Client's full name" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Date of birth<input type="date" className="h-11 rounded-xl border border-[#e8dfd3] px-3 text-sm font-normal text-[#6d665d] outline-none focus:ring-2 focus:ring-[#d6b47b] disabled:cursor-not-allowed" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Mobile number<input className="h-11 rounded-xl border border-[#e8dfd3] px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b] disabled:cursor-not-allowed" placeholder="+91" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d] sm:col-span-2">Email address<input type="email" className="h-11 rounded-xl border border-[#e8dfd3] px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b] disabled:cursor-not-allowed" placeholder="name@email.com" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d] sm:col-span-2">Notes <textarea rows={4} className="resize-none rounded-xl border border-[#e8dfd3] px-3 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b] disabled:cursor-not-allowed" placeholder="Anything important to remember about this client..." /></label></fieldset><div className="mt-6 flex items-center justify-end gap-3 border-t border-[#f1ebe2] pt-5"><p className="mr-auto text-xs text-[#9a8d7e]">Adding clients is not available yet.</p><Button variant="outline" onClick={() => setView('dashboard')} className="h-10 rounded-xl border-[#e8dfd3]">Cancel</Button><Button disabled title={NOT_AVAILABLE} className="h-10 rounded-xl bg-[#24354c] text-white hover:bg-[#30445f]">Save client</Button></div></div></div>
}

function GeneratePage({ setView, clients }: { setView: (v: View) => void; clients: Client[] }) {
  return <div className="p-5 sm:p-8 lg:p-10"><button onClick={() => setView('dashboard')} className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]">← Back to dashboard</button><PageIntro eyebrow="Report studio" title="Generate a report" description="Choose a client and report version. Calculation and PDF generation are handled securely by the backend." /><div className="max-w-2xl rounded-2xl border border-[#e8dfd3] bg-white p-5 sm:p-7"><fieldset disabled title={NOT_AVAILABLE} className="flex flex-col gap-5 opacity-60"><label className="flex flex-col gap-2 text-xs font-semibold text-[#5f574d]">Select client<select className="h-11 rounded-xl border border-[#e8dfd3] bg-white px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#d6b47b] disabled:cursor-not-allowed">{clients.length === 0 ? <option>No clients available</option> : clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label><div><p className="mb-3 text-xs font-semibold text-[#5f574d]">Report version</p><div className="grid gap-3 sm:grid-cols-2"><label className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-[#d6b47b] bg-[#fcf7ed] p-4"><input type="radio" name="version" defaultChecked className="accent-[#24354c]" /><span><span className="block text-sm font-semibold text-[#3f3932]">Version 3</span><span className="mt-1 block text-xs text-[#958878]">Comprehensive client report</span></span><Check className="ml-auto size-4 text-[#ad7b40]" /></label><label className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-[#e8dfd3] p-4"><input type="radio" name="version" className="accent-[#24354c]" /><span><span className="block text-sm font-semibold text-[#3f3932]">Version 2</span><span className="mt-1 block text-xs text-[#958878]">Essential client report</span></span></label></div></div></fieldset><div className="mt-5 flex items-start gap-3 rounded-xl bg-[#f5f0e8] p-4 text-xs leading-5 text-[#7c6d5b]"><CircleHelp className="mt-0.5 size-4 shrink-0 text-[#ad7b40]" /><p>Report generation is not available yet. Once enabled, reports will be securely processed while you continue working.</p></div><div className="mt-7 flex justify-end border-t border-[#f1ebe2] pt-5"><Button disabled title={NOT_AVAILABLE} className="h-11 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"><Sparkles data-icon="inline-start" />Generate report</Button></div></div></div>
}

const titles: Record<View, string> = { dashboard: 'Dashboard', clients: 'Clients', reports: 'Reports', 'new-client': 'New client', generate: 'Generate report' }

export function ReportPortal({ fullName, reports, clients }: { fullName: string; reports: Report[]; clients: Client[] }) {
  const [view, setView] = useState<View>('dashboard')
  const [open, setOpen] = useState(false)
  const initials = getInitials(fullName)
  const firstName = fullName.split(/\s+/)[0] || 'there'

  return <div className="min-h-screen bg-[#f7f3ed] text-[#3e3a35]"><div className="flex min-h-screen"><Sidebar view={view} setView={setView} open={open} setOpen={setOpen} fullName={fullName} initials={initials} /><div className="min-w-0 flex-1"><Header title={titles[view]} setOpen={setOpen} fullName={fullName} initials={initials} /><main>{view === 'dashboard' && <Dashboard setView={setView} firstName={firstName} reports={reports} />}{view === 'clients' && <ClientsPage setView={setView} clients={clients} />}{view === 'reports' && <ReportsPage setView={setView} reports={reports} />}{view === 'new-client' && <NewClientPage setView={setView} />}{view === 'generate' && <GeneratePage setView={setView} clients={clients} />}</main></div></div></div>
}
