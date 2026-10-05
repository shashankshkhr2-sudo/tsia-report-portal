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

export const EMPLOYEE_EXPLANATION_VERSION =
  'TSIA_NUM_V3_EMPLOYEE_EXPLANATION_1.0' as const

export type EmployeeExplanation = {
  whyWeSayThis: string
  understandFromClient: string
}

/**
 * Employee Explanation Layer
 *
 * Converts already-approved V3 findings
 * and their actual evidence into language
 * that is easier for a practitioner to use.
 *
 * It does NOT:
 * - create a numerology finding
 * - change evidence strength
 * - change V3 conclusions
 * - infer a life event
 * - determine Needed Number
 * - prescribe a remedy
 * - determine Y3
 */
export function buildEmployeeExplanation(
  insight: EmployeeInsight,
  allEvidence:
    readonly IntelligenceEvidence[]
): EmployeeExplanation {
  const evidence =
    allEvidence.filter(
      (item) =>
        insight.evidenceIds.includes(
          item.id
        )
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

function buildWhyWeSayThis(
  insight: EmployeeInsight,
  evidence:
    readonly IntelligenceEvidence[]
): string {
  if (evidence.length === 0) {
    return 'This is an approved V3 numerology finding. Its detailed supporting evidence is not currently available in this view.'
  }

  const evidenceParts =
    evidence.map(
      describeEvidence
    )

  if (
    insight.functionalQualityIds
      .length === 1
  ) {
    const quality =
      getQuality(
        insight
          .functionalQualityIds[0]
      )

    if (quality) {
      return [
        `${quality.number} is associated with ${quality.graha} and ${simpleQualityName(
          quality.id
        )}.`,
        ...evidenceParts,
        buildConclusionSentence(
          insight
        ),
      ].join(' ')
    }
  }

  if (
    insight.functionalQualityIds
      .length > 1
  ) {
    const qualities =
      insight.functionalQualityIds
        .map(getQuality)
        .filter(
          (
            item
          ): item is NonNullable<
            ReturnType<
              typeof getQuality
            >
          > => Boolean(item)
        )

    const qualityText =
      qualities
        .map(
          (quality) =>
            `${quality.number} (${quality.graha})`
        )
        .join(' and ')

    return [
      qualityText
        ? `This finding brings together evidence connected with ${qualityText}.`
        : 'This finding brings together more than one numerological quality.',
      ...evidenceParts,
      buildConclusionSentence(
        insight
      ),
    ].join(' ')
  }

  return [
    ...evidenceParts,
    buildConclusionSentence(
      insight
    ),
  ].join(' ')
}

function describeEvidence(
  evidence: IntelligenceEvidence
): string {
  const numberText =
    evidence.number !== undefined
      ? `Number ${evidence.number}`
      : 'This evidence'

  switch (evidence.layer) {
    case 'MULANK':
      return `${numberText} appears as the client’s Mulank, making it part of the core birth-day pattern.`

    case 'BHAGYANK':
      return `${numberText} appears as the client’s Bhagyank, making it part of the broader birth-date pattern.`

    case 'NAME_NUMBER':
      return evidence.sourceValue
        ? `The Name Number total is ${evidence.sourceValue} and reduces to ${evidence.number}, so this quality is also present in name-based or outward expression.`
        : `${numberText} appears through the Name Number and contributes to name-based or outward expression.`

    case 'RAW_LO_SHU':
      return `${numberText} is present directly through the birth-date digits in the Lo Shu structure.`

    case 'DERIVED_LO_SHU':
      return `${numberText} is present in the Personal Lo Shu through the approved TSIA construction.`

    case 'REPETITION':
      return evidence.sourceValue
        ? `${numberText} appears ${evidence.sourceValue} times, giving this quality stronger representation in the Personal Lo Shu.`
        : `${numberText} is repeated, giving this quality stronger representation in the Personal Lo Shu.`

    case 'MISSING_NUMBER':
      return `${numberText} is not represented in the Personal Lo Shu, so this quality is treated as an area that may require conscious development rather than as a negative prediction.`

    case 'ROW':
      return 'An approved Lo Shu row pattern also contributes structural evidence to this finding.'

    case 'COLUMN':
      return 'An approved Lo Shu column pattern also contributes structural evidence to this finding.'

    case 'RAJYOG':
      return 'An approved Rajyog structure also contributes structural evidence to this finding.'

    case 'COMPOUND_BIRTH_CONTEXT':
      return evidence.sourceValue
        ? `The birth-date compound ${evidence.sourceValue} provides additional contextual evidence for this finding.`
        : 'The birth-date compound provides additional contextual evidence for this finding.'
  }
}

function buildConclusionSentence(
  insight: EmployeeInsight
): string {
  if (
    insight.relationship ===
    'COMPLEMENT'
  ) {
    return 'Taken together, the approved evidence shows that these qualities can operate alongside and support one another.'
  }

  if (
    insight.relationship ===
    'CONTEXTUALIZE'
  ) {
    return 'Taken together, the evidence shows an uneven or context-sensitive relationship between these qualities, so the way they appear in real life should be understood carefully.'
  }

  if (
    insight.relationship ===
    'TENSION'
  ) {
    return 'Taken together, the approved evidence indicates a possible functional tension whose real-life expression should be understood with the client.'
  }

  if (
    insight.strength ===
    'STRONGLY_SUPPORTED'
  ) {
    return 'Together, this gives the pattern a clear presence in the client’s numerology.'
  }

  if (
    insight.strength ===
    'SUPPORTED'
  ) {
    return 'Together, this gives the pattern visible support in the client’s numerology.'
  }

  if (
    insight.strength ===
    'CONTEXT_DEPENDENT'
  ) {
    return 'The pattern is present, but its expression may depend on the situation or surrounding numerological evidence.'
  }

  return 'These evidence sources together support the approved V3 finding.'
}

function buildUnderstandFromClient(
  insight: EmployeeInsight
): string {
  if (
    insight.relationship ===
    'COMPLEMENT'
  ) {
    return 'Understand where these qualities naturally work together in the client’s life, where one becomes more dominant, and whether their interaction changes between different situations.'
  }

  if (
    insight.relationship ===
    'CONTEXTUALIZE'
  ) {
    return 'Understand where this pattern appears clearly, where it appears differently, and which situations make one side of the pattern more visible than the other.'
  }

  if (
    insight.relationship ===
    'TENSION'
  ) {
    return 'Understand whether the client actually experiences these qualities pulling in different directions, when that happens, and how the client usually responds.'
  }

  const qualityId =
    insight.functionalQualityIds[0]

  switch (qualityId) {
    case 'INDIVIDUAL_AGENCY':
      return 'Understand how the client makes important decisions: where they rely strongly on their own judgment, where they seek other people’s input, and whether this changes between personal and professional situations.'

    case 'RELATIONAL_RECEPTIVITY':
      return 'Understand how the client experiences other people’s feelings and viewpoints, how easily they consider different perspectives, and where emotional sensitivity or accommodation becomes stronger or weaker.'

    case 'KNOWLEDGE_EXPRESSION':
      return 'Understand how the client learns, develops ideas and explains what they know, including where expression comes naturally and where turning ideas into clear communication or action becomes harder.'

    case 'ADAPTIVE_RESTRUCTURING':
      return 'Understand how the client responds when an existing approach stops working: whether they challenge it, restructure it, try an unconventional route or prefer to preserve the existing system.'

    case 'ADAPTIVE_INTELLIGENCE':
      return 'Understand how the client handles changing information, communication and rapidly changing situations, including when adaptability feels natural and when it becomes more difficult.'

    case 'HARMONIOUS_CONNECTION':
      return 'Understand how the client expresses care, maintains harmony and handles responsibility toward close relationships, including where personal needs and responsibility toward others need balancing.'

    case 'REFLECTIVE_DISCERNMENT':
      return 'Understand how the client thinks through important matters, how much reflection they need before deciding, and when deeper analysis helps versus when it delays action.'

    case 'STRUCTURED_RESPONSIBILITY':
      return 'Understand how the client handles long-term responsibility, commitments and sustained effort, including where persistence is natural and where responsibility begins to feel heavy.'

    case 'DIRECTED_FORCE':
      return 'Understand how the client acts when a situation requires courage or decisive action, including when they act quickly, when they hold back and how they respond under challenge.'

    default:
      return 'Understand where this numerological pattern appears in the client’s real life, where it appears differently, and what circumstances change its expression.'
  }
}

function getQuality(
  id: FunctionalQualityId
) {
  return Object.values(
    FUNCTIONAL_QUALITIES
  ).find(
    (quality) =>
      quality.id === id
  )
}

function simpleQualityName(
  id: FunctionalQualityId
): string {
  switch (id) {
    case 'INDIVIDUAL_AGENCY':
      return 'self-direction'

    case 'RELATIONAL_RECEPTIVITY':
      return 'understanding others and emotional sensitivity'

    case 'KNOWLEDGE_EXPRESSION':
      return 'learning and meaningful expression'

    case 'ADAPTIVE_RESTRUCTURING':
      return 'handling change through different approaches'

    case 'ADAPTIVE_INTELLIGENCE':
      return 'communication and adaptability'

    case 'HARMONIOUS_CONNECTION':
      return 'care, harmony and connection'

    case 'REFLECTIVE_DISCERNMENT':
      return 'reflection and deeper thinking'

    case 'STRUCTURED_RESPONSIBILITY':
      return 'responsibility and persistence'

    case 'DIRECTED_FORCE':
      return 'courage and decisive action'
  }
}