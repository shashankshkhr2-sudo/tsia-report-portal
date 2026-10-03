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
  RotateCcw,
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

type ConsultationStage =
  | 'setup'
  | 'prepared'
  | 'assistant'

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

type Familiarity =
  | 'first_time'
  | 'little'
  | 'before'
  | 'well'
  | ''

type NumerologyView =
  | 'believe'
  | 'interested'
  | 'curious'
  | 'unsure'
  | 'skeptical'
  | ''

type NumberInfluence =
  | 'strongly'
  | 'possibly'
  | 'not_thought'
  | 'not_really'
  | ''

type Observation =
  | 'supports'
  | 'partly'
  | 'different'
  | 'unclear'
  | ''

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
]

function getInitials(name: string) {
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
          {getInitials(client.name)}
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

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
        selected
          ? 'border-[#b89556] bg-[#fbf5e9] font-semibold text-[#24354c] ring-2 ring-[#d6b47b]/20'
          : 'border-[#e6ddd1] bg-white text-[#625b53]'
      }`}
    >
      {children}
    </button>
  )
}

export function ConsultationWorkspace({
  client,
  onBack,
}: ConsultationWorkspaceProps) {
  const [stage, setStage] =
    useState<ConsultationStage>(
      'setup'
    )

  const [mode, setMode] =
    useState<ConsultationMode>('')

  const [purpose, setPurpose] =
    useState<ConsultationPurpose>('')

  const [note, setNote] =
    useState('')

  const [
    familiarity,
    setFamiliarity,
  ] = useState<Familiarity>('')

  const [
    numerologyView,
    setNumerologyView,
  ] = useState<NumerologyView>('')

  const [
    numberInfluence,
    setNumberInfluence,
  ] = useState<NumberInfluence>('')

  const [
    observation,
    setObservation,
  ] = useState<Observation>('')

  const [
    clientResponse,
    setClientResponse,
  ] = useState('')

  const [
    talkingPointUsed,
    setTalkingPointUsed,
  ] = useState(false)

  const canStart =
    Boolean(mode) &&
    Boolean(purpose)

  const selectedPurpose =
    purposes.find(
      (item) =>
        item.value === purpose
    )?.label

  if (stage === 'assistant') {
    return (
      <div className="min-h-full bg-[#f7f3ed] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() =>
              setStage('prepared')
            }
            className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#9a7b4f]"
          >
            <ArrowLeft className="size-4" />
            Back to Context
          </button>

          <div className="overflow-hidden rounded-3xl border border-[#ded3c3] bg-white shadow-sm">
            <div className="bg-[#24354c] px-5 py-7 text-white sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6b47b]">
                    TSIA Consultation Assistant
                  </p>

                  <h1 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
                    Consultation #1
                  </h1>

                  <p className="mt-2 text-sm text-[#cbd2da]">
                    {selectedPurpose}
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
              <ClientCard
                client={client}
              />

              <div className="mt-5 rounded-2xl border border-[#dce5db] bg-[#f4f8f3] p-4">
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dfeadd] text-[#587054]">
                    <Check className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#425a42]">
                      First Consultation Rule
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#687b67]">
                      Numerology-led
                      hypothesis,
                      client-validated
                      conversation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                  Step 1 · Understand the Client
                </p>

                <h2 className="mt-2 font-serif text-2xl font-semibold text-[#24354c]">
                  Begin naturally
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#81776b]">
                  Before explaining the
                  report, understand the
                  client's familiarity and
                  current view of
                  numerology. Do not lead
                  the client toward a
                  particular answer.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#e7ddcf] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                  Opening Question 1
                </p>

                <p className="mt-2 font-serif text-lg font-semibold leading-7 text-[#24354c]">
                  Have you come across
                  numerology before, or is
                  this your first
                  experience with it?
                </p>

                <div className="mt-4 grid gap-2">
                  <ChoiceButton
                    selected={
                      familiarity ===
                      'first_time'
                    }
                    onClick={() =>
                      setFamiliarity(
                        'first_time'
                      )
                    }
                  >
                    First time
                  </ChoiceButton>

                  <ChoiceButton
                    selected={
                      familiarity ===
                      'little'
                    }
                    onClick={() =>
                      setFamiliarity(
                        'little'
                      )
                    }
                  >
                    Know a little
                  </ChoiceButton>

                  <ChoiceButton
                    selected={
                      familiarity ===
                      'before'
                    }
                    onClick={() =>
                      setFamiliarity(
                        'before'
                      )
                    }
                  >
                    Had a numerology
                    consultation before
                  </ChoiceButton>

                  <ChoiceButton
                    selected={
                      familiarity ===
                      'well'
                    }
                    onClick={() =>
                      setFamiliarity(
                        'well'
                      )
                    }
                  >
                    Know numerology quite
                    well
                  </ChoiceButton>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#e7ddcf] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                  Opening Question 2
                </p>

                <p className="mt-2 font-serif text-lg font-semibold leading-7 text-[#24354c]">
                  What is your current view
                  about numerology?
                </p>

                <div className="mt-4 grid gap-2">
                  {[
                    {
                      value:
                        'believe' as NumerologyView,
                      label:
                        'I believe in it',
                    },
                    {
                      value:
                        'interested' as NumerologyView,
                      label:
                        'Interested, but want to understand it',
                    },
                    {
                      value:
                        'curious' as NumerologyView,
                      label:
                        'Curious',
                    },
                    {
                      value:
                        'unsure' as NumerologyView,
                      label:
                        'Not sure',
                    },
                    {
                      value:
                        'skeptical' as NumerologyView,
                      label:
                        'Skeptical',
                    },
                  ].map((item) => (
                    <ChoiceButton
                      key={item.value}
                      selected={
                        numerologyView ===
                        item.value
                      }
                      onClick={() =>
                        setNumerologyView(
                          item.value
                        )
                      }
                    >
                      {item.label}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#e7ddcf] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8d7e]">
                  Opening Question 3
                </p>

                <p className="mt-2 font-serif text-lg font-semibold leading-7 text-[#24354c]">
                  Do you feel numbers have
                  some importance or
                  influence in our lives?
                </p>

                <div className="mt-4 grid gap-2">
                  {[
                    {
                      value:
                        'strongly' as NumberInfluence,
                      label:
                        'Yes, strongly',
                    },
                    {
                      value:
                        'possibly' as NumberInfluence,
                      label:
                        'Possibly',
                    },
                    {
                      value:
                        'not_thought' as NumberInfluence,
                      label:
                        "Haven't thought about it",
                    },
                    {
                      value:
                        'not_really' as NumberInfluence,
                      label:
                        'Not really',
                    },
                  ].map((item) => (
                    <ChoiceButton
                      key={item.value}
                      selected={
                        numberInfluence ===
                        item.value
                      }
                      onClick={() =>
                        setNumberInfluence(
                          item.value
                        )
                      }
                    >
                      {item.label}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-[#e6d8bd] bg-[#fbf6ec] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ad7b40]">
                  TSIA Talking Point
                </p>

                <p className="mt-3 text-sm font-semibold leading-6 text-[#4f473d]">
                  Numerology is used by
                  TSIA as a framework for
                  understanding patterns
                  associated with numbers
                  in a person's birth date
                  and name.
                </p>

                <p className="mt-2 text-xs leading-5 text-[#81725d]">
                  Use this only when it
                  helps the conversation.
                  Do not present it as a
                  scientifically proven
                  fact.
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    onClick={() =>
                      setTalkingPointUsed(
                        true
                      )
                    }
                    className={`h-10 flex-1 rounded-xl ${
                      talkingPointUsed
                        ? 'bg-[#65785f] text-white'
                        : 'bg-[#24354c] text-white'
                    }`}
                  >
                    {talkingPointUsed ? (
                      <>
                        <Check className="mr-2 size-4" />
                        Used
                      </>
                    ) : (
                      'Mark as Used'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setTalkingPointUsed(
                        false
                      )
                    }
                    className="h-10 rounded-xl"
                  >
                    Skip
                  </Button>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                  Client Says
                </p>

                <p className="mt-2 text-sm leading-6 text-[#81776b]">
                  Capture an important
                  statement in the client's
                  own words when needed.
                </p>

                <textarea
                  rows={4}
                  value={clientResponse}
                  onChange={(event) =>
                    setClientResponse(
                      event.target.value
                    )
                  }
                  placeholder="Type the client's important response here..."
                  className="mt-3 w-full resize-none rounded-xl border border-[#e5dccf] bg-white px-3 py-3 text-sm text-[#3e3a35] outline-none focus:border-[#d6b47b] focus:ring-2 focus:ring-[#d6b47b]/20"
                />
              </div>

              <div className="mt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
                  Employee Observation
                </p>

                <p className="mt-2 text-sm leading-6 text-[#81776b]">
                  Keep your observation
                  separate from what the
                  client actually said.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <ChoiceButton
                    selected={
                      observation ===
                      'supports'
                    }
                    onClick={() =>
                      setObservation(
                        'supports'
                      )
                    }
                  >
                    Supports
                  </ChoiceButton>

                  <ChoiceButton
                    selected={
                      observation ===
                      'partly'
                    }
                    onClick={() =>
                      setObservation(
                        'partly'
                      )
                    }
                  >
                    Partly
                  </ChoiceButton>

                  <ChoiceButton
                    selected={
                      observation ===
                      'different'
                    }
                    onClick={() =>
                      setObservation(
                        'different'
                      )
                    }
                  >
                    Different
                  </ChoiceButton>

                  <ChoiceButton
                    selected={
                      observation ===
                      'unclear'
                    }
                    onClick={() =>
                      setObservation(
                        'unclear'
                      )
                    }
                  >
                    Still unclear
                  </ChoiceButton>
                </div>
              </div>

              <div className="mt-7 rounded-2xl bg-[#f8f4ed] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b8d7e]">
                  Next
                </p>

                <h3 className="mt-2 font-serif text-lg font-semibold text-[#24354c]">
                  Move into guided analysis
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#81766a]">
                  After understanding the
                  client's starting point,
                  TSIA can guide the
                  employee through the
                  relevant numerology
                  explanation and
                  consultation questions.
                </p>

                <Button
                  type="button"
                  disabled
                  className="mt-4 h-11 w-full rounded-xl bg-[#24354c] text-white opacity-45