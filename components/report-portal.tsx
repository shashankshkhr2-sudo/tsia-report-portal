'use client'

import { useState, useTransition } from 'react'
import {
  ArrowRight,
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

const NOT_AVAILABLE = 'Not available yet'

const disabledControl =
  'disabled:cursor-not-allowed disabled:opacity-50'

const navItems: {
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

const toneClasses: Record<Tone, string> = {
  plum: 'bg-[#eee3ee] text-[#76536f]',
  terracotta: 'bg-[#f6e5dd] text-[#a55f46]',
  olive: 'bg-[#e7eddf] text-[#66805c]',
  navy: 'bg-[#e2e9f0] text-[#526b84]',
}

const inputClass =
  'h-11 w-full rounded-xl border border-[#e5dccf] bg-white px-3 text-sm font-normal text-[#3e3a35] outline-none transition focus:border-[#d6b47b] focus:ring-2 focus:ring-[#d6b47b]/20'

const labelClass =
  'flex flex-col gap-2 text-xs font-semibold text-[#5f574d]'

function getInitials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function StatusBadge({
  status,
}: {
  status: Report['status']
}) {
  const ready = status === 'Ready'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        ready
          ? 'bg-[#e7f1e8] text-[#3f7650]'
          : 'bg-[#fff3dc] text-[#a26a1b]'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          ready ? 'bg-[#5e9a68]' : 'bg-[#d68a29]'
        }`}
      />
      {status}
    </span>
  )
}

function EmptyState({
  message,
}: {
  message: string
}) {
  return (
    <p className="px-5 py-10 text-center text-sm text-[#9a8d7e] sm:px-6">
      {message}
    </p>
  )
}

function Sidebar({
  view,
  setView,
  open,
  setOpen,
  fullName,
  initials,
}: {
  view: View
  setView: (v: View) => void
  open: boolean
  setOpen: (v: boolean) => void
  fullName: string
  initials: string
}) {
  const [signOutError, setSignOutError] =
    useState<string | null>(null)

  const [signingOut, startSignOut] = useTransition()

  const handleSignOut = () => {
    setSignOutError(null)

    startSignOut(async () => {
      const result = await signOut()

      if (result?.error) {
        setSignOutError(result.error)
      }
    })
  }

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-[#24354c]/25 lg:hidden"
          onClick={() => setOpen(false)}
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
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad9a84]">
          Workspace
        </p>

        <nav className="flex flex-col gap-1">
          {navItems.map(
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
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                  view === id
                    ? 'bg-[#24354c] font-medium text-white shadow-sm'
                    : 'text-[#6d665d] hover:bg-[#f0e9de]'
                }`}
              >
                <Icon className="size-[18px]" />
                {label}
              </button>
            )
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-[#e8dfd3] pt-5">
          <button
            disabled
            title={NOT_AVAILABLE}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d] hover:bg-[#f0e9de] ${disabledControl}`}
          >
            <Settings className="size-[18px]" />
            Settings
          </button>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#6d665d] hover:bg-[#f0e9de] ${disabledControl}`}
          >
            <LogOut className="size-[18px]" />

            {signingOut
              ? 'Signing out…'
              : 'Sign out'}
          </button>

          {signOutError && (
            <p
              role="alert"
              className="px-3 text-xs text-[#a55f46]"
            >
              {signOutError}
            </p>
          )}

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f0e9de]/70 p-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#d6b47b] text-xs font-semibold text-[#24354c]">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#3e3a35]">
                {fullName}
              </p>

              <p className="text-[10px] text-[#9a8b7b]">
                Administrator
              </p>
            </div>

            <ChevronDown className="ml-auto size-3.5 text-[#a79582]" />
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({
  title,
  setOpen,
  fullName,
  initials,
}: {
  title: string
  setOpen: (v: boolean) => void
  fullName: string
  initials: string
}) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[#e8dfd3] bg-[#fffdf9] px-5 sm:px-8 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden"
          onClick={() => setOpen(true)}
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
          {initials}
        </div>

        <span className="text-sm font-medium text-[#4b4741]">
          {fullName}
        </span>
      </div>
    </header>
  )
}

function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
            {eyebrow}
          </p>
        )}

        <h2 className="font-serif text-[30px] font-medium leading-tight text-[#24354c]">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#81776b]">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Users
  label: string
  value: string
  note: string
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
          <Icon className="size-[18px]" />
        </div>
      </div>

      <p className="mt-4 text-[11px] text-[#7d9579]">
        {note}
      </p>
    </div>
  )
}

function ReportRow({
  report,
  setView,
}: {
  report: Report
  setView: (v: View) => void
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${toneClasses[report.tone]}`}
      >
        {report.initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#3e3a35]">
          {report.client}
        </p>

        <p className="mt-0.5 text-[11px] text-[#9a8d7e]">
          {report.version} · {report.date}
        </p>
      </div>

      <StatusBadge status={report.status} />

      <button
        onClick={() => setView('reports')}
        className="hidden rounded-lg p-2 text-[#958778] hover:bg-[#f6f0e7] sm:block"
        aria-label={`Open ${report.client} report`}
      >
        <ArrowRight className="size-4" />
      </button>
    </div>
  )
}

function Dashboard({
  setView,
  firstName,
  reports,
  clients,
}: {
  setView: (v: View) => void
  firstName: string
  reports: Report[]
  clients: Client[]
}) {
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <PageIntro
        eyebrow="Your workspace"
        title={`Good morning, ${firstName}`}
        description="Manage clients and prepare personalized TSIA reports."
        action={
          <Button
            onClick={() =>
              setView('new-client')
            }
            className="h-11 rounded-xl bg-[#24354c] px-5 text-sm text-white hover:bg-[#30445f]"
          >
            <Plus data-icon="inline-start" />
            New client
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric
          icon={Users}
          label="My clients"
          value={String(clients.length)}
          note="Active client records"
        />

        <Metric
          icon={FileText}
          label="Reports"
          value={String(reports.length)}
          note="Reports in your workspace"
        />

        <Metric
          icon={Clock3}
          label="In progress"
          value={String(
            reports.filter(
              (report) =>
                report.status === 'Processing'
            ).length
          )}
          note="Reports being prepared"
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="rounded-2xl border border-[#e8dfd3] bg-white">
          <div className="flex items-center justify-between border-b border-[#eee7dc] px-5 py-5 sm:px-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#24354c]">
                Recent reports
              </h3>

              <p className="mt-1 text-xs text-[#9a8d7e]">
                Your latest client reports
              </p>
            </div>

            <button
              onClick={() =>
                setView('reports')
              }
              className="flex items-center gap-1 text-xs font-semibold text-[#ad7b40]"
            >
              View all
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#f1ebe2]">
            {reports.length === 0 ? (
              <EmptyState message="No reports to show yet." />
            ) : (
              reports
                .slice(0, 4)
                .map((report) => (
                  <ReportRow
                    key={report.id}
                    report={report}
                    setView={setView}
                  />
                ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-[#24354c] p-6 text-white">
          <div className="mb-7 flex size-10 items-center justify-center rounded-xl bg-[#d6b47b]/15 text-[#d6b47b]">
            <Sparkles className="size-5" />
          </div>

          <