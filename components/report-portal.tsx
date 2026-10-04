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

import {
  Logo,
} from '@/components/portal-logo'

import {
  ClientCard,
} from '@/components/client-card'

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
  const [signingOut, startSignOut] =
    useTransition()

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
          open
            ? 'translate-x-0'
            : '-translate-x-full'
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
              startSignOut(async () => {
                await signOut()
              })
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
    (report) =>
      report.status === 'Processing'
  ).length

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Your workspace"
        title={`Good morning, ${
          fullName.split(/\s+/)[0] ||
          'there'
        }`}
        description="Manage clients and prepare personalized TSIA reports."
      >
        <Button
          onClick={() =>
            setView('new-client')
          }
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
        ].map(
          ({
            label,
            value,
            icon: Icon,
          }) => (
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
          )
        )}
      </div>

      <div className="mt-8 rounded-2xl bg-[#24354c] p-6 text-white">
        <Sparkles className="size-5 text-[#d6b47b]" />

        <h3 className="mt-5 font-serif text-xl">
          Create a new report
        </h3>

        <p className="mt-2 text-sm text-[#c6cbd1]">
          Generate a personalized TSIA
          report for an existing client.
        </p>

        <Button
          onClick={() =>
            setView('generate')
          }
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
  onGenerateClient,
  onStartConsultation,
}: {
  clients: Client[]
  setView: (view: View) => void
  onGenerateClient: (
    clientId: string
  ) => void
  onStartConsultation: (
    clientId: string
  ) => void
}) {
  const [searchTerm, setSearchTerm] =
    useState('')

  const normalizedSearch =
    searchTerm.trim().toLowerCase()

  const filteredClients =
    clients.filter((client) => {
      if (!normalizedSearch) {
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
          .includes(normalizedSearch)
      )
    })

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageTitle
        eyebrow="Client management"
        title="Clients"
        description="Manage clients, reports and customer interactions."
      >
        <Button
          onClick={() =>
            setView('new-client')
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
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search Client ID / Name / Mobile / Email"
            className="h-10 w-full rounded-xl border border-[#e4dbcf] bg-white pl-10 pr-4 text-sm text-[#24354c] outline-none transition focus:border-[#b89a61] focus:ring-2 focus:ring-[#b89a61]/10"
          />
        </div>

        <button
          type="button"
          title="More filters will