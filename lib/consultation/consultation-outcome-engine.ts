import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

import type {
  ConclusionEngineResult,
  IntelligenceDomain,
  InferenceRestriction,
  ResolvedConclusion,
} from '@/lib/numerology-intelligence/types'

import type {
  ConsultationPurpose,
  ConsultationTopic,
} from '@/components/consultation-workspace'

import {
  selectConsultationIntelligence,
} from '@/lib/consultation/consultation-intelligence-selector'

import type {
  ConsultationAnswerForIntelligence,
} from '@/lib/consultation/question-intelligence'

export const CONSULTATION_OUTCOME_VERSION =
  'TSIA_CONSULTATION_OUTCOME_1.2' as const

export type OutcomeFinding = {
  id: string
  title: string
  statement: string
  strength: string
  evidenceIds: readonly string[]
  matchedDomains: readonly IntelligenceDomain[]
  relevance: 'PRIMARY' | 'SECONDARY'
  developmentSignificance: string
  restrictions: readonly InferenceRestriction[]
}

export type GeneralOutcomeObservation = {
  id: string
  title: string
  statement: string
  evidenceIds: readonly string[]
}

export type ConsultationSituation = {
  currentSituation: string
  desiredOutcome: string
  unresolvedConcern: string
  interpretationFocus: string
  confidence: 'EXPLICIT' | 'CONTEXTUAL' | 'UNDETERMINED'
}

export type ConsultationOutcome = {
  version: typeof CONSULTATION_OUTCOME_VERSION

  primaryTopic: ConsultationTopic | null
  secondaryTopics: readonly ConsultationTopic[]

  clientConcern: string
  clarification: string

  status: 'INITIAL' | 'REFINED'

  summary: string

  situation: ConsultationSituation

  strengths: readonly OutcomeFinding[]
  developmentAreas: readonly OutcomeFinding[]

  generalObservations:
    readonly GeneralOutcomeObservation[]

  practitionerGuidance: readonly string[]

  nextQuestion: string

  warnings: readonly string[]
}

export type ConsultationOutcomeInput = {
  purpose: ConsultationPurpose
  topics: readonly ConsultationTopic[]
  todayNote: string

  answers:
    readonly ConsultationAnswerForIntelligence[]

  insights: readonly EmployeeInsight[]

  conclusions: ConclusionEngineResult
}

function latestAnswer(
  answers: readonly ConsultationAnswerForIntelligence[],
  keys: readonly string[]
): string {
  for (
    let index = answers.length - 1;
    index >= 0;
    index--
  ) {
    const answer = answers[index]

    if (
      keys.includes(answer.questionKey) &&
      answer.clientAnswer.trim()
    ) {
      return answer.clientAnswer.trim()
    }
  }

  return ''
}

function normalizeText(
  value: string
): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
}

function containsAny(
  value: string,
  phrases: readonly string[]
): boolean {
  const normalized = value.toLowerCase()

  return phrases.some(
    (phrase) =>
      normalized.includes(
        phrase.toLowerCase()
      )
  )
}

/*
 * CLIENT SITUATION CLASSIFICATION
 *
 * This module interprets client
 * statements only.
 *
 * It does not create numerological
 * evidence or alter V3 findings.
 *
 * Classifications are intentionally
 * conservative.
 */
