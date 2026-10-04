'use client'

import { useState } from 'react'
import {
  FileText,
  LayoutDashboard,
  Search,
  Users,
} from 'lucide-react'

import type { Client, PortalData } from '@/lib/portal-types'

type ReportPortalProps = {
  data: PortalData
}

type PortalView = 'dashboard' | 'clients' | 'reports'

function toneClasses(tone: Client['tone']) {
  const tones = {
    plum: 'bg-[#efe6ed] text-[#72556c]',
    terracotta: 'bg-[#f3e5de] text-[#9a6049]',
    olive: 'bg-[#e9eadf] text-[#697052]',
    navy: 'bg-[#e3e9ef] text-[#43566d]',
  }

  return tones[tone]
}

export function ReportPortal({ data }: ReportPortalProps) {
  const [view, setView] = useState<PortalView>('dashboard')
  const [search, setSearch] = useState('')

  const normalizedSearch = search.trim().toLowerCase()

  const filteredClients = data.clients.filter((client) => {
    if (!normalizedSearch) return true

    return (
      client.name.toLowerCase().includes(normalizedSearch) ||
      client.phone.toLowerCase().includes(normalizedSearch) ||
      client.email.toLowerCase().includes(normalizedSearch)
    )
  })

  const filteredReports = data.reports.filter((report) => {
    if (!normalizedSearch) return true

    return (
      report.client.toLowerCase().includes(normalizedSearch) ||
      report.version.toLowerCase().includes(normalizedSearch) ||
      report.status.toLowerCase().includes(normalizedSearch)
    )
  })

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#24354c]">
      <header className="border-b border-[#e5ddd2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
              The Swastik Indian Art
            </p>

            <h1 className="mt-1 font-serif text-2xl font-semibold">
              TSIA Report Portal
            </h1>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-[#81776b]">
              Secure Practitioner Workspace
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[230px_1fr]">
        <aside className="border-b border-[#e5ddd2] bg-white p-4 lg:min-h-[calc(100vh-85px)] lg:border-b-0 lg:border-r">
          <nav className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <NavButton
              active={view === 'dashboard'}
              label="Dashboard"
              icon={<LayoutDashboard className="size-4" />}
              onClick={() => setView('dashboard')}
            />

            <NavButton
              active={view === 'clients'}
              label="Clients"
              icon={<Users className="size-4" />}
              onClick={() => setView('clients')}
            />

            <NavButton
              active={view === 'reports'}
              label="Reports"
              icon={<FileText className="size-4" />}
              onClick={() => setView('reports')}
            />
          </nav>
        </aside>

        <main className="p-5 sm:p-8 lg:p-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
                Practitioner Portal
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold">
                {view === 'dashboard'
                  ? 'Dashboard'
                  : view === 'clients'
                    ? 'Clients'
                    : 'Reports'}
              </h2>
            </div>

            {view !== 'dashboard' && (
              <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-[#ded5ca] bg-white px-3 sm:w-72">
                <Search className="size-4 text-[#9a9085]" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    view === 'clients'
                      ? 'Search clients'
                      : 'Search reports'
                  }
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa198]"
                />
              </div>
            )}
          </div>

          {view === 'dashboard' && (
            <Dashboard data={data} />
          )}

          {view === 'clients' && (
            <Clients clients={filteredClients} />
          )}

          {view === 'reports' && (
            <Reports reports={filteredReports} />
          )}
        </main>
      </div>
    </div>
  )
}

function NavButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium lg:justify-start ${
        active
          ? 'bg-[#24354c] text-white'
          : 'text-[#71685f] hover:bg-[#f5f1eb]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function Dashboard({ data }: { data: PortalData }) {
  const readyReports = data.reports.filter(
    (report) => report.status === 'Ready',
  ).length

  const processingReports = data.reports.filter(
    (report) => report.status === 'Processing',
  ).length

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Clients"
          value={data.clients.length}
        />

        <StatCard
          label="Ready Reports"
          value={readyReports}
        />

        <StatCard
          label="Processing