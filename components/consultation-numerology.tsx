'use client'

import {
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type Client = {
  id: string
  clientNumber?: string
  name: string
  dob?: string
}

type Props = {
  client: Client
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

export function ConsultationNumerology({
  client,
  mode,
  purpose,
  onBack,
  onBegin,
}: Props) {
  const modeLabel =
    mode === 'in_person'
      ? 'In-Person'
      : mode === 'phone'
        ? 'Phone'
        : 'Consultation'

  const purposeLabel =
    purpose
      ?.replaceAll('_', ' ')
      .replace(/\b\w/g, (c) =>
        c.toUpperCase()
      ) || 'Numerology'

  return (
    <div className="min-h-full bg-[#f7f3ed] p-5">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Back to Context Check
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
          TSIA Numerology Analysis
        </p>

        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
          Consultation Numerology Brief
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#81776b]">
          Review the verified numerology
          before beginning the client
          conversation.
        </p>

        <div className="mt-6 overflow-hidden rounded-3xl border border-[#e3d8c9] bg-white shadow-sm">
          <div className="bg-[#24354c] p-6 text-white">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#d6b47b]">
              Selected Client
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold">
              {client.name}
            </h2>

            <p className="mt-1 text-xs text-[#cbd2da]">
              {client.clientNumber ||
                'TSIA Client'}

              {client.dob
                ? ` · DOB ${client.dob}`
                : ''}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[9px] uppercase text-[#d6b47b]">
                  Mode
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {modeLabel}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[9px] uppercase text-[#d6b47b]">
                  Purpose
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {purposeLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="rounded-2xl bg-[#f4f8f3] p-4">
              <div className="flex gap-3">
                <Check className="mt-0.5 size-4 text-[#587054]" />

                <div>
                  <p className="text-sm font-semibold text-[#425a42]">
                    Verified Numerology
                    Context
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#687b67]">
                    Client responses will
                    never change the
                    verified TSIA
                    calculation.
                  </p>
                </div>
              </div>
            </div>

            <SectionTitle
              title="Core Numbers"
              subtitle="Numerology at a Glance"
            />

            <div className="grid grid-cols-3 gap-2">
              {[
                'Mulank',
                'Bhagyank',
                'Name Number',
              ].map((label) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#e6ddd1] bg-[#fcfaf6] p-3"
                >
                  <p className="text-[9px] font-semibold uppercase text-[#9b8d7e]">
                    {label}
                  </p>

                  <p className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
                    —
                  </p>

                  <p className="mt-1 text-[9px] text-[#ad7b40]">
                    Engine data
                  </p>
                </div>
              ))}
            </div>

            <SectionTitle
              title="Lo Shu Analysis"
              subtitle="Standard & Personal Grid"
            />

            <p className="mb-2 text-xs font-semibold text-[#5f574d]">
              Standard Lo Shu
            </p>

            <div className="grid max-w-[260px] grid-cols-3 overflow-hidden rounded-xl border border-[#ddd3c6]">
              {standardGrid.map(
                (number) => (
                  <div
                    key={number}
                    className="flex h-16 items-center justify-center border border-[#eee6da] text-lg font-semibold text-[#24354c]"
                  >
                    {number}
                  </div>
                )
              )}
            </div>

            <p className="mt-5 text-xs font-semibold text-[#5f574d]">
              Personal Lo Shu
            </p>

            <div className="mt-2 rounded-xl bg-[#f8f4ed] p-4 text-xs text-[#81766a]">
              Personal grid, present,
              missing and repeated numbers
              will load from the verified
              V2 engine.
            </div>

            <SectionTitle
              title="Structural Analysis"
              subtitle="Rajyog & Graha"
            />

            <div className="grid grid-cols-2 gap-3">
              <InfoBox
                title="Golden Rajyog"
                text="4-5-6"
              />

              <InfoBox
                title="Silver Rajyog"
                text="2-5-8"
              />
            </div>

            <div className="mt-3 rounded-xl bg-[#f8f4ed] p-4">
              <p className="text-xs font-semibold text-[#24354c]">
                Key Graha Influences
              </p>

              <p className="mt-1 text-xs leading-5 text-[#81766a]">
                Verified Graha analysis
                will load here.
              </p>
            </div>

            <SectionTitle
              title="Employee Brief"
              subtitle="5 Most Important Things to Understand"
            />

            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(
                (number) => (
                  <div
                    key={number}
                    className="flex gap-3 rounded-xl border border-[#e8dfd3] p-3"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-xs text-white">
                      {number}
                    </div>

                    <p className="text-xs leading-5 text-[#81766a]">
                      Verified client
                      insight will load
                      from the TSIA V2
                      analysis.
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-7 rounded-2xl bg-[#24354c] p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d6b47b]">
                Consultation Approach
              </p>

              <h3 className="mt-2 font-serif text-xl font-semibold">
                Numerology-led,
                client-validated
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#d8dee5]">
                Use verified numerology as
                the starting hypothesis.
                Ask natural questions,
                listen to the client's
                experience and never treat
                an assumption as a
                confirmed fact.
              </p>
            </div>

            <Button
              type="button"
              onClick={onBegin}
              className="mt-6 h-12 w-full rounded-xl bg-[#24354c] text-white"
            >
              Begin Client Conversation

              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-4 mt-8 border-t border-[#eee7dc] pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ad7b40]">
        {title}
      </p>

      <h3 className="mt-1 font-serif text-xl font-semibold text-[#24354c]">
        {subtitle}
      </h3>
    </div>
  )
}

function InfoBox({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-xl border border-[#e6ddd1] p-4">
      <p className="text-xs font-semibold text-[#24354c]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#8e8275]">
        {text}
      </p>

      <p className="mt-3 text-[10px] text-[#ad7b40]">
        Awaiting engine data
      </p>
    </div>
  )
}