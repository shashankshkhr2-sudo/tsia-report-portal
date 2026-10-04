'use client'

import {
  ArrowRight,
  Brain,
  FileText,
  MessageCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export type ClientCardData = {
  id: string
  clientNumber?: string
  name: string
  initials?: string
  phone?: string
  whatsapp?: string
  email?: string
  sourceName?: string
  reportCount?: number
  questionCount?: number
  consultationCount?: number
  lastActivity?: string
  joined?: string
  primaryEmployeeName?: string
}

type ClientCardProps = {
  client: ClientCardData

  onTSIANumerologyReport: (
    clientId: string
  ) => void

  onIntelligenceReport: (
    clientId: string
  ) => void

  onStartConsultation: (
    clientId: string
  ) => void
}

export function ClientCard({
  client,
  onTSIANumerologyReport,
  onIntelligenceReport,
  onStartConsultation,
}: ClientCardProps) {
  const hasWhatsApp = Boolean(
    client.whatsapp ||
      client.phone
  )

  const consultationCount =
    client.consultationCount ?? 0

  const returningClient =
    consultationCount > 0

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white shadow-sm transition hover:border-[#d9c49b] hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-sm font-semibold text-white sm:size-12">
            {client.initials ||
              getInitials(
                client.name
              )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-serif text-lg font-semibold text-[#24354c]">
                    {client.name}
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
                      {client.phone}
                    </span>
                  ) : (
                    <span className="text-[#aaa095]">
                      No mobile number
                    </span>
                  )}

                  {hasWhatsApp && (
                    <span className="rounded-full bg-[#f1f7f1] px-2 py-0.5 text-[10px] font-semibold text-[#55705a]">
                      WhatsApp
                    </span>
                  )}

                  {client.email && (
                    <span className="hidden truncate text-xs text-[#a09588] md:inline">
                      {client.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 lg:text-right">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#aaa095]">
                  Last activity
                </div>

                <div className="mt-1 text-sm font-medium text-[#4e5b6d]">
                  {client.lastActivity ||
                    client.joined ||
                    '—'}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <InfoBox
                label="Source"
                value={
                  client.sourceName ||
                  '—'
                }
                tone="gold"
              />

              <