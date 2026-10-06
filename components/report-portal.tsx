'use client'

import {
  useState,
  useTransition,
} from 'react'

import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'

import {
  Button,
} from '@/components/ui/button'

import { PortalDashboard } from '@/components/portal-dashboard'

import { DobInput } from '@/components/dob-input
import {
  Logo,
} from '@/components/portal-logo'
import {
  ConsultationWorkspace,
} from '@/components/consultation-workspace'

import {
  signOut,
} from '@/app/actions/auth'

import {
  addClient,
} from '@/app/actions/clients'

import {
  generateNumerologyV2,
} from '@/app/actions/numerology'

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
  | 'consultation'

const toneClasses: Record<
  Tone,
  string
> = {
  plum:
    'bg-[#eee3ee] text-[#76536f]',
  terracotta:
    'bg-[#f6e5dd] text-[#a55f46]',
  olive:
    'bg-[#e7eddf] text-[#66805c]',
  navy:
    'bg-[#e2e9f0] text-[#526b84]',
}

const inputClass =
  'h-11 w-full rounded-xl border border-[#e5dccf] bg-white px-3 text-sm font-normal text-[#3e3a35] outline-none focus:border-[#d6b47b] focus:ring-2 focus:ring-[#d6b47b]/20'

const labelClass =
  'flex flex-col gap-2 text-xs font-semibold text-[#5f574d]'

function getInitials(
  name: string
) {
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
  const [
    signingOut,
    startSignOut,
  ] = useTransition()

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
          onClick={() =>
            setOpen(false)
          }
          className="fixed inset-0 z-30 bg-[#24354c]/25 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#e8dfd3] bg-[#fbf8f2] px-5 py-7 transition-transform lg:static lg:translate-x-0 ${
          open
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        <div className="mb-12 flex items-center justify-between px-2">
          <Logo />

          <button
            onClick={() =>
              setOpen(false)
            }
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
          {items.map(
            ({
              id,
              label,
              icon: Icon,
            }) => (
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
            )
          )}
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
              startSignOut(
                async () => {
                  await signOut()
                }
              )
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d]"
          >
            <LogOut className="size-[18px]" />

            {signingOut
              ? 'Signing out…'
              : 'Sign out'}
          </button>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f0e9de]/70 p-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#d6b47b] text-xs font-semibold text-[#24354c]">
              {getInitials(
                fullName
              )}
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
  setOpen: (
    open: boolean
  ) => void
}) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[#e8dfd3] bg-[#fffdf9] px-5 sm:px-8 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() =>
            setOpen(true)
          }
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
          {getInitials(
            fullName
          )}
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
  setView: (
    view: View
  ) => void
  fullName: string
  clients: Client[]
  reports: Report[]
}) {
  const processing =
    reports.filter(
      (report) =>
        report.status ===
        'Processing'
    ).length

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PortalDashboard
        fullName={fullName}
        clientCount={clients.length}
        reportCount={reports.length}
        processingCount={processing}
        onAddClient={() =>
          setView('new-client')
        }
        onViewClients={() =>
          setView('clients')
        }
        onViewReports={() =>
          setView('reports')
        }
        onGenerateReport={() =>
          setView('generate')
        }
      />
    </div>
  )
}

