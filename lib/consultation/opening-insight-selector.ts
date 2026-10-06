import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

import type {
  OpeningIntelligenceDecision,
} from './opening-intelligence'

export type OpeningInsightSelection = {
  insight: EmployeeInsight | null

  selectionReason: string

  relevance:
    | 'GENERAL_VERIFIED'
    | 'HISTORY_REQUIRES_LINKING'
    | 'TOPIC_REQUIRES_DOMAIN_EVIDENCE'
    | 'NO_VERIFIED_INSIGHT'
}

export type OpeningInsightSelectorInput = {
  decision: OpeningIntelligenceDecision

  insights:
    readonly EmployeeInsight[]

  topics:
    readonly string[]

  todayNote: string
}

/**
 * Selects an existing verified V3 insight
 * for the opening conversation.
 *
 * IMPORTANT:
 *
 * This layer does NOT:
 * - create a new numerology finding
 * - infer career/marriage/money/etc.
 *   from keywords
 * - alter evidence strength
 * - treat client history as numerological
 *   evidence
 * - change V3 calculations
 */
export function selectOpeningInsight(
  input: OpeningInsightSelectorInput
): OpeningInsightSelection {
  const usableInsights =
    input.insights
      .filter(isUsableInsight)
      .sort(
        (a, b) =>
          b.priority -
          a.priority
      )

  if (usableInsights.length === 0) {
    return {
      insight: null,

      selectionReason:
        'No verified employee-facing V3 insight is available for the opening conversation.',

      relevance:
        'NO_VERIFIED_INSIGHT',
    }
  }

  /*
   * First consultation:
   *
   * After orientation, it is safe to begin
   * with the highest-priority verified V3
   * intelligence because there is no prior
   * client history to reconnect with.
   */
  if (
    input.decision.objective ===
    'ORIENT'
  ) {
    return {
      insight:
        usableInsights[0],

      selectionReason:
        'This is the first consultation. After orientation, begin with the highest-priority verified V3 insight.',

      relevance:
        'GENERAL_VERIFIED',
    }
  }

  /*
   * A previous client response exists.
   *
   * We deliberately do NOT guess which
   * V3 insight it belongs to.
   *
   * That requires an explicit link between
   * consultation history and the underlying
   * approved V3 finding.
   */
  if (
    input.decision
      .relevantPreviousAnswer
  ) {
    return {
      insight: null,

      selectionReason:
        'Relevant consultation history exists, but it has not yet been explicitly linked to a verified V3 finding.',

      relevance:
        'HISTORY_REQUIRES_LINKING',
    }
  }

  /*
   * Today's specific concern or selected
   * topic must not be mapped to an insight
   * merely through words appearing in the
   * title or statement.
   *
   * Domain relevance must come from
   * approved V3 domain evidence.
   */
  if (
    input.decision.objective ===
      'TODAYS_CONCERN' ||
    input.topics.length > 0 ||
    input.todayNote.trim()
  ) {
    return {
      insight: null,

      selectionReason:
        'Today’s topic requires approved V3 domain relevance before a numerological insight can be selected.',

      relevance:
        'TOPIC_REQUIRES_DOMAIN_EVIDENCE',
    }
  }

  /*
   * Neutral reconnection:
   *
   * No specific historical finding or
   * domain claim is being made.
   *
   * The highest-priority existing V3
   * insight may therefore be used as
   * general verified intelligence.
   */
  return {
    insight:
      usableInsights[0],

    selectionReason:
      'No specific historical or domain relationship needs to be inferred. Use the highest-priority verified V3 insight for general reconnection.',

    relevance:
      'GENERAL_VERIFIED',
  }
}

function isUsableInsight(
  insight: EmployeeInsight
) {
  if (
    !insight.id ||
    !insight.statement.trim()
  ) {
    return false
  }

  if (
    insight.evidenceIds.length === 0
  ) {
    return false
  }

  return true
}