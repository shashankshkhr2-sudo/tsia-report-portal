'use client'

import { useState, useTransition } from 'react'
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  Clock3,
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
import { addClient } from '@/app/actions/clients'

import type {
  Client,
  ClientSourceOption,
  EmployeeOption,
  Report,
  Tone,
} from '@/lib/portal-types'

type View =
  | 'dashboard'
  | 'clients'
  | 'reports'
  | 'new-client'
  | 'generate'

const toneClasses: Record<Tone, string> = {
  plum: 'bg-[#eee3ee] text-[#76536f]',
  terracotta: 'bg-[#f6e5dd] text-[#a55f46]',
  olive: 'bg-[#e7eddf] text-[#66805c]',
  navy: 'bg-[#e2e9f0] text-[#526b84]',
}

const inputClass =
  'h-11 w-full rounded-xl border border-[#e5dccf] bg-white px-3 text-sm font-normal text-[#3e3a35] outline-none focus:border-[#d6b47b] focus:ring-2 focus:ring-[#d6b47b]/20'

const labelClass =
  'flex flex-col gap-2 text-xs font-semibold text-[#5f574d]'

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Sidebar({
  view,
  setView,
  open,
  setOpen,
  fullName,
}: {
  view: View
  setView: (view: View) => void
  open: boolean
  setOpen: (open: boolean) => void
  fullName: string
}) {
  const [signingOut, startSignOut] = useTransition()

  const items: {
    id: View
    label: string
    icon: typeof LayoutDashboard
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
    },
  ]

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-[#24354c]/25 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#e8dfd3] bg-[#fbf8f2] px-5 py-7 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-12 flex items-center justify-between px-2">
          <Logo />

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad9a84]">
          Workspace
        </p>

        <nav className="flex flex-col gap-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setView(id)
                setOpen(false)
              }}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                view === id
                  ? 'bg-[#24354c] font-medium text-white'
                  : 'text-[#6d665d] hover:bg-[#f0e9de]'
              }`}
            >
              <Icon className="size-[18px]" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#e8dfd3] pt-5">
          <button
            disabled
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d] opacity-50"
          >
            <Settings className="size-[18px]" />
            Settings
          </button>

          <button
            disabled={signingOut}
            onClick={() => {
              startSignOut(async () => {
                await signOut()
              })
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d]"
          >
            <LogOut className="size-[18px]" />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f0e9de]/70 p-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#d6b47b] text-xs font-semibold text-[#24354c]">
              {getInitials(fullName)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#3e3a35]">
                {fullName}
              </p>

              <p className="text-[10px] text-[#9a8b7b]">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({
  title,
  fullName,
  setOpen,
}: {
  title: string
  fullName: string
  setOpen: (open: boolean) => void
}) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[#e8dfd3] bg-[#fffdf9] px-5 sm:px-8 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5 text-[#24354c]" />
        </button>

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#a79582]">
            TSIA Report Portal
          </p>

          <h1 className="font-serif text-xl font-semibold text-[#24354c]">
            {title}
          </h1>
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#d6b47b] text-xs font-semibold text-[#24354c]">
          {getInitials(fullName)}
        </div>

        <span className="text-sm font-medium text-[#4b4741]">
          {fullName}
        </span>
      </div>
    </header>
  )
}

function PageTitle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
          {eyebrow}
        </p>

        <h2 className="font-serif text-[30px] font-medium text-[#24354c]">
          {title}
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#81776b]">
          {description}
        </p>
      </div>

      {children}
    </div>
  )
}

function Dashboard({
  setView,
  fullName,
  clients,
  reports,
}: {
  setView: (view: View) => void
  fullName: string
  clients: Client[]
  reports: Report[]
}) {
  const processing = reports.filter(
    (report) => report.status === 'Processing'
  ).length

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Your workspace"
        title={`Good morning, ${fullName.split(/\s+/)[0] || 'there'}`}
        description="Manage clients and prepare personalized TSIA reports."
      >
        <Button
          onClick={() => setView('new-client')}
          className="h-11 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
        >
          <Plus className="mr-2 size-4" />
          Add Client
        </Button>
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: 'My Clients',
            value: clients.length,
            icon: Users,
          },
          {
            label: 'Reports',
            value: reports.length,
            icon: FileText,
          },
          {
            label: 'In Progress',
            value: processing,
            icon: Clock3,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#e8dfd3] bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#8e8478]">
                  {label}
                </p>

                <p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">
                  {value}
                </p>
              </div>

              <div className="flex size-9 items-center justify-center rounded-xl bg-[#f3eadc] text-[#ad7b40]">
                <Icon className="size-[18px]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-[#24354c] p-6 text-white">
        <Sparkles className="size-5 text-[#d6b47b]" />

        <h3 className="mt-5 font-serif text-xl">
          Create a new report
        </h3>

        <p className="mt-2 text-sm text-[#c6cbd1]">
          Generate a personalized report for an existing client.
        </p>

        <Button
          onClick={() => setView('generate')}
          className="mt-6 rounded-xl bg-[#d6b47b] text-[#24354c] hover:bg-[#e6c98f]"
        >
          Generate Report
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  )
}

function ClientsPage({
  clients,
  setView,
}: {
  clients: Client[]
  setView: (view: View) => void
}) {
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Client management"
        title="Clients"
        description="Manage clients, reports and customer interactions."
      >
        <Button
          onClick={() => setView('new-client')}
          className="h-11 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
        >
          <Plus className="mr-2 size-4" />
          Add Client
        </Button>
      </PageTitle>

      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 size-4 text-[#aa9c8c]" />

          <input
            disabled
            placeholder="Search Client ID / Name / Mobile / Email"
            className="h-10 w-full rounded-xl border border-[#e8dfd3] bg-white pl-10 pr-4 text-sm opacity-60"
          />
        </div>

        <span className="hidden text-xs text-[#9a8d7e] sm:block">
          {clients.length} {clients.length === 1 ? 'client' : 'clients'}
        </span>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-10 text-center text-sm text-[#9a8d7e]">
          No clients to show yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-2xl border border-[#e8dfd3] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex size-11 items-center justify-center rounded-full text-xs font-semibold ${toneClasses[client.tone]}`}
                >
                  {client.initials}
                </div>

                {client.clientNumber && (
                  <span className="rounded-full bg-[#f5f0e8] px-2.5 py-1 text-[10px] font-semibold text-[#8a765c]">
                    {client.clientNumber}
                  </span>
                )}
              </div>

              <h3 className="mt-5 font-serif text-lg font-semibold text-[#24354c]">
                {client.name}
              </h3>

              <p className="mt-1 text-xs text-[#8d8275]">
                {client.email || 'No email provided'}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#f1ebe2] pt-4 text-[11px] text-[#9a8d7e]">
                <span>{client.phone || 'No mobile'}</span>
                <span>Joined {client.joined}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReportsPage({
  reports,
  setView,
}: {
  reports: Report[]
  setView: (view: View) => void
}) {
  return (
        <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Workspace"
        title="Reports"
        description="Review and manage client reports."
      >
        <Button
          onClick={() => setView('generate')}
          className="h-11 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
        >
          <Sparkles className="mr-2 size-4" />
          Generate Report
        </Button>
      </PageTitle>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-10 text-center text-sm text-[#9a8d7e]">
          No reports to show yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center gap-3 border-b border-[#f1ebe2] px-5 py-4 last:border-0"
            >
              <div
                className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold ${toneClasses[report.tone]}`}
              >
                {report.initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#3e3a35]">
                  {report.client}
                </p>

                <p className="mt-1 text-xs text-[#8d8275]">
                  {report.version} · {report.date}
                </p>
              </div>

              <span className="text-xs text-[#81776b]">
                {report.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({
  number,
  title,
  description,
  children,
}: {
  number: number
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-[#eee7dc] px-5 py-7 last:border-0 sm:px-8">
      <div className="mb-6 flex gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-xs font-semibold text-white">
          {number}
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-[#24354c]">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#948779]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {children}
      </div>
    </section>
  )
}

function NewClientPage({
  setView,
  onAddClient,
  clientSources,
  employees,
}: {
  setView: (view: View) => void
  onAddClient: (client: Client) => void
  clientSources: ClientSourceOption[]
  employees: EmployeeOption[]
}) {
  const [fullName, setFullName] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [birthStateRegion, setBirthStateRegion] = useState('')
  const [birthCountry, setBirthCountry] = useState('India')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [sameWhatsapp, setSameWhatsapp] = useState(true)
  const [whatsapp, setWhatsapp] = useState('')
  const [sourceId, setSourceId] = useState('')
  const [referredBy, setReferredBy] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  const selectedSource = clientSources.find(
    (source) => source.id === sourceId
  )

  const referral =
    selectedSource?.name.trim().toLowerCase() === 'referral'

  const save = () => {
    if (!fullName.trim() || !dob || saving) return

    setError(null)

    startSaving(async () => {
      const result = await addClient({
        full_name: fullName.trim(),
        current_name: currentName.trim(),
        date_of_birth: dob,
        gender,
        birth_time: birthTime,
        birth_place_name: birthPlace.trim(),
        birth_state_region: birthStateRegion.trim(),
        birth_country: birthCountry.trim(),
        mobile: mobile.trim(),
        whatsapp_number: sameWhatsapp
          ? mobile.trim()
          : whatsapp.trim(),
        email: email.trim(),
        source_id: sourceId,
        referred_by: referral ? referredBy.trim() : '',
        primary_employee_id: employeeId,
        notes: notes.trim(),
      })

      if (result.error || !result.client) {
        setError(result.error || 'Unable to save client.')
        return
      }

      onAddClient({
        id: result.client.id,
        clientNumber: result.client.client_number || undefined,
        name: result.client.full_name,
        currentName: result.client.current_name || undefined,
        initials: getInitials(result.client.full_name),
        dob: result.client.date_of_birth,
        gender: result.client.gender || undefined,
        birthTime: result.client.birth_time || undefined,
        birthPlace: result.client.birth_place_name || undefined,
        birthStateRegion:
          result.client.birth_state_region || undefined,
        birthCountry: result.client.birth_country || undefined,
        phone: result.client.mobile || '',
        whatsapp: result.client.whatsapp_number || undefined,
        email: result.client.email || '',
        sourceId: result.client.source_id || undefined,
        sourceName: selectedSource?.name,
        referredBy: result.client.referred_by || undefined,
        primaryEmployeeId:
          result.client.primary_employee_id || undefined,
        notes: result.client.notes || '',
        status:
          result.client.status === 'inactive'
            ? 'inactive'
            : 'active',
        joined: new Date(
          result.client.created_at
        ).toLocaleDateString(),
        tone: 'navy',
      })

      setView('clients')
    })
  }

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <button
        onClick={() => setView('clients')}
        className="mb-6 text-xs font-semibold text-[#9a7b4f]"
      >
        ← Back to Clients
      </button>

      <PageTitle
        eyebrow="Client management"
        title="Add New Client"
        description="Create the master client record once. Reports and services will be connected to this client."
      />

      <div className="max-w-4xl overflow-hidden rounded-2xl border border-[#e5dccf] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eee7dc] bg-[#fcfaf6] px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold text-[#24354c]">
              Client ID
            </p>
            <p className="mt-1 text-xs text-[#948779]">
              Generated automatically after saving.
            </p>
          </div>

          <span className="rounded-full border border-[#dfd1bd] bg-white px-3 py-1.5 text-xs font-semibold text-[#a47a42]">
            Automatic
          </span>
        </div>

        <Section
          number={1}
          title="Personal Details"
          description="Basic identity information for the master client record."
        >
          <label className={`${labelClass} sm:col-span-2`}>
            Full Name / Birth Name *
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter client's full name"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Current Name
            <input
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="If different"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Date of Birth *
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Gender
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={inputClass}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">
                Prefer not to say
              </option>
            </select>
          </label>
        </Section>

        <Section
          number={2}
          title="Birth Details"
          description="Birth information for astrology and Premium Life Path services."
        >
          <label className={labelClass}>
            Time of Birth
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Birth Place
            <input
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="City / Town"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            State / Region
            <input
              value={birthStateRegion}
              onChange={(e) => setBirthStateRegion(e.target.value)}
              placeholder="e.g. Maharashtra"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Country
            <input
              value={birthCountry}
              onChange={(e) => setBirthCountry(e.target.value)}
              className={inputClass}
            />
          </label>
        </Section>

        <Section
          number={3}
          title="Contact"
          description="Contact information is optional."
        >
          <label className={labelClass}>
            Mobile / Primary Contact
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className={inputClass}
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-[#e8dfd3] bg-[#fcfaf6] px-4 py-3 text-sm text-[#5f574d] sm:col-span-2">
            <input
              type="checkbox"
              checked={sameWhatsapp}
              onChange={(e) => setSameWhatsapp(e.target.checked)}
              className="size-4 accent-[#24354c]"
            />
            WhatsApp number is the same as mobile
          </label>

          {!sameWhatsapp && (
            <label className={`${labelClass} sm:col-span-2`}>
              WhatsApp Number
              <input
                type="tel"
                value={whatsapp}
                onChange={(