'use client'

import {
  ArrowRight,
  MessageCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Client } from '@/lib/portal-types'

type Props = {
  client: Client
  onGenerate: (clientId: string) => void
  onConsultation: (clientId: string) => void
}

export function ClientCard({
  client,
  onGenerate,
  onConsultation,
}: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-sm font-semibold text-white">
            {client.initials || 'C'}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-[#24354c]">
                {client.name}
              </h3>

              {client.clientNumber && (
                <span className="rounded-full border border-[#e6d8bd] bg-[#fbf6ec] px-2 py-1 text-[10px] font-semibold text-[#8b6d37]">
                  {client.clientNumber}
                </span>
              )}
            </div>

            <div className="mt-2 text-sm text-[#766d63]">
              {client.phone || 'No mobile number'}
            </div>

            {client.email && (
              <div className="mt-1 truncate text-xs text-[#9a8d7e]">
                {client.email}
              </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#fcf8ef] p-3">
                <p className="text-[10px] uppercase text-[#a38a5b]">
                  Source
                </p>

                <p className="mt-1 truncate text-xs font-semibold text-[#5d554b]">
                  {client.sourceName || '—'}
                </p>
              </div>

              <div className="rounded-xl bg-[#f7f9fb] p-3">
                <p className="text-[10px] uppercase text-[#7c8795]">
                  Reports
                </p>

                <p className="mt-1 font-semibold text-[#24354c]">
                  {client.reportCount ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-[#fbf8f5] p-3">
                <p className="text-[10px] uppercase text-[#97897b]">
                  Questions
                </p>

                <p className="mt-1 font-semibold text-[#24354c]">
                  {client.questionCount ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-[#eee7dc] pt-3">
              <p className="mb-3 text-xs text-[#94887b]">
                Assigned to{' '}
                <span className="font-semibold text-[#5d574f]">
                  {client.primaryEmployeeName || 'Not assigned'}
                </span>
              </p>

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  onClick={() => onConsultation(client.id)}
                  className="h-10 rounded-xl bg-[#24354c] px-4 text-xs text-white hover:bg-[#30445f]"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Start Consultation
                </Button>

                <button
                  type="button"
                  onClick={() => onGenerate(client.id)}
                  aria-label={`Generate report for ${client.name}`}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#e4d8c5] bg-[#fffdf9] text-[#8f7445]"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}