'use client'

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import type {
  ConsultationClient,
  ConsultationMode,
  ConsultationPurpose,
  ConsultationTopic,
} from '@/components/consultation-workspace'

type Props = {
  client: ConsultationClient
  mode: ConsultationMode
  purpose: ConsultationPurpose
  topic: ConsultationTopic
  note: string
  saving: boolean
  error: string

  onModeChange:
    (value: ConsultationMode) => void

  onPurposeChange:
    (value: ConsultationPurpose) => void

  onTopicChange:
    (value: ConsultationTopic) => void

  onNoteChange:
    (value: string) => void

  onBack: () => void
  onContinue: () => void
}

const purposes = [
  [
    'numerology_report',
    'Numerology Report Explanation',
  ],
  [
    'future_numerology',
    'Future Numerology',
  ],
  ['follow_up', 'Follow-up'],
  [
    'general_consultation',
    'General Consultation',
  ],
] as const

const topics = [
  ['business', 'Business'],
  ['career', 'Career'],
  ['money', 'Money & Wealth'],
  ['family', 'Family'],
  ['relationship', 'Relationship'],
  ['marriage', 'Marriage'],
  [
    'personal_direction',
    'Personal Direction',
  ],
  ['other', 'Other'],
] as const

export function ConsultationSetup({
  client,
  mode,
  purpose,
  topic,
  note,
  saving,
  error,
  onModeChange,
  onPurposeChange,
  onTopicChange,
  onNoteChange,
  onBack,
  onContinue,
}: Props) {
  const ready =
    Boolean(mode) &&
    Boolean(purpose) &&
    Boolean(topic)

  return (
    <div className="min-h-full bg-[#f7f3ed] p-5">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-xs text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Back to Client
        </button>

        <p className="text-[10px] uppercase tracking-widest text-[#ad7b40]">
          Consultation Workspace
        </p>

        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
          Start New Consultation
        </h1>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">

          <p className="text-xs text-[#8e8275]">
            Selected Client
          </p>

          <h2 className="mt-1 font-serif text-xl font-semibold text-[#24354c]">
            {client.name}
          </h2>

          <p className="text-xs text-[#8e8275]">
            {client.clientNumber ||
              'TSIA Client'}
          </p>

          <Label text="Consultation Mode *" />

          <div className="grid grid-cols-2 gap-3">
            <ModeButton
              active={mode === 'in_person'}
              text="In-Person"
              icon={<MapPin className="size-5" />}
              onClick={() =>
                onModeChange('in_person')
              }
            />

            <ModeButton
              active={mode === 'phone'}
              text="Phone"
              icon={<Phone className="size-5" />}
              onClick={() =>
                onModeChange('phone')
              }
            />
          </div>

          <Label text="Consultation Purpose *" />

          <select
            value={purpose}
            onChange={(e) =>
              onPurposeChange(
                e.target
                  .value as ConsultationPurpose
              )
            }
            className="h-12 w-full rounded-xl border px-3 text-sm"
          >
            <option value="">
              Select purpose
            </option>

            {purposes.map(
              ([value, text]) => (
                <option
                  key={value}
                  value={value}
                >
                  {text}
                </option>
              )
            )}
          </select>

          <Label text="Primary Topic *" />

          <select
            value={topic}
            onChange={(e) =>
              onTopicChange(
                e.target
                  .value as ConsultationTopic
              )
            }
            className="h-12 w-full rounded-xl border px-3 text-sm"
          >
            <option value="">
              Select topic
            </option>

            {topics.map(
              ([value, text]) => (
                <option
                  key={value}
                  value={value}
                >
                  {text}
                </option>
              )
            )}
          </select>

          <Label text="Specific Concern / Note" />

          <textarea
            rows={3}
            value={note}
            onChange={(e) =>
              onNoteChange(e.target.value)
            }
            placeholder="Add only what is new for today's consultation."
            className="w-full rounded-xl border p-3 text-sm"
          />

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <Button
            type="button"
            disabled={!ready || saving}
            onClick={onContinue}
            className="mt-6 h-12 w-full rounded-xl bg-[#24354c] text-white disabled:opacity-40"
          >
            {saving
              ? 'Starting Consultation...'
              : 'Start Consultation'}

            {!saving && (
              <ArrowRight className="ml-2 size-4" />
            )}
          </Button>

        </div>
      </div>
    </div>
  )
}

function Label({
  text,
}: {
  text: string
}) {
  return (
    <p className="mb-3 mt-7 text-xs font-semibold text-[#5f574d]">
      {text}
    </p>
  )
}

function ModeButton({
  active,
  text,
  icon,
  onClick,
}: {
  active: boolean
  text: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left ${
        active
          ? 'border-[#b89556] bg-[#fbf5e9]'
          : 'border-[#e6ddd1]'
      }`}
    >
      <div className="text-[#ad7b40]">
        {icon}
      </div>

      <p className="mt-2 font-semibold text-[#24354c]">
        {text}
      </p>
    </button>
  )
}