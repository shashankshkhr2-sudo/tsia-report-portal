'use client'

import {
  ArrowRight,
  Clock3,
  FileText,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react'

type PortalDashboardProps = {
  fullName: string
  clientCount: number
  reportCount: number
  processingCount: number
  onAddClient: () => void
  onViewClients: () => void
  onViewReports: () => void
  onGenerateReport: () => void
}

function firstName(value: string) {
  const name = value.trim().split(/\s+/)[0]
  return name || 'TSIA'
}

export function PortalDashboard({
  fullName,
  clientCount,
  reportCount,
  processingCount,
  onAddClient,
  onViewClients,
  onViewReports,
  onGenerateReport,
}: PortalDashboardProps) {
  return (
    <div>
      <section className="mb-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#ad7b40]">
          Your Workspace
        </p>

        <h2 className="font-serif text-4xl leading-tight text-[#24354c] sm:text-5xl">
          Good morning, {firstName(fullName)}
        </h2>

        <p className="mt-4 text-base leading-7 text-[#8e8478]">
          Manage clients and prepare personalized TSIA reports.
        </p>

        <button
          type="button"
          onClick={onAddClient}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#243f5a] px-6 py-5 text-base font-medium text-white transition hover:bg-[#1d344b]"
        >
          <Plus className="size-5" />
          Add Client
        </button>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={onViewClients}
          className="group rounded-2xl border border-[#e8dfd3] bg-white p-5 text-left transition hover:border-[#d6b47b] hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8e8478]">
                My Clients
              </p>

              <p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">
                {clientCount}
              </p>
            </div>

            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f3eadc] text-[#ad7b40]">
              <Users className="size-5" />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-1.5 border-t border-[#f0ebe4] pt-3 text-xs font-semibold text-[#9a7b4f]">
            View all clients
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>

        <button
          type="button"
          onClick={onViewReports}
          className="group rounded-2xl border border-[#e8dfd3] bg-white p-5 text-left transition hover:border-[#d6b47b] hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8e8478]">
                Reports
              </p>

              <p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">
                {reportCount}
              </p>
            </div>

            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f3eadc] text-[#ad7b40]">
              <FileText className="size-5" />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-1.5 border-t border-[#f0ebe4] pt-3 text-xs font-semibold text-[#9a7b4f]">
            View reports
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>

        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8e8478]">
                In Progress
              </p>

              <p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">
                {processingCount}
              </p>
            </div>

            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f3eadc] text-[#ad7b40]">
              <Clock3 className="size-5" />
            </div>
          </div>

          <p className="mt-5 border-t border-[#f0ebe4] pt-3 text-xs text-[#9a8d7e]">
            Reports currently processing
          </p>
        </div>
      </div>

      <section className="mt-8 rounded-3xl bg-[#243f5a] p-7 text-white">
        <Sparkles className="size-7 text-[#e6bd78]" />

        <h3 className="mt-8 font-serif text-3xl">
          Create a new report
        </h3>

        <p className="mt-3 max-w-xl text-base leading-7 text-white/70">
          Generate a personalized report for an existing client.
        </p>

        <button
          type="button"
          onClick={onGenerateReport}
          className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-[#e6bd78] px-5 py-3 font-semibold text-[#24354c] transition hover:bg-[#edc98e]"
        >
          Generate Report
          <ArrowRight className="size-5" />
        </button>
      </section>
    </div>
  )
}