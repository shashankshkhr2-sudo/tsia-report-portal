'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  FileText,
  History,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
  Video,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type ConsultationMode =
  | 'in_person'
  | 'phone'
  | ''

type ConsultationPurpose =
  | 'numerology_report'
  | 'future_numerology'
  | 'career'
  | 'business'
  | 'money'
  | 'family'
  | 'relationship'
  | 'marriage'
  | 'personal_direction'
  | 'follow_up'
  | 'other'
  | ''

type ClientSummary = {
  id: string
  clientNumber?: string
  name: string
  dob?: string
}

type ConsultationWorkspaceProps = {
  client: ClientSummary
  onBack: () => void
}

const purposes: {
  value: ConsultationPurpose
  label: string
}[] = [
  {
    value: 'numerology_report',
    label: 'Numerology Report',
  },
  {
    value: 'future_numerology',
    label: 'Future Numerology',
  },
  {
    value: 'career',
    label: 'Career',
  },
  {
    value: 'business',
    label: 'Business',
  },
  {
    value: 'money',
    label: 'Money',
  },
  {
    value: 'family',
    label: 'Family',
  },
  {
    value: 'relationship',
    label: 'Relationship',
  },
  {
    value: 'marriage',
    label: 'Marriage',
  },
  {
    value: 'personal_direction',
    label: 'Personal Direction',
  },
  {
    value: 'follow_up',
    label: 'Follow-up',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

export function ConsultationWorkspace({
  client,
  onBack,
}: ConsultationWorkspaceProps) {
  const [mode, setMode] =
    useState<ConsultationMode>('')

  const [purpose, setPurpose] =
    useState<ConsultationPurpose>('')

  const [note, setNote] =
    useState('')

  const [prepared, setPrepared] =
    useState(false)

  const canStart =
    Boolean(mode) &&
    Boolean(purpose)

  const selectedPurpose =
    purposes.find(
      (item) =>
        item.value === purpose
    )?.label

  if (prepared) {
    return (
      <div className="min-h-full bg-[#f7f3ed] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() =>
              setPrepared(false)
            }
            className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
          >
            <ArrowLeft className="size-4" />
            Edit Consultation Setup
          </button>

          <div className="overflow-hidden rounded-3xl border border-[#ded3c3] bg-white shadow-sm">
            <div className="bg-[#24354c] px-5 py-7 text-white sm:px-8">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#d6b47b] text-[#24354c]">
                <Sparkles className="size-5" />
              </div>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6b47b]">
                Context Loaded
              </p>

              <h1 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
                Consultation Ready
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#cbd2da]">
                TSIA has prepared the
                consultation context before
                opening the live assistant.
              </p>
            </div>

            <div className="p-5 sm:p-8">
              <div className="rounded-2xl border border-[#e7ddcf] bg-[#fcfaf6] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-sm font-semibold text-white">
                    {client.name
                      .split(/\s+/)
                      .filter(Boolean)
                      .map(
                        (part) =>
                          part[0]
                      )
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#24354c]">
                      {client.name}
                    </h2>

                    <p className="mt-1 text-xs text-[#8b8074]">
                      {client.clientNumber ||
                        'TSIA Client'}
                    </p>

                    {client.dob && (
                      <p className="mt-1 text-xs text-[#8b8074]">
                        DOB {client.dob}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
                    {mode ===
                    'in_person'
                      ? 'In-Person'
                      : 'Phone'}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7ddcf] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                    Purpose
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#24354c]">
                    {selectedPurpose}
                  </p>
                </div>
              </div>

              {note.trim() && (
                <div className="mt-4 rounded-2xl border border-[#e7ddcf] bg-[#fffdf9] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                    Today's Note
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#61594f]">
                    {note.trim()}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                  TSIA Context Check
                </p>

                <h3 className="mt-2 font-serif text-xl font-semibold text-[#24354c]">
                  What the system will review
                </h3>

                <div className="mt-4 space-y-3">
                  {[
                    {
                      icon: History,
                      title:
                        'Consultation History',
                      text:
                        'Previous consultations, topics, answers and pending follow-ups.',
                    },
                    {
                      icon: FileText,
                      title:
                        'Reports & Products',
                      text:
                        'Available client reports and relevant TSIA products.',
                    },
                    {
                      icon: UserRound,
                      title:
                        'Client Continuity',
                      text:
                        'Previous questions, responses and talking points already used with this client.',
                    },
                    {
                      icon: Sparkles,
                      title:
                        'Numerology Context',
                      text:
                        'Verified TSIA numerology evidence available for consultation guidance.',
                    },
                  ].map(
                    ({
                      icon: Icon,
                      title,
                      text,
                    }) => (
                      <div
                        key={title}
                        className="flex gap-3 rounded-2xl bg-[#f8f4ed] p-4"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#ad7b40]">
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
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dfeadd] text-[#587054]">
                    <Check className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#425a42]">
                      Guidance rule ready
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#687b67]">
                      First consultation:
                      numerology-led
                      hypothesis,
                      client-validated
                      conversation.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                className="mt-6 h-12 w-full rounded-xl bg-[#24354c] text-white hover:bg-[#30445f]"
              >
                Open Consultation Assistant
                <ArrowRight className="ml-2 size-4" />
              </Button>

              <p className="mt-3 text-center text-[11px] leading-5 text-[#9b8f82]">
                In this design prototype,
                no consultation record has
                been written to the database
                yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#f7f3ed] p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Back to Client
        </button>

        <div className="mb-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
            Consultation Workspace
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
            Start New Consultation
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#81776b]">
            Tell TSIA only what is new
            today. Existing client
            information and consultation
            history will be loaded
            automatically.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#e3d8c9] bg-white shadow-sm">
          <div className="border-b border-[#eee6da] bg-[#fcfaf6] p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d7c]">
              Selected Client
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-sm font-semibold text-white">
                {client.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .map(
                    (part) =>
                      part[0]
                  )
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>

              <div>
                <h2 className="font-serif text-lg font-semibold text-[#24354c]">
                  {client.name}
                </h2>

                <p className="mt-0.5 text-xs text-[#8e8275]">
                  {client.clientNumber ||
                    'TSIA Client'}
                  {client.dob
                    ? ` · DOB ${client.dob}`
                    : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="rounded-2xl border border-[#e6d8bd] bg-[#fbf6ec] p-4">
              <div className="flex gap-3">
                <CircleHelp className="mt-0.5 size-4 shrink-0 text-[#ad7b40]" />

                <div>
                  <p className="text-sm font-semibold text-[#725d3b]">
                    Automatically prepared
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#806f55]">
                    Consultation number,
                    employee, location,
                    previous history,
                    reports, products,
                    follow-ups and previous
                    talking-point usage do
                    not need to be entered
                    again.
                  </p>
                </div>
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
                    setMode(
                      'in_person'
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    mode ===
                    'in_person'
                      ? 'border-[#b89556] bg-[#fbf5e9] ring-2 ring-[#d6b47b]/20'
                      : 'border-[#e6ddd1] bg-white'
                  }`}
                >
                  <MapPin className="size-5 text-[#ad7b40]" />

                  <p className="mt-3 text-sm font-semibold text-[#24354c]">
                    In-Person
                  </p>

                  <p className="mt-1 text-[11px] text-[#918578]">
                    Face-to-face
                    consultation
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMode('phone')
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    mode === 'phone'
                      ? 'border-[#b89556] bg-[#fbf5e9] ring-2 ring-[#d6b47b]/20'
                      : 'border-[#e6ddd1] bg-white'
                  }`}
                >
                  <Phone className="size-5 text-[#ad7b40]" />

                  <p className="mt-3 text-sm font-semibold text-[#24354c]">
                    Phone
                  </p>

                  <p className="mt-1 text-[11px] text-[#918578]">
                    Voice consultation
                  </p>
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-[#ddd3c6] px-4 py-3 text-[#9b9186]">
                <Video className="size-4" />

                <div>
                  <p className="text-xs font-semibold">
                    Video Consultation
                  </p>

                  <p className="text-[10px]">
                    Future option
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <label className="text-xs font-semibold text-[#5f574d]">
                Today's Main Purpose *
              </label>

              <select
                value={purpose}
                onChange={(event) =>
                  setPurpose(
                    event.target
                      .value as ConsultationPurpose
                  )
                }
                className="mt-3 h-12 w-full rounded-xl border border-[#e5dccf] bg-white px-3 text-sm text-[#3e3a35] outline-none focus:border-[#d6b47b] focus:ring-2 focus:ring-[#d6b47b]/20"
              >
                <option value="">
                  Select purpose
                </option>

                {purposes.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="mt-7">
              <label className="text-xs font-semibold text-[#5f574d]">
                Optional Note
              </label>

              <p className="mt-1 text-[11px] leading-5 text-[#95897c]">
                Add only something new that
                will help today's
                consultation.
              </p>

              <textarea
                rows={3}
                value={note}
                onChange={(event) =>
                  setNote(
                    event.target.value
                  )
                }
                placeholder="Example: Client wants to discuss business expansion."
                className="mt-3 w-full resize-none rounded-xl border border-[#e5dccf] bg-white px-3 py-3 text-sm text-[#3e3a35] outline-none focus:border-[#d6b47b] focus:ring-2 focus:ring-[#d6b47b]/20"
              />
            </div>

            <div className="mt-7 border-t border-[#eee7dc] pt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b8d7e]">
                System Context
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  'Consultation number — automatic',
                  'Previous consultations — automatic',
                  'Available reports — automatic',
                  'Pending follow-ups — automatic',
                  'Previous Q&A — automatic',
                  'Used talking points — automatic',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl bg-[#f8f4ed] px-3 py-2.5 text-xs text-[#71685f]"
                  >
                    <Check className="size-3.5 shrink-0 text-[#708365]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              disabled={!canStart}
              onClick={() =>
                setPrepared(true)
              }
              className="mt-7 h-12 w-full rounded-xl bg-[#24354c] text-white hover:bg-[#30445f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start Consultation
              <ArrowRight className="ml-2 size-4" />
            </Button>

            {!canStart && (
              <p className="mt-3 text-center text-[11px] text-[#9b8f82]">
                Select consultation mode
                and today's main purpose to
                continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}