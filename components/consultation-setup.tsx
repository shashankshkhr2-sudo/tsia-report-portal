'use client'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Phone,
  Video,
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
  onModeChange: (
    value: ConsultationMode
  ) => void
  onPurposeChange: (
    value: ConsultationPurpose
  ) => void
  onNoteChange: (
    value: string
  ) => void
  onBack: () => void
  onContinue: () => void
}

const purposes = [
  ['numerology_report', 'Numerology Report'],
  ['future_numerology', 'Future Numerology'],
  ['career', 'Career'],
  ['business', 'Business'],
  ['money', 'Money & Wealth'],
  ['family', 'Family'],
  ['relationship', 'Relationship'],
  ['marriage', 'Marriage'],
  ['personal_direction', 'Personal Direction'],
  ['follow_up', 'Follow-up'],
  ['other', 'Other'],
] as const

export function ConsultationSetup({
  client,
  mode,
  purpose,
  note,
  onModeChange,
  onPurposeChange,
  onNoteChange,
  onBack,
  onContinue,
}: Props) {
  const canContinue =
    Boolean(mode) &&
    Boolean(purpose)

  const initials = client.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-full bg-[#f7f3ed] p-5 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Back to Client
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
          Consultation Workspace
        </p>

        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
          Start New Consultation
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#81776b]">
          Enter only what is new for
          today&apos;s consultation.
        </p>

        <div className="mt-7 rounded-3xl border border-[#e3d8c9] bg-white p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d7c]">
            Selected Client
          </p>

          <div className="mt-4 flex items-center gap-3">
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
                {client.dob
                  ? ` · DOB ${client.dob}`
                  : ''}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <p className="text-xs font-semibold text-[#5f574d]">
              Consultation Mode *
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  onModeChange(
                    'in_person'
                  )
                }
                className={`rounded-2xl border p-4 text-left ${
                  mode === 'in_person'
                    ? 'border-[#b89556] bg-[#fbf5e9]'
                    : 'border-[#e6ddd1]'
                }`}
              >
                <MapPin className="size-5 text-[#ad7b40]" />

                <p className="mt-3 font-semibold text-[#24354c]">
                  In-Person
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  onModeChange('phone')
                }
                className={`rounded-2xl border p-4 text-left ${
                  mode === 'phone'
                    ? 'border-[#b89556] bg-[#fbf5e9]'
                    : 'border-[#e6ddd1]'
                }`}
              >
                <Phone className="size-5 text-[#ad7b40]" />

                <p className="mt-3 font-semibold text-[#24354c]">
                  Phone
                </p>
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-[#ddd3c6] p-3 text-[#9b9186]">
              <Video className="size-4" />

              <span className="text-xs">
                Video Consultation —
                future option
              </span>
            </div>
          </div>

          <div className="mt-7">
            <label className="text-xs font-semibold text-[#5f574d]">
              Today&apos;s Main Purpose *
            </label>

            <select
              value={purpose}
              onChange={(event) =>
                onPurposeChange(
                  event.target
                    .value as ConsultationPurpose
                )
              }
              className="mt-3 h-12 w-full rounded-xl border border-[#e5dccf] bg-white px-3 text-sm"
            >
              <option value="">
                Select purpose
              </option>

              {purposes.map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="mt-7">
            <label className="text-xs font-semibold text-[#5f574d]">
              Optional Note
            </label>

            <textarea
              rows={3}
              value={note}
              onChange={(event) =>
                onNoteChange(
                  event.target.value
                )
              }
              placeholder="Add only something new for today's consultation."
              className="mt-3 w-full resize-none rounded-xl border border-[#e5dccf] p-3 text-sm"
            />
          </div>

          <div className="mt-7 border-t border-[#eee7dc] pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b8d7e]">
              Automatically Loaded
            </p>

            <div className="mt-3 space-y-2">
              {[
                'Consultation number',
                'Previous consultations',
                'Available reports',
                'Pending follow-ups',
                'Previous Q&A',
                'Used talking points',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-[#f8f4ed] p-3 text-xs text-[#71685f]"
                >
                  <Check className="size-4 text-[#708365]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className="mt-7 h-12 w-full rounded-xl bg-[#24354c] text-white disabled:opacity-40"
          >
            Start Consultation
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}