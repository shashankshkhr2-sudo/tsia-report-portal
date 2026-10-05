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
 * Version 1.2
 *
 * Purpose:
 *
 * Convert approved V3 intelligence into
 * natural practitioner-facing language.
 *
 * The explanation should sound like an
 * experienced numerologist explaining
 * the finding to a client.
 *
 * IMPORTANT:
 *
 * Actual V3 evidence remains authoritative.
 *
 * This layer does NOT:
 * - calculate numerology
 * - create evidence
 * - create conclusions
 * - change evidence strength
 * - change methodology
 * - infer life events
 * - determine Needed Number
 * - prescribe remedies
 * - determine Y3
 */

export const EMPLOYEE_EXPLANATION_VERSION =
  'TSIA_NUM_V3_EMPLOYEE_EXPLANATION_1.2' as const

export type EmployeeExplanation = {
  whyWeSayThis: string
  understandFromClient: string
}

/**
 * Build the employee-facing explanation
 * for one approved insight.
 */
export function buildEmployeeExplanation(
  insight: EmployeeInsight,
  allEvidence: readonly IntelligenceEvidence[]
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
 * Only evidence IDs already attached to
 * the approved EmployeeInsight may be used.
 *
 * Never infer additional evidence from
 * the number, Graha or quality.
 */
function resolveInsightEvidence(
  insight: EmployeeInsight,
  allEvidence: readonly IntelligenceEvidence[]
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
 * Main employee/client explanation.
 *
 * Architecture:
 *
 * actual evidence
 * → simple numerology explanation
 * → approved finding
 *
 * Technical evidence remains available
 * separately under "Numerology Behind This".
 */
function buildWhyWeSayThis(
  insight: EmployeeInsight,
  evidence: readonly IntelligenceEvidence[]
): string {
  if (evidence.length === 0) {
    return (
      'This is an approved numerological finding, ' +
      'but its detailed supporting evidence is not ' +
      'available in the current consultation view.'
    )
  }

  const qualityIds =
    insight.functionalQualityIds

  if (
    insight.source ===
      'CROSS_QUALITY' &&
    qualityIds.length >= 2
  ) {
    return buildCrossQualityExplanation(
      insight,
      evidence
    )
  }

  const qualityId =
    qualityIds[0]

  if (!qualityId) {
    return buildEvidenceOnlyExplanation(
      insight,
      evidence
    )
  }

  return buildSingleQualityExplanation(
    insight,
    qualityId,
    evidence
  )
}

/**
 * Explanation for a normal single-quality
 * conclusion.
 */
function buildSingleQualityExplanation(
  insight: EmployeeInsight,
  qualityId: FunctionalQualityId,
  evidence: readonly IntelligenceEvidence[]
): string {
  const quality =
    getFunctionalQualityById(
      qualityId
    )

  const relevantEvidence =
    evidence.filter(
      (item) =>
        !item.functionalQualityId ||
        item.functionalQualityId ===
          qualityId
    )

  const evidenceSentences =
    relevantEvidence
      .map(
        evidenceToNaturalSentence
      )
      .filter(
        (sentence) =>
          sentence.length > 0
      )

  const uniqueSentences =
    removeDuplicateStrings(
      evidenceSentences
    )

  const parts: string[] = []

  if (quality) {
    const introduction =
      buildQualityIntroduction(
        qualityId,
        quality.number,
        quality.graha,
        relevantEvidence
      )

    if (introduction) {
      parts.push(
        introduction
      )
    }
  }

  /**
   * Add supporting evidence not already
   * represented naturally by the opening.
   */
  const additionalEvidence =
    uniqueSentences.filter(
      (sentence) =>
        !isCoveredByIntroduction(
          sentence,
          relevantEvidence
        )
    )

  if (
    additionalEvidence.length > 0
  ) {
    parts.push(
      additionalEvidence.join(' ')
    )
  }

  const closing =
    buildNaturalClosing(
      insight,
      qualityId
    )

  if (closing) {
    parts.push(
      closing
    )
  }

  return parts
    .filter(Boolean)
    .join(' ')
}

/**
 * Build the first natural sentence.
 *
 * Prefer familiar numerology sources:
 *
 * Name Number
 * Mulank
 * Bhagyank
 *
 * Then explain Number + Graha + simple
 * client-facing meaning.
 */
function buildQualityIntroduction(
  qualityId: FunctionalQualityId,
  number: number,
  graha: string,
  evidence: readonly IntelligenceEvidence[]
): string {
  const primaryEvidence =
    findPreferredPrimaryEvidence(
      evidence
    )

  const simpleMeaning =
    simpleQualityMeaning(
      qualityId
    )

  if (primaryEvidence) {
    const sourceDescription =
      naturalPrimarySource(
        primaryEvidence
      )

    if (sourceDescription) {
      return (
        `${sourceDescription}, connected with ` +
        `${graha} and ${simpleMeaning}.`
      )
    }
  }

  return (
    `Number ${number} is connected with ` +
    `${graha} and ${simpleMeaning}.`
  )
}

/**
 * Prefer the most client-recognizable
 * numerology source for the opening.
 */
function findPreferredPrimaryEvidence(
  evidence: readonly IntelligenceEvidence[]
): IntelligenceEvidence | undefined {
  const preferredLayers:
    readonly IntelligenceEvidence['layer'][] = [
      'MULANK',
      'BHAGYANK',
      'NAME_NUMBER',
    ]

  for (
    const layer
    of preferredLayers
  ) {
    const match =
      evidence.find(
        (item) =>
          item.layer === layer
      )

    if (match) {
      return match
    }
  }

  return undefined
}

/**
 * Natural description of Mulank,
 * Bhagyank or Name Number.
 *
 * Use only values actually present
 * in the evidence record.
 */
function naturalPrimarySource(
  evidence: IntelligenceEvidence
): string {
  const finalNumber =
    evidence.number

  const sourceValue =
    readableSourceValue(
      evidence
    )

  switch (evidence.layer) {
    case 'MULANK':
      if (
        sourceValue &&
        finalNumber !== undefined
      ) {
        return (
          `Your Mulank is ` +
          `${formatCompoundNumber(
            sourceValue,
            finalNumber
          )}`
        )
      }

      if (
        finalNumber !== undefined
      ) {
        return (
          `Your Mulank is ` +
          `${finalNumber}`
        )
      }

      return 'Your Mulank'

    case 'BHAGYANK':
      if (
        sourceValue &&
        finalNumber !== undefined
      ) {
        return (
          `Your Bhagyank is ` +
          `${formatCompoundNumber(
            sourceValue,
            finalNumber
          )}`
        )
      }

      if (
        finalNumber !== undefined
      ) {
        return (
          `Your Bhagyank is ` +
          `${finalNumber}`
        )
      }

      return 'Your Bhagyank'

    case 'NAME_NUMBER':
      if (
        sourceValue &&
        finalNumber !== undefined
      ) {
        return (
          `Your Name Number is ` +
          `${formatCompoundNumber(
            sourceValue,
            finalNumber
          )}`
        )
      }

      if (
        finalNumber !== undefined
      ) {
        return (
          `Your Name Number is ` +
          `${finalNumber}`
        )
      }

      return 'Your Name Number'

    default:
      return ''
  }
}

/**
 * Translate additional evidence into
 * natural numerologist language.
 *
 * Do not expose internal software terms.
 */
function evidenceToNaturalSentence(
  evidence: IntelligenceEvidence
): string {
  switch (evidence.layer) {
    case 'MULANK':
    case 'BHAGYANK':
    case 'NAME_NUMBER':
      /**
       * Usually already explained in the
       * introduction.
       */
      return ''

    case 'REPETITION':
      return repetitionSentence(
        evidence
      )

    case 'RAW_LO_SHU':
      return rawLoShuSentence(
        evidence
      )

    case 'DERIVED_LO_SHU':
      return personalLoShuSentence(
        evidence
      )

    case 'MISSING_NUMBER':
      return missingNumberSentence(
        evidence
      )

    case 'ROW':
      return structureSentence(
        evidence,
        'Lo Shu row'
      )

    case 'COLUMN':
      return structureSentence(
        evidence,
        'Lo Shu column'
      )

    case 'RAJYOG':
      return structureSentence(
        evidence,
        'Rajyog pattern'
      )

    case 'COMPOUND_BIRTH_CONTEXT':
      return compoundContextSentence(
        evidence
      )

    default:
      return ''
  }
}

/**
 * Repetition explanation.
 *
 * Use the actual evidence statement to
 * determine that repetition evidence
 * exists, but present it naturally.
 */
function repetitionSentence(
  evidence: IntelligenceEvidence
): string {
  const number =
    evidence.number

  const count =
    parsePositiveInteger(
      evidence.sourceValue
    )

  if (
    number !== undefined &&
    count !== null
  ) {
    return (
      `Number ${number} also appears ` +
      `${count} ${count === 1
        ? 'time'
        : 'times'} in the Personal Lo Shu, ` +
      `giving this pattern additional support.`
    )
  }

  if (
    number !== undefined
  ) {
    return (
      `Number ${number} also has repetition ` +
      `support in the Personal Lo Shu.`
    )
  }

  return (
    'The Personal Lo Shu also provides ' +
    'repetition support for this pattern.'
  )
}

function rawLoShuSentence(
  evidence: IntelligenceEvidence
): string {
  if (
    evidence.number !==
    undefined
  ) {
    return (
      `Number ${evidence.number} is also present ` +
      `in the birth-date numbers used for the ` +
      `Lo Shu analysis.`
    )
  }

  return (
    'The birth-date numbers in the Lo Shu ' +
    'also contribute to this finding.'
  )
}

function personalLoShuSentence(
  evidence: IntelligenceEvidence
): string {
  if (
    evidence.number !==
    undefined
  ) {
    return (
      `Number ${evidence.number} is also represented ` +
      `in the Personal Lo Shu.`
    )
  }

  return (
    'The Personal Lo Shu also contributes ' +
    'to this finding.'
  )
}

/**
 * Missing number is deliberately described
 * as under-support, not as a negative trait.
 */
function missingNumberSentence(
  evidence: IntelligenceEvidence
): string {
  if (
    evidence.number !==
    undefined
  ) {
    return (
      `Number ${evidence.number} is not directly ` +
      `represented in the Personal Lo Shu, so this ` +
      `quality may need to be understood more carefully ` +
      `in the client’s real-life experience.`
    )
  }

  return (
    'The Personal Lo Shu shows an under-supported ' +
    'area that should be understood through the ' +
    'client’s real-life experience.'
  )
}

/**
 * Structural evidence remains grounded in
 * the actual V3 evidence statement.
 *
 * We do not invent a new interpretation
 * of a row, column or Rajyog here.
 */
function structureSentence(
  evidence: IntelligenceEvidence,
  label: string
): string {
  const statement =
    cleanSentence(
      evidence.statement
    )

  if (!statement) {
    return (
      `An approved ${label} also contributes ` +
      `to this finding.`
    )
  }

  return (
    `An approved ${label} also contributes ` +
    `to this finding: ${lowercaseFirst(
      statement
    )}`
  )
}

/**
 * Compound birth context remains contextual
 * only. It never becomes an independent
 * personality or outcome claim.
 */
function compoundContextSentence(
  evidence: IntelligenceEvidence
): string {
  const sourceValue =
    readableSourceValue(
      evidence
    )

  if (sourceValue) {
    return (
      `The birth-date compound ${sourceValue} ` +
      `also provides supporting context for ` +
      `this interpretation.`
    )
  }

  return (
    'The verified birth-date compound also ' +
    'provides supporting context for this interpretation.'
  )
}

/**
 * Natural closing.
 *
 * IMPORTANT:
 * "Strongly supported" means strong evidence
 * for the pattern. It does not mean the trait
 * is automatically a positive "strength".
 */
function buildNaturalClosing(
  insight: EmployeeInsight,
  qualityId: FunctionalQualityId
): string {
  const meaning =
    simpleQualityMeaning(
      qualityId
    )

  if (
    insight.strength ===
    'STRONGLY_SUPPORTED'
  ) {
    return (
      `Together, these numbers show a clear ` +
      `pattern connected with ${meaning}.`
    )
  }

  if (
    insight.strength ===
    'SUPPORTED'
  ) {
    return (
      `Together, these numbers support a ` +
      `visible pattern connected with ${meaning}.`
    )
  }

  if (
    insight.strength ===
    'CONTEXT_DEPENDENT'
  ) {
    return (
      `The numbers indicate this pattern, but ` +
      `how ${meaning} is expressed may change ` +
      `depending on the situation.`
    )
  }

  return ''
}

/**
 * Cross-quality explanation.
 *
 * Each side is explained from its own
 * actual evidence before the approved
 * relationship is described.
 */
function buildCrossQualityExplanation(
  insight: EmployeeInsight,
  evidence: readonly IntelligenceEvidence[]
): string {
  const [
    qualityAId,
    qualityBId,
  ] =
    insight.functionalQualityIds

  if (
    !qualityAId ||
    !qualityBId
  ) {
    return buildEvidenceOnlyExplanation(
      insight,
      evidence
    )
  }

  const qualityA =
    getFunctionalQualityById(
      qualityAId
    )

  const qualityB =
    getFunctionalQualityById(
      qualityBId
    )

  if (
    !qualityA ||
    !qualityB
  ) {
    return buildEvidenceOnlyExplanation(
      insight,
      evidence
    )
  }

  const evidenceA =
    evidence.filter(
      (item) =>
        item.functionalQualityId ===
        qualityAId
    )

  const evidenceB =
    evidence.filter(
      (item) =>
        item.functionalQualityId ===
        qualityBId
    )

  const parts: string[] = []

  const sourceA =
    buildShortQualityEvidence(
      qualityAId,
      qualityA.number,
      qualityA.graha,
      evidenceA
    )

  const sourceB =
    buildShortQualityEvidence(
      qualityBId,
      qualityB.number,
      qualityB.graha,
      evidenceB
    )

  if (sourceA) {
    parts.push(sourceA)
  }

  if (sourceB) {
    parts.push(sourceB)
  }

  const relationship =
    crossQualityRelationshipSentence(
      insight,
      qualityAId,
      qualityBId
    )

  if (relationship) {
    parts.push(
      relationship
    )
  }

  return parts.join(' ')
}

function buildShortQualityEvidence(
  qualityId: FunctionalQualityId,
  number: number,
  graha: string,
  evidence: readonly IntelligenceEvidence[]
): string {
  const primary =
    findPreferredPrimaryEvidence(
      evidence
    )

  const meaning =
    simpleQualityMeaning(
      qualityId
    )

  if (primary) {
    const source =
      naturalPrimarySource(
        primary
      )

    if (source) {
      return (
        `${source}, connected with ` +
        `${graha} and ${meaning}.`
      )
    }
  }

  return (
    `Number ${number}, connected with ` +
    `${graha} and ${meaning}, contributes ` +
    `to this combined pattern.`
  )
}

function crossQualityRelationshipSentence(
  insight: EmployeeInsight,
  qualityAId: FunctionalQualityId,
  qualityBId: FunctionalQualityId
): string {
  const qualityA =
    simpleQualityMeaning(
      qualityAId
    )

  const qualityB =
    simpleQualityMeaning(
      qualityBId
    )

  switch (insight.relationship) {
    case 'COMPLEMENT':
      return (
        `The approved V3 analysis shows that ` +
        `${qualityA} and ${qualityB} can operate ` +
        `alongside each other.`
      )

    case 'CONTEXTUALIZE':
      return (
        `The approved V3 analysis shows that the ` +
        `balance between ${qualityA} and ${qualityB} ` +
        `needs to be understood in context.`
      )

    case 'TENSION':
      return (
        `The approved V3 analysis identifies a possible ` +
        `tension between ${qualityA} and ${qualityB}. ` +
        `How this appears in real life should be understood ` +
        `through the client’s experience.`
      )

    default:
      return (
        'These numerological qualities contribute ' +
        'to the approved combined finding.'
      )
  }
}

/**
 * Fallback when no Functional Quality ID
 * is available.
 *
 * Preserve the actual evidence statement
 * rather than inventing an interpretation.
 */
function buildEvidenceOnlyExplanation(
  insight: EmployeeInsight,
  evidence: readonly IntelligenceEvidence[]
): string {
  const statements =
    removeDuplicateStrings(
      evidence
        .map(
          (item) =>
            cleanSentence(
              item.statement
            )
        )
        .filter(Boolean)
    )

  if (
    statements.length > 0
  ) {
    return statements.join(' ')
  }

  return (
    cleanSentence(
      insight.statement
    ) ||
    'This finding comes from the approved V3 analysis.'
  )
}

/**
 * UNDERSTAND FROM CLIENT
 *
 * This is not asking whether numerology
 * is "correct".
 *
 * It identifies what the numerology alone
 * cannot establish about this particular
 * person's real-life manifestation.
 */
function buildUnderstandFromClient(
  insight: EmployeeInsight
): string {
  if (
    insight.relationship ===
    'COMPLEMENT'
  ) {
    return (
      'Understand where these two qualities work together ' +
      'in the client’s real life, where one becomes more ' +
      'prominent, and whether their interaction changes ' +
      'across different situations.'
    )
  }

  if (
    insight.relationship ===
    'CONTEXTUALIZE'
  ) {
    return (
      'Understand where this pattern appears clearly, ' +
      'where it appears differently, and which situations ' +
      'change the way these qualities are expressed.'
    )
  }

  if (
    insight.relationship ===
    'TENSION'
  ) {
    return (
      'Understand whether the client experiences these ' +
      'qualities pulling in different directions, when ' +
      'that happens, and how they usually respond.'
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
        'expresses what they know: where expression comes naturally ' +
        'and where turning ideas into clear communication or action ' +
        'becomes more difficult.'
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
        'communication and changing situations: when adaptability ' +
        'comes naturally and when it becomes more difficult.'
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
        'commitments and sustained effort: where persistence comes ' +
        'naturally and where responsibility begins to feel heavy.'
      )

    case 'DIRECTED_FORCE':
      return (
        'Understand how the client responds when a situation requires ' +
        'courage or decisive action: when they act quickly, when they ' +
        'hold back and how they respond under challenge.'
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

/**
 * Simple employee/client-facing meanings.
 *
 * These do not replace the locked
 * Functional Quality definitions.
 */
function simpleQualityMeaning(
  id: FunctionalQualityId
): string {
  switch (id) {
    case 'INDIVIDUAL_AGENCY':
      return 'self-direction'

    case 'RELATIONAL_RECEPTIVITY':
      return (
        'understanding others and emotional sensitivity'
      )

    case 'KNOWLEDGE_EXPRESSION':
      return (
        'learning and expressing ideas'
      )

    case 'ADAPTIVE_RESTRUCTURING':
      return (
        'handling change and finding different approaches'
      )

    case 'ADAPTIVE_INTELLIGENCE':
      return (
        'communication and adaptability'
      )

    case 'HARMONIOUS_CONNECTION':
      return (
        'care, harmony and connection'
      )

    case 'REFLECTIVE_DISCERNMENT':
      return (
        'reflection and deeper thinking'
      )

    case 'STRUCTURED_RESPONSIBILITY':
      return (
        'responsibility and persistence'
      )

    case 'DIRECTED_FORCE':
      return (
        'courage and taking action'
      )
  }
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
 * Prevent repeating the same natural
 * explanation sentence.
 */
function removeDuplicateStrings(
  values: readonly string[]
): string[] {
  const seen =
    new Set<string>()

  const result:
    string[] = []

  for (const value of values) {
    const cleaned =
      value.trim()

    if (!cleaned) {
      continue
    }

    const key =
      cleaned.toLowerCase()

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(cleaned)
  }

  return result
}

/**
 * Primary source is already represented
 * in the opening sentence.
 *
 * Currently only Mulank/Bhagyank/Name
 * Number produce empty additional
 * sentences, so this is intentionally
 * conservative.
 */
function isCoveredByIntroduction(
  sentence: string,
  _evidence: readonly IntelligenceEvidence[]
): boolean {
  return sentence.trim() === ''
}

function readableSourceValue(
  evidence: IntelligenceEvidence
): string | null {
  if (
    evidence.sourceValue ===
      undefined ||
    evidence.sourceValue ===
      null
  ) {
    return null
  }

  const value =
    String(
      evidence.sourceValue
    ).trim()

  return value
    ? value
    : null
}

/**
 * Example:
 *
 * source 46 + final 1
 * → 46/1
 *
 * If the source already equals the final
 * number, do not produce 1/1.
 */
function formatCompoundNumber(
  sourceValue: string,
  finalNumber: number
): string {
  if (
    sourceValue ===
    String(finalNumber)
  ) {
    return String(
      finalNumber
    )
  }

  return (
    `${sourceValue}/${finalNumber}`
  )
}

function parsePositiveInteger(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null
  }

  const parsed =
    Number(
      String(value).trim()
    )

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    return null
  }

  return parsed
}

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

function lowercaseFirst(
  value: string
): string {
  if (!value) {
    return value
  }

  return (
    value.charAt(0).toLowerCase() +
    value.slice(1)
  )
}