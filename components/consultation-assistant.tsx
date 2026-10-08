'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
} from 'lucide-react'

import { generateNumerologyV2 } from '@/app/actions/numerology'
import { saveConsultationAnswer } from '@/app/actions/consultations'
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

type RecordedAnswer = ConsultationAnswerForIntelligence & {
  observation: string
  savedId: string
}

type IntroductionResponse = {
  question: string
  clientAnswer: string
  practitionerObservation: string
  savedId: string | null
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

const grahaNames: Record<number, string> = {
  1: 'Surya',
  2: 'Chandra',
  3: 'Guru',
  4: 'Rahu',
  5: 'Budh',
  6: 'Shukra',
  7: 'Ketu',
  8: 'Shani',
  9: 'Mangal',
}

const introduction = [
  {
    title: 'Seven Days and the Grahas',
    question:
      'Have you ever thought about why we have seven days in a week?',
    explanation:
      'In Bharatiya Jyotish, the seven weekdays are traditionally associated with seven Grahas: Surya, Chandra, Mangal, Budh, Guru, Shukra and Shani. We know them through Ravivar, Somvar, Mangalvar, Budhvar, Guruvar, Shukravar and Shanivar. Rahu and Ketu are also part of the Navagraha system, but they are lunar nodes and do not have separate weekdays.',
  },
  {
    title: 'Nine Numbers and Navagraha',
    question:
      'Have you ever wondered why Indian numerology uses nine basic numbers?',
    explanation:
      'Indian Ank Shastra traditionally associates the numbers 1 to 9 with the Navagrahas. Number 1 represents Surya, 2 Chandra, 3 Guru, 4 Rahu, 5 Budh, 6 Shukra, 7 Ketu, 8 Shani and 9 Mangal. This is the traditional connection between Ank Shastra, Navagraha and Jyotish Shastra.',
  },
  {
    title: 'Time and the Sun',
    question:
      'What time is showing on your watch right now? Is it the same time everywhere in the world?',
    explanation:
      'The Earth rotates, and different parts of the world experience daylight at different times. India, Canada, the United States and Europe follow different time zones. Days and years are connected with celestial cycles. In Bharatiya Jyotish, celestial movements are traditionally considered when interpreting phases of human life.',
  },
] as const

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

function Panel({
  title,
  children,
}: {
  title: string
  children: ReactNode
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

function SectionHeading({
  small,
  big,
}: {
  small: string
  big: string
}) {
  return (
    <div className="mb-4 mt-7 border-t border-[#e6ddd1] pt-5">
      <p className="text-[10px] uppercase tracking-wide text-[#ad7b40]">
        {small}
      </p>
      <h2 className="mt-1 font-serif text-xl font-semibold text-[#24354c]">
        {big}
      </h2>
    </div>
  )
}

function CalculationDisplay({
  calculation,
}: {
  calculation: NumerologyCalculationResult
}) {
  const numberText = (
    compound: number,
    final: number
  ) =>
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
          )} · ${
            grahaNames[calculation.mulank.final] || ''
          }`}
        />

        <Info
          title="Bhagyank"
          value={`${numberText(
            calculation.bhagyank.compound,
            calculation.bhagyank.final
          )} · ${
            grahaNames[calculation.bhagyank.final] || ''
          }`}
        />

        <Info
          title="Name Number"
          value={`${numberText(
            calculation.nameNumber.compoundTotal,
            calculation.nameNumber.finalNumber
          )} · ${
            grahaNames[
              calculation.nameNumber.finalNumber
            ] || ''
          }`}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <p className="mb-2 text-center text-xs font-semibold text-[#24354c]">
            Standard Lo Shu
          </p>

          <div className="grid grid-cols-3 gap-[2px]">
            {grid.map((number) => (
              <div
                key={number}
                className="flex aspect-square items-center justify-center border border-[#d8c7ae] bg-[#fbf8f3] text-sm font-bold text-[#24354c] sm:text-lg"
              >
                {number}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-center text-xs font-semibold text-[#24354c]">
            Personal Lo Shu
          </p>

          <div className="grid grid-cols-3 gap-[2px]">
            {grid.map((number) => (
              <div
                key={number}
                className="flex aspect-square min-w-0 items-center justify-center overflow-hidden border border-[#d8c7ae] bg-[#fbf8f3] px-0.5 text-center text-xs font-bold text-[#24354c] sm:text-lg"
              >
                {String(number).repeat(
                  calculation.loShu.counts[number] || 0
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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

      <details className="mt-4 rounded-xl border border-[#e6ddd1] p-3">
        <summary className="cursor-pointer font-semibold text-[#24354c]">
          Complete Lo Shu Details
        </summary>

        <div className="mt-3 space-y-2 text-sm text-[#776d61]">
          <p>
            <b>Present:</b>{' '}
            {calculation.loShu.presentNumbers.join(', ') ||
              'None'}
          </p>

          <p>
            <b>Missing:</b>{' '}
            {calculation.loShu.missingNumbers.join(', ') ||
              'None'}
          </p>

          <p>
            <b>Repeated:</b> {repeats || 'None'}
          </p>

          <p>
            <b>Mental row:</b> 4-9-2
          </p>

          <p>
            <b>Emotional/Will row:</b> 3-5-7
          </p>

          <p>
            <b>Practical/Material row:</b> 8-1-6
          </p>

          <p>
            <b>Columns:</b> 4-3-8, 9-5-1, 2-7-6
          </p>
        </div>
      </details>
    </>
  )
}

function LiveGuidance({
  result,
}: {
  result: UniversalNumerologyResult
}) {
  const lifePathOnly =
    result.scope.category === 'LIFE_PATH_REQUIRED'

  const insights = result.relevantQualities.slice(0, 3)
  const actions =
    result.behaviouralDevelopment.slice(0, 3)

  return (
    <div className="mt-4">
      <Panel title="Consultation Scope">
        <p>{result.scope.employeeExplanation}</p>
      </Panel>

      <Panel title="Three Relevant Personality Insights">
        {lifePathOnly ? (
          <p>{result.scope.suggestedResponse}</p>
        ) : insights.length ? (
          <div className="space-y-3">
            {insights.map((item, index) => (
              <div
                key={item.qualityId}
                className="rounded-xl bg-[#f8f4ed] p-3"
              >
                <p className="font-semibold text-[#24354c]">
                  {index + 1}. {item.title}
                </p>

                <p className="mt-2">
                  {item.interpretation}
                </p>

                <p className="mt-2 text-xs text-[#ad7b40]">
                  {item.verificationStatus ===
                  'V3_SUPPORTED'
                    ? 'Approved V3 finding'
                    : 'Traditional association — confirm with client'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>
            No eligible personality insight is available.
          </p>
        )}
      </Panel>

      {!lifePathOnly && (
        <Panel title="Three Practical Improvement Actions">
          {actions.length ? (
            <div className="space-y-3">
              {actions.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#f8f4ed] p-3"
                >
                  <p className="font-semibold text-[#24354c]">
                    {index + 1}. {item.title}
                  </p>

                  <p className="mt-2">
                    {item.practicalImprovement}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>
              No approved development action is available.
            </p>
          )}
        </Panel>
      )}

      <Panel title="Suggested Next Question">
        <p>
          {result.suggestedQuestions[0] ||
            'Which part of this guidance best matches your experience?'}
        </p>

        {result.suggestedQuestions.length > 1 && (
          <details className="mt-3">
            <summary className="cursor-pointer font-semibold text-[#24354c]">
              Other Suggested Questions
            </summary>

            <div className="mt-3 space-y-2">
              {result.suggestedQuestions
                .slice(1)
                .map((question, index) => (
                  <p key={index}>
                    {index + 2}. {question}
                  </p>
                ))}
            </div>
          </details>
        )}
      </Panel>

      <details className="mt-4 rounded-2xl border border-[#e6ddd1] bg-white p-4">
        <summary className="cursor-pointer font-serif text-lg font-semibold text-[#24354c]">
          Full Consultation Interpretation
        </summary>

        <div className="mt-4 space-y-4 text-sm leading-6 text-[#776d61]">
          <div>
            <p className="font-semibold text-[#24354c]">
              {result.concernInterpretation.title}
            </p>

            <p className="mt-2">
              {
                result.concernInterpretation
                  .suitabilityDiscussion
              }
            </p>

            <p className="mt-2">
              {
                result.concernInterpretation
                  .personalityConnection
              }
            </p>

            <p className="mt-2">
              {
                result.concernInterpretation
                  .improvementDirection
              }
            </p>

            <p className="mt-2 text-xs">
              {result.concernInterpretation.limitation}
            </p>
          </div>

          {result.relevantQualities.map((quality) => (
            <div
              key={quality.qualityId}
              className="border-t pt-3"
            >
              <p className="font-semibold text-[#24354c]">
                {quality.title}
              </p>

              <p className="mt-1">
                {quality.interpretation}
              </p>

              {quality.evidence.map(
                (evidence, index) => (
                  <p
                    key={index}
                    className="mt-2 text-xs"
                  >
                    {evidence.description}
                  </p>
                )
              )}
            </div>
          ))}

          {result.behaviouralDevelopment.map(
            (item) => (
              <div
                key={item.id}
                className="border-t pt-3"
              >
                <p className="font-semibold text-[#24354c]">
                  {item.title}
                </p>

                <p className="mt-1">
                  {item.possiblePattern}
                </p>

                <p className="mt-2">
                  <b>Improvement:</b>{' '}
                  {item.practicalImprovement}
                </p>
              </div>
            )
          )}

          {result.warnings.map(
            (warning, index) => (
              <p
                key={index}
                className="border-t pt-2 text-xs"
              >
                {warning}
              </p>
            )
          )}
        </div>
      </details>

      {result.scope.requiresLifePathGuidance && (
        <Panel title="Jeevan Sutra Premium Life Path Guidance">
          <p>{result.scope.suggestedResponse}</p>
        </Panel>
      )}
    </div>
  )
}

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
  const isFirstConsultation =
    consultationNumber === 1

  const [introStep, setIntroStep] = useState(0)
  const [introRevealed, setIntroRevealed] =
    useState(false)

  const [introAnswer, setIntroAnswer] =
    useState('')
  const [introObservation, setIntroObservation] =
    useState('')

  const [introResponses, setIntroResponses] =
    useState<IntroductionResponse[]>([])

  const [choice, setChoice] = useState('')
  const [answer, setAnswer] = useState('')
  const [observation, setObservation] =
    useState('')

  const [answers, setAnswers] =
    useState<RecordedAnswer[]>([])

  const [clarificationNeeded, setClarificationNeeded] =
    useState(false)

  const [
    clarificationReviewed,
    setClarificationReviewed,
  ] = useState(false)

  const [data, setData] =
    useState<Data | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  const [saveError, setSaveError] =
    useState('')

  const [showDeepAnalysis, setShowDeepAnalysis] =
    useState(false)

  const introductionComplete =
    !isFirstConsultation ||
    introStep >= introduction.length

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

        if (
          response.error ||
          !response.result
        ) {
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
            'Incomplete consultation intelligence.'
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
          setError(
            'Unable to load numerology.'
          )
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

  const primaryTopic =
    topics[0] || null

  const concern = lastAnswer(answers, [
    'TODAY_NOTE_EXPLORATION',
    'PRIMARY_CONCERN_EXPLORATION',
  ])

  const clarification = lastAnswer(answers, [
    'CONCERN_CLARIFICATION',
  ])

  const actualConcern =
    concern || note.trim()

  const universal = useMemo(
    () =>
      data && actualConcern
        ? buildUniversalNumerologyIntelligence({
            topic:
              normalizeTopic(primaryTopic),
            clientConcern:
              actualConcern,
            clarification,
            calculation:
              data.calculation,
            conclusions:
              data.intelligence.conclusions,
          })
        : null,
    [
      data,
      primaryTopic,
      actualConcern,
      clarification,
    ]
  )

  const familiarity =
    decision.questionKey ===
    'NUMEROLOGY_FAMILIARITY'

  const clarificationPending =
    clarificationNeeded &&
    !clarification

  const ready =
    decision.stage === 'READY_FOR_V3' ||
    !decision.shouldAskQuestion

  const showQuestion =
    introductionComplete &&
    (
      clarificationPending ||
      (
        !ready &&
        decision.shouldAskQuestion
      )
    )

  const canContinue =
    !saving &&
    (
      clarificationPending
        ? Boolean(answer.trim())
        : familiarity
          ? Boolean(choice)
          : Boolean(answer.trim())
    )

  const hasConcernAnswer =
    answers.some(
      (item) =>
        item.questionKey ===
          'TODAY_NOTE_EXPLORATION' ||
        item.questionKey ===
          'PRIMARY_CONCERN_EXPLORATION'
    )

  const showOutcome =
    introductionComplete &&
    Boolean(actualConcern) &&
    (hasConcernAnswer || ready) &&
    !clarificationPending

  const currentQuestionText =
    clarificationPending
      ? 'Could you explain your concern in more detail? What is happening, and what would you most like to improve?'
      : decision.questionText

  async function persistAnswer(
    questionText: string,
    clientAnswer: string
  ) {
    const response =
      await saveConsultationAnswer({
        consultationId,
        clientId: client.id,
        questionText,
        clientAnswer,
      })

    if (
      response.error ||
      !response.result
    ) {
      throw new Error(
        response.error ||
          'Unable to save the client response.'
      )
    }

    return response.result.id
  }

  async function continueIntroduction() {
    if (saving) return

    if (!introRevealed) {
      if (!currentIntro) return

      setSaving(true)
      setSaveError('')

      try {
        let savedId: string | null = null

        if (introAnswer.trim()) {
          savedId = await persistAnswer(
            currentIntro.question,
            introAnswer.trim()
          )
        }

        setIntroResponses((previous) => [
          ...previous,
          {
            question: currentIntro.question,
            clientAnswer:
              introAnswer.trim(),
            practitionerObservation:
              introObservation.trim(),
            savedId,
          },
        ])

        setIntroRevealed(true)
      } catch (caught) {
        setSaveError(
          caught instanceof Error
            ? caught.message
            : 'Unable to save introduction response.'
        )
      } finally {
        setSaving(false)
      }

      return
    }

    setIntroStep(
      (previous) => previous + 1
    )

    setIntroRevealed(false)
    setIntroAnswer('')
    setIntroObservation('')
    setSaveError('')
  }

  async function continueQuestion() {
    if (saving) return

    const isClarification =
      clarificationPending

    if (
      !isClarification &&
      (
        !decision.shouldAskQuestion ||
        !decision.questionKey ||
        !decision.questionText
      )
    ) {
      return
    }

    const response =
      isClarification
        ? answer.trim()
        : familiarity
          ? answer.trim()
            ? `${choice}. ${answer.trim()}`
            : choice
          : answer.trim()

    if (!response) return

    const questionKey =
      isClarification
        ? 'CONCERN_CLARIFICATION'
        : decision.questionKey!

    const questionText =
      currentQuestionText ||
      'Consultation Question'

    setSaving(true)
    setSaveError('')

    try {
      const savedId =
        await persistAnswer(
          questionText,
          response
        )

      setAnswers((previous) => [
        ...previous,
        {
          questionKey,
          questionText,
          clientAnswer: response,
          observation:
            observation.trim(),
          savedId,
        },
      ])

      if (isClarification) {
        setClarificationNeeded(false)
      }

      setChoice('')
      setAnswer('')
      setObservation('')
    } catch (caught) {
      setSaveError(
        caught instanceof Error
          ? caught.message
          : 'Unable to save client response.'
      )
    } finally {
      setSaving(false)
    }
  }

  function reviewClarification(
    needed: boolean
  ) {
    if (saving) return

    setClarificationNeeded(needed)
    setClarificationReviewed(true)
    setChoice('')
    setAnswer('')
    setObservation('')
    setSaveError('')
  }

  const currentIntro =
    introStep < introduction.length
      ? introduction[introStep]
      : null

  return (
    <div className="min-h-full bg-[#f7f3ed] p-4">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="mb-4 flex items-center gap-2 text-xs text-[#9a7b4f] disabled:opacity-50"
        >
          <ArrowLeft className="size-4" />
          Context Check
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <header className="bg-[#24354c] p-5 text-white">
            <p className="text-[10px] uppercase tracking-widest text-[#d6b47b]">
              Jeevan Sutra · Live Consultation
            </p>

            <h1 className="mt-2 font-serif text-2xl font-semibold">
              {client.name}
            </h1>

            <p className="mt-1 text-xs text-gray-300">
              {client.clientNumber ||
                'Jeevan Sutra Client'}
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

            <p className="mt-4 text-[10px] text-[#d6b47b]">
              By Shekhar Sales Corporation
            </p>
          </header>

          <main className="p-5">
            {saveError && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <p className="font-semibold">
                  Response not saved
                </p>
                <p className="mt-1">
                  {saveError}
                </p>
                <p className="mt-2 text-xs">
                  Your current text remains on screen.
                  Please retry.
                </p>
              </div>
            )}

            {!introductionComplete &&
              currentIntro && (
                <>
                  <SectionHeading
                    small={`First Consultation · Introduction ${
                      introStep + 1
                    } of ${introduction.length}`}
                    big={currentIntro.title}
                  />

                  <Panel title="Ask the Client">
                    <p className="text-base font-semibold text-[#24354c]">
                      {currentIntro.question}
                    </p>

                    <p className="mt-2 text-xs text-[#ad7b40]">
                      Ask naturally and pause
                      for the response.
                    </p>

                    {!introRevealed && (
                      <>
                        <label className="mt-4 block text-xs font-semibold text-[#24354c]">
                          Client&apos;s Answer
                        </label>

                        <textarea
                          value={introAnswer}
                          onChange={(event) =>
                            setIntroAnswer(
                              event.target.value
                            )
                          }
                          disabled={saving}
                          rows={2}
                          placeholder="Optional — record the client's answer..."
                          className="mt-2 w-full rounded-xl border p-3 text-sm"
                        />

                        <label className="mt-3 block text-xs font-semibold text-[#24354c]">
                          Practitioner Observation
                        </label>

                        <textarea
                          value={introObservation}
                          onChange={(event) =>
                            setIntroObservation(
                              event.target.value
                            )
                          }
                          disabled={saving}
                          rows={2}
                          placeholder="Optional — your observation..."
                          className="mt-2 w-full rounded-xl border p-3 text-sm"
                        />
                      </>
                    )}
                  </Panel>

                  {introRevealed && (
                    <Panel title="Explain the Traditional Connection">
                      <p>
                        {currentIntro.explanation}
                      </p>
                    </Panel>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      void continueIntroduction()
                    }
                    disabled={saving}
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#24354c] p-3 font-semibold text-white disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Saving Response...
                      </>
                    ) : (
                      <>
                        {introRevealed
                          ? introStep ===
                            introduction.length - 1
                            ? 'Continue to Personal Numerology'
                            : 'Next Introduction Question'
                          : 'Show Explanation'}

                        <ChevronRight className="ml-2 size-4" />
                      </>
                    )}
                  </button>
                </>
              )}

            {introductionComplete && (
              <>
                {isFirstConsultation && (
                  <Panel title="From Bharatiya Parampara to Personal Guidance">
                    <p>
                      In our Indian spiritual traditions,
                      Grahas are associated with qualities
                      and phases of human life.
                    </p>

                    <p className="mt-3">
                      <b>
                        Numerology — Ank Shastra
                      </b>{' '}
                      traditionally explores personality,
                      nature, strengths and development
                      through birth numbers, name numbers,
                      Lo Shu and Graha associations.
                    </p>

                    <p className="mt-3">
                      <b>
                        Astrology — Jyotish Shastra
                      </b>{' '}
                      traditionally interprets life periods
                      and circumstances through birth time,
                      place, Kundli, Graha placements
                      and Dasha.
                    </p>

                    <p className="mt-3 font-semibold text-[#24354c]">
                      Numerology helps us explore
                      who you are. Astrology helps
                      us interpret the timing of
                      different phases of your life.
                    </p>

                    <p className="mt-3 text-[#ad7b40]">
                      Now let us explore
                      your personal numbers.
                    </p>
                  </Panel>
                )}

                {note.trim() && (
                  <Panel title="Today's Note">
                    <p className="whitespace-pre-wrap">
                      {note}
                    </p>
                  </Panel>
                )}

                <SectionHeading
                  small="Personal Numerology"
                  big="Client at a Glance"
                />

                {loading && (
                  <p className="flex items-center gap-2 text-sm">
                    <Loader2 className="size-4 animate-spin" />
                    Preparing verified numerology...
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

                <SectionHeading
                  small="Live Consultation"
                  big="Client Conversation"
                />

                {isFirstConsultation &&
                  introResponses.length > 0 && (
                    <details className="mb-4 rounded-xl border border-[#e6ddd1] p-3">
                      <summary className="cursor-pointer font-semibold text-[#24354c]">
                        Introduction Responses
                      </summary>

                      <div className="mt-3 space-y-3">
                        {introResponses.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="rounded-xl bg-[#fbf8f3] p-3 text-sm"
                            >
                              <p className="font-semibold text-[#24354c]">
                                {item.question}
                              </p>

                              <p className="mt-2">
                                <b>Client:</b>{' '}
                                {item.clientAnswer ||
                                  'Not recorded'}
                              </p>

                              <p className="mt-2">
                                <b>Practitioner:</b>{' '}
                                {item.practitionerObservation ||
                                  'Not recorded'}
                              </p>

                              <p className="mt-2 text-xs text-[#587054]">
                                {item.savedId
                                  ? 'Client answer saved'
                                  : 'No client answer entered'}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </details>
                  )}

                <div className="space-y-3">
                  {answers.map(
                    (item, index) => (
                      <div
                        key={item.savedId}
                        className="rounded-xl bg-[#fbf8f3] p-4"
                      >
                        <p className="text-xs font-semibold text-[#ad7b40]">
                          Question {index + 1}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#24354c]">
                          {item.questionText}
                        </p>

                        <p className="mt-3 whitespace-pre-wrap text-sm text-[#776d61]">
                          <b>Client:</b>{' '}
                          {item.clientAnswer}
                        </p>

                        {item.observation && (
                          <p className="mt-3 whitespace-pre-wrap border-t pt-2 text-xs text-[#776d61]">
                            <b>
                              Practitioner Observation:
                            </b>{' '}
                            {item.observation}
                          </p>
                        )}

                        <p className="mt-2 flex items-center gap-1 text-xs text-[#587054]">
                          <Check className="size-3" />
                          Client answer saved
                        </p>
                      </div>
                    )
                  )}
                </div>

                {showQuestion && (
                  <Panel title="Current Question">
                    <p className="font-semibold text-[#24354c]">
                      {currentQuestionText}
                    </p>

                    {familiarity &&
                      !clarificationPending && (
                        <div className="mt-4 grid gap-2">
                          {familiarityOptions.map(
                            (option) => (
                              <button
                                key={option}
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                  setChoice(option)
                                }
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
                            )
                          )}
                        </div>
                      )}

                    <label className="mt-4 block text-xs font-semibold text-[#24354c]">
                      Client&apos;s Answer
                    </label>

                    <textarea
                      value={answer}
                      onChange={(event) =>
                        setAnswer(
                          event.target.value
                        )
                      }
                      disabled={saving}
                      rows={3}
                      placeholder={
                        familiarity &&
                        !clarificationPending
                          ? 'Optional client comments...'
                          : "Type the client's response..."
                      }
                      className="mt-2 w-full rounded-xl border p-3 text-sm"
                    />

                    <label className="mt-3 block text-xs font-semibold text-[#24354c]">
                      Practitioner Observation
                    </label>

                    <textarea
                      value={observation}
                      onChange={(event) =>
                        setObservation(
                          event.target.value
                        )
                      }
                      disabled={saving}
                      rows={2}
                      placeholder="Optional — record your observation separately..."
                      className="mt-2 w-full rounded-xl border p-3 text-sm"
                    />

                    <button
                      type="button"
                      disabled={!canContinue}
                      onClick={() =>
                        void continueQuestion()
                      }
                      className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#24354c] p-3 font-semibold text-white disabled:opacity-40"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Saving Response...
                        </>
                      ) : (
                        <>
                          Save & Continue
                          <ChevronRight className="ml-2 size-4" />
                        </>
                      )}
                    </button>
                  </Panel>
                )}

                {ready &&
                  !clarificationPending &&
                  !clarificationReviewed &&
                  Boolean(actualConcern) && (
                    <Panel title="Is Further Clarification Needed?">
                      <p>
                        Review the client's concern
                        before finalising the
                        personalised discussion.
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            reviewClarification(true)
                          }
                          className="rounded-xl bg-[#24354c] p-3 font-semibold text-white"
                        >
                          Ask Clarification
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            reviewClarification(false)
                          }
                          className="rounded-xl border p-3 font-semibold text-[#24354c]"
                        >
                          Continue Without Clarification
                        </button>
                      </div>
                    </Panel>
                  )}

                {showOutcome && (
                  <>
                    <SectionHeading
                      small="Jeevan Sutra Consultation"
                      big={`${topicName(
                        primaryTopic
                      )} Guidance`}
                    />

                    <Panel title="Client's Discussion">
                      <p className="font-semibold text-[#ad7b40]">
                        Selected Topic
                      </p>

                      <p>
                        {topicName(primaryTopic)}
                      </p>

                      <p className="mt-3 font-semibold text-[#ad7b40]">
                        Main Concern
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

                    {!loading &&
                      !error &&
                      universal && (
                        <LiveGuidance
                          result={universal}
                        />
                      )}
                  </>
                )}

                {!loading &&
                  !error &&
                  data && (
                    <>
                      <SectionHeading
                        small="Supporting Intelligence"
                        big="V3 Numerology Evidence"
                      />

                      <details className="rounded-2xl border border-[#e6ddd1] bg-white p-4">
                        <summary className="cursor-pointer font-semibold text-[#24354c]">
                          View Topic-Specific V3 Findings
                        </summary>

                        <div className="mt-4">
                          {selection &&
                          selection.insights.length > 0 ? (
                            <ConsultationV3Insights
                              insights={selection.insights.map(
                                (item) =>
                                  item.insight
                              )}
                              evidence={
                                data.intelligence.evidence
                              }
                            />
                          ) : (
                            <p className="text-sm text-[#776d61]">
                              No eligible topic-specific
                              V3 findings are currently
                              available.
                            </p>
                          )}

                          {selection?.warnings.map(
                            (warning, index) => (
                              <p
                                key={index}
                                className="mt-3 text-xs text-[#8a8177]"
                              >
                                {warning}
                              </p>
                            )
                          )}
                        </div>
                      </details>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setShowDeepAnalysis(
                              (previous) =>
                                !previous
                            )
                          }
                          className="flex w-full items-center justify-between rounded-xl border border-[#e6ddd1] bg-white p-4 text-left font-semibold text-[#24354c]"
                        >
                          Complete Numerology Intelligence

                          <span className="text-xs text-[#ad7b40]">
                            {showDeepAnalysis
                              ? 'Hide'
                              : 'Show'}
                          </span>
                        </button>

                        {showDeepAnalysis && (
                          <div className="mt-4">
                            <ConsultationCompleteIntelligence
                              conclusions={
                                data.intelligence
                                  .conclusions
                                  .conclusions
                              }
                              developmentAssessments={
                                data.intelligence
                                  .conclusions
                                  .developmentAssessments
                              }
                              crossQualityResolutions={
                                data.intelligence
                                  .crossQuality
                                  .resolutions
                              }
                            />
                          </div>
                        )}
                      </div>

                      {data.consultationInsightPool
                        .warnings.length > 0 && (
                        <details className="mt-4 rounded-xl border border-[#e6ddd1] p-3">
                          <summary className="cursor-pointer text-sm font-semibold text-[#24354c]">
                            Intelligence Notes
                          </summary>

                          <div className="mt-3 space-y-2 text-xs text-[#776d61]">
                            {data.consultationInsightPool.warnings.map(
                              (
                                warning,
                                index
                              ) => (
                                <p key={index}>
                                  {warning}
                                </p>
                              )
                            )}
                          </div>
                        </details>
                      )}
                    </>
                  )}

                <p className="mt-6 text-xs leading-5 text-[#8a8177]">
                  Jeevan Sutra uses traditional
                  Indian numerology as an
                  interpretive guidance framework.
                  Practitioner observations and
                  client statements are distinct
                  from calculated numerology data.
                  Outcomes are not guaranteed.
                </p>

                <p className="mt-2 text-xs leading-5 text-[#8a8177]">
                  Client answers entered and
                  successfully saved during this
                  consultation are stored in
                  Supabase. Practitioner observations
                  currently remain on this screen
                  only. Previously saved answers
                  are not yet reloaded when
                  reopening a consultation.
                </p>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}