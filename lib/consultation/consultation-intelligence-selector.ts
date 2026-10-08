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
 * TSIA CONSULTATION INTELLIGENCE SELECTOR
 *
 * Version 1.1
 *
 * Selects existing verified V3 findings
 * according to consultation topics.
 *
 * DEVELOPMENT RULE 001:
 * SIMPLE • FAST • SAFE • RELIABLE
 *
 * This selector NEVER:
 *
 * - Changes V2 calculations
 * - Modifies V3 conclusions
 * - Creates numerological evidence
 * - Treats client answers as evidence
 * - Predicts specific life events
 * - Changes approved V3 methodology
 */

export const CONSULTATION_SELECTOR_VERSION =
  'TSIA_CONSULTATION_SELECTOR_1.1' as const

export type ConsultationInsight = {
  insight: EmployeeInsight

  relevanceScore: number

  matchedDomains:
    readonly IntelligenceDomain[]

  relevanceLevel:
    | 'PRIMARY'
    | 'SECONDARY'
    | 'GENERAL'
}

export type ConsultationSelectionResult = {
  version:
    typeof CONSULTATION_SELECTOR_VERSION

  purpose: ConsultationPurpose

  primaryTopic:
    ConsultationTopic | null

  secondaryTopics:
    readonly ConsultationTopic[]

  insights:
    readonly ConsultationInsight[]

  totalEligibleInsights: number

  warnings:
    readonly string[]
}

type SelectorInput = {
  purpose: ConsultationPurpose

  topics:
    readonly ConsultationTopic[]

  insights:
    readonly EmployeeInsight[]

  conclusions:
    ConclusionEngineResult

  limit?: number
}

/**
 * APPROVED TOPIC MAPPING
 *
 * Maps consultation topics to
 * existing V3 intelligence domains.
 *
 * No new numerology methodology
 * is introduced.
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
 * ELIGIBILITY CHECK
 *
 * Only approved conclusions with
 * sufficient evidence can enter
 * consultation selection.
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
 * GET APPROVED CONCLUSION ID
 *
 * Employee output prefixes
 * conclusion IDs with EMP_.
 *
 * Cross-quality findings are
 * excluded from topic selection
 * until their domain eligibility
 * is independently validated.
 */
function getConclusionId(
  insight: EmployeeInsight
): string | null {
  if (
    insight.source !==
    'CORE_CONCLUSION'
  ) {
    return null
  }

  return insight.id.startsWith(
    'EMP_'
  )
    ? insight.id.slice(4)
    : insight.id
}

/**
 * TOPIC-BASED SELECTION
 *
 * Primary topic:
 * Highest relevance.
 *
 * Secondary topics:
 * Supporting relevance.
 *
 * General findings:
 * Lower priority.
 *
 * All findings must originate
 * from approved V3 conclusions.
 */
export function selectConsultationIntelligence(
  input: SelectorInput
): ConsultationSelectionResult {
  const primaryTopic =
    input.topics[0] ?? null

  const secondaryTopics =
    input.topics.slice(1)

  const primaryDomains =
    new Set<IntelligenceDomain>(
      primaryTopic
        ? TOPIC_DOMAINS[primaryTopic]
        : []
    )

  const secondaryDomains =
    new Set<IntelligenceDomain>(
      secondaryTopics.flatMap(
        (topic) =>
          TOPIC_DOMAINS[topic]
      )
    )

  /**
   * FAST CONCLUSION LOOKUP
   *
   * Build once per selection.
   *
   * Avoid repeated searches
   * through the conclusion list.
   */
  const conclusionMap =
    new Map<
      string,
      ResolvedConclusion
    >(
      input.conclusions.conclusions.map(
        (conclusion) => [
          conclusion.id,
          conclusion,
        ]
      )
    )

  const selected:
    ConsultationInsight[] = []

  const warnings: string[] = []

  for (
    const insight of input.insights
  ) {
    const conclusionId =
      getConclusionId(insight)

    if (!conclusionId) {
      continue
    }

    const conclusion =
      conclusionMap.get(
        conclusionId
      )

    if (
      !conclusion ||
      !isEligible(conclusion)
    ) {
      continue
    }

    const matchedPrimary =
      conclusion.allowedDomains.filter(
        (domain) =>
          primaryDomains.has(domain)
      )

    const matchedSecondary =
      conclusion.allowedDomains.filter(
        (domain) =>
          secondaryDomains.has(domain)
      )

    let relevanceLevel:
      ConsultationInsight['relevanceLevel'] =
        'GENERAL'

    let relevanceScore =
      insight.priority

    if (
      matchedPrimary.length > 0
    ) {
      relevanceLevel =
        'PRIMARY'

      relevanceScore += 100
    } else if (
      matchedSecondary.length > 0
    ) {
      relevanceLevel =
        'SECONDARY'

      relevanceScore += 50
    }

    const matchedDomains =
      Array.from(
        new Set<IntelligenceDomain>([
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

  /**
   * RANKING
   *
   * Primary topic findings first.
   *
   * Secondary topic findings next.
   *
   * General findings last.
   *
   * Existing employee priority
   * breaks ties within each group.
   */
  const levelRank = {
    PRIMARY: 3,
    SECONDARY: 2,
    GENERAL: 1,
  } as const

  selected.sort(
    (a, b) => {
      const levelDifference =
        levelRank[b.relevanceLevel] -
        levelRank[a.relevanceLevel]

      if (levelDifference !== 0) {
        return levelDifference
      }

      return (
        b.relevanceScore -
        a.relevanceScore
      )
    }
  )

  /**
   * DISPLAY LIMIT
   *
   * Default: five findings.
   *
   * This does not limit the
   * underlying approved pool.
   */
  const limit =
    Math.max(
      0,
      Math.floor(
        input.limit ?? 5
      )
    )

  const result =
    selected.slice(
      0,
      limit
    )

  /**
   * WARNINGS
   *
   * Inform the practitioner
   * when direct topic-specific
   * intelligence is unavailable.
   */
  if (
    primaryTopic &&
    !selected.some(
      (item) =>
        item.relevanceLevel ===
        'PRIMARY'
    )
  ) {
    warnings.push(
      'No directly matched verified V3 conclusion was available for the selected primary topic.'
    )
  }

  if (
    selected.length === 0
  ) {
    warnings.push(
      'No eligible verified V3 conclusions were available for consultation selection.'
    )
  }

  return {
    version:
      CONSULTATION_SELECTOR_VERSION,

    purpose:
      input.purpose,

    primaryTopic,

    secondaryTopics,

    insights:
      result,

    totalEligibleInsights:
      selected.length,

    warnings,
  }
}