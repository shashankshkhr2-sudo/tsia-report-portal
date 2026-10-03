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
        : ''

  return (
    <div className="min-h-full bg-[#f7f3ed] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
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
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6b47b]">
                  TSIA Consultation Assistant
                </p>

                <h1 className="mt-2 font-serif text-2xl font-semibold">
                  {client.name}
                </h1>

                <p className="mt-1 text-xs text-[#cbd2da]">
                  {client.clientNumber ||
                    'TSIA Client'}
                  {' · '}
                  Consultation #1
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#d6b47b] text-[#24354c]">
                <Sparkles className="size-5" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px]">
                {modeLabel}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px]">
                {purposeLabel}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="rounded-2xl border border-[#dce5db] bg-[#f4f8f3] p-4">
              <div className="flex gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-[#587054]" />

                <div>
                  <p className="text-sm font-semibold text-[#425a42]">
                    First consultation guidance
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#687b67]">
                    Numerology-led hypothesis,
                    client-validated
                    conversation.
                  </p>
                </div>
              </div>
            </div>

            {note.trim() && (
              <div className="mt-4 rounded-2xl bg-[#f8f4ed] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b8d7e]">
                  Today&apos;s Note
                </p>

                <p className="mt-2 text-sm leading-6 text-[#61594f]">
                  {note.trim()}
                </p>
              </div>
            )}

            <div className="mt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                Start Here
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
                Understand the client first
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#81776b]">
                Ask naturally. Do not lead
                the client toward a
                numerology conclusion.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e6ddd1] p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f8f4ed] text-[#ad7b40]">
                  <MessageCircle className="size-4" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                    Suggested Question 1
                  </p>

                  <p className="mt-2 text-base font-semibold leading-6 text-[#24354c]">
                    Have you come across
                    numerology before, or is
                    this your first
                    experience with it?
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {[
                  [
                    'first_time',
                    'First time',
                  ],
                  [
                    'little',
                    'Know a little',
                  ],
                  [
                    'before',
                    'Had a consultation before',
                  ],
                  [
                    'well',
                    'Know it quite well',
                  ],
                ].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFamiliarity(
                          value as Familiarity
                        )
                      }
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
                        familiarity ===
                        value
                          ? 'border-[#b89556] bg-[#fbf5e9] text-[#24354c]'
                          : 'border-[#e8e0d5] text-[#625a51]'
                      }`}
                    >
                      {label}

                      {familiarity ===
                        value && (
                        <Check className="size-4 text-[#ad7b40]" />
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e6ddd1] p-5">
              <div className="flex items-center gap-2">
                <UserRound className="size-4 text-[#ad7b40]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                  Client Says
                </p>
              </div>

              <textarea
                rows={3}
                value={answer}
                onChange={(event) =>
                  setAnswer(
                    event.target.value
                  )
                }
                placeholder="Type the client's response..."
                className="mt-4 w-full resize-none rounded-xl border border-[#e5dccf] p-3 text-sm outline-none focus:border-[#d6b47b]"
              />

              <button
                type="button"
                className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
              >
                <Mic className="size-4" />
                Voice input — future option
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#24354c] p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d6b47b]">
                Employee Guidance
              </p>

              <p className="mt-3 text-sm leading-6 text-[#eef1f4]">
                Listen first. Use the
                client&apos;s answer to
                decide how much basic
                numerology explanation is
                needed before discussing
                their report.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e5d6ba] bg-[#fbf6ec] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ad7b40]">
                Talking Point
              </p>

              <p className="mt-3 text-sm font-semibold leading-6 text-[#5f4d32]">
                Numerology is used by TSIA
                as a framework for
                understanding patterns and
                tendencies, while the
                client&apos;s real
                experience remains
                important.
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="rounded-xl bg-[#24354c] px-4 py-2 text-xs font-semibold text-white"
                >
                  Mark Used
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-[#dfd1ba] px-4 py-2 text-xs font-semibold text-[#79623e]"
                >
                  Skip
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={!familiarity}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#24354c] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue Consultation
              <ChevronRight className="ml-2 size-4" />
            </button>

            <p className="mt-3 text-center text-[11px] leading-5 text-[#9b8f82]">
              Prototype stage — answers and
              talking-point usage are not
              yet written to the database.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}