function analyzeClientSituation(
  concern: string,
  clarification: string,
  primaryTopic: ConsultationTopic | null
): ConsultationSituation {
  const combined = normalizeText(
    [concern, clarification]
      .filter(Boolean)
      .join(' ')
  )

  if (!combined) {
    return {
      currentSituation:
        'The client has not yet described their current situation.',

      desiredOutcome:
        'The desired outcome has not yet been established.',

      unresolvedConcern:
        'The practitioner should first understand the client’s main concern.',

      interpretationFocus:
        'Clarify the client’s situation before offering personalized guidance.',

      confidence: 'UNDETERMINED',
    }
  }

  /*
   * CAREER — WORK VS RECOGNITION
   */
  if (
    primaryTopic === 'career' &&
    containsAny(combined, [
      'actor',
      'acting',
      'producer',
      'film',
      'movie',
      'cinema',
      'audition',
    ])
  ) {
    const hasWork = containsAny(
      combined,
      [
        'getting work',
        'getting lot of work',
        'getting a lot of work',
        'getting plenty of work',
        'getting projects',
        'working regularly',
        'many projects',
        'lot of work',
        'lots of work',
      ]
    )

    const wantsRecognition =
      containsAny(combined, [
        'big hit',
        'breakthrough',
        'recognition',
        'fame',
        'success',
        'hit film',
        'hit movie',
        'big break',
      ])

    if (
      hasWork &&
      wantsRecognition
    ) {
      return {
        currentSituation:
          'The client reports receiving professional work or opportunities in the entertainment industry.',

        desiredOutcome:
          'The client is seeking a larger breakthrough, recognition, or a more significant professional achievement.',

        unresolvedConcern:
          'The main concern appears to be the gap between ongoing opportunities and the level of recognition or success the client hopes to achieve.',

        interpretationFocus:
          'Explore professional positioning, the quality of opportunities, creative choices, visibility, and the distinction between consistent work and major recognition.',

        confidence: 'EXPLICIT',
      }
    }

    if (wantsRecognition) {
      return {
        currentSituation:
          'The client is involved in or pursuing work in the entertainment industry.',

        desiredOutcome:
          'The client wants stronger professional recognition or a significant breakthrough.',

        unresolvedConcern:
          'The present level of professional progress needs further clarification.',

        interpretationFocus:
          'Understand whether the client needs more opportunities, stronger positioning, or greater recognition from existing work.',

        confidence: 'CONTEXTUAL',
      }
    }
  }

  /*
   * BUSINESS — ACTIVITY VS GROWTH
   */
  if (
    primaryTopic === 'business'
  ) {
    const existingBusiness =
      containsAny(combined, [
        'my business',
        'running business',
        'running a business',
        'existing business',
        'getting orders',
        'have clients',
        'getting clients',
      ])

    const wantsGrowth =
      containsAny(combined, [
        'expand',
        'expansion',
        'grow',
        'growth',
        'scale',
        'bigger',
        'more profit',
        'more customers',
      ])

    if (
      existingBusiness &&
      wantsGrowth
    ) {
      return {
        currentSituation:
          'The client describes an existing business or ongoing commercial activity.',

        desiredOutcome:
          'The client is seeking business expansion, stronger performance, or greater commercial progress.',

        unresolvedConcern:
          'The gap between present business activity and the desired level of growth needs to be explored.',

        interpretationFocus:
          'Discuss operational capacity, market positioning, customer acquisition, decision-making, and realistic expansion priorities.',

        confidence: 'CONTEXTUAL',
      }
    }
  }

  /*
   * MONEY — CURRENT POSITION VS GOAL
   */
  if (
    primaryTopic === 'money'
  ) {
    const financialPressure =
      containsAny(combined, [
        'debt',
        'loan',
        'loss',
        'losses',
        'financial pressure',
        'cash flow',
        'cashflow',
        'shortage',
      ])

    if (financialPressure) {
      return {
        currentSituation:
          'The client reports a financial concern or pressure.',

        desiredOutcome:
          'The client appears to want greater financial stability or improvement.',

        unresolvedConcern:
          'The immediate financial priority and its practical causes need clarification.',

        interpretationFocus:
          'Understand financial obligations, cash-flow priorities, available options, and the decisions currently within the client’s control.',

        confidence: 'CONTEXTUAL',
      }
    }
  }

  /*
   * GENERAL CONSERVATIVE FALLBACK
   *
   * Do not invent specific circumstances.
   */
  return {
    currentSituation:
      `The client reports: "${combined}"`,

    desiredOutcome:
      'The client’s desired achievement should be confirmed directly.',

    unresolvedConcern:
      'The practitioner should identify the difference between the current situation and the outcome the client wants.',

    interpretationFocus:
      'Clarify what is already working, what remains difficult, and which practical decision matters most.',

    confidence: 'UNDETERMINED',
  }
}

