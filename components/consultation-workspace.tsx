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
  MessageCircle,
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

type Stage =
  | 'setup'
  | 'context'
  | 'assistant'

type ClientSummary = {
  id: string
  clientNumber?: string
  name: string
  dob?: string
}

type Props = {
  client: ClientSummary
  onBack: () => void
}

type Observation =
  | 'supports'
  | 'partly'
  | 'different'
  | 'unclear'
  | ''

const purposes = [
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
    label: 'Money & Wealth',
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
] as const

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function ClientCard({
  client,
}: {
  client: ClientSummary
}) {
  return (
    <div className="rounded-2xl border border-[#e7ddcf] bg-[#fcfaf6] p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#24354c] text-sm font-semibold text-white">
          {initials(client.name)}
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
  )
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'w-full rounded-xl border border-[#b89556] bg-[#fbf5e9] px-4 py-3 text-left text-sm font-semibold text-[#24354c] ring-2 ring-[#d6b47b]/20'
          : 'w-full rounded-xl border border-[#e6ddd1] bg-white px-4 py-3 text-left text-sm text-[#625b53]'
      }
    >
      {children}
    </button>
  )
}

export function ConsultationWorkspace({
  client,
  onBack,
}: Props) {
  const [stage, setStage] =
    useState<Stage>('setup')

  const [mode, setMode] =
    useState<ConsultationMode>('')

  const [purpose, setPurpose] =
    useState<ConsultationPurpose>('')

  const [note, setNote] =
    useState('')

  const [q1, setQ1] =
    useState('')

  const [q2, setQ2] =
    useState('')

  const [q3, setQ3] =
    useState('')

  const [clientSays, setClientSays] =
    useState('')

  const [observation, setObservation] =
    useState<Observation>('')

  const [
    talkingPointUsed,
    setTalkingPointUsed,
  ] = useState(false)

  const canStart =
    mode !== '' &&
    purpose !== ''

  const purposeLabel =
    purposes.find(
      (item) =>
        item.value === purpose
    )?.label || ''

  if (stage === 'assistant') {
    return (
      <div className="min-h-full bg-[#f7f3ed] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() =>
              setStage('context')
            }
            className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
          >
            <ArrowLeft className="size-4" />
            Back to Context
          </button>

          <div className="overflow-hidden rounded-3xl border border-[#ded3c3] bg-white shadow-sm">
            <div className="bg-[#24354c] p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6b47b]">
                    TSIA Consultation Assistant
                  </p>

                  <h1 className="mt-2 font-serif text-2xl font-semibold">
                    Consultation #1
                  </h1>

                  <p className="mt-2 text-sm text-[#cbd2da]">
                    {purposeLabel}
                    {' · '}
                    {mode === 'in_person'
                      ? 'In-Person'
                      : 'Phone'}
                  </p>
                </div>

                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#d6b47b] text-[#24354c]">
                  <MessageCircle className="size-5" />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <ClientCard client={client} />

              <div className="mt-5 rounded-2xl border border-[#dce5db] bg-[#f4f8f3] p-4">
                <p className="text-sm font-semibold text-[#425a42]">
                  First Consultation Rule
                </p>

                <p className="mt-1 text-xs leading-5 text-[#687b67]">
                  Numerology-led hypothesis,
                  client-validated
                  conversation.
                </p>
              </div>

              <div className="mt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                  Opening Stage
                </p>

                <h2 className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
                  Understand the client first
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#81776b]">
                  Ask naturally. Listen
                  before explaining the
                  numerology report.
                </p>
              </div>

              <QuestionCard
                number={1}
                question="Have you come across numerology before, or is this your first experience with it?"
              >
                <Choice
                  active={q1 === 'first'}
                  onClick={() =>
                    setQ1('first')
                  }
                >
                  First time
                </Choice>

                <Choice
                  active={q1 === 'little'}
                  onClick={() =>
                    setQ1('little')
                  }
                >
                  Know a little
                </Choice>

                <Choice
                  active={q1 === 'before'}
                  onClick={() =>
                    setQ1('before')
                  }
                >
                  Had a consultation before
                </Choice>

                <Choice
                  active={q1 === 'well'}
                  onClick={() =>
                    setQ1('well')
                  }
                >
                  Know numerology quite well
                </Choice>
              </QuestionCard>

              <QuestionCard
                number={2}
                question="What is your current view about numerology?"
              >
                <Choice
                  active={q2 === 'believe'}
                  onClick={() =>
                    setQ2('believe')
                  }
                >
                  I believe in it
                </Choice>

                <Choice
                  active={q2 === 'understand'}
                  onClick={() =>
                    setQ2('understand')
                  }
                >
                  Interested, but want to
                  understand it
                </Choice>

                <Choice
                  active={q2 === 'curious'}
                  onClick={() =>
                    setQ2('curious')
                  }
                >
                  Curious
                </Choice>

                <Choice
                  active={q2 === 'unsure'}
                  onClick={() =>
                    setQ2('unsure')
                  }
                >
                  Not sure
                </Choice>

                <Choice
                  active={q2 === 'skeptical'}
                  onClick={() =>
                    setQ2('skeptical')
                  }
                >
                  Skeptical
                </Choice>
              </QuestionCard>

              <QuestionCard
                number={3}
                question="Do you feel numbers have some importance or influence in our lives?"
              >
                <Choice
                  active={q3 === 'yes'}
                  onClick={() =>
                    setQ3('yes')
                  }
                >
                  Yes, strongly
                </Choice>

                <Choice
                  active={q3 === 'possibly'}
                  onClick={() =>
                    setQ3('possibly')
                  }
                >
                  Possibly
                </Choice>

                <Choice
                  active={q3 === 'not_thought'}
                  onClick={() =>
                    setQ3('not_thought')
                  }
                >
                  Haven&apos;t thought about
                  it
                </Choice>

                <Choice
                  active={q3 === 'no'}
                  onClick={() =>
                    setQ3('no')
                  }
                >
                  Not really
                </Choice>
              </QuestionCard>

              <div className="mt-6 rounded-2xl border border-[#e6d8bd] bg-[#fbf6ec] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ad7b40]">
                  TSIA Talking Point
                </p>

                <p className="mt-3 text-sm font-semibold leading-6 text-[#4f473d]">
                 