function ClientsPage({
  clients,
  setView,
  onGenerateClient,
  onStartConsultation,
}: {
  clients: Client[]
  setView: (
    view: View
  ) => void
  onGenerateClient: (
    clientId: string
  ) => void
  onStartConsultation: (
    clientId: string
  ) => void
}) {
  const [
    searchTerm,
    setSearchTerm,
  ] = useState('')

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase()

  const filteredClients =
    clients.filter(
      (client) => {
        if (
          !normalizedSearch
        ) {
          return true
        }

        return [
          client.clientNumber,
          client.name,
          client.phone,
          client.email,
        ].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(
              normalizedSearch
            )
        )
      }
    )

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Client management"
        title="Clients"
        description="Manage clients, reports and customer interactions."
      >
        <Button
          onClick={() =>
            setView(
              'new-client'
            )
          }
          className="h-11 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
        >
          <Plus className="mr-2 size-4" />
          Add Client
        </Button>
      </PageTitle>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 size-4 text-[#aa9c8c]" />

          <input
            value={
              searchTerm
            }
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target
                  .value
              )
            }
            placeholder="Search Client ID / Name / Mobile / Email"
            className="h-10 w-full rounded-xl border border-[#e4dbcf] bg-white pl-10 pr-4 text-sm text-[#24354c] outline-none transition focus:border-[#b89a61] focus:ring-2 focus:ring-[#b89a61]/10"
          />
        </div>

        <button
          type="button"
          title="More filters will be available as client management expands."
          className="hidden h-10 items-center gap-2 rounded-xl border border-[#e4dbcf] bg-white px-4 text-sm font-medium text-[#5f5a54] sm:flex"
        >
          <Settings className="size-4" />
          Filter
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-[#24354c]">
            {
              filteredClients.length
            }{' '}
            {filteredClients.length ===
            1
              ? 'Client'
              : 'Clients'}
          </span>

          {searchTerm && (
            <span className="ml-2 text-xs text-[#9a8d7e]">
              of{' '}
              {
                clients.length
              }
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-[#8e8275]">
          Latest Activity
          <ChevronDown className="size-3.5" />
        </div>
      </div>

      {filteredClients.length ===
      0 ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-10 text-center">
          <Users className="mx-auto mb-3 size-8 text-[#b89a61]" />

          <h3 className="font-serif text-lg font-semibold text-[#24354c]">
            {clients.length ===
            0
              ? 'No clients yet'
              : 'No matching clients'}
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm text-[#95897b]">
            {clients.length ===
            0
              ? 'Add your first client to begin managing reports and customer interactions.'
              : 'Try searching with a different Client ID, name, mobile number or email.'}
          </p>

          {clients.length ===
            0 && (
            <Button
              onClick={() =>
                setView(
                  'new-client'
                )
              }
              className="mt-5 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
            >
              <Plus className="mr-2 size-4" />
              Add Client
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClients.map(
            (client) => {
              const hasWhatsApp =
                Boolean(
                  client.whatsapp ||
                    client.phone
                )

              return (
                <div
                  key={
                    client.id
                  }
                  className="group overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white shadow-sm transition hover:border-[#d9c49b] hover:shadow-md"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-sm font-semibold text-white sm:size-12">
                        {client.initials ||
                          'C'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate font-serif text-lg font-semibold text-[#24354c]">
                                {
                                  client.name
                                }
                              </h3>

                              {client.clientNumber && (
                                <span className="rounded-full border border-[#e6d8bd] bg-[#fbf6ec] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#8b6d37]">
                                  {
                                    client.clientNumber
                                  }
                                </span>
                              )}
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#766d63]">
                              {client.phone ? (
                                <span>
                                  {
                                    client.phone
                                  }
                                </span>
                              ) : (
                                <span className="text-[#aaa095]">
                                  No
                                  mobile
                                  number
                                </span>
                              )}

                              {hasWhatsApp && (
                                <span className="rounded-full bg-[#f1f7f1] px-2 py-0.5 text-[10px] font-semibold text-[#55705a]">
                                  WhatsApp
                                </span>
                              )}

                              {client.email && (
                                <span className="hidden truncate text-xs text-[#a09588] md:inline">
                                  {
                                    client.email
                                  }
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 lg:text-right">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#aaa095]">
                              Last
                              activity
                            </div>

                            <div className="mt-1 text-sm font-medium text-[#4e5b6d]">
                              {client.lastActivity ||
                                client.joined ||
                                '—'}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 sm:max-w-xl">
                          <div className="rounded-xl border border-[#eadfc9] bg-[#fcf8ef] px-3 py-2.5">
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#a38a5b]">
                              Source
                            </div>

                            <div className="mt-1 truncate text-xs font-semibold text-[#5d554b] sm:text-sm">
                              {client.sourceName ||
                                '—'}
                            </div>
                          </div>

                          <div className="rounded-xl border border-[#e2e6ea] bg-[#f7f9fb] px-3 py-2.5">
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7c8795]">
                              Reports
                            </div>

                            <div className="mt-1 text-sm font-semibold text-[#24354c]">
                              {client.reportCount ??
                                0}
                            </div>
                          </div>

                          <div className="rounded-xl border border-[#ece3da] bg-[#fbf8f5] px-3 py-2.5">
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#97897b]">
                              Questions
                            </div>

                            <div className="mt-1 text-sm font-semibold text-[#24354c]">
                              {client.questionCount ??
                                0}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 border-t border-[#f0ebe4] pt-3">
                          <div className="mb-3 text-xs text-[#94887b]">
                            Assigned
                            to{' '}
                            <span className="font-semibold text-[#5d574f]">
                              {client.primaryEmployeeName ||
                                'Not assigned'}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                              type="button"
                              onClick={() =>
                                onStartConsultation(
                                  client.id
                                )
                              }
                              className="h-10 rounded-xl bg-[#24354c] px-4 text-xs text-white hover:bg-[#30445f]"
                            >
                              <MessageCircle className="mr-2 size-4" />
                              Start
                              Consultation
                            </Button>

                            <button
                              type="button"
                              onClick={() =>
                                onGenerateClient(
                                  client.id
                                )
                              }
                              title={`Generate report for ${client.name}`}
                              aria-label={`Generate report for ${client.name}`}
                              className="flex size-10 shrink-0 items-center justify-center self-end rounded-full border border-[#e4d8c5] bg-[#fffdf9] text-[#8f7445] transition group-hover:border-[#cdb47f] group-hover:bg-[#fbf4e6] sm:self-auto"
                            >
                              <ArrowRight className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          )}
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
  setView: (
    view: View
  ) => void
}) {
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Workspace"
        title="Reports"
        description="Review and manage client reports."
      >
        <Button
          onClick={() =>
            setView(
              'generate'
            )
          }
          className="h-11 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
        >
          <Sparkles className="mr-2 size-4" />
          Generate Report
        </Button>
      </PageTitle>

      {reports.length ===
      0 ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-10 text-center">
          <FileText className="mx-auto mb-3 size-8 text-[#b89a61]" />

          <h3 className="font-serif text-lg font-semibold text-[#24354c]">
            No reports yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#948779]">
            Generate your first
            Numerology Version 2
            report.
          </p>

          <Button
            onClick={() =>
              setView(
                'generate'
              )
            }
            className="mt-5 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
          >
            <Sparkles className="mr-2 size-4" />
            Generate Report
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white">
          {reports.map(
            (report) => (
              <div
                key={
                  report.id
                }
                className="flex items-center gap-4 border-b border-[#eee7dc] p-5 last:border-b-0"
              >
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    toneClasses[
                      report.tone
                    ]
                  }`}
                >
                  {
                    report.initials
                  }
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-serif text-base font-semibold text-[#24354c]">
                    {
                      report.client
                    }
                  </h3>

                  <p className="mt-1 text-xs text-[#948779]">
                    {
                      report.version
                    }{' '}
                    ·{' '}
                    {
                      report.date
                    }
                  </p>
                </div>

                <span className="rounded-full bg-[#f5f0e8] px-3 py-1 text-xs font-medium text-[#786b5c]">
                  {
                    report.status
                  }
                </span>
              </div>
            )
          )}
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
  setView: (
    view: View
  ) => void
  onAddClient: (
    client: Client
  ) => void
  clientSources:
    ClientSourceOption[]
  employees:
    EmployeeOption[]
}) {
  const [
    fullName,
    setFullName,
  ] = useState('')

  const [
    currentName,
    setCurrentName,
  ] = useState('')

  const [
    dob,
    setDob,
  ] = useState('')

  const [
    gender,
    setGender,
  ] = useState('')

  const [
    birthTime,
    setBirthTime,
  ] = useState('')

  const [
    birthPlace,
    setBirthPlace,
  ] = useState('')

  const [
    birthStateRegion,
    setBirthStateRegion,
  ] = useState('')

  const [
    birthCountry,
    setBirthCountry,
  ] = useState('India')

  const [
    mobile,
    setMobile,
  ] = useState('')

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    sameWhatsapp,
    setSameWhatsapp,
  ] = useState(true)

  const [
    whatsapp,
    setWhatsapp,
  ] = useState('')

  const [
    sourceId,
    setSourceId,
  ] = useState('')

  const [
    referredBy,
    setReferredBy,
  ] = useState('')

  const [
    employeeId,
    setEmployeeId,
  ] = useState('')

  const [
    notes,
    setNotes,
  ] = useState('')

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null)

  const [
    saving,
    startSaving,
  ] = useTransition()

  const selectedSource =
    clientSources.find(
      (source) =>
        source.id ===
        sourceId
    )

  const referral =
    selectedSource?.name
      .trim()
      .toLowerCase() ===
    'referral'

  const save = () => {
    if (
      !fullName.trim() ||
      !dob ||
      saving
    ) {
      return
    }

    setError(null)

    startSaving(
      async () => {
        const result =
          await addClient({
            full_name:
              fullName.trim(),

            current_name:
              currentName.trim(),

            date_of_birth:
              dob,

            gender,

            birth_time:
              birthTime,

            birth_place_name:
              birthPlace.trim(),

            birth_state_region:
              birthStateRegion.trim(),

            birth_country:
              birthCountry.trim(),

            mobile:
              mobile.trim(),

            whatsapp_number:
              sameWhatsapp
                ? mobile.trim()
                : whatsapp.trim(),

            email:
              email.trim(),

            source_id:
              sourceId,

            referred_by:
              referral
                ? referredBy.trim()
                : '',

            primary_employee_id:
              employeeId,

            notes:
              notes.trim(),
          })

        if (
          result.error ||
          !result.client
        ) {
          setError(
            result.error ||
              'Unable to save client.'
          )
          return
        }

        const assignedEmployee =
          employees.find(
            (employee) =>
              employee.id ===
              result.client
                ?.primary_employee_id
          )

        onAddClient({
          id:
            result.client.id,

          clientNumber:
            result.client
              .client_number ||
            undefined,

          name:
            result.client
              .full_name,

          currentName:
            result.client
              .current_name ||
            undefined,

          initials:
            getInitials(
              result.client
                .full_name
            ),

          dob:
            result.client
              .date_of_birth,

          gender:
            result.client
              .gender ||
            undefined,

          birthTime:
            result.client
              .birth_time ||
            undefined,

          birthPlace:
            result.client
              .birth_place_name ||
            undefined,

          birthStateRegion:
            result.client
              .birth_state_region ||
            undefined,

          birthCountry:
            result.client
              .birth_country ||
            undefined,

          phone:
            result.client
              .mobile || '',

          whatsapp:
            result.client
              .whatsapp_number ||
            undefined,

          email:
            result.client
              .email || '',

          sourceId:
            result.client
              .source_id ||
            undefined,

          sourceName:
            selectedSource?.name,

          referredBy:
            result.client
              .referred_by ||
            undefined,

          primaryEmployeeId:
            result.client
              .primary_employee_id ||
            undefined,

          primaryEmployeeName:
            assignedEmployee
              ?.fullName,

          reportCount: 0,
          questionCount: 0,

          lastActivity:
            new Date(
              result.client
                .created_at
            ).toLocaleDateString(),

          notes:
            result.client
              .notes || '',

          status:
            result.client
              .status ===
            'inactive'
              ? 'inactive'
              : 'active',

          joined:
            new Date(
              result.client
                .created_at
            ).toLocaleDateString(),

          tone: 'navy',
        })

        setView(
          'clients'
        )
      }
    )
  }

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <button
        onClick={() =>
          setView('clients')
        }
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
              Generated
              automatically after
              saving.
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
          <label
            className={`${labelClass} sm:col-span-2`}
          >
            Full Name / Birth
            Name *

            <input
              value={
                fullName
              }
              onChange={(
                event
              ) =>
                setFullName(
                  event.target
                    .value
                )
              }
              placeholder="Enter client's full name"
              className={
                inputClass
              }
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Current Name

            <input
              value={
                currentName
              }
              onChange={(
                event
              ) =>
                setCurrentName(
                  event.target
                    .value
                )
              }
              placeholder="If different"
              className={
                inputClass
              }
            />
          </label>

        <label
  className={
    labelClass
  }
>
  Date of Birth *

  <DobInput
    value={dob}
    onChange={setDob}
    required
  />
</label>

          <label
            className={
              labelClass
            }
          >
            Gender

            <select
              value={
                gender
              }
              onChange={(
                event
              ) =>
                setGender(
                  event.target
                    .value
                )
              }
              className={
                inputClass
              }
            >
              <option value="">
                Select
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>

              <option value="prefer_not_to_say">
                Prefer not to
                say
              </option>
            </select>
          </label>
        </Section>

        <Section
          number={2}
          title="Birth Details"
          description="Birth information for astrology and Premium Life Path services."
        >
          <label
            className={
              labelClass
            }
          >
            Time of Birth

            <input
              type="time"
              value={
                birthTime
              }
              onChange={(
                event
              ) =>
                setBirthTime(
                  event.target
                    .value
                )
              }
              className={
                inputClass
              }
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Birth Place

            <input
              value={
                birthPlace
              }
              onChange={(
                event
              ) =>
                setBirthPlace(
                  event.target
                    .value
                )
              }
              placeholder="City / Town"
              className={
                inputClass
              }
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            State / Region

            <input
              value={
                birthStateRegion
              }
              onChange={(
                event
              ) =>
                setBirthStateRegion(
                  event.target
                    .value
                )
              }
              placeholder="e.g. Maharashtra"
              className={
                inputClass
              }
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Country

            <input
              value={
                birthCountry
              }
              onChange={(
                event
              ) =>
                setBirthCountry(
                  event.target
                    .value
                )
              }
              className={
                inputClass
              }
            />
          </label>
        </Section>

        <Section
          number={3}
          title="Contact"
          description="Contact information is optional."
        >
          <label
            className={
              labelClass
            }
          >
            Mobile / Primary
            Contact

            <input
              type="tel"
              value={mobile}
              onChange={(
                event
              ) =>
                setMobile(
                  event.target
                    .value
                )
              }
              placeholder="+91"
              className={
                inputClass
              }
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Email

            <input
              type="email"
              value={email}
              onChange={(
                event
              ) =>
                setEmail(
                  event.target
                    .value
                )
              }
              placeholder="name@email.com"
              className={
                inputClass
              }
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-[#e8dfd3] bg-[#fcfaf6] px-4 py-3 text-sm text-[#5f574d] sm:col-span-2">
            <input
              type="checkbox"
              checked={
                sameWhatsapp
              }
              onChange={(
                event
              ) =>
                setSameWhatsapp(
                  event.target
                    .checked
                )
              }
              className="size-4 accent-[#24354c]"
            />

            WhatsApp number is
            the same as mobile
          </label>

          {!sameWhatsapp && (
            <label
              className={`${labelClass} sm:col-span-2`}
            >
              WhatsApp Number

              <input
                type="tel"
                value={
                  whatsapp
                }
                onChange={(
                  event
                ) =>
                  setWhatsapp(
                    event.target
                      .value
                  )
                }
                placeholder="+91"
                className={
                  inputClass
                }
              />
            </label>
          )}
        </Section>

        <Section
          number={4}
          title="Client Source"
          description="Track how the client came to The Swastik Indian Art."
        >
          <label
            className={
              labelClass
            }
          >
            Source

            <select
              value={
                sourceId
              }
              onChange={(
                event
              ) =>
                setSourceId(
                  event.target
                    .value
                )
              }
              className={
                inputClass
              }
            >
              <option value="">
                Select source
              </option>

              {clientSources.map(
                (source) => (
                  <option
                    key={
                      source.id
                    }
                    value={
                      source.id
                    }
                  >
                    {
                      source.name
                    }
                  </option>
                )
              )}
            </select>
          </label>

          {referral && (
            <label
              className={
                labelClass
              }
            >
              Referred By

              <input
                value={
                  referredBy
                }
                onChange={(
                  event
                ) =>
                  setReferredBy(
                    event.target
                      .value
                  )
                }
                placeholder="Name of referrer"
                className={
                  inputClass
                }
              />
            </label>
          )}
        </Section>

        <Section
          number={5}
          title="Assignment"
          description="Select the primary TSIA employee responsible for this client."
        >
          <label
            className={`${labelClass} sm:col-span-2`}
          >
            Primary Assigned
            Employee

            <select
              value={
                employeeId
              }
              onChange={(
                event
              ) =>
                setEmployeeId(
                  event.target
                    .value
                )
              }
              className={
                inputClass
              }
            >
              <option value="">
                Assign to me
              </option>

              {employees.map(
                (employee) => (
                  <option
                    key={
                      employee.id
                    }
                    value={
                      employee.id
                    }
                  >
                    {
                      employee.fullName
                    }

                    {employee.specialization
                      ? ` — ${employee.specialization}`
                      : ''}
                  </option>
                )
              )}
            </select>
          </label>
        </Section>

        <Section
          number={6}
          title="Internal Notes"
          description="Private notes for the TSIA team. Not visible to the customer."
        >
          <label
            className={`${labelClass} sm:col-span-2`}
          >
            Notes

            <textarea
              rows={4}
              value={notes}
              onChange={(
                event
              ) =>
                setNotes(
                  event.target
                    .value
                )
              }
              placeholder="Internal notes..."
              className="w-full resize-none rounded-xl border border-[#e5dccf] px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#d6b47b]/20"
            />
          </label>
        </Section>

        {error && (
          <div className="mx-5 mt-5 rounded-xl border border-[#ead0c7] bg-[#fff5f1] px-4 py-3 text-sm text-[#a55f46] sm:mx-8">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 bg-[#fcfaf6] px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
          <Button
            variant="outline"
            disabled={saving}
            onClick={() =>
              setView(
                'clients'
              )
            }
            className="h-11 rounded-xl"
          >
            Cancel
          </Button>

          <Button
            disabled={
              saving ||
              !fullName.trim() ||
              !dob
            }
            onClick={save}
            className="h-11 rounded-xl bg-[#24354c] px-6 text-white hover:bg-[#30445f]"
          >
            {saving
              ? 'Saving…'
              : 'Save Client'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function GeneratePage({
  clients,
  setView,
  initialClientId,
}: {
  clients: Client[]
  setView: (
    view: View
  ) => void
  initialClientId: string
}) {
  const [
    selectedClientId,
    setSelectedClientId,
  ] = useState(
    initialClientId
  )

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null)

  const [
    generated,
    setGenerated,
  ] = useState<
    Awaited<
      ReturnType<
        typeof generateNumerologyV2
      >
    >['result']
  >(null)

  const [
    generating,
    startGenerating,
  ] = useTransition()

  const selectedClient =
    clients.find(
      (client) =>
        client.id ===
        selectedClientId
    )

  const generate = () => {
    if (
      !selectedClientId ||
      generating
    ) {
      return
    }

    setError(null)
    setGenerated(null)

    startGenerating(
      async () => {
        const result =
          await generateNumerologyV2(
            selectedClientId
          )

        if (
          result.error ||
          !result.result
        ) {
          setError(
            result.error ||
              'Unable to generate report.'
          )
          return
        }

        setGenerated(
          result.result
        )
      }
    )
  }

  const grahaNames: Record<
    number,
    string
  > = {
    1: 'Surya',
    2: 'Chandra',
    3: 'Guru',
    4: 'Rahu',
    5: 'Budh',
    6: 'Shukra',
    7: 'Ketu',
    8: 'Shani',
    9: 'Mangal',
  }

  const standardGrid = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ]

  const personalCell = (
    number: number
  ) => {
    if (!generated) {
      return ''
    }

    const counts =
      generated.calculation
        .loShu
        .counts as Record<
        number,
        number
      >

    const count =
      counts[number] || 0

    if (count === 0) {
      return ''
    }

    return String(
      number
    ).repeat(count)
  }

  const repeatedNumbers =
    generated
      ? Object.entries(
          generated
            .calculation
            .loShu
            .repeatedNumbers
        )
      : []

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <button
        onClick={() =>
          setView(
            'clients'
          )
        }
        className="mb-6 text-xs font-semibold text-[#9a7b4f]"
      >
        ← Back to Clients
      </button>

      <PageTitle
        eyebrow="Employee Analysis"
        title="Numerology V2 Analysis"
        description="Review the client's verified numerology calculations and interpretation."
      />

      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-6">
          <label
            className={
              labelClass
            }
          >
            Client

            <select
              value={
                selectedClientId
              }
              onChange={(
                event
              ) => {
                setSelectedClientId(
                  event.target
                    .value
                )

                setError(null)
                setGenerated(
                  null
                )
              }}
              className={
                inputClass
              }
            >
              <option value="">
                Select client
              </option>

              {clients.map(
                (client) => (
                  <option
                    key={
                      client.id
                    }
                    value={
                      client.id
                    }
                  >
                    {
                      client.name
                    }

                    {client.clientNumber
                      ? ` — ${client.clientNumber}`
                      : ''}
                  </option>
                )
              )}
            </select>
          </label>

          {selectedClient && (
            <div className="mt-4 rounded-xl border border-[#eee4d6] bg-[#f8f4ed] p-4">
              <p className="font-serif text-lg font-semibold text-[#24354c]">
                {
                  selectedClient.name
                }
              </p>

              <div className="mt-2 space-y-1 text-xs text-[#7c7064]">
                {selectedClient.clientNumber && (
                  <p>
                    Client ID:{' '}
                    {
                      selectedClient.clientNumber
                    }
                  </p>
                )}

                <p>
                  Date of
                  Birth:{' '}
                  {
                    selectedClient.dob
                  }
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-3 rounded-xl bg-[#f5f0e8] p-4 text-xs leading-5 text-[#7c6d5b]">
            <CircleHelp className="size-4 shrink-0 text-[#ad7b40]" />

            <span>
              The verified TSIA
              Version 2 engine
              calculates the core
              numbers, Personal Lo
              Shu, patterns,
              Rajyog and detailed
              interpretation
              automatically.
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-[#ead0c7] bg-[#fff5f1] px-4 py-3 text-sm text-[#a55f46]">
              {error}
            </div>
          )}

          <Button
            disabled={
              !selectedClientId ||
              generating
            }
            onClick={
              generate
            }
            className="mt-5 h-11 w-full rounded-xl bg-[#24354c] text-white hover:bg-[#30445f]"
          >
            <Sparkles className="mr-2 size-4" />

            {generating
              ? 'Generating…'
              : 'Generate Numerology V2'}
          </Button>
        </div>

        {generated && (
          <div className="overflow-hidden rounded-2xl border border-[#e1d5c4] bg-white shadow-sm">
            <div className="bg-[#24354c] p-6 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d6b47b]">
                TSIA · Employee
                Analysis
              </p>

              <h3 className="mt-2 font-serif text-2xl">
                {
                  generated
                    .client
                    .fullName
                }
              </h3>

              <p className="mt-1 text-xs text-[#c9d0d8]">
                {generated
                  .client
                  .clientNumber ||
                  'TSIA Client'}
                {' · '}
                DOB{' '}
                {
                  generated
                    .client
                    .dateOfBirth
                }
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a7b4f]">
                Core Numbers
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[#f8f4ed] p-3 text-center">
                  <p className="text-[10px] text-[#8d8174]">
                    Mulank
                  </p>

                  <p className="mt-1 font-serif text-2xl font-semibold text-[#24354c]">
                    {
                      generated
                        .calculation
                        .mulank
                        .final
                    }
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#9a7b4f]">
                    {
                      grahaNames[
                        generated
                          .calculation
                          .mulank
                          .final
                      ]
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-[#f8f4ed] p-3 text-center">
                  <p className="text-[10px] text-[#8d8174]">
                    Bhagyank
                  </p>

                  <p className="mt-1 font-serif text-2xl font-semibold text-[#24354c]">
                    {
                      generated
                        .calculation
                        .bhagyank
                        .final
                    }
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#9a7b4f]">
                    {
                      grahaNames[
                        generated
                          .calculation
                          .bhagyank
                          .final
                      ]
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-[#f8f4ed] p-3 text-center">
                  <p className="text-[10px] text-[#8d8174]">
                    Name No.
                  </p>

                  <p className="mt-1 font-serif text-2xl font-semibold text-[#24354c]">
                    {
                      generated
                        .calculation
                        .nameNumber
                        .finalNumber
                    }
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#9a7b4f]">
                    {
                      grahaNames[
                        generated
                          .calculation
                          .nameNumber
                          .finalNumber
                      ]
                    }
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-[#eee7dc] pt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a7b4f]">
                  Lo Shu Analysis
                </p>

                <h3 className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
                  Standard &
                  Personal Lo Shu
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#7c7064]">
                  The Personal Lo
                  Shu uses the
                  client's DOB
                  digits, final
                  Mulank and final
                  Bhagyank. Zero is
                  excluded.
                </p>

                <div className="mt-6 grid gap-7 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#756a5f]">
                      Standard Lo
                      Shu Grid
                    </p>

                    <div className="mx-auto grid aspect-square w-full max-w-[280px] grid-cols-3 overflow-hidden rounded-xl border-2 border-[#d3b87e] bg-[#fffdf9]">
                      {standardGrid
                        .flat()
                        .map(
                          (
                            number,
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              className="flex items-center justify-center border border-[#e1cfaa] font-serif text-2xl font-semibold text-[#24354c]"
                            >
                              {
                                number
                              }
                            </div>
                          )
                        )}
                    </div>

                    <p className="mt-3 text-center text-[11px] text-[#948779]">
                      Original
                      reference
                      grid
                    </p>
                  </div>

                  <div>
                    <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#9a7b4f]">
                      Personal Lo
                      Shu Grid
                    </p>

                    <div className="mx-auto grid aspect-square w-full max-w-[280px] grid-cols-3 overflow-hidden rounded-xl border-2 border-[#b28a4b] bg-[#fbf6ec] shadow-sm">
                      {standardGrid
                        .flat()
                        .map(
                          (
                            number,
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              className="flex items-center justify-center border border-[#dcc69a] px-1 font-serif text-2xl font-bold text-[#24354c]"
                            >
                              {personalCell(
                                number
                              )}
                            </div>
                          )
                        )}
                    </div>

                    <p className="mt-3 text-center text-[11px] text-[#948779]">
                      DOB + Mulank
                      + Bhagyank
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#e9dfd0] bg-[#fcfaf6] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9a8b7b]">
                      Present
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#24354c]">
                      {generated
                        .calculation
                        .loShu
                        .presentNumbers
                        .join(
                          ', '
                        )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e9dfd0] bg-[#fcfaf6] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9a8b7b]">
                      Missing
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#24354c]">
                      {generated
                        .calculation
                        .loShu
                        .missingNumbers
                        .length
                        ? generated
                            .calculation
                            .loShu
                            .missingNumbers
                            .join(
                              ', '
                            )
                        : 'None'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e9dfd0] bg-[#fcfaf6] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9a8b7b]">
                      Repeated
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#24354c]">
                      {repeatedNumbers.length
                        ? repeatedNumbers
                            .map(
                              ([
                                number,
                                count,
                              ]) =>
                                `${number} × ${count}`
                            )
                            .join(
                              ' · '
                            )
                        : 'None'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[#eee7dc] pt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a7b4f]">
                  Rajyog
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#e8dfd3] bg-[#fcfaf6] p-4">
                    <p className="text-xs text-[#8d8174]">
                      Golden Rajyog
                      · 4-5-6
                    </p>

                    <p className="mt-1 font-serif text-lg font-semibold capitalize text-[#24354c]">
                      {
                        generated
                          .calculation
                          .rajyog
                          .golden
                          .status
                      }
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e8dfd3] bg-[#fcfaf6] p-4">
                    <p className="text-xs text-[#8d8174]">
                      Silver Rajyog
                      · 2-5-8
                    </p>

                    <p className="mt-1 font-serif text-lg font-semibold capitalize text-[#24354c]">
                      {
                        generated
                          .calculation
                          .rajyog
                          .silver
                          .status
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[#eee7dc] pt-7">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a7b4f]">
                  Detailed
                  Employee
                  Analysis
                </p>

                <p className="text-sm leading-6 text-[#6f665d]">
                  {
                    generated
                      .narrative
                      .introduction
                  }
                </p>

                <div className="mt-7 space-y-8">
                  {generated
                    .narrative
                    .sections
                    .map(
                      (
                        section
                      ) => (
                        <section
                          key={
                            section.title
                          }
                        >
                          <h4 className="font-serif text-xl font-semibold text-[#24354c]">
                            {
                              section.title
                            }
                          </h4>

                          <div className="mt-3 space-y-4">
                            {section.paragraphs.map(
                              (
                                paragraph,
                                index
                              ) => (
                                <p
                                  key={
                                    index
                                  }
                                  className="text-sm leading-7 text-[#6f665d]"
                                >
                                  {
                                    paragraph
                                  }
                                </p>
                              )
                            )}
                          </div>
                        </section>
                      )
                    )}
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-[#e6d8bd] bg-[#fbf6ec] p-4 text-xs leading-5 text-[#806b48]">
                Employee analysis
                generated from the
                verified TSIA
                Version 2 engine.
                The final client
                report will be
                generated
                separately.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const titles: Record<
  View,
  string
> = {
  dashboard:
    'Dashboard',
  clients:
    'Clients',
  reports:
    'Reports',
  'new-client':
    'New Client',
  generate:
    'Generate Report',
  consultation:
    'Consultation',
}

export function ReportPortal({
  fullName,
  reports,
  clients,
  clientSources,
  employees,
}: {
  fullName: string
  reports: Report[]
  clients: Client[]
  clientSources:
    ClientSourceOption[]
  employees:
    EmployeeOption[]
}) {
  const [
    view,
    setView,
  ] = useState<View>(
    'dashboard'
  )

  const [
    open,
    setOpen,
  ] = useState(false)

  const [
    clientList,
    setClientList,
  ] = useState<Client[]>(
    clients
  )

  const [
    selectedReportClientId,
    setSelectedReportClientId,
  ] = useState('')

  const [
    selectedConsultationClientId,
    setSelectedConsultationClientId,
  ] = useState('')

  const addLocalClient = (
    client: Client
  ) => {
    setClientList(
      (current) => [
        client,
        ...current,
      ]
    )
  }

  const openGenerateForClient = (
    clientId: string
  ) => {
    setSelectedReportClientId(
      clientId
    )

    setView('generate')
  }

  const openConsultationForClient = (
    clientId: string
  ) => {
    setSelectedConsultationClientId(
      clientId
    )

    setView(
      'consultation'
    )
  }

  const changeView = (
    nextView: View
  ) => {
    if (
      nextView ===
      'generate'
    ) {
      setSelectedReportClientId(
        ''
      )
    }

    if (
      nextView !==
      'consultation'
    ) {
      setSelectedConsultationClientId(
        ''
      )
    }

    setView(nextView)
  }

  const consultationClient =
    clientList.find(
      (client) =>
        client.id ===
        selectedConsultationClientId
    )

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#3e3a35]">
      <div className="flex min-h-screen">
        <Sidebar
          view={view}
          setView={
            changeView
          }
          open={open}
          setOpen={setOpen}
          fullName={
            fullName
          }
        />

        <div className="min-w-0 flex-1">
          <Header
            title={
              titles[view]
            }
            fullName={
              fullName
            }
            setOpen={
              setOpen
            }
          />

          <main>
            {view ===
              'dashboard' && (
              <Dashboard
                setView={
                  changeView
                }
                fullName={
                  fullName
                }
                clients={
                  clientList
                }
                reports={
                  reports
                }
              />
            )}

            {view ===
              'clients' && (
              <ClientsPage
                clients={
                  clientList
                }
                setView={
                  changeView
                }
                onGenerateClient={
                  openGenerateForClient
                }
                onStartConsultation={
                  openConsultationForClient
                }
              />
            )}

            {view ===
              'reports' && (
              <ReportsPage
                reports={
                  reports
                }
                setView={
                  changeView
                }
              />
            )}

            {view ===
              'new-client' && (
              <NewClientPage
                setView={
                  changeView
                }
                onAddClient={
                  addLocalClient
                }
                clientSources={
                  clientSources
                }
                employees={
                  employees
                }
              />
            )}

            {view ===
              'generate' && (
              <GeneratePage
                key={
                  selectedReportClientId ||
                  'general'
                }
                clients={
                  clientList
                }
                setView={
                  changeView
                }
                initialClientId={
                  selectedReportClientId
                }
              />
            )}

            {view ===
              'consultation' &&
              consultationClient && (
                <ConsultationWorkspace
                  key={
                    consultationClient.id
                  }
                  client={{
                    id:
                      consultationClient.id,
                    clientNumber:
                      consultationClient.clientNumber,
                    name:
                      consultationClient.name,
                    dob:
                      consultationClient.dob,
                  }}
                  onBack={() =>
                    changeView(
                      'clients'
                    )
                  }
                />
              )}

            {view ===
              'consultation' &&
              !consultationClient && (
                <div className="p-5 sm:p-8 lg:p-10">
                  <div className="mx-auto max-w-xl rounded-2xl border border-[#e8dfd3] bg-white p-8 text-center">
                    <Users className="mx-auto size-8 text-[#b89a61]" />

                    <h2 className="mt-4 font-serif text-xl font-semibold text-[#24354c]">
                      Client not
                      selected
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#81776b]">
                      Return to the
                      Clients page
                      and choose the
                      client whose
                      consultation
                      you want to
                      start.
                    </p>

                    <Button
                      onClick={() =>
                        changeView(
                          'clients'
                        )
                      }
                      className="mt-5 rounded-xl bg-[#24354c] px-5 text-white hover:bg-[#30445f]"
                    >
                      Back to
                      Clients
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