import type {
  ConclusionEngineResult,
  ResolvedConclusion,
} from './types'

import type {
  CrossQualityResolverResult,
  CrossQualityResolution,
} from './crossqualityresolver'

/**
 * TSIA Numerology Intelligence V3
 * Employee Output Layer
 *
 * Purpose:
 *
 * Convert approved V3 intelligence into
 * a concise employee-facing brief.
 *
 * This layer does NOT:
 * - change calculations
 * - create new methodology
 * - determine Needed Number
 * - prescribe remedies
 * - determine Y3
 * - convert research candidates into
 *   production conclusions
 */

export const
  EMPLOYEE_OUTPUT_VERSION =
    'TSIA_NUM_V3_EMPLOYEE_OUTPUT_1.0' as const

export type EmployeeInsightSource =
  | 'CORE_CONCLUSION'
  | 'CROSS_QUALITY'

export type EmployeeInsight = {
  id: string

  source:
    EmployeeInsightSource

  title: string

  statement: string

  priority: number

  strength?: string

  relationship?: string

  developmentSignificance?:
    string
}

export type EmployeeOutputResult = {
  version:
    typeof EMPLOYEE_OUTPUT_VERSION

  insights:
    readonly EmployeeInsight[]

  warnings:
    readonly string[]
}

/**
 * Internal ranking only.
 *
 * This does NOT change methodology
 * evidence strength.
 *
 * It only determines which approved
 * findings are most useful to show
 * first to the employee.
 */
function conclusionPriority(
  conclusion: ResolvedConclusion
): number {
  let priority = 0

  if (
    conclusion.strength ===
    'STRONGLY_SUPPORTED'
  ) {
    priority += 40
  } else if (
    conclusion.strength ===
    'SUPPORTED'
  ) {
    priority += 25
  } else if (
    conclusion.strength ===
    'CONTEXT_DEPENDENT'
  ) {
    priority += 15
  }

  if (
    conclusion.resolution ===
    'REINFORCE'
  ) {
    priority += 20
  } else if (
    conclusion.resolution ===
    'MODERATE'
  ) {
    priority += 18
  } else if (
    conclusion.resolution ===
    'COMPENSATE'
  ) {
    priority += 18
  } else if (
    conclusion.resolution ===
    'TENSION'
  ) {
    priority += 16
  } else if (
    conclusion.resolution ===
    'CONTEXTUALIZE'
  ) {
    priority += 14
  }

  if (
    conclusion
      .developmentSignificance ===
    'HIGH'
  ) {
    priority += 18
  } else if (
    conclusion
      .developmentSignificance ===
    'ELEVATED'
  ) {
    priority += 12
  } else if (
    conclusion
      .developmentSignificance ===
    'STANDARD'
  ) {
    priority += 6
  }

  return priority
}

/**
 * Only meaningful production conclusions
 * should enter the employee brief.
 *
 * INSUFFICIENT conclusions remain available
 * inside the full V3 result but are not
 * promoted as one of the five important
 * client insights.
 */
function isUsableConclusion(
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
 * Cross-quality output is intentionally
 * stricter than the raw resolver.
 *
 * We exclude:
 * - research-only pairs
 * - coexist-only pairs
 * - insufficient evidence
 * - structural-supremacy duplicates
 *
 * Only approved RESOLVED interactions
 * are candidates for employee-facing
 * prioritization.
 */
function isUsableCrossQuality(
  resolution: CrossQualityResolution
): boolean {
  if (
    resolution.status !== 'RESOLVED'
  ) {
    return false
  }

  return (
    resolution.relationship ===
      'COMPLEMENT' ||
    resolution.relationship ===
      'CONTEXTUALIZE' ||
    resolution.relationship ===
      'TENSION'
  )
}

function crossQualityPriority(
  resolution: CrossQualityResolution
): number {
  if (
    resolution.relationship ===
    'COMPLEMENT'
  ) {
    return 35
  }

  if (
    resolution.relationship ===
    'CONTEXTUALIZE'
  ) {
    return 30
  }

  if (
    resolution.relationship ===
    'TENSION'
  ) {
    return 28
  }

  return 0
}

function conclusionToInsight(
  conclusion: ResolvedConclusion
): EmployeeInsight {
  return {
    id:
      `EMP_${conclusion.id}`,

    source:
      'CORE_CONCLUSION',

    title:
      conclusion.title,

    statement:
      conclusion.statement,

    priority:
      conclusionPriority(
        conclusion
      ),

    strength:
      conclusion.strength,

    developmentSignificance:
      conclusion
        .developmentSignificance,
  }
}

function crossQualityToInsight(
  resolution: CrossQualityResolution
): EmployeeInsight {
  return {
    id:
      `EMP_${resolution.id}`,

    source:
      'CROSS_QUALITY',

    title:
      'Combined Pattern',

    statement:
      resolution.statement,

    priority:
      crossQualityPriority(
        resolution
      ),

    relationship:
      resolution.relationship,
  }
}

/**
 * Avoid displaying duplicate statements.
 *
 * The underlying engine output remains
 * unchanged. This only cleans the
 * employee presentation layer.
 */
function removeDuplicateStatements(
  insights: readonly EmployeeInsight[]
): EmployeeInsight[] {
  const seen =
    new Set<string>()

  const result:
    EmployeeInsight[] = []

  for (const insight of insights) {
    const key =
      insight.statement
        .trim()
        .toLowerCase()

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(insight)
  }

  return result
}

/**
 * Build the employee-facing V3 brief.
 *
 * Default = five important insights.
 */
export function buildEmployeeOutput(
  conclusions:
    ConclusionEngineResult,

  crossQuality:
    CrossQualityResolverResult,

  limit = 5
): EmployeeOutputResult {
  const coreInsights =
    conclusions.conclusions
      .filter(
        isUsableConclusion
      )
      .map(
        conclusionToInsight
      )

  const crossQualityInsights =
    crossQuality.resolutions
      .filter(
        isUsableCrossQuality
      )
      .map(
        crossQualityToInsight
      )

  const combined =
    removeDuplicateStatements([
      ...coreInsights,
      ...crossQualityInsights,
    ])

  const ranked =
    combined
      .sort(
        (a, b) =>
          b.priority -
          a.priority
      )
      .slice(
        0,
        Math.max(0, limit)
      )

  return {
    version:
      EMPLOYEE_OUTPUT_VERSION,

    insights:
      ranked,

    warnings: [],
  }
}