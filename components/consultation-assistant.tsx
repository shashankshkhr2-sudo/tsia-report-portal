'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Mic,
} from 'lucide-react'

import {
  generateNumerologyV2,
} from '@/app/actions/numerology'

import {
  ConsultationV3Insights,
} from '@/components/consultation-v3-insights'

import {
  ConsultationCompleteIntelligence,
} from '@/components/consultation-complete-intelligence'

import {
  decideNextQuestion,
} from '@/lib/consultation/question-intelligence'

import type {
  ConsultationAnswerForIntelligence,
  QuestionIntelligenceDecision,
} from '@/lib/consultation/question-intelligence'

import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  NumerologyV3Result,
} from '@/lib/numerology-intelligence/engine'

import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

import type {
  EmployeeInterpretation,
} from '@/lib/numerology-intelligence/employeeinterpretation'

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
  topics: readonly ConsultationTopic[]
  note: string
  consultationId: string
  consultationNumber: number
  onBack: () => void
}

type Result = {
  calculation: NumerologyCalculationResult

  intelligence: NumerologyV3Result

  employeeOutput: {
    version: string
    insights: readonly EmployeeInsight[]
    warnings: readonly string[]
  }

  employeeInterpretation: {
    version: string
    interpretations:
      readonly EmployeeInterpretation[]
    warnings: readonly string[]
  }
}

