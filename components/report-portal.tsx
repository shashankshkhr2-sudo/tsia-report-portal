'use client'

import { useState, useTransition } from 'react'
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/portal-logo'
import { ClientCard } from '@/components/client-card'
import { ConsultationWorkspace } from '@/components/consultation-workspace'

import { signOut } from '@/app/actions/auth'

import type {
  Client,
  ClientSourceOption,
  EmployeeOption,
  Report,
} from '@/lib/portal-types'

type View =
  | 'dashboard'
  | 'clients'
  | 'reports'
  | 'consultation'

const titles: Record<View, string> = {
  dashboard: 'Dashboard',
  clients: 'Clients',
  reports: 'Reports',
  consultation: 'Consultation',
}

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

  const items = [
    {
      id: 'dashboard' as View,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'clients' as View,
      label: 'Clients',
      icon: Users,
    },
    {
      id: 'reports' as View,
      label: 'Reports',
      icon: FileText,
    },
  ]

  return (
    <>
      {open && (
        <button
          type="button"
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
            type="button"
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
              type="button"
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
            type="button"
            disabled
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d] opacity-50"
          >
            <Settings className="size-[18px]" />
            Settings
          </button>

          <button
            type="button"
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
          type="button"
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
  fullName,
  clients,
  reports,
  onClients,
}: {
  fullName: string
  clients: Client[]
  reports: Report[]
  onClients: () => void
}) {
  const processing = reports.filter(
    (report) => report.status === 'Processing'
  ).length

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Your workspace"
        title={`Good morning, ${fullName.split(/\s+/)[0] || 'there'}`}
        description="Manage clients, TSIA reports and live consultations."
      >
        <Button
          type="button"
          onClick={onClients}
          className="h-11 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
        >
          <Users className="mr-2 size-4" />
          View Clients
        </Button>
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="My Clients"
          value={clients.length}
          icon={<Users className="size-[18px]" />}
        />

        <StatCard
          label="Reports"
          value={reports.length}
          icon={<FileText className="size-[18px]" />}
        />

        <StatCard
          label="In Progress"
          value={processing}
          icon={<Sparkles className="size-[18px]" />}
        />
      </div>

      <div className="mt-8 rounded-2xl bg-[#24354c] p-6 text-white">
        <Sparkles className="size-5 text-[#d6b47b]" />

        <h3 className="mt-5 font-serif text-xl">
          TSIA Client Workspace
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#c6cbd1]">
          Open a client to access their TSIA Numerology Report,
          Personal Numerology Intelligence Report and Live Consultation.
        </p>

        <Button
          type="button"
          onClick={onClients}
          className="mt-6 rounded-xl bg-[#d6b47b] text-[#24354c] hover:bg-[#e6c98f]"
        >
          Open Clients
        </Button>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5">
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
          {icon}
        </div>
      </div>
    </div>
  )
}

