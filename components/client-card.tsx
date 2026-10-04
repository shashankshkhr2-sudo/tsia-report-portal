'use client'

import {
  ArrowRight,
  Brain,
  FileText,
  History,
  MessageCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Client } from '@/lib/portal-types'

type ClientCardProps = {
  client: Client
  onGenerateReport: (clientId: string) => void
  onStartConsultation: (clientId: string) => void
}

export function ClientCard({
  client,
  onGenerateReport,
  onStartConsultation,
}: ClientCardProps) {
  const hasWhatsApp = Boolean(
    client.whatsapp || client.phone
  )

  const reportCount =
    client.reportCount ?? 0

  const questionCount =
    client.questionCount ?? 0

  const hasHistory =
    reportCount > 0 ||
    questionCount > 0

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-sm font-semibold text-white">
            {client.initials || 'C'}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-[#24354c]">
                {client.name}
              </h3>

              {client.clientNumber && (
                <span className="rounded-full border border-[#e6d8bd] bg-[#fbf6ec] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#8b6d37]">
                  {client.clientNumber}
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-[#766d63]">
              <span>
                {client.phone || 'No mobile number'}
              </span>

              {hasWhatsApp && (
                <span className="rounded-full bg-[#f1f7f1] px-2 py-0.5 text-[10px] font-semibold text-[#55705a]">
                  WhatsApp
                </span>
              )}
            </div>

            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#aaa095]">
                Last Activity
              </p>

              <p className="mt-1 text-sm font-medium text-[#4e5b6d]">
                {client.lastActivity ||
                  client.joined ||
                  '—'}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-[#eadfc9] bg-[#fcf8ef] px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a38a5b]">
                  Source
                </p>

                <p className="mt-1 truncate text-xs font-semibold text-[#5d554b]">
                  {client.sourceName || '—'}
                </p>
              </div>

              <div className="rounded-xl border border-[#e2e6ea] bg-[#f7f9fb] px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7c8795]">
                  Reports
                </p>

                <p className="mt-1 text-sm font-semibold text-[#24354c]">
                  {reportCount}
                </p>
              </div>

              <div className="rounded-xl border border-[#ece3da] bg-[#fbf8f5] px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#97897b]">
                  Questions
                </p>

                <p className="mt-1 text-sm font-semibold text-[#24354c]">
                  {questionCount}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-[#eee7dc] pt-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a7b4f]">
                TSIA Services
              </p>

              <button
                type="button"
                onClick={() =>
                  onGenerateReport(client.id)
                }
                className="flex w-full items-center justify-between rounded-xl border border-[#e7ddce] bg-[#fffdf9] p-3 text-left"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3eadc] text-[#9a7b4f]">
                    <FileText className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#24354c]">
                      TSIA Numerology Report
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#948779]">
                      Standard numerology report
                    </p>
                  </div>
                </div>

                <ArrowRight className="size-4 shrink-0 text-[#9a7b4f]" />
              </button>

              <div className="mt-2 flex w-full items-center justify-between rounded-xl border border-[#e3e7eb] bg-[#f8fafc] p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e7edf3] text-[#526b84]">
                    <Brain className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#24354c]">
                      TSIA Personal Numerology Intelligence Report
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#7c8795]">
                      Advanced numbers, patterns & life direction
                    </p>
                  </div>
                </div>

                <span className="ml-2 shrink-0 rounded-full bg-[#eee3ee] px-2 py-1 text-[9px] font-semibold text-[#76536f]">
                  V3
                </span>
              </div>
            </div>

            {hasHistory && (
              <div className="mt-4 rounded-xl border border-[#e5dccf] bg-[#faf7f2] p-3">
                <div className="flex items-center gap-2">
                  <History className="size-4 text-[#9a7b4f]" />

                  <p className="text-xs font-semibold text-[#24354c]">
                    Client History Available
                  </p>
                </div>

                <p className="mt-1.5 text-[11px] leading-5 text-[#81776b]">
                  Review previous reports, questions and consultation history before continuing.
                </p>
              </div>
            )}

            <div className="mt-4 border-t border-[#f0ebe4] pt-4">
              <p className="mb-3 text-xs text-[#94887b]">
                Assigned to{' '}
                <span className="font-semibold text-[#5d574f]">
                  {client.primaryEmployeeName ||
                    'Not assigned'}
                </span>
              </p>

              <Button
                type="button"
                onClick={() =>
                  onStartConsultation(client.id)
                }
                className="h-11 w-full rounded-xl bg-[#24354c] text-xs text-white hover:bg-[#30445f]"
              >
                <MessageCircle className="mr-2 size-4" />

                {hasHistory
                  ? 'Continue Consultation'
                  : 'Start Consultation'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}