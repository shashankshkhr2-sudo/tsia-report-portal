'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type ConsultationClient = {
  id: string
  clientNumber: string
  name: string
  dob?: string | null
}

type ConsultationWorkspaceProps = {
  client: ConsultationClient
  onBack: () => void
}

export function ConsultationWorkspace({
  client,
  onBack,
}: ConsultationWorkspaceProps) {
  const [mode, setMode] = useState<
    'FIRST_CONSULTATION' | 'FOLLOW_UP'
  >('FIRST_CONSULTATION')

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#8d744f]"
      >
        <ArrowLeft className="size-4" />
        Back to Clients
      </button>

      <div className="mb-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
          TSIA Consultation
        </p>

        <h2 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
          {client.name}
        </h2>

        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#81776b]">
          <span>Client ID: {client.clientNumber}</span>

          {client.dob && (
            <span>DOB: {client.dob}</span>
          )}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-[#e8dfd3] bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f3eadc] text-[#ad7b40]">
            <UserRound className="size-5" />
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-[#24354c]">
              Consultation Mode
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#81776b]">
              Select the consultation context before beginning the
              conversation.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode('FIRST_CONSULTATION')}
            className={`rounded-xl border p-4 text-left ${
              mode === 'FIRST_CONSULTATION'
                ? 'border-[#24354c] bg-[#f4f6f8]'
                : 'border-[#e8dfd3] bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#24354c]">
                First Consultation
              </span>

              {mode === 'FIRST_CONSULTATION' && (
                <CheckCircle2 className="size-5 text-[#ad7b40]" />
              )}
            </div>

            <p className="mt-2 text-xs leading-5 text-[#81776b]">
              Numerology-led hypothesis with a client-validated
              conversation.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode('FOLLOW_UP')}
            className={`rounded-xl border p-4 text-left ${
              mode === 'FOLLOW_UP'
                ? 'border-[#24354c] bg-[#f4f6f8]'
                : 'border-[#e8dfd3] bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#24354c]">
                Follow-up Consultation
              </span>

              {mode === 'FOLLOW_UP' && (
                <CheckCircle2 className="size-5 text-[#ad7b40]" />
              )}
            </div>

            <p className="mt-2 text-xs leading-5 text-[#81776b]">
              Client-history-led guidance with numerology used as
              supporting context.
            </p>
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#e8dfd3] bg-white p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-[#ad7b40]" />

            <h3 className="font-serif text-lg font-semibold text-[#24354c]">
              TSIA Guidance
            </h3>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#81776b]">
            Verified TSIA findings, talking points and consultation
            guidance will appear here.
          </p>

          <div className="mt-5 rounded-xl bg-[#f8f4ed] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a7b4f]">
              Methodology Protection
            </p>

            <p className="mt-2 text-sm leading-6 text-[#6f675e]">
              The consultation workspace will use verified TSIA
              evidence. It will not modify the frozen numerology
              calculations or invent unsupported conclusions.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e8dfd3] bg-white p-5">
          <div className="flex items-center gap-3">
            <MessageSquareText className="size-5 text-[#ad7b40]" />

            <h3 className="font-serif text-lg font-semibold text-[#24354c]">
              Live Conversation
            </h3>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#81776b]">
            Questions, client responses, observations and validated
            findings will be handled here as the consultation system
            is connected.
          </p>

          <div className="mt-5 rounded-xl border border-dashed border-[#d8cbbb] p-5 text-center">
            <ShieldCheck className="mx-auto size-6 text-[#ad7b40]" />

            <p className="mt-3 text-sm font-medium text-[#24354c]">
              Consultation data protection ready
            </p>

            <p className="mt-1 text-xs leading-5 text-[#8a8075]">
              Database permissions, role access and audit controls
              will remain part of the production security layer.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          className="h-11 rounded-xl bg-[#24354c] px-6 text-white hover:bg-[#30445f]"
        >
          Start Consultation
        </Button>
      </div>
    </div>
  )
}