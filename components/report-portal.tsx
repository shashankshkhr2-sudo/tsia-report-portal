'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Client, Report } from '@/lib/portal-types'
import { ClientCard } from '@/components/client-card'

type Props = {
  fullName: string
  reports: Report[]
  clients: Client[]
}

export function ReportPortal({
  fullName,
  reports,
  clients,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const inProgress = reports.filter(
    (report) =>
      report.status?.toLowerCase() === 'in progress' ||
      report.status?.toLowerCase() === 'pending'
  ).length

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#24354c]">

      {/* TOP BAR */}
      <header className="border-b border-[#e7ddd0] bg-[#fffdf9]">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-6">

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-3xl text-[#24354c]"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9b9186]">
              TSIA Report Portal
            </p>

            <h1 className="font-serif text-3xl font-semibold">
              Dashboard
            </h1>
          </div>

        </div>
      </header>

      {/* MOBILE SIDE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">

          <div className="w-[82%] max-w-sm bg-[#fffaf2] p-6 shadow-xl">

            <div className="flex items-start justify-between">

              <div>
                <p className="font-serif text-2xl font-bold tracking-[0.18em]">
                  TSIA
                </p>

                <p className="text-xs tracking-[0.25em] text-[#ad7b40]">
                  REPORT PORTAL
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-3xl"
                aria-label="Close menu"
              >
                ×
              </button>

            </div>

            <p className="mt-16 text-xs font-semibold uppercase tracking-[0.2em] text-[#b3a89c]">
              Workspace
            </p>

            <nav className="mt-5 space-y-3">

              <MenuItem
                href="/"
                label="Dashboard"
                active
              />

              <MenuItem
                href="/clients"
                label="Clients"
              />

              <MenuItem
                href="/reports"
                label="Reports"
              />

            </nav>

            <div className="mt-16 border-t border-[#e7ddd0] pt-6">

              <div className="mb-6 text-[#aaa198]">
                Settings
              </div>

              <Link
                href="/logout"
                className="block text-[#6f6961]"
              >
                Sign out
              </Link>

            </div>

            <div className="mt-10 rounded-2xl bg-[#f6ecdf] p-4">

              <p className="font-semibold">
                {fullName}
              </p>

              <p className="text-sm text-[#9b9186]">
                TSIA Team Member
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex-1 bg-black/20"
            aria-label="Close menu"
          />

        </div>
      )}

      {/* DASHBOARD */}
      <div className="mx-auto max-w-6xl px-5 py-8">

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ad7b40]">
          Your Workspace
        </p>

        <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
          Welcome, {fullName}
        </h2>

        <p className="mt-4 text-base text-[#81776b]">
          Manage clients and prepare personalized TSIA reports.
        </p>

        {/* ADD CLIENT */}
        <Link
          href="/clients/new"
          className="mt-8 flex w-full items-center justify-center gap-4 rounded-2xl bg-[#243f5c] px-6 py-5 text-lg font-semibold text-white shadow-sm"
        >
          <span className="text-2xl font-light">+</span>
          Add Client
        </Link>

        {/* SUMMARY */}
        <section className="mt-8 grid gap-5 sm:grid-cols-3">

          <DashboardStat
            label="My Clients"
            value={clients.length}
            symbol="♙"
          />

          <DashboardStat
            label="Reports"
            value={reports.length}
            symbol="▤"
          />

          <DashboardStat
            label="In Progress"
            value={inProgress}
            symbol="◷"
          />

        </section>

        {/* CLIENTS */}
        <section className="mt-10">

          <div className="flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
                Client Management
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold">
                My Clients
              </h2>
            </div>

            <span className="text-sm text-[#9b9186]">
              {clients.length} total
            </span>

          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {clients.length ? (
              clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                />
              ))
            ) : (
              <Empty text="No clients available yet." />
            )}

          </div>

        </section>

        {/* REPORTS */}
        <section className="mt-10 pb-10">

          <div className="flex items-center justify-between">

            <h2 className="font-serif text-2xl font-semibold">
              Recent Reports
            </h2>

            <span className="text-sm text-[#9b9186]">
              {reports.length} total
            </span>

          </div>

          <div className="mt-5 space-y-3">

            {reports.length ? (
              reports.slice(0, 5).map((report) => (

                <div
                  key={report.id}
                  className="rounded-2xl border border-[#e7ddd0] bg-white p-4"
                >

                  <div className="flex justify-between gap-4">

                    <div className="min-w-0">

                      <p className="truncate font-semibold">
                        {report.client}
                      </p>

                      <p className="mt-1 text-xs text-[#81776b]">
                        {report.version} · {report.date}
                      </p>

                    </div>

                    <span className="shrink-0 text-xs font-semibold text-[#ad7b40]">
                      {report.status}
                    </span>

                  </div>

                </div>

              ))
            ) : (
              <Empty text="No reports available yet." />
            )}

          </div>

        </section>

      </div>

    </main>
  )
}

function DashboardStat({
  label,
  value,
  symbol,
}: {
  label: string
  value: number
  symbol: string
}) {
  return (
    <div className="rounded-3xl border border-[#e7ddd0] bg-white p-6">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-[#81776b]">
            {label}
          </p>

          <p className="mt-5 font-serif text-4xl font-semibold">
            {value}
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6ecdf] text-2xl text-[#ad7b40]">
          {symbol}
        </div>

      </div>

    </div>
  )
}

function MenuItem({
  href,
  label,
  active = false,
}: {
  href: string
  label: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'block rounded-2xl bg-[#243f5c] px-5 py-4 font-semibold text-white'
          : 'block rounded-2xl px-5 py-4 text-[#6f6961]'
      }
    >
      {label}
    </Link>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8cbbb] p-5 text-sm text-[#81776b]">
      {text}
    </div>
  )
}