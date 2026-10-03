'use client'

import { useState } from 'react'

import {
  ArrowLeft,
  Check,
  ChevronRight,
  MessageCircle,
  Mic,
  Sparkles,
  UserRound,
} from 'lucide-react'

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
}

type Familiarity =
  | 'first_time'
  | 'little'
  | 'before'
  | 'well'
  | ''

const purposeLabels: Record<
  Exclude<ConsultationPurpose, ''>,
  string
> = {
  numerology_report: 'Numerology Report',
  future_numerology: 'Future Numerology',
  career: 'Career',
  business: 'Business',
  money: 'Money & Wealth',
  family: 'Family',
  relationship: 'Relationship',
  marriage: 'Marriage',
  personal_direction: 'Personal Direction',
  follow_up: 'Follow-up',
  other: 'Other',
}

const loShu = [
  4, 9, 2,
  3, 5, 7,
  8, 1, 6,
]

export function ConsultationAssistant({
  client,
  mode,
  purpose,
  note,
  onBack,
}: Props) {
  const [familiarity, setFamiliarity] =
    useState<Familiarity>('')

  const [answer, setAnswer] =
    useState('')

  const purposeLabel =
    purpose
      ? purposeLabels[purpose]
      : 'General Consultation'

  const modeLabel =
    mode === 'in_person'
      ? 'In-Person'
      : mode === 'phone'
        ? 'Phone'
        : 'Consultation'

  return (
    <div className="min-h-full bg-[#f7f3ed] p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Consultation Context
        </button>

        <div className="overflow-hidden rounded-3xl border border-[#ded3c3] bg-white shadow-sm">
          <div className="bg-[#24354c] p-5 text-white sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6b47b]">
                  TSIA Live Consultation
                </p>

                <h1 className="mt-2 font-serif text-2xl font-semibold">
                  {client.name}
                </h1>

                <p className="mt-1 text-xs text-[#cbd2da]">
                  {client.clientNumber || 'TSIA Client'}
                  {' · '}
                  Consultation #1
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#d6b47b] text-[#24354c]">
                <Sparkles className="size-5" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px]">
                {modeLabel}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px]">
                {purposeLabel}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <SectionTitle
              title="Numerology Snapshot"
              subtitle="Keep this visible while talking"
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

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold text-[#5f574d]">
                  Standard Lo Shu
                </p>

                <div className="grid max-w-[240px] grid-cols-3 overflow-hidden rounded-xl border border-[#ddd3c6]">
                  {loShu.map((number) => (
                    <div
                      key={number}
                      className="flex h-14 items-center justify-center border border-[#eee6da] font-semibold text-[#24354c]"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-[#5f574d]">
                  Personal Lo Shu
                </p>

                <div className="rounded-xl bg-[#f8f4ed] p-4">
                  <p className="text-xs leading-5 text-[#81766a]">
                    Personal grid will load
                    from the verified V2 engine.
                  </p>

                  <div className="mt-3 space-y-1 text-[11px] text-[#81766a]">
                    <p>Present: —</p>
                    <p>Missing: —</p>
                    <p>Repeated: —</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoBox
                title="Golden Rajyog"
                text="4-5-6 · —"
              />

              <InfoBox
                title="Silver Rajyog"
                text="2-5-8 · —"
              />
            </div>

            <div className="mt-4 rounded-xl border border-[#e6ddd1] p-4">
              <p className="text-xs font-semibold text-[#24354c]">
                Key Graha Influence
              </p>

              <p className="mt-1 text-xs text-[#81766a]">
                Verified Graha analysis will
                appear here.
              </p>
            </div>

            <SectionTitle
              title="Key Client Insights"
              subtitle="Most important things to remember"
            />

            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((number) => (
                <div
                  key={number}
                  className="flex gap-3 rounded-xl bg-[#f8f4ed] p-3"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-[10px] text-white">
                    {number}
                  </div>

                  <p className="text-xs leading-5 text-[#81766a]">
                    Verified TSIA V2 insight
                    will appear here.
                  </p>
                </div>
              ))}
            </div>

            {note.trim() && (
              <div className="mt-5 rounded-xl border border-[#e6d8bd] bg-[#fbf6ec] p-4">
                <p className="text-[10px] font-semibold uppercase text-[#ad7b40]">
                  Today&apos;s Note
                </p>

                <p className="mt-2 text-xs leading-5 text-[#806f55]">
                  {note.trim()}
                </p>
              </div>
            )}

            <SectionTitle
              title="Live Conversation"
              subtitle="Current consultation step"
            />

            <div className="rounded-2xl border border-[#e6ddd1] p-5">
              <div className="flex gap-3">
                <MessageCircle className="mt-1 size-4 shrink-0 text-[#ad7b40]" />

                <div>
                  <p className="text-[10px] font-semibold uppercase text-[#9b8d7e]">
                    Suggested Question
                  </p>

                  <p className="mt-