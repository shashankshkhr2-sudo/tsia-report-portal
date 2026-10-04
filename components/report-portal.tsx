'use client'

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
  const ready = reports.filter(
    (report) => report.status === 'Ready'
  ).length

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">

        <header className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
            The Swastik Indian Art
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
            TSIA Report Portal
          </h1>

          <p className="mt-2 text-sm text-[#81776b]">
            Welcome, {fullName}
          </p>
        </header>

        {/* DASHBOARD SUMMARY */}
        <section className="grid grid-cols-3 gap-2 sm:gap-4">
          <Stat label="Clients" value={clients.length} />
          <Stat label="Reports" value={reports.length} />
          <Stat label="Ready" value={ready} />
        </section>

        {/* CLIENTS */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#24354c]">
              Clients
            </h2>

            <span className="text-xs text-[#9b9186]">
              {clients.length} total
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-[#24354c]">
            Recent Reports
          </h2>

          <div className="mt-4 space-y-3">
            {reports.length ? (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-[#e8dfd3] bg-white p-4"
                >
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#24354c]">
                        {report.client}
                      </p>

                      <p className="mt-1 text-xs text-[#81776b]">
                        {report.version} · {report.date}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-semibold text-[#8d744f]">
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

function Stat({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-[#e8dfd3] bg-white px-2 py-4 text-center sm:rounded-2xl sm:p-5 sm:text-left">
      <p className="text-xs text-[#81776b] sm:text-sm">
        {label}
      </p>

      <p className="mt-1 font-serif text-2xl font-semibold text-[#24354c] sm:mt-2 sm:text-3xl">
        {value}
      </p>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8cbbb] p-5 text-sm text-[#81776b]">
      {text}
    </div>
  )
}