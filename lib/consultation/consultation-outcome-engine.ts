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
} from './consultation-intelligence-selector'

import type {
  ConsultationAnswerForIntelligence,
} from './question-intelligence'

/**
 * TSIA CONSULTATION OUTCOME ENGINE
 *
 * Version 1.1
 *
 * Development Rule 001:
 * SIMPLE • FAST • SAFE • RELIABLE
 *
 * Uses the existing approved V3
 * consultation selector.
 *
 * Does not modify V2 or V3.
 *
 * Client statements are context,
 * never numerological evidence.
 */

export const CONSULTATION_OUTCOME_VERSION =
  'TSIA_CONSULTATION_OUTCOME_1.1' as const

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

export type ConsultationOutcome = {
  version: typeof CONSULTATION_OUTCOME_VERSION

  primaryTopic: ConsultationTopic | null
  secondaryTopics: readonly ConsultationTopic[]

  clientConcern: string
  clarification: string

  status: 'INITIAL' | 'REFINED'

  summary: string

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

/**
 * Retrieve the latest non-empty
 * answer for one of the specified keys.
 *
 * Using the latest answer allows
 * the practitioner to revise an answer.
 */
function findAnswer(
  answers: readonly ConsultationAnswerForIntelligence[],
  keys: readonly string[]
): string {
  for (let index = answers.length - 1; index >= 0; index--) {
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

/**
 * Preserve traceability between
 * EmployeeInsight and approved
 * V3 ResolvedConclusion.
 */
function conclusionIdFromInsight(
  insight: EmployeeInsight
): string | null {
  if (insight.source !== 'CORE_CONCLUSION') {
    return null
  }

  return insight.id.startsWith('EMP_')
    ? insight.id.slice(4)
    : insight.id
}

/**
 * Topic-specific follow-up questions.
 *
 * These are safe initial prompts.
 * The future narrative layer may
 * refine them using client context.
 */
function nextQuestionForTopic(
  topic: ConsultationTopic | null
): string {
  switch (topic) {
    case 'career':
      return 'What specific professional achievement matters most to you right now, and what do you believe is holding it back?'

    case 'business':
      return 'Which business result is most important to you right now, and what difficulty are you facing in achieving it?'

    case 'money':
      return 'Is your main priority improving income, managing commitments, building savings, or making a financial decision?'

    case 'family':
      return 'Which family relationship or responsibility would you most like to discuss in greater detail?'

    case 'relationship':
      return 'What would you most like to improve in this relationship, and what has been difficult so far?'

    case 'marriage':
      return 'Is your main concern finding a partner, evaluating a relationship, or improving an existing marriage?'

    case 'personal_direction':
      return 'Which important decision or personal change would you most like clarity about?'

    default:
      return 'What specific outcome would make this consultation most useful to you?'
  }
}

/**
 * MAIN OUTCOME BUILDER
 */
export function buildConsultationOutcome(
  input: ConsultationOutcomeInput
): ConsultationOutcome {
  const clientConcern =
    findAnswer(
      input.answers,
      [
        'TODAY_NOTE_EXPLORATION',
        'PRIMARY_CONCERN_EXPLORATION',
      ]
    ) || input.todayNote.trim()

  const clarification =
    findAnswer(
      input.answers,
      ['CONCERN_CLARIFICATION']
    )

  /**
   * Reuse the existing approved
   * consultation selector.
   *
   * No duplicate topic mapping.
   */
  const selection =
    selectConsultationIntelligence({
      purpose: input.purpose,
      topics: input.topics,
      insights: input.insights,
      conclusions: input.conclusions,

      // Keep the complete eligible pool.
      limit: input.insights.length,
    })

  const conclusionMap =
    new Map<string, ResolvedConclusion>(
      input.conclusions.conclusions.map(
        (conclusion) => [
          conclusion.id,
          conclusion,
        ]
      )
    )

  const relevant: OutcomeFinding[] = []

  const generalObservations:
    GeneralOutcomeObservation[] = []

  for (const selected of selection.insights) {
    const insight = selected.insight

    const conclusionId =
      conclusionIdFromInsight(insight)

    if (!conclusionId) {
      continue
    }

    const conclusion =
      conclusionMap.get(conclusionId)

    if (!conclusion) {
      continue
    }

    if (selected.relevanceLevel === 'GENERAL') {
      generalObservations.push({
        id: insight.id,
        title: insight.title,
        statement: insight.statement,
        evidenceIds: insight.evidenceIds,
      })

      continue
    }

    relevant.push({
      id: insight.id,
      title: insight.title,
      statement: insight.statement,

      strength: conclusion.strength,

      evidenceIds: insight.evidenceIds,

      matchedDomains:
        selected.matchedDomains,

      relevance:
        selected.relevanceLevel,

      developmentSignificance:
        conclusion.developmentSignificance,

      restrictions:
        conclusion.restrictions,
    })
  }

  /**
   * Evidence strength and
   * development significance
   * are independent dimensions.
   *
   * A development area is not
   * automatically a weakness.
   */
  const strengths =
    relevant.filter(
      (finding) =>
        finding.strength === 'PRIMARY_FINDING' ||
        finding.strength === 'STRONGLY_SUPPORTED' ||
        finding.strength === 'SUPPORTED'
    )

  const developmentAreas =
    relevant.filter(
      (finding) =>
        finding.developmentSignificance === 'HIGH' ||
        finding.developmentSignificance === 'ELEVATED'
    )

  const warnings = [...selection.warnings]

  if (!clientConcern) {
    warnings.push(
      'The client concern has not yet been recorded.'
    )
  }

  const practitionerGuidance: string[] = []

  if (clientConcern) {
    practitionerGuidance.push(
      'Confirm the practical outcome the client wants before discussing numerological interpretations.'
    )
  }

  if (relevant.length > 0) {
    practitionerGuidance.push(
      'Use the approved topic-relevant V3 findings to explore possible strengths and development themes. Ask for real examples rather than assuming that a pattern explains the client’s circumstances.'
    )
  } else {
    practitionerGuidance.push(
      'No approved topic-specific V3 conclusion is currently available. General numerology observations may be discussed as general themes, but must not be presented as direct explanations of the client’s concern.'
    )
  }

  if (clarification) {
    practitionerGuidance.push(
      'Use the client’s clarification to refine the discussion without treating it as new numerological evidence.'
    )
  }

  practitionerGuidance.push(
    'Do not guarantee career, business, relationship, financial, or other future outcomes.'
  )

  const summary =
    relevant.length > 0
      ? `${relevant.length} approved V3 finding(s) are relevant to the selected discussion. Interpret them in the context of the client’s reported situation.`
      : 'The client’s discussion is recorded. The current approved V3 findings do not establish a topic-specific numerological conclusion.'

  return {
    version: CONSULTATION_OUTCOME_VERSION,

    primaryTopic:
      selection.primaryTopic,

    secondaryTopics:
      selection.secondaryTopics,

    clientConcern,
    clarification,

    status:
      clarification
        ? 'REFINED'
        : 'INITIAL',

    summary,

    strengths:
      strengths.slice(0, 5),

    developmentAreas:
      developmentAreas.slice(0, 5),

    generalObservations:
      generalObservations.slice(0, 5),

    practitionerGuidance,

    nextQuestion:
      nextQuestionForTopic(
        selection.primaryTopic
      ),

    warnings,
  }
}