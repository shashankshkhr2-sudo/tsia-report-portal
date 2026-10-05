import type {
  FunctionalQualityId,
  IntelligenceEvidence,
} from './types'

import type {
  EmployeeInsight,
} from './employeeoutput'

import {
  FUNCTIONAL_QUALITIES,
} from './functionalqualities'

/**
 * TSIA Numerology Intelligence V3
 * Employee Explanation Layer
 *
 * Version 1.1
 *
 * Purpose:
 *
 * Convert an already-approved employee
 * insight and its ACTUAL V3 evidence into
 * clear practitioner-facing language.
 *
 * Evidence remains authoritative.
 *
 * This layer does NOT:
 * - calculate numerology
 * - create new evidence
 * - create a new conclusion
 * - change evidence strength
 * - change V3 methodology
 * - infer life events
 * - determine Needed Number
 * - prescribe remedies
 * - determine Y3
 */

export const EMPLOYEE_EXPLANATION_VERSION =
  'TSIA_NUM_V3_EMPLOYEE_EXPLANATION_1.1' as const

export type EmployeeExplanation = {
  whyWeSayThis: string
  understandFromClient: string
}

/**
 * Build one employee explanation.
 *
 * Only evidence IDs already preserved
 * by Employee Output are allowed.
 */
export function buildEmployeeExplanation(
  insight: EmployeeInsight,
  allEvidence:
    readonly IntelligenceEvidence[]
): EmployeeExplanation {
  const evidence =
    resolveInsightEvidence(
      insight,
      allEvidence
    )

  return {
    whyWeSayThis:
      buildWhyWeSayThis(
        insight,
        evidence
      ),

    understandFromClient:
      buildUnderstandFromClient(
        insight
      ),
  }
}

/**
 * Resolve evidence strictly from the
 * evidence IDs carried by the approved
 * EmployeeInsight.
 *
 * No evidence is inferred from a number,
 * title, Graha or Functional Quality.
 */
function resolveInsightEvidence(
  insight: EmployeeInsight,
  allEvidence:
    readonly IntelligenceEvidence[]
): IntelligenceEvidence[] {
  const allowedIds =
    new Set(
      insight.evidenceIds
    )

  return allEvidence.filter(
    (item) =>
      allowedIds.has(item.id)
  )
}

/**
 * Build practitioner-friendly explanation.
 *
 * Important:
 *
 * The actual IntelligenceEvidence.statement
 * remains the authoritative explanation
 * of what each evidence record supports.
 */
function buildWhyWeSayThis(
  insight: EmployeeInsight,
  evidence:
    readonly IntelligenceEvidence[]
): string {
  if (evidence.length === 0) {
    return 'This is an approved V3 finding, but its supporting evidence is not available in the current consultation view.'
  }

  const opening =
    buildOpening(
      insight
    )

  const evidenceText =
    evidence
      .map(
        evidenceToExplanation
      )
      .filter(
        (text) =>
          text.length > 0
      )
      .join(' ')

  const conclusion =
    buildClosing(
      insight
    )

  return [
    opening,
    evidenceText,
    conclusion,
  ]
    .filter(Boolean)
    .join(' ')
}

/**
 * Opening identifies the actual
 * Number + Graha connection for the
 * Functional Quality involved.
 *
 * It does not claim that this alone
 * proves the finding.
 */
function buildOpening(
  insight: EmployeeInsight
): string {
  const qualities =
    insight.functionalQualityIds
      .map(
        getFunctionalQualityById
      )
      .filter(
        (
          quality
        ): quality is NonNullable<
          ReturnType<
            typeof getFunctionalQualityById
          >
        > =>
          quality !== undefined
      )

  if (qualities.length === 0) {
    return ''
  }

  if (qualities.length === 1) {
    const quality =
      qualities[0]

    return (
      `Number ${quality.number} is associated with ` +
      `${quality.graha} and the TSIA functional quality ` +
      `${quality.title}.`
    )
  }

  const qualityText =
    qualities
      .map(
        (quality) =>
          `Number ${quality.number} (${quality.graha})`
      )
      .join(' and ')

  return (
    `This finding brings together ` +
    `${qualityText}.`
  )
}

/**
 * Translate one ACTUAL evidence record
 * into practitioner-friendly language.
 *
 * The evidence statement is always
 * preserved as the central meaning.
 *
 * Layer/source information may clarify
 * where the evidence came from, but it
 * must not create an additional finding.
 */
function evidenceToExplanation(
  evidence: IntelligenceEvidence
): string {
  const statement =
    cleanSentence(
      evidence.statement
    )

  if (!statement) {
    return ''
  }

  const source =
    sourceIntroduction(
      evidence
    )

  if (!source) {
    return statement
  }

  return `${source} ${statement}`
}

/**
 * Describe only the provenance/layer of
 * evidence that ACTUALLY exists.
 *
 * This does not interpret what that
 * evidence means. Meaning remains in
 * evidence.statement.
 */
