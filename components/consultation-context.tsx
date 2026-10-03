'use client'

import {
  ArrowLeft,
  ArrowRight,
  Check,
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
  consultationId: string
  consultationNumber: number
  onBack: () => void
  onOpenAssistant: () => void
}

const purposeNames: Record<string, string> = {
  numerology_report:
    'Numerology Report Explanation',
  future_numerology:
    'Future Numerology',
  follow_up:
    'Follow-up',
  general_consultation:
    'General Consultation',
}

const topicNames: Record<string, string> = {
  business: 'Business',
  career: 'Career',
  money: 'Money & Wealth',
  family: 'Family',
  relationship: 'Relationship',
  marriage: 'Marriage',
  personal_direction:
    'Personal Direction',
  other: 'Other',
}

export function ConsultationContext({
  client,
  mode,
  purpose,
  topic,
  note,
  consultationId,
  consultationNumber,
  onBack,
  onOpenAssistant,
}: Props) {
  return (
    <div className="min-h-full bg-[#f7f3ed] p-5">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex items-center gap-2 text-xs text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <p className="text-[10px] uppercase tracking-widest text-[#ad7b40]">
          Consultation Context
        </p>

        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
          Context Check
        </h1>

        <div className="mt-6 rounded-3xl bg-[#24354c] p-5 text-white">

          <p className="text-[10px] uppercase text-[#d6b47b]">
            Active Consultation
          </p>

          <h2 className="mt-2 font-serif text-2xl font-semibold">
            {client.name}
          </h2>

          <p className="mt-1 text-sm">
            Consultation #{consultationNumber}
          </p>

          <p className="mt-1 text-[10px] text-gray-300">
            ID: {consultationId}
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">

          <Info
            label="Mode"
            value={
              mode === 'in_person'
                ? 'In-Person'
                : 'Phone'
            }
          />

          <Info
            label="Purpose"
            value={
              purposeNames[purpose] ||
              'Consultation'
            }
          />

          <Info
            label="Primary Topic"
            value={
              topicNames[topic] ||
              'Other'
            }
          />

          {note.trim() && (
            <Info
              label="Specific Concern"
              value={note}
            />
          )}

          <div className="mt-5 rounded-xl bg-[#f4f8f3] p-4">
            <div className="flex gap-3">
              <Check className="size-5 text-[#587054]" />

              <div>
                <p className="text-sm font-semibold text-[#425a42]">
                  Consultation record created
                </p>

                <p className="mt-1 text-xs text-[#687b67]">
                  This consultation now has
                  its own database ID and
                  consultation number.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={onOpenAssistant}
            className="mt-6 h-12 w-full rounded-xl bg-[#24354c] text-white"
          >
            Open Live Consultation

            <ArrowRight className="ml-2 size-4" />
          </Button>

        </div>
      </div>
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="border-b py-4 last:border-0">
      <p className="text-[10px] uppercase text-[#9b8d7e]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#24354c]">
        {value}
      </p>
    </div>
  )
}