'use client'

import type { PortalData } from '@/lib/portal-data'

type Props = {
  data: PortalData
}

export function ReportPortal({ data }: Props) {
  const readyReports = data.reports.filter(
    (report) => report.status === 'Ready'
  ).length

  const processingReports = data.reports.filter(
    (report) => report.status === 'Processing'
  ).length

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
            The Swastik Indian Art
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
            TSIA Report Portal
          </h1>

          <p className="mt-2 text-sm text-[#81776b]">
            Client, report and consultation management
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Clients"
            value={data.clients.length}
          />

          <StatCard
            label="Ready Reports"
            value={readyReports}
          />

          <StatCard
            label="Processing"
            value={processingReports}
          />
        </section>

        <section className="mt-8 rounded-2xl border border-[#e8dfd3] bg-white p-5">
          <h2 className="font-serif text-xl font-semibold text-[#24354c]">
            Clients
          </h2>

          <div className="mt-4 space-y-3">
            {data.clients.length === 0 ? (
              <p className="text-sm text-[#81776b]">
                No clients available.
              </p>
            ) : (
              data.clients.map((client) => (
                <article
                  key={client.id}
                  className="rounded-xl border border-[#eee5da] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#f3eadc] font-semibold text-[#8d744f]">
                      {client.initials}
                    </div>

                    <div>
                      <p className="font-semibold text-[#24354c]">
                        {client.name}
                      </p>

                      <p className="text-xs text-[#81776b]">
                        {client.phone || 'No phone'}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#e8dfd3] bg-white p-5">
          <h2 className="font-serif text-xl font-semibold text-[#24354c]">
            Recent Reports
          </h2>

          <div className="mt-4 space-y-3">
            {data.reports.length === 0 ? (
              <p className="text-sm text-[#81776b]">
                No reports available.
              </p>
            ) : (
              data.reports.map((report) => (
                <article
                  key={report.id}
                  className="flex items-center justify-between rounded-xl border border-[#eee5da] p-4"
                >
                  <div>
                    <p className="font-semibold text-[#24354c]">
                      {report.client}
                    </p>

                    <p className="mt-1 text-xs text-[#81776b]">
                      {report.version} · {report.date}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#f3eadc] px-3 py-1 text-xs font-semibold text-[#8d744f]">
                    {report.status}
                  </span>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5">
      <p className="text-sm text-[#81776b]">{label}</p>

      <p className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
        {value}
      </p>
    </div>
  )
}