function sourceIntroduction(
  evidence: IntelligenceEvidence
): string {
  switch (evidence.layer) {
    case 'MULANK':
      return numberPrefix(
        evidence,
        'appears through the Mulank.'
      )

    case 'BHAGYANK':
      return numberPrefix(
        evidence,
        'appears through the Bhagyank.'
      )

    case 'NAME_NUMBER':
      if (
        evidence.sourceValue !==
          undefined &&
        evidence.sourceValue !==
          null &&
        String(
          evidence.sourceValue
        ).trim() !== ''
      ) {
        return (
          `The Name Number source is ` +
          `${evidence.sourceValue}` +
          numberReductionText(
            evidence
          ) +
          '.'
        )
      }

      return numberPrefix(
        evidence,
        'appears through the Name Number.'
      )

    case 'RAW_LO_SHU':
      return numberPrefix(
        evidence,
        'is represented through the birth-date digits used in the Lo Shu analysis.'
      )

    case 'DERIVED_LO_SHU':
      return numberPrefix(
        evidence,
        'is represented in the Personal Lo Shu through the approved TSIA calculation.'
      )

    case 'REPETITION':
      if (
        evidence.sourceValue !==
          undefined &&
        evidence.sourceValue !==
          null &&
        String(
          evidence.sourceValue
        ).trim() !== ''
      ) {
        return (
          evidence.number !==
          undefined
            ? `Number ${evidence.number} has repetition evidence with source value ${evidence.sourceValue}.`
            : `This repetition evidence has source value ${evidence.sourceValue}.`
        )
      }

      return numberPrefix(
        evidence,
        'has verified repetition evidence.'
      )

    case 'MISSING_NUMBER':
      return numberPrefix(
        evidence,
        'has verified missing-number evidence.'
      )

    case 'ROW':
      return structurePrefix(
        evidence,
        'Lo Shu row'
      )

    case 'COLUMN':
      return structurePrefix(
        evidence,
        'Lo Shu column'
      )

    case 'RAJYOG':
      return structurePrefix(
        evidence,
        'Rajyog'
      )

    case 'COMPOUND_BIRTH_CONTEXT':
      if (
        evidence.sourceValue !==
          undefined &&
        evidence.sourceValue !==
          null &&
        String(
          evidence.sourceValue
        ).trim() !== ''
      ) {
        return (
          `The verified compound birth ` +
          `context is ${evidence.sourceValue}.`
        )
      }

      return (
        'Verified compound birth context ' +
        'also contributes to this finding.'
      )

    default:
      return ''
  }
}

/**
 * Number prefix is descriptive only.
 */
function numberPrefix(
  evidence: IntelligenceEvidence,
  description: string
): string {
  if (
    evidence.number ===
    undefined
  ) {
    return `This evidence ${description}`
  }

  return (
    `Number ${evidence.number} ` +
    description
  )
}

/**
 * For Name Number evidence, only state
 * the final number if the evidence record
 * itself contains it.
 */
function numberReductionText(
  evidence: IntelligenceEvidence
): string {
  if (
    evidence.number ===
    undefined
  ) {
    return ''
  }

  return (
    ` and its verified final number is ` +
    `${evidence.number}`
  )
}

/**
 * Structural source identification.
 *
 * structureId is displayed only when
 * it actually exists in V3 evidence.
 */
function structurePrefix(
  evidence: IntelligenceEvidence,
  label: string
): string {
  if (evidence.structureId) {
    return (
      `The approved ${label} structure ` +
      `${evidence.structureId} contributes evidence.`
    )
  }

  return (
    `An approved ${label} structure ` +
    'contributes evidence.'
  )
}

/**
 * Closing language describes the status
 * of the APPROVED conclusion only.
 *
 * It does not upgrade or reinterpret
 * evidence.
 */
function buildClosing(
  insight: EmployeeInsight
): string {
  if (
    insight.relationship ===
    'COMPLEMENT'
  ) {
    return (
      'The approved V3 conclusion is that ' +
      'these qualities can operate together.'
    )
  }

  if (
    insight.relationship ===
    'CONTEXTUALIZE'
  ) {
    return (
      'The approved V3 conclusion requires ' +
      'these qualities to be understood in context.'
    )
  }

  if (
    insight.relationship ===
    'TENSION'
  ) {
    return (
      'The approved V3 conclusion identifies ' +
      'a possible functional tension that should ' +
      'be understood through the client’s real experience.'
    )
  }

  if (
    insight.strength ===
    'STRONGLY_SUPPORTED'
  ) {
    return (
      'Together, the verified evidence gives ' +
      'this finding clear numerological support.'
    )
  }

  if (
    insight.strength ===
    'SUPPORTED'
  ) {
    return (
      'Together, the verified evidence supports ' +
      'this numerological finding.'
    )
  }

  if (
    insight.strength ===
    'CONTEXT_DEPENDENT'
  ) {
    return (
      'The approved finding is context-dependent, ' +
      'so its real-life expression should be explored ' +
      'with the client.'
    )
  }

  return (
    'This explanation reflects only the ' +
    'approved V3 finding and its connected evidence.'
  )
}

