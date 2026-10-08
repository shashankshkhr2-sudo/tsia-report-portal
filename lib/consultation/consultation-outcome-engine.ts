import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

import type {
  ConclusionEngineResult,
  IntelligenceDomain,
  ResolvedConclusion,
} from '@/lib/numerology-intelligence/types'

import type {
  ConsultationTopic,
} from '@/components/consultation-workspace'

import type {
  ConsultationAnswerForIntelligence,
} from './question-intelligence'

export const CONSULTATION_OUTCOME_VERSION =
  'TSIA_CONSULTATION_OUTCOME_1.0' as const

export type OutcomeFinding = {
  id: string
  title: string
  statement: string
  strength: string
  evidenceIds: readonly string[]
  matchedDomains: readonly IntelligenceDomain[]
  relevance: 'PRIMARY' | 'SECONDARY'
  developmentSignificance: string
}

export type ConsultationOutcome = {
  version: typeof CONSULTATION_OUTCOME_VERSION

  primaryTopic: ConsultationTopic | null
  secondaryTopics: readonly ConsultationTopic[]

  clientConcern: string
  clarification: string

  status:
    | 'INITIAL'
    | 'REFINED'

  summary: string

  strengths: readonly OutcomeFinding[]
  developmentAreas: readonly OutcomeFinding[]

  generalObservations: readonly {
    id: string
    title: string
    statement: string
  }[]

  practitionerGuidance: readonly string[]

  nextQuestion: string

  warnings: readonly string[]
}

export type ConsultationOutcomeInput = {
  topics: readonly ConsultationTopic[]

  todayNote: string

  answers:
    readonly ConsultationAnswerForIntelligence[]

  insights: readonly EmployeeInsight[]

  conclusions: ConclusionEngineResult
}

const TOPIC_DOMAINS: Record<
  ConsultationTopic,
  readonly IntelligenceDomain[]
> = {
  career: [
    'CAREER',
    'DECISION_MAKING',
  ],

  business: [
    'BUSINESS',
    'PROBLEM_SOLVING',
  ],

  money: [
    'MONEY',
    'DECISION_MAKING',
  ],

  family: ['FAMILY'],

  relationship: [
    'PARTNER',
    'ROMANCE',
  ],

  marriage: [
    'PARTNER',
    'FAMILY',
  ],

  personal_direction: [
    'GUIDANCE',
    'CORE',
  ],

  other: [
    'GUIDANCE',
    'CORE',
  ],
}

function findAnswer(
  answers: readonly ConsultationAnswerForIntelligence[],
  keys: readonly string[]
): string {
  const item = answers.find(
    (answer) =>
      keys.includes(answer.questionKey) &&
      answer.clientAnswer.trim().length > 0
  )

  return item?.clientAnswer.trim() || ''
}

function eligible(
  conclusion: ResolvedConclusion
): boolean {
  return (
    conclusion.resolution !== 'INSUFFICIENT' &&
    conclusion.strength !== 'INSUFFICIENT_EVIDENCE'
  )
}

function matchedDomains(
  conclusion: ResolvedConclusion,
  domains: ReadonlySet<IntelligenceDomain>
): IntelligenceDomain[] {
  return conclusion.allowedDomains.filter(
    (domain) => domains.has(domain)
  )
}

function toFinding(
  insight: EmployeeInsight,
  conclusion: ResolvedConclusion,
  domains: readonly IntelligenceDomain[],
  relevance: 'PRIMARY' | 'SECONDARY'
): OutcomeFinding {
  return {
    id: insight.id,
    title: insight.title,
    statement: insight.statement,
    strength: conclusion.strength,
    evidenceIds: insight.evidenceIds,
    matchedDomains: domains,
    relevance,
    developmentSignificance:
      conclusion.developmentSignificance,
  }
}

function nextQuestionForTopic(
  topic: ConsultationTopic | null
): string {
  switch (topic) {
    case 'career':
      return 'What specific professional result are you hoping to achieve, and what has been the main obstacle so far?'

    case 'business':
      return 'Which business outcome matters most right now: stable revenue, growth, customers, payments, or a major decision?'

    case 'money':
      return 'Is your immediate priority increasing income, improving financial stability, managing commitments, or planning for the future?'

    case 'family':
      return 'Which family relationship or responsibility would you most like to improve?'

    case 'relationship':
      return 'What would you most like to improve in the relationship: communication, understanding, trust, or future direction?'

    case 'marriage':
      return 'Is your current concern about finding a partner, evaluating compatibility, or improving an existing marriage?'

    case 'personal_direction':
      return 'What important decision or change are you currently considering?'

    default:
      return 'What specific outcome would make this consultation useful to you?'
  }
}

