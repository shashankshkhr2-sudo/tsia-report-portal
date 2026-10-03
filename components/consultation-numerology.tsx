'use client'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Grid3X3,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type ClientSummary = {
  id: string
  clientNumber?: string
  name: string
  dob?: string
}

type ConsultationNumerologyProps = {
  client: ClientSummary
  mode?: string
  purpose?: string
  onBack: () => void
  onBegin: () => void
}

const standardGrid = [
  4, 9, 2,
  3, 5, 7,
  8, 1, 6,
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function displayMode(mode?: string) {
  if (mode === 'in_person') {
    return 'In-Person'
  }

  if (mode === 'phone') {
    return 'Phone'
  }

  return mode || 'Consultation'
}

function displayPurpose(
  purpose?: string
) {
  const labels: Record<
    string,
    string
  > = {
    numerology_report:
      'Numerology Report',

    future_numerology:
      'Future Numerology',

    career:
      'Career',

    business:
      'Business',

    money:
      'Money',

    family:
      'Family',

    relationship:
      'Relationship',

    marriage:
      'Marriage',

    personal_direction:
      'Personal Direction',

    follow_up:
      'Follow-up',

    other:
      'Other',
  }

  if (!purpose) {
    return 'Numerology Consultation'
  }

  return labels[purpose] || purpose
}

function StandardLoShu() {
  return (
    <div className="grid aspect-square w-full max-w-[260px] grid-cols-3 overflow-hidden rounded-2xl border border-[#d9cfbf] bg-white">
      {standardGrid.map(
        (number, index) => (
          <div
            key={`${number}-${index}`}
            className="flex items-center justify-center border-b border-r border-[#e5dccf] text-xl font-semibold text-[#24354c] [&:nth-child(3n)]:border-r-0 [&:nth-child(n+7)]:border-b-0"
          >
            {number}
          </div>
        )
      )}
    </div>
  )
}

function PendingPersonalGrid() {
  return (
    <div className="grid aspect-square w-full max-w-[260px] grid-cols-3 overflow-hidden rounded-2xl border border-[#d9cfbf] bg-[#fcfaf6]">
      {standardGrid.map(
        (number, index) => (
          <div
            key={`${number}-${index}`}
            className="flex items-center justify-center border-b border-r border-[#e5dccf] text-xs font-medium text-[#b1a89e] [&:nth-child(3n)]:border-r-0 [&:nth-child(n+7)]:border-b-0"
          >
            —
          </div>
        )
      )}
    </div>
  )
}

function PendingTag({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-[#e6ddd1] bg-[#fcfaf6] px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b8d7e]">
        {children}
      </p>

      <p className="mt-1 text-xs text-[#8e8275]">
        Loading from verified analysis
      </p>
    </div>
  )
}

export function ConsultationNumerology({
  client,
  mode,
  purpose,
  onBack,
  onBegin,
}: ConsultationNumerologyProps) {
  return (
    <div className="min-h-full bg-[#f7f3ed] p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Back to Context Check
        </button>

        <div className="mb-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
            TSIA Numerology Analysis
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
            Consultation Numerology Brief
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#81776b]">
            Review the client's verified
            numerology before beginning the
            live conversation. Treat the
            analysis as a starting
            hypothesis and validate it
            through the client's actual
            experience.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#e3d8c9] bg-white shadow-sm">
          <div className="bg-[#24354c] p-5 text-white sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#d6b47b] text-sm font-bold text-[#24354c]">
                {initials(client.name)}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d6b47b]">
                  Client
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  {client.name}
                </h2>

                <p className="mt-1 text-xs text-[#cbd2da]">
                  {client.clientNumber ||
                    'TSIA Client'}

                  {client.dob
                    ? ` · DOB ${client.dob}`
                    : ''}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#d6b47b]">
                  Mode
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {displayMode(mode)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#d6b47b]">
                  Purpose
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {displayPurpose(
                    purpose
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex items-start gap-3 rounded-2xl border border-[#dce5db] bg-[#f4f8f3] p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dfeadd] text-[#587054]">
                <Check className="size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#425a42]">
                  Verified Numerology
                  Context
                </p>

                <p className="mt-1 text-xs leading-5 text-[#687b67]">
                  This workspace is
                  designed to receive
                  calculations and evidence
                  from the verified TSIA
                  Numerology V2 engine.
                  Consultation responses
                  must never alter the
                  underlying calculation.
                </p>
              </div>
            </div>

            <section className="mt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                Core Numbers
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
                Numerology at a Glance
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: 'Mulank',
                    description:
                      'Birth number',
                  },
                  {
                    label: 'Bhagyank',
                    description:
                      'Life path number',
                  },
                  {
                    label:
                      'Name Number',
                    description:
                      'Chaldean name number',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#e6ddd1] bg-[#fcfaf6] p-5"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                      {item.label}
                    </p>

                    <p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">
                      —
                    </p>

                    <p className="mt-2 text-xs text-[#8e8275]">
                      {item.description}
                    </p>

                    <p className="mt-3 text-[10px] font-semibold text-[#ad7b40]">
                      Awaiting verified
                      engine data
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-9 border-t border-[#eee7dc] pt-8">
              <div className="flex items-center gap-2">
                <Grid3X3 className="size-4 text-[#ad7b40]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                  Lo Shu Analysis
                </p>
              </div>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
                Standard & Personal Grid
              </h3>

              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-xs font-semibold text-[#5f574d]">
                    Standard Lo Shu
                  </p>

                  <StandardLoShu />
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold text-[#5f574d]">
                    Personal Lo Shu
                  </p>

                  <PendingPersonalGrid />

                  <p className="mt-3 max-w-[260px] text-[11px] leading-5 text-[#95897c]">
                    Personal grid will be
                    populated directly from
                    the verified TSIA
                    calculation.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PendingTag>
                  Present Numbers
                </PendingTag>

                <PendingTag>
                  Missing Numbers
                </PendingTag>

                <PendingTag>
                  Repeated Numbers
                </PendingTag>
              </div>
            </section>

            <section className="mt-9 border-t border-[#eee7dc] pt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                Structural Analysis
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
                Rajyog & Graha
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e