/**
 * This section does NOT validate whether
 * numerology is "right".
 *
 * It tells the employee what must still
 * be understood from the client's actual
 * experience.
 */
function buildUnderstandFromClient(
  insight: EmployeeInsight
): string {
  if (
    insight.relationship ===
    'COMPLEMENT'
  ) {
    return (
      'Understand where these qualities work together ' +
      'in the client’s real life, where one becomes ' +
      'more prominent, and whether their interaction ' +
      'changes across different situations.'
    )
  }

  if (
    insight.relationship ===
    'CONTEXTUALIZE'
  ) {
    return (
      'Understand where this pattern appears clearly, ' +
      'where it appears differently, and which situations ' +
      'change the way the two qualities are expressed.'
    )
  }

  if (
    insight.relationship ===
    'TENSION'
  ) {
    return (
      'Understand whether the client actually experiences ' +
      'these qualities pulling in different directions, ' +
      'when that happens, and how the client responds.'
    )
  }

  const qualityId =
    insight.functionalQualityIds[0]

  if (!qualityId) {
    return defaultClientUnderstanding()
  }

  return clientUnderstandingForQuality(
    qualityId
  )
}

/**
 * These are exploration directions,
 * not additional numerology conclusions.
 *
 * They deliberately ask what is not
 * established by numerology alone.
 */
function clientUnderstandingForQuality(
  qualityId: FunctionalQualityId
): string {
  switch (qualityId) {
    case 'INDIVIDUAL_AGENCY':
      return (
        'Understand how the client makes important decisions: ' +
        'where they rely on their own judgment, where they seek ' +
        'other people’s input, and whether this changes between ' +
        'personal and professional situations.'
      )

    case 'RELATIONAL_RECEPTIVITY':
      return (
        'Understand how the client experiences other people’s ' +
        'feelings and viewpoints, how they respond to different ' +
        'perspectives, and where this pattern becomes stronger ' +
        'or weaker in real relationships.'
      )

    case 'KNOWLEDGE_EXPRESSION':
      return (
        'Understand how the client learns, develops ideas and ' +
        'expresses what they know, including where expression ' +
        'comes naturally and where converting ideas into clear ' +
        'communication or action becomes more difficult.'
      )

    case 'ADAPTIVE_RESTRUCTURING':
      return (
        'Understand how the client responds when an existing ' +
        'approach stops working: whether they challenge it, ' +
        'restructure it, try a different route or prefer to ' +
        'preserve the existing approach.'
      )

    case 'ADAPTIVE_INTELLIGENCE':
      return (
        'Understand how the client handles changing information, ' +
        'communication and changing situations, including when ' +
        'adaptability feels natural and when it becomes more difficult.'
      )

    case 'HARMONIOUS_CONNECTION':
      return (
        'Understand how the client expresses care, maintains ' +
        'harmony and handles responsibility toward close relationships, ' +
        'including where their own needs and responsibility toward ' +
        'others need balancing.'
      )

    case 'REFLECTIVE_DISCERNMENT':
      return (
        'Understand how the client thinks through important matters, ' +
        'how much reflection they need before deciding, and when ' +
        'deeper analysis helps versus when it delays action.'
      )

    case 'STRUCTURED_RESPONSIBILITY':
      return (
        'Understand how the client handles long-term responsibility, ' +
        'commitments and sustained effort, including where persistence ' +
        'comes naturally and where responsibility begins to feel heavy.'
      )

    case 'DIRECTED_FORCE':
      return (
        'Understand how the client responds when a situation requires ' +
        'courage or decisive action, including when they act quickly, ' +
        'when they hold back and how they respond under challenge.'
      )

    default:
      return defaultClientUnderstanding()
  }
}

function defaultClientUnderstanding(): string {
  return (
    'Understand where this numerological pattern appears ' +
    'in the client’s real life, where it appears differently, ' +
    'and which circumstances change its expression.'
  )
}

function getFunctionalQualityById(
  id: FunctionalQualityId
) {
  return Object.values(
    FUNCTIONAL_QUALITIES
  ).find(
    (quality) =>
      quality.id === id
  )
}

/**
 * Normalize punctuation only.
 *
 * Do not rewrite the actual evidence
 * statement here.
 */
function cleanSentence(
  value: string
): string {
  const cleaned =
    value.trim()

  if (!cleaned) {
    return ''
  }

  if (
    cleaned.endsWith('.') ||
    cleaned.endsWith('!') ||
    cleaned.endsWith('?')
  ) {
    return cleaned
  }

  return `${cleaned}.`
}