function ClientsPage({
  clients,
  onNumerology,
  onIntelligence,
  onConsultation,
}: {
  clients: Client[]
  onNumerology: (clientId: string) => void
  onIntelligence: (clientId: string) => void
  onConsultation: (clientId: string) => void
}) {
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()

  const filtered = clients.filter((client) => {
    if (!query) return true

    return [
      client.clientNumber,
      client.name,
      client.phone,
      client.email,
    ].some((value) =>
      String(value || '')
        .toLowerCase()
        .includes(query)
    )
  })

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Client management"
        title="Clients"
        description="Manage clients, reports and customer interactions."
      />

      <div className="mb-6 rounded-xl border border-[#e4dbcf] bg-white px-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search Client ID / Name / Mobile / Email"
          className="h-12 w-full bg-transparent text-sm text-[#24354c] outline-none"
        />
      </div>

      <div className="mb-4 text-sm font-semibold text-[#24354c]">
        {filtered.length}{' '}
        {filtered.length === 1 ? 'Client' : 'Clients'}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-10 text-center">
          <Users className="mx-auto size-8 text-[#b89a61]" />

          <h3 className="mt-3 font-serif text-lg font-semibold text-[#24354c]">
            No matching clients
          </h3>

          <p className="mt-2 text-sm text-[#95897b]">
            Try another Client ID, name, mobile number or email.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={{
                id: client.id,
                clientNumber: client.clientNumber,
                name: client.name,
                initials: client.initials,
                phone: client.phone,
                whatsapp: client.whatsapp,
                email: client.email,
                sourceName: client.sourceName,
                reportCount: client.reportCount,
                questionCount: client.questionCount,
                lastActivity: client.lastActivity,
                joined: client.joined,
                primaryEmployeeName: client.primaryEmployeeName,
              }}
              onTSIANumerologyReport={onNumerology}
              onIntelligenceReport={onIntelligence}
              onStartConsultation={onConsultation}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ReportsPage({
  reports,
}: {
  reports: Report[]
}) {
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Workspace"
        title="Reports"
        description="Review and manage client reports."
      />

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-10 text-center">
          <FileText className="mx-auto size-8 text-[#b89a61]" />

          <h3 className="mt-3 font-serif text-lg font-semibold text-[#24354c]">
            No reports yet
          </h3>

          <p className="mt-2 text-sm text-[#948779]">
            Client reports will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center gap-4 border-b border-[#eee7dc] p-5 last:border-b-0"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e2e9f0] text-xs font-semibold text-[#526b84]">
                {report.initials}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-serif text-base font-semibold text-[#24354c]">
                  {report.client}
                </h3>

                <p className="mt-1 text-xs text-[#948779]">
                  {report.version} · {report.date}
                </p>
              </div>

              <span className="rounded-full bg-[#f5f0e8] px-3 py-1 text-xs font-medium text-[#786b5c]">
                {report.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ComingSoon({
  title,
  description,
  onBack,
}: {
  title: string
  description: string
  onBack: () => void
}) {
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-xs font-semibold text-[#9a7b4f]"
      >
        ← Back to Clients
      </button>

      <div className="mx-auto max-w-xl rounded-2xl border border-[#e8dfd3] bg-white p-8">
        <FileText className="size-8 text-[#b89a61]" />

        <h2 className="mt-4 font-serif text-2xl font-semibold text-[#24354c]">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#81776b]">
          {description}
        </p>
      </div>
    </div>
  )
}

export function ReportPortal({
  fullName,
  reports,
  clients,
  clientSources: _clientSources,
  employees: _employees,
}: {
  fullName: string
  reports: Report[]
  clients: Client[]
  clientSources: ClientSourceOption[]
  employees: EmployeeOption[]
}) {
  const [view, setView] = useState<View>('dashboard')
  const [open, setOpen] = useState(false)

  const [selectedConsultationClientId, setSelectedConsultationClientId] =
    useState('')

  const [selectedProduct, setSelectedProduct] = useState<
    'numerology' | 'intelligence' | null
  >(null)

  const changeView = (nextView: View) => {
    if (nextView !== 'consultation') {
      setSelectedConsultationClientId('')
    }

    setSelectedProduct(null)
    setView(nextView)
  }

  const openConsultation = (clientId: string) => {
    setSelectedConsultationClientId(clientId)
    setSelectedProduct(null)
    setView('consultation')
  }

  const openNumerology = (_clientId: string) => {
    setSelectedProduct('numerology')
  }

  const openIntelligence = (_clientId: string) => {
    setSelectedProduct('intelligence')
  }

  const consultationClient = clients.find(
    (client) => client.id === selectedConsultationClientId
  )

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#3e3a35]">
      <div className="flex min-h-screen">
        <Sidebar
          view={view}
          setView={changeView}
          open={open}
          setOpen={setOpen}
          fullName={fullName}
        />

        <div className="min-w-0 flex-1">
          <Header
            title={titles[view]}
            fullName={fullName}
            setOpen={setOpen}
          />

          <main>
            {selectedProduct === 'numerology' && (
              <ComingSoon
                title="TSIA Numerology Report"
                description="The existing verified TSIA numerology calculation and report workflow will be connected here without changing the frozen calculation engine."
                onBack={() => setSelectedProduct(null)}
              />
            )}

            {selectedProduct === 'intelligence' && (
              <ComingSoon
                title="TSIA Personal Numerology Intelligence Report"
                description="The advanced Numerology Intelligence workflow will be connected here after its report execution layer is completed and validated."
                onBack={() => setSelectedProduct(null)}
              />
            )}

            {!selectedProduct && view === 'dashboard' && (
              <Dashboard
                fullName={fullName}
                clients={clients}
                reports={reports}
                onClients={() => changeView('clients')}
              />
            )}

            {!selectedProduct && view === 'clients' && (
              <ClientsPage
                clients={clients}
                onNumerology={openNumerology}
                onIntelligence={openIntelligence}
                onConsultation={openConsultation}
              />
            )}

            {!selectedProduct && view === 'reports' && (
              <ReportsPage reports={reports} />
            )}

            {!selectedProduct &&
              view === 'consultation' &&
              consultationClient && (
                <ConsultationWorkspace
                  key={consultationClient.id}
                  client={{
                    id: consultationClient.id,
                    clientNumber: consultationClient.clientNumber,
                    name: consultationClient.name,
                    dob: consultationClient.dob,
                  }}
                  onBack={() => changeView('clients')}
                />
              )}

            {!selectedProduct &&
              view === 'consultation' &&
              !consultationClient && (
                <div className="p-5 sm:p-8 lg:p-10">
                  <div className="mx-auto max-w-xl rounded-2xl border border-[#e8dfd3] bg-white p-8 text-center">
                    <Users className="mx-auto size-8 text-[#b89a61]" />

                    <h2 className="mt-4 font-serif text-xl font-semibold text-[#24354c]">
                      Client not selected
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#81776b]">
                      Return to Clients and select the client whose
                      consultation you want to start.
                    </p>

                    <Button
                      type="button"
                      onClick={() => changeView('clients')}
                      className="mt-5 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
                    >
                      Back to Clients
                    </Button>
                  </div>
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  )
}