const labels: Record<string, string> = {
  numerology_report: 'Report Discussion',
  follow_up: 'Follow-up Consultation',
  general_consultation:
    'General Consultation',

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

const familiarityOptions = [
  'First time',
  'Know a little',
  'Consultation before',
  'Know it quite well',
] as const

const grid: NumerologyDigit[] = [
  4, 9, 2,
  3, 5, 7,
  8, 1, 6,
]

export function ConsultationAssistant({
  client,
  mode,
  purpose,
  topics,
  note,
  consultationId,
  consultationNumber,
  onBack,
}: Props) {
  const [choice, setChoice] =
    useState('')

  const [answer, setAnswer] =
    useState('')

  const [
    currentAnswers,
    setCurrentAnswers,
  ] = useState<
    ConsultationAnswerForIntelligence[]
  >([])

  const [data, setData] =
    useState<Result | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')

      try {
        const response =
          await generateNumerologyV2(
            client.id
          )

        if (!active) {
          return
        }

        if (
          response.error ||
          !response.result
        ) {
          setError(
            response.error ||
              'Unable to load numerology.'
          )

          setLoading(false)
          return
        }

        setData({
          calculation:
            response.result.calculation,

          intelligence:
            response.result.intelligence,

          employeeOutput:
            response.result.employeeOutput,

          employeeInterpretation:
            response.result
              .employeeInterpretation,
        })
      } catch {
        if (active) {
          setError(
            'Unable to load numerology.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [client.id])

  const decision =
    useMemo<QuestionIntelligenceDecision>(
      () =>
        decideNextQuestion({
          consultationNumber,
          purpose,
          topics,
          todayNote: note,
          currentAnswers,
        }),
      [
        consultationNumber,
        purpose,
        topics,
        note,
        currentAnswers,
      ]
    )

  const calculation =
    data?.calculation

  const modeLabel =
    mode === 'in_person'
      ? 'In-Person'
      : mode === 'phone'
        ? 'Phone'
        : 'Consultation'

  const primaryTopic =
    topics[0] || null

  const isFamiliarityQuestion =
    decision.questionKey ===
    'NUMEROLOGY_FAMILIARITY'

  const isReadyForV3 =
    decision.stage ===
      'READY_FOR_V3' ||
    !decision.shouldAskQuestion

  const canContinue =
    isFamiliarityQuestion
      ? Boolean(choice)
      : Boolean(answer.trim())

  function handleContinue() {
    if (
      !decision.shouldAskQuestion ||
      !decision.questionKey ||
      !decision.questionText
    ) {
      return
    }

    const clientAnswer =
      isFamiliarityQuestion
        ? answer.trim()
          ? `${choice}. ${answer.trim()}`
          : choice
        : answer.trim()

    if (!clientAnswer) {
      return
    }

    const recordedAnswer:
      ConsultationAnswerForIntelligence = {
        questionKey:
          decision.questionKey,

        questionText:
          decision.questionText,

        clientAnswer,
      }

    setCurrentAnswers(
      (previous) => [
        ...previous,
        recordedAnswer,
      ]
    )

    setChoice('')
    setAnswer('')
  }

  return (
    <div className="min-h-full bg-[#f7f3ed] p-4">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-xs text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Context Check
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

          {/* SECTION 1 — CLIENT HEADER */}

          <header className="bg-[#24354c] p-5 text-white">
            <p className="text-[10px] uppercase tracking-widest text-[#d6b47b]">
              TSIA Live Consultation
            </p>

            <h1 className="mt-2 font-serif text-2xl font-semibold">
              {client.name}
            </h1>

            <p className="mt-1 text-xs text-gray-300">
              {client.clientNumber ||
                'TSIA Client'}
              {' · '}
              Consultation #
              {consultationNumber}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tag text={modeLabel} />

              <Tag
                text={
                  labels[purpose] ||
                  'Consultation'
                }
              />

              {primaryTopic && (
                <Tag
                  text={
                    labels[primaryTopic] ||
                    primaryTopic
                  }
                />
              )}
            </div>
          </header>

          <main className="p-5">

            {/* SECTION 2 — CLIENT CONVERSATION */}

            {note.trim() && (
              <div className="rounded-xl bg-[#fbf6ec] p-4">
                <p className="text-[10px] font-semibold uppercase text-[#ad7b40]">
                  Today&apos;s Note
                </p>

                <p className="mt-2 text-sm leading-6 text-[#24354c]">
                  {note}
                </p>
              </div>
            )}

            <Title
              small="Live Consultation"
              big="Client Conversation"
            />

            {!isReadyForV3 && (
              <>
                <div className="rounded-2xl border p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                    {decision.stage ===
                    'NUMEROLOGY_FAMILIARITY'
                      ? 'Opening Question'
                      : 'Current Question'}
                  </p>

                  <p className="mt-2 text-base font-semibold leading-6 text-[#24354c]">
                    {decision.questionText}
                  </p>

                  {isFamiliarityQuestion && (
                    <div className="mt-4 grid gap-2">
                      {familiarityOptions.map(
                        (item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              setChoice(item)
                            }
                            className={`flex justify-between rounded-xl border p-3 text-left text-sm ${
                              choice === item
                                ? 'border-[#b89556] bg-[#fbf5e9]'
                                : 'border-[#e6ddd1]'
                            }`}
                          >
                            {item}

                            {choice === item && (
                              <Check className="size-4 text-[#ad7b40]" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-2xl border p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                    Client Says
                  </p>

                  <textarea
                    value={answer}
                    onChange={(event) =>
                      setAnswer(
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder={
                      isFamiliarityQuestion
                        ? "Optional: add the client's own words..."
                        : "Type the client's response..."
                    }
                    className="mt-3 w-full rounded-xl border p-3 text-sm"
                  />

                  <p className="mt-2 flex items-center gap-2 text-xs text-[#9a7b4f]">
                    <Mic className="size-4" />
                    Voice input - future
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={handleContinue}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[#24354c] text-sm font-semibold text-white disabled:opacity-40"
                >
                  Continue Consultation

                  <ChevronRight className="ml-2 size-4" />
                </button>
              </>
            )}

            {isReadyForV3 && (
              <div className="rounded-2xl border border-[#dfd3c1] bg-[#fbf6ec] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                  Opening Context Complete
                </p>

                <h3 className="mt-2 font-serif text-lg font-semibold text-[#24354c]">
                  Ready for Personalized
                  Discussion
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#776d61]">
                  The client&apos;s
                  orientation and current
                  concern have been
                  established. Relevant
                  verified TSIA V3
                  intelligence can now be
                  used for the consultation.
                </p>
              </div>
            )}

            {currentAnswers.length > 0 && (
              <div className="mt-4 rounded-2xl bg-[#f8f4ed] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                  Conversation Context
                </p>

                <div className="mt-3 space-y-3">
                  {currentAnswers.map(
                    (item, index) => (
                      <div
                        key={`${item.questionKey}-${index}`}
                        className="border-b border-[#e8dfd3] pb-3 last:border-b-0 last:pb-0"
                      >
                        <p className="text-xs font-semibold leading-5 text-[#24354c]">
                          {item.questionText}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#776d61]">
                          {item.clientAnswer}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* SECTION 3 — CLIENT AT A GLANCE */}

            <Title
              small="Numerology Reference"
              big="Client at a Glance"
            />

            {loading && (
              <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ed] p-4 text-xs text-[#776d61]">
                <Loader2 className="size-4 animate-spin" />
                Loading verified TSIA
                numerology...
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                {error}
              </div>
            )}

            {calculation && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <NumberBox
                    title="Mulank"
                    value={formatCompound(
                      calculation.mulank.compound,
                      calculation.mulank.final
                    )}
                    graha={
                      calculation.grahas[
                        calculation.mulank.final
                      ]
                    }
                  />

                  <NumberBox
                    title="Bhagyank"
                    value={formatCompound(
                      calculation.bhagyank.compound,
                      calculation.bhagyank.final
                    )}
                    graha={
                      calculation.grahas[
                        calculation.bhagyank.final
                      ]
                    }
                  />

                  <NumberBox
                    title="Name Number"
                    value={formatCompound(
                      calculation.nameNumber.compoundTotal,
                      calculation.nameNumber.finalNumber
                    )}
                    graha={
                      calculation.grahas[
                        calculation.nameNumber.finalNumber
                      ]
                    }
                  />
                </div>

                <Title
                  small="Lo Shu"
                  big="Numerology Structure"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold">
                      Standard Lo Shu
                    </p>

                    <div className="grid max-w-[230px] grid-cols-3">
                      {grid.map((number) => (
                        <GridCell
                          key={number}
                          text={String(number)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold">
                      Personal Lo Shu
                    </p>

                    <div className="grid max-w-[230px] grid-cols-3">
                      {grid.map((number) => (
                        <GridCell
                          key={number}
                          text={repeatNumber(
                            number,
                            calculation.loShu.counts[number]
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-[#f8f4ed] p-4 text-sm leading-6 text-[#776d61]">
                  <p>
                    <b>Present:</b>{' '}
                    {joinNumbers(
                      calculation.loShu.presentNumbers
                    )}
                  </p>

                  <p>
                                        <b>Missing:</b>{' '}
                    {joinNumbers(
                      calculation.loShu.missingNumbers
                    )}
function MiniBox({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-[10px] font-semibold text-[#24354c]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#776d61]">
        {text}
      </p>
    </div>
  )
}