function findConclusion(
  insight: EmployeeInsight,
  conclusions: ConclusionEngineResult
): ResolvedConclusion | null {
  if (
    insight.source !==
    'CORE_CONCLUSION'
  ) {
    return null
  }

  const conclusionId =
    insight.id.startsWith('EMP_')
      ? insight.id.slice(4)
      : insight.id

  return (
    conclusions.conclusions.find(
      (item) =>
        item.id === conclusionId
    ) || null
  )
}

function toOutcomeFinding(
  insight: EmployeeInsight,
  conclusion: ResolvedConclusion,
  relevance: 'PRIMARY' | 'SECONDARY',
  matchedDomains: readonly IntelligenceDomain[]
): OutcomeFinding {
  return {
    id: conclusion.id,

    title: insight.title,

    statement:
      conclusion.statement,

    strength:
      conclusion.strength,

    evidenceIds:
      conclusion.supportingEvidenceIds,

    matchedDomains,

    relevance,

    developmentSignificance:
      conclusion.developmentSignificance,

    restrictions:
      conclusion.restrictions,
  }
}

function isSupportedStrength(
  strength: string
): boolean {
  return (
    strength === 'PRIMARY_FINDING' ||
    strength === 'STRONGLY_SUPPORTED' ||
    strength === 'SUPPORTED'
  )
}

function hasDevelopmentSignificance(
  significance: string
): boolean {
  return (
    significance === 'HIGH' ||
    significance === 'ELEVATED'
  )
}

/*
 * CONTEXT-SPECIFIC NEXT QUESTION
 *
 * Uses client discussion context,
 * not unsupported predictions.
 */
function buildNextQuestion(
  primaryTopic: ConsultationTopic | null,
  situation: ConsultationSituation
): string {
  if (
    primaryTopic === 'career'
  ) {
    if (
      situation.confidence === 'EXPLICIT' &&
      situation.desiredOutcome.includes(
        'breakthrough'
      )
    ) {
      return 'Are you primarily seeking recognition as an actor, commercial success as a producer, or both?'
    }

    return 'Which matters most at this stage: receiving more opportunities, improving the quality of work, or achieving greater recognition?'
  }

  if (
    primaryTopic === 'business'
  ) {
    return 'Is your main priority increasing revenue, improving profitability, expanding operations, or entering a new market?'
  }

  if (
    primaryTopic === 'money'
  ) {
    return 'Is your immediate priority reducing financial pressure, increasing income, managing existing commitments, or planning long-term wealth?'
  }

  if (
    primaryTopic === 'family'
  ) {
    return 'What would you most like to improve in your family situation: communication, understanding, responsibilities, or emotional connection?'
  }

  if (
    primaryTopic === 'relationship'
  ) {
    return 'What is the most important change you would like to see in this relationship?'
  }

  if (
    primaryTopic === 'marriage'
  ) {
    return 'Is your main concern finding a suitable partner, understanding an existing relationship, or improving communication and expectations?'
  }

  if (
    primaryTopic === 'personal_direction'
  ) {
    return 'Which decision or personal goal feels most important to you right now?'
  }

  return 'What specific outcome would make this consultation most useful to you?'
}

/*
 * PRACTITIONER GUIDANCE
 *
 * Separate:
 *
 * 1. Client-reported circumstances
 * 2. Verified V3 observations
 * 3. Practical discussion direction
 *
 * No client statement is treated
 * as numerological evidence.
 */
function buildPractitionerGuidance(
  situation: ConsultationSituation,
  strengths: readonly OutcomeFinding[],
  developmentAreas: readonly OutcomeFinding[]
): readonly string[] {
  const guidance: string[] = []

  guidance.push(
    `Current situation: ${situation.currentSituation}`
  )

  guidance.push(
    `Desired direction: ${situation.desiredOutcome}`
  )

  guidance.push(
    `Main discussion focus: ${situation.unresolvedConcern}`
  )

  if (
    strengths.length > 0
  ) {
    const firstStrength =
      strengths[0]

    guidance.push(
      `Verified numerological strength: ${firstStrength.title}. ${firstStrength.statement}`
    )
  } else {
    guidance.push(
      'No directly supported topic-specific V3 strength is available. Do not interpret general numerological observations as a proven explanation of the client’s situation.'
    )
  }

  if (
    developmentAreas.length > 0
  ) {
    const firstArea =
      developmentAreas[0]

    guidance.push(
      `Development consideration: ${firstArea.title}. ${firstArea.statement}`
    )
  }

  guidance.push(
    `Practical exploration: ${situation.interpretationFocus}`
  )

  guidance.push(
    'Confirm the interpretation with the client. Their answers may improve practical guidance but must not change the approved numerological findings.'
  )

  guidance.push(
    'Do not promise a specific career breakthrough, financial result, relationship outcome, or event timing without a separately approved and appropriately supported methodology.'
  )

  return guidance
}

