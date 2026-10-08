import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

import type {
  ConclusionEngineResult,
  IntelligenceDomain,
  ResolvedConclusion,
} from '@/lib/numerology-intelligence/types'

import type {
  ConsultationPurpose,
  ConsultationTopic,
} from '@/components/consultation-workspace'

/**
 * TSIA Consultation Intelligence Selector
 *
 * This layer selects existing verified
 * V3 findings for a consultation.
 *
 * It NEVER:
 * - changes V2 calculations
 * - modifies V3 conclusions
 * - invents numerological evidence
 * - treats client statements as evidence
 * - predicts specific life events
 */

export const CONSULTATION_SELECTOR_VERSION =
  'TSIA_CONSULTATION_SELECTOR_1.0' as const

export type ConsultationInsight = {
  insight: EmployeeInsight
  relevanceScore: number
  matchedDomains: readonly IntelligenceDomain[]
  relevanceLevel:
    | 'PRIMARY'
    | 'SECONDARY'
    | 'GENERAL'
}

export type ConsultationSelectionResult = {
  version: typeof CONSULTATION_SELECTOR_VERSION
  purpose: ConsultationPurpose
  primaryTopic: ConsultationTopic | null
  secondaryTopics: readonly ConsultationTopic[]
  insights: readonly ConsultationInsight[]
  totalEligibleInsights: number
  warnings: readonly string[]
}

type SelectorInput = {
  purpose: ConsultationPurpose
  topics: readonly ConsultationTopic[]
  insights: readonly EmployeeInsight[]
  conclusions: ConclusionEngineResult
  limit?: number
}

/**
 * Approved mapping between consultation
 * subjects and existing V3 domains.
 *
 * No new numerology methodology is
 * introduced here.
 */
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

  family: [
    'FAMILY',
  ],

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

/**
 * Resolve a displayed insight back to
 * its approved V3 conclusion.
 *
 * Employee insight IDs are prefixed
 * with EMP_ in the existing output layer.
 */
function findConclusion(
  insight: EmployeeInsight,
  conclusions: readonly ResolvedConclusion[]
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
    conclusions.find(
      (item) =>
        item.id === conclusionId
    ) || null
  )
}

/**
 * Only conclusions with approved
 * evidence support are eligible.
 */
function isEligible(
  conclusion: ResolvedConclusion
): boolean {
  return (
    conclusion.resolution !==
      'INSUFFICIENT' &&
    conclusion.strength !==
      'INSUFFICIENT_EVIDENCE'
  )
}

/**
 * Rank verified employee insights
 * according to the selected subject.
 */
export function selectConsultationIntelligence(
  input: SelectorInput
): ConsultationSelectionResult {
  const primaryTopic =
    input.topics[0] || null

  const secondaryTopics =
    input.topics.slice(1)

  const primaryDomains =
    primaryTopic
      ? TOPIC_DOMAINS[primaryTopic]
      : []

  const secondaryDomains =
    secondaryTopics.flatMap(
      (topic) =>
        TOPIC_DOMAINS[topic]
    )

  const selected:
    ConsultationInsight[] = []

  const warnings: string[] = []

  for (const insight of input.insights) {
    const conclusion =
      findConclusion(
        insight,
        input.conclusions.conclusions
      )

    /**
     * Cross-quality insights require
     * separate domain validation.
     *
     * Until that is implemented, they
     * are excluded rather than assigned
     * an invented domain.
     */
    if (!conclusion) {
      continue
    }

    if (!isEligible(conclusion)) {
      continue
    }

    const matchedPrimary =
      conclusion.allowedDomains.filter(
        (domain) =>
          primaryDomains.includes(domain)
      )

    const matchedSecondary =
      conclusion.allowedDomains.filter(
        (domain) =>
          secondaryDomains.includes(domain)
      )

    let relevanceScore =
      insight.priority

    let relevanceLevel:
      ConsultationInsight['relevanceLevel'] =
        'GENERAL'

    if (matchedPrimary.length > 0) {
      relevanceScore += 100
      relevanceLevel = 'PRIMARY'
    } else if (
      matchedSecondary.length > 0
    ) {
      relevanceScore += 50
      relevanceLevel = 'SECONDARY'
    }

    const matchedDomains =
      Array.from(
        new Set([
          ...matchedPrimary,
          ...matchedSecondary,
        ])
      )

    selected.push({
      insight,
      relevanceScore,
      matchedDomains,
      relevanceLevel,
    })
  }

  selected.sort(
    (a, b) =>
      b.relevanceScore -
      a.relevanceScore
  )

  const limit =
    Math.max(
      0,
      input.limit ?? 5
    )

  const result =
    selected.slice(0, limit)

  if (
    primaryTopic &&
    !result.some(
      (item) =>
        item.relevanceLevel ===
        'PRIMARY'
    )
  ) {
    warnings.push(
      'No directly matched verified V3 conclusion was available for the selected primary topic.'
    )
  }

  return {
    version:
      CONSULTATION_SELECTOR_VERSION,

    purpose: input.purpose,

    primaryTopic,

    secondaryTopics,

    insights: result,

    totalEligibleInsights:
      selected.length,

    warnings,
  }
}