export function buildConsultationOutcome(
  input: ConsultationOutcomeInput
): ConsultationOutcome {
  const primaryTopic =
    input.topics[0] || null

  const secondaryTopics =
    input.topics.slice(1)

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

  const primaryDomains =
    new Set<IntelligenceDomain>(
      primaryTopic
        ? TOPIC_DOMAINS[primaryTopic]
        : []
    )

  const secondaryDomains =
    new Set<IntelligenceDomain>(
      secondaryTopics.flatMap(
        (topic) => TOPIC_DOMAINS[topic]
      )
    )

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

  const generalObservations: {
    id: string
    title: string
    statement: string
  }[] = []

  for (const insight of input.insights) {
    /*
     * Cross-quality findings are not
     * assigned domains by this engine.
     *
     * They remain available in the
     * complete V3 intelligence display.
     */
    if (
      insight.source !== 'CORE_CONCLUSION'
    ) {
      continue
    }

    const conclusionId =
      insight.id.startsWith('EMP_')
        ? insight.id.slice(4)
        : insight.id

    const conclusion =
      conclusionMap.get(conclusionId)

    if (!conclusion || !eligible(conclusion)) {
      continue
    }

    const primaryMatches =
      matchedDomains(
        conclusion,
        primaryDomains
      )

    const secondaryMatches =
      matchedDomains(
        conclusion,
        secondaryDomains
      )

    if (primaryMatches.length > 0) {
      relevant.push(
        toFinding(
          insight,
          conclusion,
          primaryMatches,
          'PRIMARY'
        )
      )
    } else if (secondaryMatches.length > 0) {
      relevant.push(
        toFinding(
          insight,
          conclusion,
          secondaryMatches,
          'SECONDARY'
        )
      )
    } else {
      generalObservations.push({
        id: insight.id,
        title: insight.title,
        statement: insight.statement,
      })
    }
  }

  relevant.sort((a, b) => {
    if (a.relevance !== b.relevance) {
      return a.relevance === 'PRIMARY'
        ? -1
        : 1
    }

    const aInsight = input.insights.find(
      (item) => item.id === a.id
    )

    const bInsight = input.insights.find(
      (item) => item.id === b.id
    )

    return (
      (bInsight?.priority || 0) -
      (aInsight?.priority || 0)
    )
  })

  /*
   * Development significance is
   * not equivalent to a weakness.
   *
   * Findings can appear in both
   * categories when appropriate,
   * but neither category creates
   * a new V3 conclusion.
   */
  const strengths =
    relevant.filter(
      (finding) =>
        finding.strength ===
          'PRIMARY_FINDING' ||
        finding.strength ===
          'STRONGLY_SUPPORTED' ||
        finding.strength ===
          'SUPPORTED'
    )

  const developmentAreas =
    relevant.filter(
      (finding) =>
        finding.developmentSignificance ===
          'ELEVATED' ||
        finding.developmentSignificance ===
          'HIGH'
    )

  const warnings: string[] = []

  if (relevant.length === 0) {
    warnings.push(
      'No verified V3 conclusion is approved for the selected consultation domains.'
    )
  }

  if (!clientConcern) {
    warnings.push(
      'The client’s main concern has not yet been recorded.'
    )
  }

  const practitionerGuidance: string[] = []

  if (clientConcern) {
    practitionerGuidance.push(
      'Begin by confirming the client’s stated concern and the practical outcome they are seeking.'
    )
  }

  if (relevant.length > 0) {
    practitionerGuidance.push(
      'Discuss the approved numerological findings as possible themes, then ask the client for concrete examples before relating them to professional or personal decisions.'
    )
  } else {
    practitionerGuidance.push(
      'The current verified V3 evidence does not support a direct topic-specific interpretation. Do not substitute general personality observations as an explanation of the client’s situation.'
    )
  }

  if (clarification) {
    practitionerGuidance.push(
      'Use the additional clarification to refine practical questions and recommendations. It does not change numerological evidence.'
    )
  }

  practitionerGuidance.push(
    'Do not present numerological themes as established causes of real-world events or guarantees of future outcomes.'
  )

  const status =
    clarification
      ? 'REFINED'
      : 'INITIAL'

  const summary =
    relevant.length > 0
      ? `The consultation has ${relevant.length} approved numerological finding(s) relevant to the selected discussion. These findings may guide a personalized conversation, subject to the client's actual circumstances.`
      : 'The selected discussion and client concern are recorded, but the current verified V3 conclusions do not establish a topic-specific numerological interpretation.'

  return {
    version: CONSULTATION_OUTCOME_VERSION,

    primaryTopic,
    secondaryTopics,

    clientConcern,
    clarification,

    status,
    summary,

    strengths: strengths.slice(0, 5),

    developmentAreas:
      developmentAreas.slice(0, 5),

    generalObservations:
      generalObservations.slice(0, 5),

    practitionerGuidance,

    nextQuestion:
      nextQuestionForTopic(primaryTopic),

    warnings,
  }
}