/*
 * MAIN CONSULTATION OUTCOME ENGINE
 */
export function buildConsultationOutcome(
  input: ConsultationOutcomeInput
): ConsultationOutcome {
  const primaryTopic =
    input.topics[0] || null

  const secondaryTopics =
    input.topics.slice(1)

  const concernAnswer =
    latestAnswer(
      input.answers,
      [
        'TODAY_NOTE_EXPLORATION',
        'PRIMARY_CONCERN_EXPLORATION',
      ]
    )

  const clientConcern =
    concernAnswer ||
    input.todayNote.trim()

  const clarification =
    latestAnswer(
      input.answers,
      [
        'CONCERN_CLARIFICATION',
      ]
    )

  const situation =
    analyzeClientSituation(
      clientConcern,
      clarification,
      primaryTopic
    )

  const selection =
    selectConsultationIntelligence({
      purpose: input.purpose,

      topics: input.topics,

      insights: input.insights,

      conclusions:
        input.conclusions,

      limit:
        input.insights.length,
    })

  const relevantFindings:
    OutcomeFinding[] = []

  const generalObservations:
    GeneralOutcomeObservation[] = []

  for (
    const selected of
    selection.insights
  ) {
    const insight =
      selected.insight

    const conclusion =
      findConclusion(
        insight,
        input.conclusions
      )

    if (!conclusion) {
      continue
    }

    if (
      selected.relevanceLevel ===
      'GENERAL'
    ) {
      generalObservations.push({
        id: conclusion.id,

        title: insight.title,

        statement:
          conclusion.statement,

        evidenceIds:
          conclusion.supportingEvidenceIds,
      })

      continue
    }

    relevantFindings.push(
      toOutcomeFinding(
        insight,
        conclusion,

        selected.relevanceLevel ===
          'PRIMARY'
          ? 'PRIMARY'
          : 'SECONDARY',

        selected.matchedDomains
      )
    )
  }

  const strengths =
    relevantFindings
      .filter(
        (finding) =>
          isSupportedStrength(
            finding.strength
          )
      )
      .slice(0, 5)

  const developmentAreas =
    relevantFindings
      .filter(
        (finding) =>
          hasDevelopmentSignificance(
            finding.developmentSignificance
          )
      )
      .slice(0, 5)

  const practitionerGuidance =
    buildPractitionerGuidance(
      situation,
      strengths,
      developmentAreas
    )

  const nextQuestion =
    buildNextQuestion(
      primaryTopic,
      situation
    )

  const warnings: string[] = [
    ...selection.warnings,
  ]

  if (!clientConcern) {
    warnings.push(
      'Client concern is not yet recorded.'
    )
  }

  if (
    relevantFindings.length === 0
  ) {
    warnings.push(
      'No verified V3 conclusion directly matches the selected consultation topic. General findings must not be presented as topic-specific conclusions.'
    )
  }

  const summary =
    relevantFindings.length > 0
      ? 'The consultation combines the client’s stated situation with approved topic-relevant V3 findings and practical discussion guidance.'
      : 'The consultation has identified the client’s discussion context. No directly matching V3 conclusion is available, so practical guidance remains separate from numerological interpretation.'

  return {
    version:
      CONSULTATION_OUTCOME_VERSION,

    primaryTopic,
    secondaryTopics,

    clientConcern,
    clarification,

    status:
      clarification
        ? 'REFINED'
        : 'INITIAL',

    summary,

    situation,

    strengths,
    developmentAreas,

    generalObservations,

    practitionerGuidance,

    nextQuestion,

    warnings,
  }
}