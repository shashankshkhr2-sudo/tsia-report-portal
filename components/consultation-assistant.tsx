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
import { decideNextQuestion } from '@/lib/consultation/question-intelligence'
import { selectConsultationIntelligence } from '@/lib/consultation/consultation-intelligence-selector'
import { buildUniversalNumerologyIntelligence } from '@/lib/consultation/universal-numerology-intelligence'

import {
  CONSULTATION_LANGUAGES,
  LANGUAGE_INFO,
  createConsultationLanguagePreferences,
  getConsultationContent,
  getTypingInputProps,
  updateConsultationLanguage,
  updateTypingLanguage,
  updateVoiceLanguage,
} from '@/lib/consultation/localization'

import type {
  ConsultationLanguage,
  ConsultationLanguagePreferences,
  ConsultationContentKey,
} from '@/lib/consultation/localization'

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

type RecordedAnswer =
  ConsultationAnswerForIntelligence & {
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

/*
 * Canonical question text is deliberately retained.
 *
 * Existing consultation records use questionText to
 * identify previously saved answers. Changing these
 * strings would break history matching.
 *
 * Native-language text is used only for display.
 */
const introduction = [
  {
    id: 'INTRO_WEEKDAYS',
    title: 'Seven Days and the Grahas',
    question:
      'Have you ever thought about why we have seven days in a week?',
    explanation:
      'In Bharatiya Jyotish, the seven weekdays are traditionally associated with seven Grahas: Surya, Chandra, Mangal, Budh, Guru, Shukra and Shani. We know them through Ravivar, Somvar, Mangalvar, Budhvar, Guruvar, Shukravar and Shanivar. Rahu and Ketu are also part of the Navagraha system, but they are lunar nodes and do not have separate weekdays.',
  },
  {
    id: 'INTRO_NAVAGRAHA',
    title: 'Nine Numbers and Navagraha',
    question:
      'Have you ever wondered why Indian numerology uses nine basic numbers?',
    explanation:
      'Indian Ank Shastra traditionally associates the numbers 1 to 9 with the Navagrahas. Number 1 represents Surya, 2 Chandra, 3 Guru, 4 Rahu, 5 Budh, 6 Shukra, 7 Ketu, 8 Shani and 9 Mangal. This is the traditional connection between Ank Shastra, Navagraha and Jyotish Shastra.',
  },
  {
    id: 'INTRO_TIME',
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

const languageNames: Record<ConsultationLanguage, string> = {
  hi: 'हिन्दी',
  en: 'English',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
}

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
          )} · ${grahaNames[calculation.mulank.final] || ''}`}
        />
        <Info
          title="Bhagyank"
          value={`${numberText(
            calculation.bhagyank.compound,
            calculation.bhagyank.final
          )} · ${grahaNames[calculation.bhagyank.final] || ''}`}
        />
        <Info
          title="Name Number"
          value={`${numberText(
            calculation.nameNumber.compoundTotal,
            calculation.nameNumber.finalNumber
          )} · ${
            grahaNames[calculation.nameNumber.finalNumber] || ''
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
            {calculation.loShu.presentNumbers.join(', ') || 'None'}
          </p>
          <p>
            <b>Missing:</b>{' '}
            {calculation.loShu.missingNumbers.join(', ') || 'None'}
          </p>
          <p><b>Repeated:</b> {repeats || 'None'}</p>
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
                <p className="mt-2">{item.interpretation}</p>
                <p className="mt-2 text-xs text-[#ad7b40]">
                  {item.verificationStatus === 'V3_SUPPORTED'
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
            <div key={quality.qualityId} className="border-t pt-3">
              <p className="font-semibold text-[#24354c]">
                {quality.title}
              </p>
              <p className="mt-1">{quality.interpretation}</p>
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
              <p className="mt-1">{item.possiblePattern}</p>
              <p className="mt-2">
                <b>Improvement:</b> {item.practicalImprovement}
              </p>
            </div>
          ))}

          {result.warnings.map((warning, index) => (
            <p key={index} className="border-t pt-2 text-xs">
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

function LanguageSelector({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: ConsultationLanguage
  onChange: (value: ConsultationLanguage) => void
  disabled: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[#24354c]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as ConsultationLanguage)
        }
        disabled={disabled}
        className="w-full rounded-xl border border-[#e6ddd1] bg-[#fffdf9] px-3 py-3 text-sm font-semibold text-[#24354c] outline-none focus:border-[#ad7b40] disabled:opacity-50"
      >
        {CONSULTATION_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {languageNames[language]}
          </option>
        ))}
      </select>
    </label>
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
  const isFirstConsultation = consultationNumber === 1

  const [languagePreferences, setLanguagePreferences] =
    useState<ConsultationLanguagePreferences>(() =>
      createConsultationLanguagePreferences('en')
    )

  const consultationLanguage =
    languagePreferences.consultationLanguage

  const typingLanguage =
    languagePreferences.typingLanguage

  const voiceLanguage =
    languagePreferences.voiceLanguage

  const typingProps = getTypingInputProps(typingLanguage)

  const [introStep, setIntroStep] = useState(0)
  const [introRevealed, setIntroRevealed] = useState(false)
  const [introAnswer, setIntroAnswer] = useState('')
  const [introObservation, setIntroObservation] = useState('')
  const [introImportant, setIntroImportant] = useState(false)
  const [introResponses, setIntroResponses] =
    useState<IntroductionResponse[]>([])

  const [choice, setChoice] = useState('')
  const [answer, setAnswer] = useState('')
  const [observation, setObservation] = useState('')
  const [importantForNext, setImportantForNext] = useState(false)

  const [answers, setAnswers] = useState<RecordedAnswer[]>([])
  const [unmappedAnswers, setUnmappedAnswers] =
    useState<SavedResponse[]>([])

  const [clarificationNeeded, setClarificationNeeded] =
    useState(false)
  const [clarificationReviewed, setClarificationReviewed] =
    useState(false)

  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState(true)
  const [restoreError, setRestoreError] = useState('')
  const [restoreAttempt, setRestoreAttempt] = useState(0)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [showDeepAnalysis, setShowDeepAnalysis] = useState(false)

  const introductionComplete =
    !isFirstConsultation ||
    introStep >= introduction.length

  const topicsKey = topics.join('|')

  const stableTopics = useMemo(
    () => topicsKey.split('|').filter(Boolean) as ConsultationTopic[],
    [topicsKey]
  )

  const currentIntro = introductionComplete
    ? null
    : introduction[introStep]

  const nativeIntroduction = currentIntro
    ? getConsultationContent(
        consultationLanguage,
        currentIntro.id as ConsultationContentKey
      )
    : null

  const nativeClarification = getConsultationContent(
    consultationLanguage,
    'CLARIFY_CONCERN'
  )

  const currentIntroductionAvailable =
    !currentIntro || nativeIntroduction !== null

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      setData(null)

      try {
        const response = await generateNumerologyV2(client.id)

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
          !Array.isArray(result.consultationInsightPool.insights)
        ) {
          setError('Incomplete consultation intelligence.')
          return
        }

        setData({
          calculation: result.calculation,
          intelligence: result.intelligence,
          consultationInsightPool: result.consultationInsightPool,
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
      setIntroAnswer('')
      setIntroObservation('')
      setIntroImportant(false)
      setAnswer('')
      setObservation('')
      setChoice('')
      setImportantForNext(false)
      setClarificationNeeded(false)
      setClarificationReviewed(false)

      try {
        const response = await getConsultationAnswers({
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
              item.employeeObservation === INTRO_PROGRESS_MARKER

            introductions.push({
              question: matched.question,
              clientAnswer: item.clientAnswer,
              practitionerObservation: progressOnly
                ? ''
                : item.employeeObservation,
              savedId: item.id,
              important: item.importantForNextConsultation,
            })
          } else {
            remaining.push({
              id: item.id,
              questionText: item.questionText,
              clientAnswer: item.clientAnswer,
              employeeObservation: item.employeeObservation,
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
              topics: stableTopics,
              todayNote: note,
              currentAnswers: restored,
              clarificationNeeded: false,
            })

            if (
              next.shouldAskQuestion &&
              next.questionKey &&
              next.questionText !== null &&
              normalizeQuestion(next.questionText) ===
                normalizeQuestion(item.questionText)
            ) {
              questionKey = next.questionKey
            }
          }

          if (questionKey !== null) {
            restored.push({
              questionKey,
              questionText: item.questionText,
              clientAnswer: item.clientAnswer,
              observation: item.employeeObservation,
              savedId: item.id,
              important: item.importantForNextConsultation,
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
                (item) => item.question === question.question
              )
            ) {
              completed += 1
            } else {
              break
            }
          }

          setIntroStep(completed)
          setIntroRevealed(false)
        }

        if (
          restored.some(
            (item) =>
              item.questionKey === 'CONCERN_CLARIFICATION'
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
    stableTopics,
    note,
    restoreAttempt,
  ])

  const decision = useMemo(
    () =>
      decideNextQuestion({
        consultationNumber,
        purpose,
        topics: stableTopics,
        todayNote: note,
        currentAnswers: answers,
        clarificationNeeded,
      }),
    [
      consultationNumber,
      purpose,
      stableTopics,
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
            topics: stableTopics,
            insights: data.consultationInsightPool.insights,
            conclusions: data.intelligence.conclusions,
            limit: 5,
          })
        : null,
    [data, purpose, stableTopics]
  )

  const primaryTopic = stableTopics[0] || null

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
            conclusions: data.intelligence.conclusions,
          })
        : null,
    [data, actualConcern, clarification, primaryTopic]
  )

  const familiarity =
    decision.questionKey === 'NUMEROLOGY_FAMILIARITY'

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
      item.questionKey === 'TODAY_NOTE_EXPLORATION' ||
      item.questionKey === 'PRIMARY_CONCERN_EXPLORATION'
  )

  const showOutcome =
    introductionComplete &&
    Boolean(actualConcern) &&
    (hasConcernAnswer || ready) &&
    !clarificationPending &&
    clarificationReviewed

  /*
   * Canonical text is used for persistence.
   * Display text is selected independently.
   */
  const canonicalQuestionText = clarificationPending
    ? clarificationQuestion
    : decision.questionText

  const displayQuestionText = clarificationPending
    ? nativeClarification?.question || null
    : consultationLanguage === 'en'
      ? decision.questionText
      : null

  const dynamicQuestionUnavailable =
    showQuestion &&
    !clarificationPending &&
    consultationLanguage !== 'en'

  const canContinue =
    !saving &&
    !restoring &&
    !restoreError &&
    Boolean(canonicalQuestionText?.trim()) &&
    Boolean(displayQuestionText?.trim()) &&
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
    const response = await saveConsultationAnswer({
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
    if (
      saving ||
      restoring ||
      restoreError ||
      !currentIntroductionAvailable
    ) {
      return
    }

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

    const alreadySaved = introResponses.some(
      (item) => item.question === current.question
    )

    if (alreadySaved) {
      setIntroRevealed(true)
      return
    }

    setSaving(true)
    setSaveError('')

    try {
      const clientAnswer = introAnswer
      const practitionerObservation = introObservation

      const savedId = await persistAnswer(
        current.question,
        clientAnswer,
        practitionerObservation.trim()
          ? practitionerObservation
          : !clientAnswer.trim()
            ? INTRO_PROGRESS_MARKER
            : '',
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

    const questionKey = clarificationPending
      ? 'CONCERN_CLARIFICATION'
      : decision.questionKey

    if (!questionKey) {
      setSaveError(
        'Unable to identify the consultation question.'
      )
      return
    }

    const questionText = canonicalQuestionText

    if (!questionText || !questionText.trim()) {
      setSaveError('Consultation question is missing.')
      return
    }

    const clientAnswer = clarificationPending
      ? answer
      : familiarity
        ? answer.trim()
          ? `${choice}. ${answer}`
          : choice
        : answer

    const employeeObservation = observation

    setSaving(true)
    setSaveError('')

    try {
      const savedId = await persistAnswer(
        questionText,
        clientAnswer,
        employeeObservation,
        importantForNext
      )

      setAnswers((previous) => [
        ...previous,
        {
          questionKey,
          questionText,
          clientAnswer,
          observation: employeeObservation,
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

  function displaySavedIntroQuestion(question: string) {
    const matched = introduction.find(
      (item) =>
        normalizeQuestion(item.question) ===
        normalizeQuestion(question)
    )

    if (!matched) return question

    return (
      getConsultationContent(
        consultationLanguage,
        matched.id as ConsultationContentKey
      )?.question || 'Localized question unavailable'
    )
  }

  function displaySavedQuestion(item: RecordedAnswer) {
    if (item.questionKey === 'CONCERN_CLARIFICATION') {
      return (
        nativeClarification?.question ||
        'Localized question unavailable'
      )
    }

    return item.questionText
  }

  return (
    <div className="min-h-full bg-[#f7f3ed] p-4">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#24354c] disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Consultation Workspace
        </button>

        <div className="overflow-hidden rounded-3xl border border-[#e6ddd1] bg-[#fffdf9] shadow-sm">
          <header className="bg-[#24354c] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e2c18c]">
              Jeevan Sutra
            </p>

            <h1 className="mt-2 font-serif text-2xl font-semibold">
              Live Consultation
            </h1>

            <p className="mt-1 text-xs text-[#e2c18c]">
              By Shekhar Sales Corporation
            </p>

            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="text-lg font-semibold">
                {client.name}
              </p>

              <p className="mt-1 text-xs text-white/80">
                Consultation #{consultationNumber}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                  {topicName(String(purpose))}
                </span>

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                  {String(mode).replace(/_/g, ' ')}
                </span>

                {stableTopics.map((topic) => (
                  <span
                    key={String(topic)}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs"
                  >
                    {topicName(String(topic))}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6">
            <section className="rounded-2xl border border-[#e6ddd1] bg-white p-4">
              <h2 className="font-serif text-lg font-semibold text-[#24354c]">
                Consultation Language Settings
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#776d61]">
                Consultation content, typing preference and
                voice preference are independent.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <LanguageSelector
                  label="Consultation Language"
                  value={consultationLanguage}
                  disabled={saving}
                  onChange={(language) =>
                    setLanguagePreferences((previous) =>
                      updateConsultationLanguage(previous, language)
                    )
                  }
                />

                <LanguageSelector
                  label="Typing Language"
                  value={typingLanguage}
                  disabled={saving}
                  onChange={(language) =>
                    setLanguagePreferences((previous) =>
                      updateTypingLanguage(previous, language)
                    )
                  }
                />

                <LanguageSelector
                  label="Voice Language"
                  value={voiceLanguage}
                  disabled={saving}
                  onChange={(language) =>
                    setLanguagePreferences((previous) =>
                      updateVoiceLanguage(previous, language)
                    )
                  }
                />
              </div>

              <p className="mt-3 text-xs text-[#776d61]">
                Typing locale: {LANGUAGE_INFO[typingLanguage].locale}
                {' · '}
                Voice locale: {LANGUAGE_INFO[voiceLanguage].speechLocale}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#776d61]">
                Typing language does not automatically change
                your phone keyboard. Voice recording and
                transcription are not yet enabled.
              </p>
            </section>

            {saveError && (
              <div
                role="alert"
                className="mb-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {saveError}
              </div>
            )}

            {restoring && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f8f4ed] p-4 text-sm text-[#24354c]">
                <Loader2 className="h-5 w-5 animate-spin" />
                Restoring saved consultation history...
              </div>
            )}

            {!restoring && restoreError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  Consultation history could not be loaded.
                </p>

                <p className="mt-2 text-sm text-red-700">
                  {restoreError}
                </p>

                <p className="mt-2 text-xs text-red-700">
                  New answers are disabled to prevent
                  duplicate or inconsistent records.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setRestoreAttempt((previous) => previous + 1)
                  }
                  className="mt-4 rounded-xl bg-[#24354c] px-4 py-3 text-sm font-semibold text-white"
                >
                  Retry Loading History
                </button>
              </div>
            )}

            {!restoring && !restoreError && (
              <>
                {!introductionComplete && currentIntro && (
                  <>
                    <SectionHeading
                      small={`Introduction ${introStep + 1} of ${introduction.length}`}
                      big="Understanding Our Indian Traditions"
                    />

                    {!nativeIntroduction ? (
                      <Panel title="Language Content Unavailable">
                        <p role="alert">
                          The native content for this introduction
                          is missing in the selected language.
                          Please complete the language resource
                          before continuing.
                        </p>
                      </Panel>
                    ) : (
                      <Panel title={nativeIntroduction.title}>
                        <p
                          lang={LANGUAGE_INFO[consultationLanguage].locale}
                          className="text-base font-semibold leading-7 text-[#24354c]"
                        >
                          {nativeIntroduction.question}
                        </p>

                        {!introRevealed && (
                          <div className="mt-5 space-y-4">
                            <div>
                              <label className="mb-2 block text-xs font-semibold text-[#24354c]">
                                Client Response (Optional)
                              </label>

                              <textarea
                                {...typingProps}
                                value={introAnswer}
                                onChange={(event) =>
                                  setIntroAnswer(event.target.value)
                                }
                                disabled={saving}
                                rows={3}
                                placeholder="Enter what the client says..."
                                className="w-full rounded-xl border border-[#e6ddd1] bg-[#fffdf9] p-3 text-sm text-[#24354c] outline-none focus:border-[#ad7b40]"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-semibold text-[#24354c]">
                                Practitioner Observation (Optional)
                              </label>

                              <textarea
                                {...typingProps}
                                value={introObservation}
                                onChange={(event) =>
                                  setIntroObservation(event.target.value)
                                }
                                disabled={saving}
                                rows={3}
                                placeholder="Record your observation..."
                                className="w-full rounded-xl border border-[#e6ddd1] bg-[#fffdf9] p-3 text-sm text-[#24354c] outline-none focus:border-[#ad7b40]"
                              />
                            </div>

                            <label className="flex items-center gap-3 rounded-xl bg-[#f8f4ed] p-3 text-sm font-medium text-[#24354c]">
                              <input
                                type="checkbox"
                                checked={introImportant}
                                onChange={(event) =>
                                  setIntroImportant(event.target.checked)
                                }
                                disabled={saving}
                                className="h-4 w-4 accent-[#24354c]"
                              />
                              Important for Next Consultation
                            </label>
                          </div>
                        )}

                        {introRevealed && (
                          <div className="mt-5 rounded-xl border border-[#e6ddd1] bg-[#f8f4ed] p-4">
                            <p className="text-xs font-semibold uppercase text-[#ad7b40]">
                              Practitioner Explanation
                            </p>

                            <p
                              lang={LANGUAGE_INFO[consultationLanguage].locale}
                              className="mt-3 leading-7 text-[#24354c]"
                            >
                              {nativeIntroduction.explanation}
                            </p>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            void continueIntroduction()
                          }}
                          disabled={saving}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#24354c] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : introRevealed ? (
                            <>
                              {introStep === introduction.length - 1
                                ? 'Continue to Consultation'
                                : 'Next Introduction Question'}
                              <ChevronRight className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Save & Show Explanation
                              <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </Panel>
                    )}
                  </>
                )}

                {introductionComplete && isFirstConsultation && (
                  <Panel title="Introduction Completed">
                    <div className="flex items-center gap-2 text-[#24354c]">
                      <Check className="h-5 w-5 text-green-700" />
                      <p>
                        The three introductory questions have
                        been completed.
                      </p>
                    </div>

                    <p className="mt-2">
                      Continue with the client's personal
                      numerology and consultation concerns.
                    </p>
                  </Panel>
                )}

                {note.trim() && (
                  <Panel title="Today's Consultation Note">
                    <p className="whitespace-pre-wrap">{note}</p>
                  </Panel>
                )}

                <SectionHeading
                  small="Numerology Foundation"
                  big="Personal Numerology"
                />

                {loading && (
                  <Panel title="Loading Calculations">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading numerology and intelligence...
                    </div>
                  </Panel>
                )}

                {!loading && error && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                {!loading && data && (
                  <Panel title="Verified Numerology Calculation">
                    <CalculationDisplay calculation={data.calculation} />
                  </Panel>
                )}

                {introResponses.length > 0 && (
                  <details className="mt-5 rounded-2xl border border-[#e6ddd1] bg-white p-4">
                    <summary className="cursor-pointer font-semibold text-[#24354c]">
                      Saved Introduction Responses (
                      {introResponses.length})
                    </summary>

                    <div className="mt-4 space-y-3">
                      {introResponses.map((item, index) => (
                        <div
                          key={`${item.question}-${index}`}
                          className="rounded-xl bg-[#f8f4ed] p-3 text-sm"
                        >
                          <p className="font-semibold text-[#24354c]">
                            {displaySavedIntroQuestion(item.question)}
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-[#776d61]">
                            <b>Client:</b>{' '}
                            {item.clientAnswer || 'No response recorded'}
                          </p>

                          {item.practitionerObservation && (
                            <p className="mt-2 whitespace-pre-wrap text-[#776d61]">
                              <b>Practitioner:</b>{' '}
                              {item.practitionerObservation}
                            </p>
                          )}

                          {item.important && (
                            <p className="mt-2 text-xs font-semibold text-[#ad7b40]">
                              Important for Next Consultation
                            </p>
                          )}

                          {item.savedId && (
                            <p className="mt-2 flex items-center gap-1 text-xs text-green-700">
                              <Check className="h-3 w-3" />
                              Saved
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {introductionComplete && (
                  <>
                    <SectionHeading
                      small="Practitioner Conversation"
                      big="Client Discussion"
                    />

                    {answers.length > 0 && (
                      <div className="space-y-3">
                        {answers.map((item, index) => (
                          <div
                            key={item.savedId || index}
                            className="rounded-2xl border border-[#e6ddd1] bg-white p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-semibold text-[#24354c]">
                                {index + 1}. {displaySavedQuestion(item)}
                              </p>
                              <Check className="h-4 w-4 shrink-0 text-green-700" />
                            </div>

                            <p className="mt-3 whitespace-pre-wrap text-sm text-[#776d61]">
                              <b>Client Answer:</b> {item.clientAnswer}
                            </p>

                            {item.observation && (
                              <p className="mt-3 whitespace-pre-wrap text-sm text-[#776d61]">
                                <b>Practitioner Observation:</b>{' '}
                                {item.observation}
                              </p>
                            )}

                            {item.important && (
                              <p className="mt-3 text-xs font-semibold text-[#ad7b40]">
                                Important for Next Consultation
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {unmappedAnswers.length > 0 && (
                      <details className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-[#24354c]">
                          Additional Saved History (
                          {unmappedAnswers.length})
                        </summary>

                        <p className="mt-3 text-xs text-[#776d61]">
                          These responses were recovered from the
                          database, but their question identifiers
                          could not be verified. They have not
                          been used to infer the client's concern.
                        </p>

                        <div className="mt-3 space-y-3">
                          {unmappedAnswers.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-xl bg-white p-3 text-sm"
                            >
                              <p className="font-semibold text-[#24354c]">
                                {item.questionText}
                              </p>

                              <p className="mt-2 whitespace-pre-wrap">
                                <b>Client:</b>{' '}
                                {item.clientAnswer || 'No response'}
                              </p>

                              {item.employeeObservation && (
                                <p className="mt-2 whitespace-pre-wrap">
                                  <b>Practitioner:</b>{' '}
                                  {item.employeeObservation}
                                </p>
                              )}

                              {item.importantForNextConsultation && (
                                <p className="mt-2 text-xs font-semibold text-[#ad7b40]">
                                  Important for Next Consultation
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    {showQuestion && (
                      <Panel
                        title={
                          clarificationPending
                            ? 'Clarify the Client Concern'
                            : 'Next Consultation Question'
                        }
                      >
                        {dynamicQuestionUnavailable ? (
                          <div
                            role="alert"
                            className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-[#776d61]"
                          >
                            <p className="font-semibold text-[#24354c]">
                              Native question content not yet available
                            </p>
                            <p className="mt-2">
                              This guided question is not yet
                              authored in the selected consultation
                              language. Choose English to continue
                              this question. Your saved responses
                              will not be changed.
                            </p>
                          </div>
                        ) : !displayQuestionText ? (
                          <p role="alert">
                            The selected language question is
                            unavailable. Saving is disabled.
                          </p>
                        ) : (
                          <>
                            <p
                              lang={LANGUAGE_INFO[consultationLanguage].locale}
                              className="text-base font-semibold leading-7 text-[#24354c]"
                            >
                              {displayQuestionText}
                            </p>

                            {clarificationPending &&
                              nativeClarification && (
                                <p
                                  lang={LANGUAGE_INFO[consultationLanguage].locale}
                                  className="mt-3 text-sm leading-6 text-[#776d61]"
                                >
                                  {nativeClarification.explanation}
                                </p>
                              )}

                            {familiarity && !clarificationPending && (
                              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {familiarityOptions.map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => setChoice(option)}
                                    disabled={saving}
                                    className={`rounded-xl border p-3 text-left text-sm font-semibold ${
                                      choice === option
                                        ? 'border-[#ad7b40] bg-[#f5ead8] text-[#24354c]'
                                        : 'border-[#e6ddd1] bg-white text-[#776d61]'
                                    }`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="mt-4">
                              <label className="mb-2 block text-xs font-semibold text-[#24354c]">
                                {familiarity && !clarificationPending
                                  ? 'Additional Client Response (Optional)'
                                  : 'Client Answer'}
                              </label>

                              <textarea
                                {...typingProps}
                                value={answer}
                                onChange={(event) =>
                                  setAnswer(event.target.value)
                                }
                                disabled={saving}
                                rows={4}
                                placeholder="Record the client's answer..."
                                className="w-full rounded-xl border border-[#e6ddd1] bg-[#fffdf9] p-3 text-sm text-[#24354c] outline-none focus:border-[#ad7b40]"
                              />
                            </div>

                            <div className="mt-4">
                              <label className="mb-2 block text-xs font-semibold text-[#24354c]">
                                Practitioner Observation (Optional)
                              </label>

                              <textarea
                                {...typingProps}
                                value={observation}
                                onChange={(event) =>
                                  setObservation(event.target.value)
                                }
                                disabled={saving}
                                rows={3}
                                placeholder="Your interpretation, observations, or follow-up notes..."
                                className="w-full rounded-xl border border-[#e6ddd1] bg-[#fffdf9] p-3 text-sm text-[#24354c] outline-none focus:border-[#ad7b40]"
                              />
                            </div>

                            <label className="mt-4 flex items-center gap-3 rounded-xl bg-[#f8f4ed] p-3 text-sm font-medium text-[#24354c]">
                              <input
                                type="checkbox"
                                checked={importantForNext}
                                onChange={(event) =>
                                  setImportantForNext(event.target.checked)
                                }
                                disabled={saving}
                                className="h-4 w-4 accent-[#24354c]"
                              />
                              Important for Next Consultation
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                void continueQuestion()
                              }}
                              disabled={!canContinue}
                              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#24354c] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  Save & Continue
                                  <ChevronRight className="h-4 w-4" />
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </Panel>
                    )}

                    {!showQuestion &&
                      !clarificationReviewed &&
                      !clarificationPending &&
                      (hasConcernAnswer || ready) && (
                        <Panel title="Confirm Client Concern">
                          <p>
                            Before presenting the guidance,
                            confirm whether the client has
                            explained the concern sufficiently.
                          </p>

                          {actualConcern && (
                            <div className="mt-3 rounded-xl bg-[#f8f4ed] p-3">
                              <p className="text-xs font-semibold text-[#ad7b40]">
                                Current Understanding
                              </p>
                              <p className="mt-2 whitespace-pre-wrap text-[#24354c]">
                                {actualConcern}
                              </p>
                            </div>
                          )}

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() =>
                                reviewClarification(true)
                              }
                              className="rounded-xl border border-[#24354c] px-4 py-3 text-sm font-semibold text-[#24354c]"
                            >
                              Ask Clarification
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                reviewClarification(false)
                              }
                              className="rounded-xl bg-[#24354c] px-4 py-3 text-sm font-semibold text-white"
                            >
                              Continue Without Clarification
                            </button>
                          </div>
                        </Panel>
                      )}

                    {showOutcome && (
                      <>
                        <SectionHeading
                          small="Client-Specific Guidance"
                          big="Consultation Intelligence"
                        />

                        {actualConcern && (
                          <Panel title="Client's Main Concern">
                            <p className="whitespace-pre-wrap">
                              {actualConcern}
                            </p>

                            {clarification && (
                              <div className="mt-3 border-t border-[#e6ddd1] pt-3">
                                <p className="font-semibold text-[#24354c]">
                                  Additional Clarification
                                </p>
                                <p className="mt-2 whitespace-pre-wrap">
                                  {clarification}
                                </p>
                              </div>
                            )}
                          </Panel>
                        )}

                        {universal && (
                          <LiveGuidance result={universal} />
                        )}

                        {data && selection && (
                          <details className="mt-4 rounded-2xl border border-[#e6ddd1] bg-white p-4">
                            <summary className="cursor-pointer font-semibold text-[#24354c]">
                              Supporting V3 Consultation Evidence
                            </summary>

                            <div className="mt-4">
                              <ConsultationV3Insights
                                insights={selection.insights.map(
                                  (item) => item.insight
                                )}
                              />
                            </div>
                          </details>
                        )}

                        {data && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setShowDeepAnalysis(
                                  (previous) => !previous
                                )
                              }
                              className="mt-5 w-full rounded-xl border border-[#24354c] px-4 py-3 text-sm font-semibold text-[#24354c]"
                            >
                              {showDeepAnalysis
                                ? 'Hide Complete Intelligence'
                                : 'Show Complete Intelligence'}
                            </button>

                            {showDeepAnalysis && (
                              <div className="mt-4 space-y-4">
                                <Panel title="V3 Intelligence Engine">
                                  <p>
                                    Version:{' '}
                                    {data.intelligence.engineVersion}
                                  </p>
                                  <p className="mt-2">
                                    The sections below display the
                                    actual verified V3 engine output.
                                  </p>
                                </Panel>

                                <details className="rounded-2xl border border-[#e6ddd1] bg-white p-4">
                                  <summary className="cursor-pointer font-semibold text-[#24354c]">
                                    V3 Conclusions
                                  </summary>
                                  <pre className="mt-4 max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#f8f4ed] p-3 text-xs text-[#24354c]">
                                    {JSON.stringify(
                                      data.intelligence.conclusions,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </details>

                                <details className="rounded-2xl border border-[#e6ddd1] bg-white p-4">
                                  <summary className="cursor-pointer font-semibold text-[#24354c]">
                                    Cross-Quality Analysis
                                  </summary>
                                  <pre className="mt-4 max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#f8f4ed] p-3 text-xs text-[#24354c]">
                                    {JSON.stringify(
                                      data.intelligence.crossQuality,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </details>

                                <details className="rounded-2xl border border-[#e6ddd1] bg-white p-4">
                                  <summary className="cursor-pointer font-semibold text-[#24354c]">
                                    Intelligence Evidence
                                  </summary>
                                  <pre className="mt-4 max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#f8f4ed] p-3 text-xs text-[#24354c]">
                                    {JSON.stringify(
                                      data.intelligence.evidence,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </details>
                              </div>
                            )}
                          </>
                        )}

                        {data &&
                          data.consultationInsightPool.warnings.length >
                            0 && (
                            <details className="mt-4 rounded-xl border border-[#e6ddd1] bg-white p-4">
                              <summary className="cursor-pointer text-sm font-semibold text-[#24354c]">
                                Intelligence Notes
                              </summary>

                              <div className="mt-3 space-y-2">
                                {data.consultationInsightPool.warnings.map(
                                  (warning, index) => (
                                    <p
                                      key={index}
                                      className="text-xs leading-5 text-[#776d61]"
                                    >
                                      {warning}
                                    </p>
                                  )
                                )}
                              </div>
                            </details>
                          )}
                      </>
                    )}

                    {ready && !actualConcern && !showQuestion && (
                      <Panel title="Consultation Status">
                        <p>
                          The guided questions are complete.
                          Record the client's main concern
                          before generating personalized
                          concern-specific guidance.
                        </p>
                      </Panel>
                    )}
                  </>
                )}

                <div className="mt-8 border-t border-[#e6ddd1] pt-4">
                  <p className="text-xs leading-5 text-[#776d61]">
                    Jeevan Sutra provides traditional
                    numerology-based consultation guidance.
                    Interpretations should be discussed with
                    the client and should not be presented as
                    guaranteed outcomes.
                  </p>

                  <p className="mt-3 text-xs text-[#776d61]">
                    Client responses and practitioner
                    observations are saved to the consultation
                    record. Marked responses are identified for
                    future consultation review.
                  </p>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}