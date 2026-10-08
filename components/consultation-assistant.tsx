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

import {
  selectConsultationIntelligence,
} from '@/lib/consultation/consultation-intelligence-selector'

import type {
  ConsultationAnswerForIntelligence,
  QuestionIntelligenceDecision,
} from '@/lib/consultation/question-intelligence'

import type {
  ConsultationSelectionResult,
} from '@/lib/consultation/consultation-intelligence-selector'

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

type EmployeeOutputData = {
  version: string
  insights: readonly EmployeeInsight[]
  warnings: readonly string[]
}

type Result = {
  calculation: NumerologyCalculationResult
  intelligence: NumerologyV3Result
  consultationInsightPool: EmployeeOutputData
}

const labels: Record<string, string> = {
  numerology_report: 'Report Discussion',
  follow_up: 'Follow-up Consultation',
  general_consultation: 'General Consultation',

  business: 'Business',
  career: 'Career',
  money: 'Money & Wealth',
  family: 'Family',
  relationship: 'Relationship',
  marriage: 'Marriage',
  personal_direction: 'Personal Direction',
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

function getConcernAnswer(
  answers: readonly ConsultationAnswerForIntelligence[]
): string {
  const concern = answers.find(
    (item) =>
      item.questionKey === 'TODAY_NOTE_EXPLORATION' ||
      item.questionKey === 'PRIMARY_CONCERN_EXPLORATION'
  )

  return concern?.clientAnswer.trim() || ''
}

function getClarificationAnswer(
  answers: readonly ConsultationAnswerForIntelligence[]
): string {
  const clarification = answers.find(
    (item) =>
      item.questionKey === 'CONCERN_CLARIFICATION'
  )

  return clarification?.clientAnswer.trim() || ''
}

function readableTopic(topic: string | null): string {
  if (!topic) {
    return 'General Consultation'
  }

  return labels[topic] || topic.replace(/_/g, ' ')
}

export function ConsultationAssistant({
  client,
  mode,
  purpose,
  topics,
  note,
  consultationNumber,
  onBack,
}: Props) {
  const [choice, setChoice] = useState('')
  const [answer, setAnswer] = useState('')

  const [
    currentAnswers,
    setCurrentAnswers,
  ] = useState<ConsultationAnswerForIntelligence[]>([])

  const [
    clarificationNeeded,
    setClarificationNeeded,
  ] = useState(false)

  const [
    clarificationReviewed,
    setClarificationReviewed,
  ] = useState(false)

  const [data, setData] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /*
   * LOAD VERIFIED NUMEROLOGY
   *
   * V2 is calculated on the server.
   * V3 reuses the same calculation.
   *
   * Consultation context does not modify
   * the verified numerology.
   */
  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      setData(null)

      try {
        const response =
          await generateNumerologyV2(client.id)

        if (!active) {
          return
        }

        if (response.error || !response.result) {
          setError(
            response.error ||
              'Unable to load numerology.'
          )
          return
        }

        const result = response.result

        if (
          !result.calculation ||
          !result.intelligence ||
          !result.consultationInsightPool ||
          !Array.isArray(
            result.consultationInsightPool.insights
          )
        ) {
          setError(
            'Consultation intelligence is incomplete. Please verify the numerology server action.'
          )
          return
        }

        setData({
          calculation: result.calculation,
          intelligence: result.intelligence,
          consultationInsightPool:
            result.consultationInsightPool,
        })
      } catch {
        if (active) {
          setError('Unable to load numerology.')
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

  /*
   * QUESTION INTELLIGENCE
   *
   * Clarification is requested by
   * the practitioner, not guessed
   * from client keywords.
   */
  const decision =
    useMemo<QuestionIntelligenceDecision>(
      () =>
        decideNextQuestion({
          consultationNumber,
          purpose,
          topics,
          todayNote: note,
          currentAnswers,
          clarificationNeeded,
        }),
      [
        consultationNumber,
        purpose,
        topics,
        note,
        currentAnswers,
        clarificationNeeded,
      ]
    )

  /*
   * VERIFIED TOPIC SELECTION
   */
  const consultationSelection =
    useMemo<ConsultationSelectionResult | null>(
      () => {
        if (!data) {
          return null
        }

        return selectConsultationIntelligence({
          purpose,
          topics,
          insights:
            data.consultationInsightPool.insights,
          conclusions:
            data.intelligence.conclusions,
          limit: 5,
        })
      },
      [data, purpose, topics]
    )

  const directInsights =
    consultationSelection?.insights.filter(
      (item) =>
        item.relevanceLevel === 'PRIMARY' ||
        item.relevanceLevel === 'SECONDARY'
    ) || []

  const generalInsights =
    consultationSelection?.insights.filter(
      (item) =>
        item.relevanceLevel === 'GENERAL'
    ) || []

  const consultationInsights =
    consultationSelection
      ? consultationSelection.insights.map(
          (item) => item.insight
        )
      : []

  const calculation = data?.calculation

  const modeLabel =
    mode === 'in_person'
      ? 'In-Person'
      : mode === 'phone'
        ? 'Phone'
        : 'Consultation'

  const primaryTopic = topics[0] || null

  const concernAnswer = getConcernAnswer(currentAnswers)
  const clarificationAnswer =
    getClarificationAnswer(currentAnswers)

  const hasConcern =
    Boolean(concernAnswer || note.trim())

  const isFamiliarityQuestion =
    decision.questionKey ===
    'NUMEROLOGY_FAMILIARITY'

  const isReadyForV3 =
    decision.stage === 'READY_FOR_V3' ||
    !decision.shouldAskQuestion

  const canContinue =
    isFamiliarityQuestion
      ? Boolean(choice)
      : Boolean(answer.trim())

  /*
   * INITIAL OUTCOME
   *
   * Display after the concern is
   * recorded, even if the practitioner
   * requests additional clarification.
   *
   * The findings remain unchanged
   * when the client answers questions.
   */
  const showInitialOutcome =
    hasConcern &&
    currentAnswers.some(
      (item) =>
        item.questionKey ===
          'TODAY_NOTE_EXPLORATION' ||
        item.questionKey ===
          'PRIMARY_CONCERN_EXPLORATION'
    )

  const outcomeStatus =
    clarificationAnswer
      ? 'Refined Discussion Context'
      : 'Initial Discussion Context'

  /*
   * RECORD CONSULTATION ANSWER
   *
   * Phase 1: local React state.
   *
   * Database persistence will be
   * implemented separately.
   */
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
        questionKey: decision.questionKey,
        questionText: decision.questionText,
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

  /*
   * PRACTITIONER CLARIFICATION
   *
   * One optional clarification per
   * opening concern.
   */
  function requestClarification() {
    if (clarificationReviewed) {
      return
    }

    setClarificationNeeded(true)
    setClarificationReviewed(true)
    setChoice('')
    setAnswer('')
  }

  function continueWithoutClarification() {
    setClarificationNeeded(false)
    setClarificationReviewed(true)
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

          {/* CLIENT HEADER */}

          <header className="bg-[#24354c] p-5 text-white">

            <p className="text-[10px] uppercase tracking-widest text-[#d6b47b]">
              TSIA Live Consultation
            </p>

            <h1 className="mt-2 font-serif text-2xl font-semibold">
              {client.name}
            </h1>

            <p className="mt-1 text-xs text-gray-300">
              {client.clientNumber || 'TSIA Client'}
              {' · '}
              Consultation #{consultationNumber}
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
                  text={readableTopic(primaryTopic)}
                />
              )}
            </div>

          </header>

          <main className="p-5">

            {/* SECTION 1: CLIENT CONVERSATION */}

            {note.trim() && (
              <div className="rounded-xl bg-[#fbf6ec] p-4">

                <p className="text-[10px] font-semibold uppercase text-[#ad7b40]">
                  Today's Note
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#24354c]">
                  {note}
                </p>

              </div>
            )}

            <Title
              small="Live Consultation"
              big="Client Conversation"
            />

            {currentAnswers.length > 0 && (
              <div className="mb-4 space-y-3">

                {currentAnswers.map(
                  (item, index) => (
                    <div
                      key={`${item.questionKey}-${index}`}
                      className="rounded-2xl border border-[#e6ddd1] bg-[#fbf8f3] p-4"
                    >

                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                        TSIA Question {index + 1}
                      </p>

                      <p className="mt-2 text-sm font-semibold leading-6 text-[#24354c]">
                        {item.questionText}
                      </p>

                      <div className="mt-3 rounded-xl bg-white p-3">

                        <p className="text-[10px] font-semibold uppercase text-[#ad7b40]">
                          Client Says
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#776d61]">
                          {item.clientAnswer}
                        </p>

                      </div>
                    </div>
                  )
                )}

              </div>
            )}

            {!isReadyForV3 && (
              <>

                <div className="rounded-2xl border border-[#e6ddd1] p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                    {decision.stage ===
                    'NUMEROLOGY_FAMILIARITY'
                      ? 'Opening Question'
                      : decision.stage ===
                          'CONCERN_CLARIFICATION'
                        ? 'Clarification Question'
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

                <div className="mt-4 rounded-2xl border border-[#e6ddd1] p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                    Client Says
                  </p>

                  <textarea
                    value={answer}
                    onChange={(event) =>
                      setAnswer(event.target.value)
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

            {/* PRACTITIONER CLARIFICATION DECISION */}

            {isReadyForV3 &&
              showInitialOutcome &&
              !clarificationReviewed && (
                <div className="mt-4 rounded-2xl border border-[#dfd3c1] bg-[#fbf6ec] p-5">

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                    Practitioner Decision
                  </p>

                  <h3 className="mt-2 font-serif text-lg font-semibold text-[#24354c]">
                    Is further clarification needed?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#776d61]">
                    Review the client's concern.
                    If more information is needed,
                    ask one additional question
                    before finalizing the discussion.
                  </p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">

                    <button
                      type="button"
                      onClick={requestClarification}
                      className="rounded-xl bg-[#24354c] px-4 py-3 text-sm font-semibold text-white"
                    >
                      Ask Clarification
                    </button>

                    <button
                      type="button"
                      onClick={continueWithoutClarification}
                      className="rounded-xl border border-[#cdbb9d] bg-white px-4 py-3 text-sm font-semibold text-[#24354c]"
                    >
                      Continue Without Clarification
                    </button>

                  </div>

                </div>
              )}

            {isReadyForV3 && (
              <div className="mt-4 rounded-2xl border border-[#dfd3c1] bg-[#fbf6ec] p-5">

                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                  Opening Context
                </p>

                <h3 className="mt-2 font-serif text-lg font-semibold text-[#24354c]">
                  {clarificationReviewed
                    ? 'Ready for Personalized Discussion'
                    : 'Initial Context Available'}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#776d61]">
                  The client's stated concern is
                  available for consultation.
                  Verified V3 intelligence is
                  presented separately from
                  client-provided information.
                </p>

              </div>
            )}

            {/* SECTION 2: DISCUSSION-SPECIFIC OUTCOME */}

            {showInitialOutcome && (
              <>
                <Title
                  small="TSIA Consultation Outcome"
                  big={`${readableTopic(primaryTopic)} — Numerology Outcome`}
                />

                <div className="rounded-2xl border border-[#dfd3c1] bg-[#fffdf9] p-5">

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                    {outcomeStatus}
                  </p>

                  <h3 className="mt-2 font-serif text-lg font-semibold text-[#24354c]">
                    Client's Discussion
                  </h3>

                  <p className="mt-3 text-xs font-semibold uppercase text-[#ad7b40]">
                    Selected Topic
                  </p>

                  <p className="mt-1 text-sm text-[#24354c]">
                    {readableTopic(primaryTopic)}
                  </p>

                  <p className="mt-4 text-xs font-semibold uppercase text-[#ad7b40]">
                    Client's Main Concern
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#776d61]">
                    {concernAnswer || note.trim()}
                  </p>

                  {clarificationAnswer && (
                    <>
                      <p className="mt-4 text-xs font-semibold uppercase text-[#ad7b40]">
                        Additional Clarification
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#776d61]">
                        {clarificationAnswer}
                      </p>
                    </>
                  )}

                </div>

                {loading && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f8f4ed] p-4 text-xs text-[#776d61]">
                    <Loader2 className="size-4 animate-spin" />
                    Preparing verified numerology context...
                  </div>
                )}

                {!loading && !error && consultationSelection && (
                  <div className="mt-4 space-y-4">

                    <div className="rounded-2xl border border-[#e6ddd1] p-5">

                      <h3 className="font-serif text-lg font-semibold text-[#24354c]">
                        Relevant Numerological Findings
                      </h3>

                      {directInsights.length > 0 ? (
                        <div className="mt-4 space-y-3">
                          {directInsights.map(
                            (item) => (
                              <div
                                key={item.insight.id}
                                className="rounded-xl bg-[#f8f4ed] p-4"
                              >
                                <p className="text-sm font-semibold text-[#24354c]">
                                  {item.insight.title}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-[#776d61]">
                                  {item.insight.statement}
                                </p>

                                <p className="mt-2 text-[10px] uppercase tracking-wide text-[#ad7b40]">
                                  {item.relevanceLevel === 'PRIMARY'
                                    ? 'Directly matched to primary topic'
                                    : 'Matched to secondary topic'}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-[#776d61]">
                          No verified V3 conclusion
                          directly matches the selected
                          discussion topic. General
                          numerology observations must
                          not be presented as a direct
                          explanation of the client's
                          concern.
                        </p>
                      )}

                    </div>

                    <div className="rounded-2xl border border-[#e6ddd1] p-5">

                      <h3 className="font-serif text-lg font-semibold text-[#24354c]">
                        Practitioner Guidance
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-[#776d61]">
                        Discuss the client's stated
                        concern alongside the verified
                        findings above. Explore which
                        observations the client
                        recognizes in their own
                        experience before suggesting
                        practical next steps.
                      </p>

                      <p className="mt-3 text-sm leading-6 text-[#776d61]">
                        Client statements provide
                        real-world context. They do
                        not establish numerological
                        causes or change the
                        approved V3 conclusions.
                      </p>

                      {!clarificationAnswer &&
                        !clarificationReviewed && (
                          <p className="mt-3 text-sm leading-6 text-[#776d61]">
                            The practitioner may
                            request one clarification
                            question to understand
                            the situation more
                            precisely.
                          </p>
                        )}

                      {clarificationAnswer && (
                        <p className="mt-3 text-sm leading-6 text-[#776d61]">
                          The additional response
                          should now be considered
                          when discussing practical
                          guidance. The underlying
                          verified numerology remains
                          unchanged.
                        </p>
                      )}

                    </div>

                  </div>
                )}

              </>
            )}

            {/* SECTION 3: CLIENT AT A GLANCE */}

            <Title
              small="Numerology Reference"
              big="Client at a Glance"
            />

            {loading && (
              <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ed] p-4 text-xs text-[#776d61]">
                <Loader2 className="size-4 animate-spin" />
                Loading verified TSIA numerology...
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
                      {grid.map(
                        (number) => (
                          <GridCell
                            key={number}
                            text={String(number)}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold">
                      Personal Lo Shu
                    </p>

                    <div className="grid max-w-[230px] grid-cols-3">
                      {grid.map(
                        (number) => (
                          <GridCell
                            key={number}
                            text={repeatNumber(
                              number,
                              calculation.loShu.counts[number]
                            )}
                          />
                        )
                      )}
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
                  </p>

                  <p>
                    <b>Repeated:</b>{' '}
                    {formatRepeated(
                      calculation.loShu.repeatedNumbers
                    )}
                  </p>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">

                  <MiniBox
                    title="Golden Rajyog"
                    text={`4-5-6 · ${statusLabel(
                      calculation.rajyog.golden.status
                    )}`}
                  />

                  <MiniBox
                    title="Silver Rajyog"
                    text={`2-5-8 · ${statusLabel(
                      calculation.rajyog.silver.status
                    )}`}
                  />

                </div>

                <div className="mt-3 rounded-xl border p-4">

                  <p className="text-sm font-semibold text-[#24354c]">
                    Core Graha Influence
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#776d61]">

                    Mulank:{' '}
                    <b>
                      {
                        calculation.grahas[
                          calculation.mulank.final
                        ]
                      }
                    </b>

                    <br />

                    Bhagyank:{' '}
                    <b>
                      {
                        calculation.grahas[
                          calculation.bhagyank.final
                        ]
                      }
                    </b>

                    <br />

                    Name Number:{' '}
                    <b>
                      {
                        calculation.grahas[
                          calculation.nameNumber.finalNumber
                        ]
                      }
                    </b>

                  </p>

                </div>

              </>
            )}

            {/* SECTION 4: TOPIC-BASED INTELLIGENCE */}

            {!loading && !error && data && (
              <>
                <Title
                  small="Supporting Numerological Evidence"
                  big={
                    primaryTopic
                      ? `${readableTopic(primaryTopic)} Intelligence`
                      : 'Numerology Intelligence'
                  }
                />

                {consultationInsights.length > 0 ? (
                  <ConsultationV3Insights
                    insights={consultationInsights}
                    evidence={
                      data.intelligence.evidence
                    }
                  />
                ) : (
                  <div className="rounded-xl border border-[#eadfce] bg-[#f8f4ed] p-4">
                    <p className="text-sm leading-6 text-[#776d61]">
                      No eligible verified V3
                      findings are currently
                      available for this
                      consultation.
                    </p>
                  </div>
                )}

                {generalInsights.length > 0 && (
                  <p className="mt-3 text-xs leading-5 text-[#8a8177]">
                    Some findings shown above
                    are general numerology
                    observations rather than
                    direct findings for the
                    selected consultation topic.
                  </p>
                )}

                {consultationSelection?.warnings.map(
                  (warning, index) => (
                    <p
                      key={index}
                      className="mt-3 text-xs leading-5 text-[#8a8177]"
                    >
                      {warning}
                    </p>
                  ))}

              </>
            )}

            {/* SECTION 5: COMPLETE INTELLIGENCE */}

            {!loading && !error && data?.intelligence && (
              <>
                <Title
                  small="Deep Analysis"
                  big="Complete Numerology Intelligence"
                />

                <ConsultationCompleteIntelligence
                  conclusions={
                    data.intelligence.conclusions.conclusions
                  }
                  developmentAssessments={
                    data.intelligence.conclusions
                      .developmentAssessments
                  }
                  crossQualityResolutions={
                    data.intelligence.crossQuality.resolutions
                  }
                />
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}

function formatCompound(
  compound: number,
  final: number
) {
  return compound === final
    ? String(final)
    : `${compound}/${final}`
}

function repeatNumber(
  number: number,
  count: number
) {
  if (!count) {
    return ''
  }

  return String(number).repeat(count)
}

function joinNumbers(
  numbers: readonly NumerologyDigit[]
) {
  return numbers.length
    ? numbers.join(', ')
    : 'None'
}

function formatRepeated(
  repeated: Partial<
    Record<NumerologyDigit, number>
  >
) {
  const items =
    Object.entries(repeated)
      .filter(
        ([, count]) =>
          Number(count) > 1
      )
      .map(
        ([number, count]) =>
          `${number} × ${count}`
      )

  return items.length
    ? items.join(', ')
    : 'None'
}

function statusLabel(status: string) {
  if (status === 'complete') {
    return 'Complete'
  }

  if (status === 'partial') {
    return 'Partial'
  }

  return 'Absent'
}

function Tag({
  text,
}: {
  text: string
}) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px]">
      {text}
    </span>
  )
}

function Title({
  small,
  big,
}: {
  small: string
  big: string
}) {
  return (
    <div className="mb-4 mt-7 border-t pt-5">

      <p className="text-[10px] uppercase text-[#ad7b40]">
        {small}
      </p>

      <h2 className="mt-1 font-serif text-xl font-semibold text-[#24354c]">
        {big}
      </h2>

    </div>
  )
}

function NumberBox({
  title,
  value,
  graha,
}: {
  title: string
  value: string
  graha: string
}) {
  return (
    <div className="rounded-xl bg-[#f8f4ed] p-3">

      <p className="text-[9px] uppercase text-[#8c8175]">
        {title}
      </p>

      <p className="mt-2 font-serif text-xl text-[#24354c]">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-[#ad7b40]">
        {graha}
      </p>

    </div>
  )
}

function GridCell({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex h-14 items-center justify-center border text-sm font-semibold text-[#24354c]">
      {text || ' '}
    </div>
  )
}

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