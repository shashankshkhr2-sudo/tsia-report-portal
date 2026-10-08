'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
} from 'lucide-react'

import { generateNumerologyV2 } from '@/app/actions/numerology'
import { ConsultationV3Insights } from '@/components/consultation-v3-insights'
import { ConsultationCompleteIntelligence } from '@/components/consultation-complete-intelligence'
import { decideNextQuestion } from '@/lib/consultation/question-intelligence'
import { selectConsultationIntelligence } from '@/lib/consultation/consultation-intelligence-selector'
import { buildUniversalNumerologyIntelligence } from '@/lib/consultation/universal-numerology-intelligence'

import type {
  UniversalConsultationTopic,
  UniversalNumerologyResult,
} from '@/lib/consultation/universal-numerology-intelligence'

import type {
  ConsultationAnswerForIntelligence,
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

type Data = {
  calculation: NumerologyCalculationResult
  intelligence: NumerologyV3Result
  consultationInsightPool: {
    version: string
    insights: readonly EmployeeInsight[]
    warnings: readonly string[]
  }
}

const labels: Record<string, string> = {
  numerology_report: 'Report Discussion',
  follow_up: 'Follow-up Consultation',
  general_consultation: 'General Consultation',
  career: 'Career',
  business: 'Business',
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
]

const grid: NumerologyDigit[] = [
  4, 9, 2,
  3, 5, 7,
  8, 1, 6,
]

function topicName(value: string | null) {
  return value
    ? labels[value] || value.replace(/_/g, ' ')
    : 'General Consultation'
}

function normalizeTopic(
  value: string | null
): UniversalConsultationTopic {
  switch (value) {
    case 'career':
    case 'business':
    case 'money':
    case 'family':
    case 'relationship':
    case 'marriage':
    case 'personal_direction':
      return value
    default:
      return 'other'
  }
}

function lastAnswer(
  answers: readonly ConsultationAnswerForIntelligence[],
  keys: string[]
) {
  return (
    [...answers]
      .reverse()
      .find((item) => keys.includes(item.questionKey))
      ?.clientAnswer.trim() || ''
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
      <p className="text-[10px] uppercase tracking-wide text-[#ad7b40]">
        {small}
      </p>
      <h2 className="mt-1 font-serif text-xl font-semibold text-[#24354c]">
        {big}
      </h2>
    </div>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-4 rounded-2xl border border-[#e6ddd1] bg-white p-4">
      <h3 className="font-serif text-lg font-semibold text-[#24354c]">
        {title}
      </h3>
      <div className="mt-3 text-sm leading-6 text-[#776d61]">
        {children}
      </div>
    </section>
  )
}

function Info({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-[#f8f4ed] p-3">
      <p className="text-[10px] font-semibold uppercase text-[#ad7b40]">
        {title}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#24354c]">
        {value}
      </p>
    </div>
  )
}

function Guidance({
  result,
}: {
  result: UniversalNumerologyResult
}) {
  const lifePathOnly =
    result.scope.category === 'LIFE_PATH_REQUIRED'

  return (
    <div className="mt-4">
      <Panel title="Consultation Scope">
        <p>{result.scope.employeeExplanation}</p>
      </Panel>

      <Panel title={result.concernInterpretation.title}>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-[#ad7b40]">
              Profession & Suitability Discussion
            </p>
            <p className="mt-1">
              {result.concernInterpretation.suitabilityDiscussion}
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#ad7b40]">
              Personality Connection
            </p>
            <p className="mt-1">
              {result.concernInterpretation.personalityConnection}
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#ad7b40]">
              What the Client Can Improve
            </p>
            <p className="mt-1">
              {result.concernInterpretation.improvementDirection}
            </p>
          </div>

          <p className="border-t pt-3 text-xs">
            {result.concernInterpretation.limitation}
          </p>
        </div>
      </Panel>

      {!lifePathOnly && (
        <>
          <Panel title="Numerological Foundation">
            <div className="grid grid-cols-3 gap-2">
              <Info
                title="Mulank"
                value={String(result.coreNumbers.mulank)}
              />
              <Info
                title="Bhagyank"
                value={String(result.coreNumbers.bhagyank)}
              />
              <Info
                title="Name"
                value={String(result.coreNumbers.nameNumber)}
              />
            </div>
          </Panel>

          <Panel title="Personality & Relevant Qualities">
            {result.relevantQualities.length === 0 ? (
              <p>No eligible qualities were identified.</p>
            ) : (
              <div className="space-y-3">
                {result.relevantQualities.map((quality) => (
                  <div
                    key={quality.qualityId}
                    className="rounded-xl bg-[#f8f4ed] p-3"
                  >
                    <p className="font-semibold text-[#24354c]">
                      {quality.title}
                    </p>

                    <p className="mt-2">
                      {quality.interpretation}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#ad7b40]">
                      {quality.verificationStatus === 'V3_SUPPORTED'
                        ? 'Approved topic-relevant V3 finding'
                        : 'Traditional association — confirm with client'}
                    </p>

                    <div className="mt-2 space-y-1 text-xs">
                      {quality.evidence.map((evidence, index) => (
                        <p key={index}>
                          {evidence.description}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Behavioural Development Guidance">
            <p className="mb-3 text-xs">
              These are possibilities to explore, not confirmed
              weaknesses.
            </p>

            <div className="space-y-3">
              {result.behaviouralDevelopment.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#f8f4ed] p-3"
                >
                  <p className="font-semibold text-[#24354c]">
                    {item.title}
                  </p>
                  <p className="mt-2">
                    {item.possiblePattern}
                  </p>
                  <p className="mt-2 font-semibold text-[#ad7b40]">
                    Practical Improvement
                  </p>
                  <p>{item.practicalImprovement}</p>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}

      <Panel title="Suggested Follow-up Questions">
        {result.suggestedQuestions.length ? (
          <div className="space-y-3">
            {result.suggestedQuestions.map((question, index) => (
              <p key={index}>
                <b>{index + 1}.</b> {question}
              </p>
            ))}
          </div>
        ) : (
          <p>No additional question suggested.</p>
        )}
      </Panel>

      {result.scope.requiresLifePathGuidance && (
        <Panel title="TSIA Life Path Guidance Report">
          <p>{result.scope.suggestedResponse}</p>
        </Panel>
      )}

      {result.warnings.length > 0 && (
        <Panel title="Practitioner Notes">
          {result.warnings.map((warning, index) => (
            <p key={index} className="mb-2 text-xs">
              {warning}
            </p>
          ))}
        </Panel>
      )}

      <p className="mt-4 text-xs leading-5 text-[#8a8177]">
        Traditional numerology is interpretive and is not a
        scientifically validated personality or career assessment.
        No professional or life outcome is guaranteed.
      </p>
    </div>
  )
}

function CalculationDisplay({
  calculation,
}: {
  calculation: NumerologyCalculationResult
}) {
  const numberText = (compound: number, final: number) =>
    compound === final
      ? String(final)
      : `${compound}/${final}`

  const repeats = Object.entries(
    calculation.loShu.repeatedNumbers
  )
    .filter(([, count]) => Number(count) > 1)
    .map(([number, count]) => `${number} × ${count}`)
    .join(', ')

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Info
          title="Mulank"
          value={`${numberText(
            calculation.mulank.compound,
            calculation.mulank.final
          )} · ${calculation.grahas[calculation.mulank.final]}`}
        />

        <Info
          title="Bhagyank"
          value={`${numberText(
            calculation.bhagyank.compound,
            calculation.bhagyank.final
          )} · ${calculation.grahas[calculation.bhagyank.final]}`}
        />

        <Info
          title="Name Number"
          value={`${numberText(
            calculation.nameNumber.compoundTotal,
            calculation.nameNumber.finalNumber
          )} · ${
            calculation.grahas[
              calculation.nameNumber.finalNumber
            ]
          }`}
        />
      </div>

      <Title small="Lo Shu" big="Numerology Structure" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold">
            Standard Lo Shu
          </p>

          <div className="grid grid-cols-3">
            {grid.map((number) => (
              <div
                key={number}
                className="flex h-12 items-center justify-center border text-sm font-semibold"
              >
                {number}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold">
            Personal Lo Shu
          </p>

          <div className="grid grid-cols-3">
            {grid.map((number) => (
              <div
                key={number}
                className="flex h-12 items-center justify-center border text-sm font-semibold"
              >
                {String(number).repeat(
                  calculation.loShu.counts[number] || 0
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Panel title="Lo Shu Details">
        <p>
          <b>Present:</b>{' '}
          {calculation.loShu.presentNumbers.join(', ') || 'None'}
        </p>

        <p>
          <b>Missing:</b>{' '}
          {calculation.loShu.missingNumbers.join(', ') || 'None'}
        </p>

        <p>
          <b>Repeated:</b> {repeats || 'None'}
        </p>
      </Panel>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Info
          title="Golden Rajyog"
          value={`4-5-6 · ${calculation.rajyog.golden.status}`}
        />
        <Info
          title="Silver Rajyog"
          value={`2-5-8 · ${calculation.rajyog.silver.status}`}
        />
      </div>

      <Panel title="Core Graha Influence">
        <p>
          <b>Mulank:</b>{' '}
          {calculation.grahas[calculation.mulank.final]}
        </p>
        <p>
          <b>Bhagyank:</b>{' '}
          {calculation.grahas[calculation.bhagyank.final]}
        </p>
        <p>
          <b>Name Number:</b>{' '}
          {calculation.grahas[
            calculation.nameNumber.finalNumber
          ]}
        </p>
      </Panel>
    </>
  )
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

  const [answers, setAnswers] =
    useState<ConsultationAnswerForIntelligence[]>([])

  const [clarificationNeeded, setClarificationNeeded] =
    useState(false)

  const [clarificationReviewed, setClarificationReviewed] =
    useState(false)

  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      setData(null)

      try {
        const response =
          await generateNumerologyV2(client.id)

        if (!active) return

        if (response.error || !response.result) {
          setError(
            response.error || 'Unable to load numerology.'
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
          setError('Incomplete consultation intelligence.')
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
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [client.id])

  const decision = useMemo(
    () =>
      decideNextQuestion({
        consultationNumber,
        purpose,
        topics,
        todayNote: note,
        currentAnswers: answers,
        clarificationNeeded,
      }),
    [
      consultationNumber,
      purpose,
      topics,
      note,
      answers,
      clarificationNeeded,
    ]
  )

  const selection = useMemo(
    () =>
      data
        ? selectConsultationIntelligence({
            purpose,
            topics,
            insights:
              data.consultationInsightPool.insights,
            conclusions:
              data.intelligence.conclusions,
            limit: 5,
          })
        : null,
    [data, purpose, topics]
  )

  const primaryTopic = topics[0] || null

  const concern = lastAnswer(answers, [
    'TODAY_NOTE_EXPLORATION',
    'PRIMARY_CONCERN_EXPLORATION',
  ])

  const clarification = lastAnswer(answers, [
    'CONCERN_CLARIFICATION',
  ])

  const actualConcern = concern || note.trim()

  const universal = useMemo(
    () =>
      data && actualConcern
        ? buildUniversalNumerologyIntelligence({
            topic: normalizeTopic(primaryTopic),
            clientConcern: actualConcern,
            clarification,
            calculation: data.calculation,
            conclusions:
              data.intelligence.conclusions,
          })
        : null,
    [data, primaryTopic, actualConcern, clarification]
  )

  const familiarity =
    decision.questionKey === 'NUMEROLOGY_FAMILIARITY'

  const ready =
    decision.stage === 'READY_FOR_V3' ||
    !decision.shouldAskQuestion

  const canContinue = familiarity
    ? Boolean(choice)
    : Boolean(answer.trim())

  const showOutcome =
    Boolean(actualConcern) &&
    answers.some(
      (item) =>
        item.questionKey === 'TODAY_NOTE_EXPLORATION' ||
        item.questionKey === 'PRIMARY_CONCERN_EXPLORATION'
    )

  function continueQuestion() {
    if (
      !decision.shouldAskQuestion ||
      !decision.questionKey ||
      !decision.questionText
    ) {
      return
    }

    const response = familiarity
      ? answer.trim()
        ? `${choice}. ${answer.trim()}`
        : choice
      : answer.trim()

    if (!response) return

    setAnswers((previous) => [
      ...previous,
      {
        questionKey: decision.questionKey!,
        questionText: decision.questionText!,
        clientAnswer: response,
      },
    ])

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
              {[
                mode === 'in_person'
                  ? 'In-Person'
                  : mode === 'phone'
                    ? 'Phone'
                    : 'Consultation',
                topicName(purpose),
                topicName(primaryTopic),
              ].map((item, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white/10 px-3 py-1 text-[10px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </header>

          <main className="p-5">
            {note.trim() && (
              <Panel title="Today's Note">
                <p className="whitespace-pre-wrap">{note}</p>
              </Panel>
            )}

            <Title
              small="Live Consultation"
              big="Client Conversation"
            />

            <div className="space-y-3">
              {answers.map((item, index) => (
                <div
                  key={`${item.questionKey}-${index}`}
                  className="rounded-xl bg-[#fbf8f3] p-4"
                >
                  <p className="text-xs font-semibold text-[#ad7b40]">
                    TSIA Question {index + 1}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#24354c]">
                    {item.questionText}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm text-[#776d61]">
                    {item.clientAnswer}
                  </p>
                </div>
              ))}
            </div>

            {!ready && (
              <Panel title="Current Question">
                <p className="font-semibold text-[#24354c]">
                  {decision.questionText}
                </p>

                {familiarity && (
                  <div className="mt-4 grid gap-2">
                    {familiarityOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setChoice(option)}
                        className={`flex justify-between rounded-xl border p-3 text-left ${
                          choice === option
                            ? 'border-[#b89556] bg-[#fbf5e9]'
                            : 'border-[#e6ddd1]'
                        }`}
                      >
                        {option}

                        {choice === option && (
                          <Check className="size-4" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  value={answer}
                  onChange={(event) =>
                    setAnswer(event.target.value)
                  }
                  rows={3}
                  placeholder={
                    familiarity
                      ? 'Optional client comments...'
                      : "Type the client's response..."
                  }
                  className="mt-4 w-full rounded-xl border p-3 text-sm"
                />

                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={continueQuestion}
                  className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#24354c] p-3 font-semibold text-white disabled:opacity-40"
                >
                  Continue Consultation
                  <ChevronRight className="ml-2 size-4" />
                </button>
              </Panel>
            )}

            {ready && showOutcome && !clarificationReviewed && (
              <Panel title="Is further clarification needed?">
                <p>
                  Review the client's concern before finalizing
                  the personalized discussion.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setClarificationNeeded(true)
                      setClarificationReviewed(true)
                      setAnswer('')
                      setChoice('')
                    }}
                    className="rounded-xl bg-[#24354c] p-3 font-semibold text-white"
                  >
                    Ask Clarification
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setClarificationNeeded(false)
                      setClarificationReviewed(true)
                      setAnswer('')
                      setChoice('')
                    }}
                    className="rounded-xl border p-3 font-semibold text-[#24354c]"
                  >
                    Continue Without Clarification
                  </button>
                </div>
              </Panel>
            )}

            {ready && (
              <Panel title="Opening Context">
                <p>
                  {clarificationReviewed
                    ? 'Ready for personalized discussion.'
                    : 'Initial context available.'}
                  {' '}
                  Client statements remain separate from
                  verified numerological evidence.
                </p>
              </Panel>
            )}

            {showOutcome && (
              <>
                <Title
                  small="TSIA Consultation Outcome"
                  big={`${topicName(primaryTopic)} — Numerology Guidance`}
                />

                <Panel title="Client's Discussion">
                  <p className="font-semibold text-[#ad7b40]">
                    Selected Topic
                  </p>

                  <p>{topicName(primaryTopic)}</p>

                  <p className="mt-3 font-semibold text-[#ad7b40]">
                    Client's Main Concern
                  </p>

                  <p className="whitespace-pre-wrap">
                    {actualConcern}
                  </p>

                  {clarification && (
                    <>
                      <p className="mt-3 font-semibold text-[#ad7b40]">
                        Additional Clarification
                      </p>

                      <p className="whitespace-pre-wrap">
                        {clarification}
                      </p>
                    </>
                  )}
                </Panel>

                {loading && (
                  <p className="mt-4 flex items-center gap-2 text-sm">
                    <Loader2 className="size-4 animate-spin" />
                    Preparing personalized numerology...
                  </p>
                )}

                {!loading && !error && universal && (
                  <Guidance result={universal} />
                )}
              </>
            )}

            <Title
              small="Numerology Reference"
              big="Client at a Glance"
            />

            {loading && (
              <p className="flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" />
                Loading verified TSIA numerology...
              </p>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {data && (
              <CalculationDisplay
                calculation={data.calculation}
              />
            )}

            {!loading && !error && data && (
              <>
                <Title
                  small="Supporting Numerological Evidence"
                  big={`${topicName(primaryTopic)} Intelligence`}
                />

                {selection && selection.insights.length > 0 ? (
                  <ConsultationV3Insights
                    insights={selection.insights.map(
                      (item) => item.insight
                    )}
                    evidence={data.intelligence.evidence}
                  />
                ) : (
                  <Panel title="V3 Evidence Availability">
                    No eligible topic-specific V3 findings
                    are currently available. Traditional
                    associations are shown separately above.
                  </Panel>
                )}

                {selection?.warnings.map((warning, index) => (
                  <p
                    key={index}
                    className="mt-3 text-xs text-[#8a8177]"
                  >
                    {warning}
                  </p>
                ))}

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