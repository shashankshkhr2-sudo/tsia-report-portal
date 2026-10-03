'use client'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  History,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import type {
  ConsultationClient,
  ConsultationMode,
  ConsultationPurpose,
} from '@/components/consultation-workspace'

type Props = {
  client: ConsultationClient
  mode: ConsultationMode
  purpose: ConsultationPurpose
  note: string
  onBack: () => void
  onOpenAssistant: () => void
}

const purposeLabels: Record<
  Exclude<ConsultationPurpose, ''>,
  string
> = {
  numerology_report:
    'Numerology Report',
  future_numerology:
    'Future Numerology',
  career: 'Career',
  business: 'Business',
  money: 'Money & Wealth',
  family: 'Family',
  relationship: 'Relationship',
  marriage: 'Marriage',
  personal_direction:
    'Personal Direction',
  follow_up: 'Follow-up',
  other: 'Other',
}

export function ConsultationContext({
  client,
  mode,
  purpose,
  note,
  onBack,
  onOpenAssistant,
}: Props) {
  const initials = client.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const purposeLabel =
    purpose
      ? purposeLabels[purpose]
      : 'Not selected'

  const modeLabel =
    mode === 'in_person'
      ? 'In-Person'
      : mode === 'phone'
        ? 'Phone'
        : 'Not selected'

  const contextItems = [
    {
      icon: History,
      title: 'Consultation History',
      text:
        'Previous consultations, topics, answers and pending follow-ups.',
    },
    {
      icon: FileText,
      title: 'Reports & Products',
      text:
        'Available reports and relevant TSIA products for this client.',
    },
    {
      icon: UserRound,
      title: 'Client Continuity',
      text:
        'Previous questions, responses and talking points already used.',
    },
    {
      icon: Sparkles,
      title: 'Numerology Context',
      text:
        'Verified TSIA numerology evidence available for guidance.',
    },
  ]

  return (
    <div className="min-h-full bg-[#f7f3ed] p-5 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Edit Consultation Setup
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
          TSIA Context Check
        </p>

        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
          Consultation Ready
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#81776b]">
          Review the consultation context
          before opening the live assistant.
        </p>

        <div className="mt-7 rounded-3xl border border-[#e3d8c9] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#24354c] font-semibold text-white">
              {initials}
            </div>

            <div>
              <h2 className="font-serif text-xl font-semibold text-[#24354c]">
                {client.name}
              </h2>

              <p className="text-xs text-[#8e8275]">
                {client.clientNumber ||
                  'TSIA Client'}
              </p>

              {client.dob && (
                <p className="mt-1 text-xs text-[#8e8275]">
                  DOB {client.dob}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e7ddcf] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                Consultation
              </p>

              <p className="mt-2 font-serif text-xl font-semibold text-[#24354c]">
                #1
              </p>

              <p className="mt-1 text-[11px] text-[#948779]">
                Automatic from history
              </p>
            </div>

            <div className="rounded-2xl border border-[#e7ddcf] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                Mode
              </p>

              <p className="mt-2 text-sm font-semibold text-[#24354c]">
                {modeLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e7ddcf] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                Purpose
              </p>

              <p className="mt-2 text-sm font-semibold text-[#24354c]">
                {purposeLabel}
              </p>
            </div>
          </div>

          {note.trim() && (
            <div className="mt-4 rounded-2xl bg-[#f8f4ed] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                Today&apos;s Note
              </p>

              <p className="mt-2 text-sm leading-6 text-[#61594f]">
                {note.trim()}
              </p>
            </div>
          )}

          <div className="mt-7 border-t border-[#eee7dc] pt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
              System Review
            </p>

            <h3 className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
              What the system will review
            </h3>

            <div className="mt-4 space-y-3">
              {contextItems.map(
                ({
                  icon: Icon,
                  title,
                  text,
                }) => (
                  <div
                    key={title}
                    className="flex gap-3 rounded-2xl bg-[#f8f4ed] p-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#ad7b40]">
                      <Icon className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#24354c]">
                        {title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#81766a]">
                        {text}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#dce5db] bg-[#f4f8f3] p-4">
            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#dfeadd] text-[#587054]">
                <Check className="size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#425a42]">
                  Guidance rule ready
                </p>

                <p className="mt-1 text-xs leading-5 text-[#687b67]">
                  First consultation:
                  numerology-led hypothesis,
                  client-validated
                  conversation.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={onOpenAssistant}
            className="mt-7 h-12 w-full rounded-xl bg-[#24354c] text-white"
          >
            Open Consultation Assistant
            <ArrowRight className="ml-2 size-4" />
          </Button>

          <p className="mt-3 text-center text-[11px] leading-5 text-[#9b8f82]">
            Database persistence will be
            connected after the consultation
            workflow is approved.
          </p>
        </div>
      </div>
    </div>
  )
}