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
import {
  getConsultationAnswers,
  saveConsultationAnswer,
} from '@/app/actions/consultations'

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
  important: boolean
}

type IntroductionResponse = {
  question: string
  clientAnswer: string
  practitionerObservation: string
  savedId: string | null
  important: boolean
}

type SavedResponse = {
  id: string
  questionText: string
  clientAnswer: string
  employeeObservation: string
  importantForNextConsultation: boolean
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

const clarificationQuestion =
  'Could you explain your concern in more detail? What is happening, and what would you most like to improve?'

const INTRO_PROGRESS_MARKER =
  '[Jeevan Sutra: introduction completed without recorded response]'

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
  keys: readonly string[]
) {
  return (
    [...answers]
      .reverse()
      .find((item) => keys.includes(item.questionKey))
      ?.clientAnswer.trim() || ''
  )
}

function normalizeQuestion(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase()
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

          <p><b>Mental row:</b> 4-9-2</p>
          <p><b>Emotional/Will row:</b> 3-5-7</p>
          <p><b>Practical/Material row:</b> 8-1-6</p>
          <p><b>Columns:</b> 4-3-8, 9-5-1, 2-7-6</p>
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
  const actions = result.behaviouralDevelopment.slice(0, 3)

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
          <p>No eligible personality insight is available.</p>
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
            <p>No approved development action is available.</p>
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
              {result.concernInterpretation.suitabilityDiscussion}
            </p>
            <p className="mt-2">
              {result.concernInterpretation.personalityConnection}
            </p>
            <p className="mt-2">
              {result.concernInterpretation.improvementDirection}
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
              {quality.evidence.map((evidence, index) => (
                <p key={index} className="mt-2 text-xs">
                  {evidence.description}
                </p>
              ))}
            </div>
          ))}

          {result.behaviouralDevelopment.map((item) => (
            <div key={item.id} className="border-t pt-3">
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
          ))}

          {result.warnings.map((warning, index) => (
            <p
              key={index}
              className="border-t pt-2 text-xs"
            >
              {warning}
            </p>
          ))}
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
  const [introImportant, setIntroImportant] =
    useState(false)

  const [introResponses, setIntroResponses] =
    useState<IntroductionResponse[]>([])

  const [choice, setChoice] = useState('')
  const [answer, setAnswer] = useState('')
  const [observation, setObservation] =
    useState('')
  const [importantForNext, setImportantForNext] =
    useState(false)

  const [answers, setAnswers] =
    useState<RecordedAnswer[]>([])

  const [unmappedAnswers, setUnmappedAnswers] =
    useState<SavedResponse[]>([])

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
  const [restoring, setRestoring] =
    useState(true)
  const [restoreError, setRestoreError] =
    useState('')
  const [restoreAttempt, setRestoreAttempt] =
    useState(0)

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

  useEffect(() => {
    let active = true

    async function restore() {
      setRestoring(true)
      setRestoreError('')
      setSaveError('')
      setAnswers([])
      setUnmappedAnswers([])
      setIntroResponses([])
      setIntroStep(0)
      setIntroRevealed(false)
      setClarificationNeeded(false)
      setClarificationReviewed(false)

      try {
        const response =
          await getConsultationAnswers({
            consultationId,
            clientId: client.id,
          })

        if (!active) return

        if (response.error || !response.result) {
          setRestoreError(
            response.error ||
              'Unable to restore consultation history.'
          )
          return
        }

        const introductions: IntroductionResponse[] = []
        const remaining: SavedResponse[] = []

        for (const item of response.result) {
          const matched = introduction.find(
            (question) =>
              normalizeQuestion(question.question) ===
              normalizeQuestion(item.questionText)
          )

          if (matched) {
            const progressOnly =
              item.employeeObservation ===
              INTRO_PROGRESS_MARKER

            introductions.push({
              question: matched.question,
              clientAnswer: item.clientAnswer,
              practitionerObservation: progressOnly
                ? ''
                : item.employeeObservation,
              savedId: item.id,
              important:
                item.importantForNextConsultation,
            })
          } else {
            remaining.push({
              id: item.id,
              questionText: item.questionText,
              clientAnswer: item.clientAnswer,
              employeeObservation:
                item.employeeObservation,
              importantForNextConsultation:
                item.importantForNextConsultation,
            })
          }
        }

        const restored: RecordedAnswer[] = []
        const unknown: SavedResponse[] = []

        for (const item of remaining) {
          let questionKey: string | null = null

          if (
            normalizeQuestion(item.questionText) ===
            normalizeQuestion(clarificationQuestion)
          ) {
            questionKey = 'CONCERN_CLARIFICATION'
          } else {
            const next = decideNextQuestion({
              consultationNumber,
              purpose,
              topics,
              todayNote: note,
              currentAnswers: restored,
              clarificationNeeded: false,
            })

            if (
              next.shouldAskQuestion &&
              normalizeQuestion(next.questionText) ===
                normalizeQuestion(item.questionText)
            ) {
              questionKey = next.questionKey
            }
          }

          if (questionKey) {
            restored.push({
              questionKey,
              questionText: item.questionText,
              clientAnswer: item.clientAnswer,
              observation: item.employeeObservation,
              savedId: item.id,
              important:
                item.importantForNextConsultation,
            })
          } else {
            unknown.push(item)
          }
        }

        setIntroResponses(introductions)
        setAnswers(restored)
        setUnmappedAnswers(unknown)

        if (isFirstConsultation) {
          let completed = 0

          for (const question of introduction) {
            if (
              introductions.some(
                (item) =>
                  item.question === question.question
              )
            ) {
              completed += 1
            } else {
              break
            }
          }

          if (completed > 0) {
            setIntroStep(completed - 1)
            setIntroRevealed(true)
          } else {
            setIntroStep(0)
            setIntroRevealed(false)
          }
        }

        if (
          restored.some(
            (item) =>
              item.questionKey ===
              'CONCERN_CLARIFICATION'
          )
        ) {
          setClarificationReviewed(true)
          setClarificationNeeded(false)
        }
      } catch {
        if (active) {
          setRestoreError(
            'Unable to restore consultation history.'
          )
        }
      } finally {
        if (active) setRestoring(false)
      }
    }

    void restore()

    return () => {
      active = false
    }
  }, [
    consultationId,
    client.id,
    consultationNumber,
    isFirstConsultation,
    purpose,
    topics,
    note,
    restoreAttempt,
  ])

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
    [
      data,
      actualConcern,
      clarification,
      primaryTopic,
    ]
  )

  const familiarity =
    decision.questionKey ===
    'NUMEROLOGY_FAMILIARITY'

  const clarificationPending =
    clarificationNeeded && !clarification

  const ready =
    decision.stage === 'READY_FOR_V3' ||
    !decision.shouldAskQuestion

  const showQuestion =
    introductionComplete &&
    (clarificationPending ||
      (!ready && decision.shouldAskQuestion))

  const hasConcernAnswer = answers.some(
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
    !clarificationPending &&
    clarificationReviewed

  const currentQuestionText =
    clarificationPending
      ? clarificationQuestion
      : decision.questionText

  const canContinue =
    !saving &&
    !restoring &&
    !restoreError &&
    (clarificationPending
      ? Boolean(answer.trim())
      : familiarity
        ? Boolean(choice)
        : Boolean(answer.trim()))

  async function persistAnswer(
    questionText: string,
    clientAnswer: string,
    employeeObservation: string,
    important: boolean
  ) {
    const response =
      await saveConsultationAnswer({
        consultationId,
        clientId: client.id,
        questionText,
        clientAnswer,
        employeeObservation,
        importantForNextConsultation: important,
      })

    if (response.error || !response.result) {
      throw new Error(
        response.error ||
          'Unable to save consultation response.'
      )
    }

    return response.result.id
  }

  async function continueIntroduction() {
    if (saving || restoring || restoreError) return

    if (introRevealed) {
      setIntroStep((previous) => previous + 1)
      setIntroRevealed(false)
      setIntroAnswer('')
      setIntroObservation('')
      setIntroImportant(false)
      return
    }

    const current = introduction[introStep]
    if (!current) return

    setSaving(true)
    setSaveError('')

    try {
      const clientAnswer = introAnswer.trim()
      const practitionerObservation =
        introObservation.trim()

      const savedId = await persistAnswer(
        current.question,
        clientAnswer,
        practitionerObservation ||
          (!clientAnswer
            ? INTRO_PROGRESS_MARKER
            : ''),
        introImportant
      )

      setIntroResponses((previous) => [
        ...previous,
        {
          question: current.question,
          clientAnswer,
          practitionerObservation,
          savedId,
          important: introImportant,
        },
      ])

      setIntroRevealed(true)
      setIntroAnswer('')
      setIntroObservation('')
      setIntroImportant(false)
    } catch (caught) {
      setSaveError(
        caught instanceof Error
          ? caught.message
          : 'Unable to save introduction response.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function continueQuestion() {
    if (!canContinue) return

    const questionText = currentQuestionText

    const clientAnswer = clarificationPending
      ? answer.trim()
      : familiarity
        ? answer.trim()
          ? `${choice}. ${answer.trim()}`
          : choice
        : answer.trim()

    setSaving(true)
    setSaveError('')

    try {
      const savedId = await persistAnswer(
        questionText,
        clientAnswer,
        observation.trim(),
        importantForNext
      )

      const questionKey = clarificationPending
        ? 'CONCERN_CLARIFICATION'
        : decision.questionKey

      setAnswers((previous) => [
        ...previous,
        {
          questionKey,
          questionText,
          clientAnswer,
          observation: observation.trim(),
          savedId,
          important: importantForNext,
        },
      ])

      setChoice('')
      setAnswer('')
      setObservation('')
      setImportantForNext(false)

      if (clarificationPending) {
        setClarificationNeeded(false)
        setClarificationReviewed(true)
      } else {
        setClarificationReviewed(false)
      }
    } catch (caught) {
      setSaveError(
        caught instanceof Error
          ? caught.message
          : 'Unable to save consultation answer.'
      )
    } finally {
      setSaving(false)
    }
  }

  function reviewClarification(needed: boolean) {
    setClarificationNeeded(needed)
    setClarificationReviewed(!needed)
    setAnswer('')
    setObservation('')
    setChoice('')
    setImportantForNext(false)
    setSaveError('')
  }

  const currentIntro =
    introductionComplete
      ? null
      : introduction[introStep]
  const currentIntro =
    introductionComplete
      ? null
      : introduction[introStep]