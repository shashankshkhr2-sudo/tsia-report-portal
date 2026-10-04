import type {
  FunctionalQualityId,
  IntelligenceDomain,
} from './types'

/**
 * TSIA Numerology Intelligence V3
 * Cross-Quality Rule Set
 *
 * Version: Draft 1.0
 *
 * IMPORTANT
 * ----------
 * This layer sits ABOVE the existing
 * single-quality Conclusion Engine.
 *
 * It must NOT:
 * - modify frozen V2 calculations
 * - replace individual quality conclusions
 * - invent interactions for unapproved pairs
 * - convert asymmetry into tension
 * - determine Needed Number
 * - determine remedies
 * - determine Y3
 */

export const CROSS_QUALITY_RULESET_VERSION =
  'TSIA_NUM_V3_CROSS_QUALITY_DRAFT_1.0' as const

export type CrossQualityRuleStatus =
  | 'PROVISIONAL_APPROVED'
  | 'RESEARCH_CANDIDATE'

export type CrossQualityRelationship =
  | 'COMPLEMENT'
  | 'MODERATE'
  | 'COMPENSATE'
  | 'TENSION'
  | 'CONTEXTUALIZE'
  | 'COEXIST'
  | 'INSUFFICIENT'

export type CrossQualityRule = {
  ruleId: string

  qualityA: FunctionalQualityId
  qualityB: FunctionalQualityId

  relationshipName: string

  status: CrossQualityRuleStatus

  defaultRelationship:
    CrossQualityRelationship

  functionalRationale: string

  supportedSupportedStatement: string

  qualityASupportedQualityBUnderSupportedStatement:
    string

  qualityAUnderSupportedQualityBSupportedStatement:
    string

  allowedDomains:
    readonly IntelligenceDomain[]

  tensionAllowed: boolean

  structuralSupremacyRequired: boolean

  automaticNeededNumberAllowed: false
  automaticRemedyAllowed: false
  automaticY3Allowed: false

  restrictions: readonly string[]
}

/**
 * Universal restrictions applied to every
 * cross-quality rule.
 */
export const CROSS_QUALITY_UNIVERSAL_RESTRICTIONS =
  [
    'NO_SPECIFIC_LIFE_EVENT',
    'NO_RELATIONSHIP_STATUS',
    'NO_RELATIONSHIP_OUTCOME',
    'NO_CAREER_OUTCOME',
    'NO_BUSINESS_SUCCESS_PREDICTION',
    'NO_WEALTH_PREDICTION',
    'NO_HEALTH_EVENT',
    'NO_ASTROLOGICAL_GRAHA_DIAGNOSIS',
    'NO_AUTOMATIC_NEEDED_NUMBER',
    'NO_AUTOMATIC_REMEDY',
    'NO_AUTOMATIC_Y3',
  ] as const

/**
 * Provisional production candidates approved
 * for software implementation before the
 * planned 20-real-client validation study.
 */
export const PROVISIONAL_CROSS_QUALITY_RULES:
  readonly CrossQualityRule[] = [
  {
    ruleId:
      'NUM_XQ_1_2_SELF_OTHER',

    qualityA:
      'INDIVIDUAL_AGENCY',

    qualityB:
      'RELATIONAL_RECEPTIVITY',

    relationshipName:
      'Self-Direction and Relational Receptivity',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Individual self-direction and receptivity to other people or perspectives are distinct but potentially complementary functional capacities.',

    supportedSupportedStatement:
      'Capacity for maintaining personal direction can operate alongside receptivity to other people, perspectives and interpersonal context.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Self-direction appears more readily supported than relational receptivity. Development may involve incorporating other perspectives and interpersonal context without unnecessarily surrendering independent judgment.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Relational receptivity appears more readily supported than independent self-direction. Development may involve strengthening initiative, boundaries and independent expression while preserving cooperation and receptivity.',

    allowedDomains: [
      'CORE',
      'PROBLEM_SOLVING',
      'DECISION_MAKING',
      'FAMILY',
      'PARTNER',
      'ROMANCE',
      'CAREER',
      'BUSINESS',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      false,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },

  {
    ruleId:
      'NUM_XQ_1_8_AGENCY_RESPONSIBILITY',

    qualityA:
      'INDIVIDUAL_AGENCY',

    qualityB:
      'STRUCTURED_RESPONSIBILITY',

    relationshipName:
      'Agency and Sustained Responsibility',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Self-direction and ownership can operate alongside endurance, accountability and sustained responsibility.',

    supportedSupportedStatement:
      'Personal direction and ownership can operate alongside the capacity to sustain responsibility and longer-term effort.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Independent direction or initiative may be more readily supported than sustained responsibility or longer-term execution.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Responsibility and endurance may be more readily supported than independent initiation or self-direction.',

    allowedDomains: [
      'CORE',
      'PROBLEM_SOLVING',
      'DECISION_MAKING',
      'CAREER',
      'BUSINESS',
      'MONEY',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      true,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },

  {
    ruleId:
      'NUM_XQ_1_9_DIRECTION_ACTION',

    qualityA:
      'INDIVIDUAL_AGENCY',

    qualityB:
      'DIRECTED_FORCE',

    relationshipName:
      'Direction and Action',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Self-direction concerns internally defined direction or ownership, while directed force concerns capacity for courageous or decisive action.',

    supportedSupportedStatement:
      'Independent direction can operate alongside the capacity for decisive or courageous action.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Independent direction may be more readily supported than assertive or courageous execution.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Action capacity may be more readily supported than internally defined direction or independent initiative.',

    allowedDomains: [
      'CORE',
      'PROBLEM_SOLVING',
      'DECISION_MAKING',
      'CAREER',
      'BUSINESS',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      true,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },

  {
    ruleId:
      'NUM_XQ_2_3_RECEPTIVE_EXPRESSION',

    qualityA:
      'RELATIONAL_RECEPTIVITY',

    qualityB:
      'KNOWLEDGE_EXPRESSION',

    relationshipName:
      'Receptive Understanding and Meaningful Expression',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Relational receptivity supports receiving interpersonal or emotional context, while knowledge and expression support developing and communicating meaningful understanding.',

    supportedSupportedStatement:
      'Receptivity to people, perspectives or interpersonal context can operate alongside the capacity to develop and express understanding meaningfully.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Receptivity to people or context may be more readily supported than the ability to organize and express that understanding clearly.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Knowledge development and meaningful expression may be more readily supported than interpersonal or emotional receptivity.',

    allowedDomains: [
      'CORE',
      'PROBLEM_SOLVING',
      'DECISION_MAKING',
      'FAMILY',
      'PARTNER',
      'ROMANCE',
      'CAREER',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      false,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },

  {
    ruleId:
      'NUM_XQ_2_5_RECEPTIVE_ADAPTATION',

    qualityA:
      'RELATIONAL_RECEPTIVITY',

    qualityB:
      'ADAPTIVE_INTELLIGENCE',

    relationshipName:
      'Receptivity and Adaptive Exchange',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Relational receptivity concerns receiving interpersonal or contextual information, while adaptive intelligence concerns processing, exchanging and adapting information.',

    supportedSupportedStatement:
      'Interpersonal or contextual receptivity can operate alongside flexible information processing, exchange and adaptation.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Interpersonal or contextual receptivity may be more readily supported than rapid adaptation or flexible information exchange.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Flexible information processing and exchange may be more readily supported than interpersonal or emotional receptivity.',

    allowedDomains: [
      'CORE',
      'PROBLEM_SOLVING',
      'DECISION_MAKING',
      'FAMILY',
      'PARTNER',
      'ROMANCE',
      'CAREER',
      'BUSINESS',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      true,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },

  {
    ruleId:
      'NUM_XQ_2_6_ATTUNEMENT_CARE',

    qualityA:
      'RELATIONAL_RECEPTIVITY',

    qualityB:
      'HARMONIOUS_CONNECTION',

    relationshipName:
      'Attunement and Relational Care',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Relational receptivity concerns awareness of people and interpersonal context, while harmonious connection concerns care, affection, value and relational responsibility.',

    supportedSupportedStatement:
      'Receptivity to others can operate alongside the capacity to express care and support relational harmony.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Interpersonal receptivity may be more readily supported than sustained expression of care, harmony or relational responsibility.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Care and relational responsibility may be more readily supported than interpersonal or emotional receptivity.',

    allowedDomains: [
      'CORE',
      'FAMILY',
      'PARTNER',
      'ROMANCE',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      true,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },

  {
    ruleId:
      'NUM_XQ_3_5_MEANING_EXCHANGE',

    qualityA:
      'KNOWLEDGE_EXPRESSION',

    qualityB:
      'ADAPTIVE_INTELLIGENCE',

    relationshipName:
      'Meaning and Information Exchange',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Knowledge and expression concern developing and organizing meaning, while adaptive intelligence concerns flexible information processing, exchange and adaptation.',

    supportedSupportedStatement:
      'The capacity to develop and express meaningful understanding can operate alongside adaptive information processing and exchange.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Meaning development and expression may be more readily supported than flexible information exchange or adaptation.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Flexible information processing and exchange may be more readily supported than deeper organization or expression of meaning.',

    allowedDomains: [
      'CORE',
      'PROBLEM_SOLVING',
      'DECISION_MAKING',
      'CAREER',
      'BUSINESS',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      true,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },

  {
    ruleId:
      'NUM_XQ_3_7_EXPANSION_DISCERNMENT',

    qualityA:
      'KNOWLEDGE_EXPRESSION',

    qualityB:
      'REFLECTIVE_DISCERNMENT',

    relationshipName:
      'Expansion and Discernment',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Knowledge expansion develops and organizes understanding, while reflective discernment examines, questions and evaluates more deeply.',

    supportedSupportedStatement:
      'Expansion of understanding can operate alongside reflective examination and discernment.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Learning, meaning development or expression may be more readily supported than deeper reflective examination.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Reflective examination and discernment may be more readily supported than expansion or outward articulation of understanding.',

    allowedDomains: [
      'CORE',
      'PROBLEM_SOLVING',
      'DECISION_MAKING',
      'CAREER',
      'BUSINESS',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      true,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },

  {
    ruleId:
      'NUM_XQ_5_7_ADAPTATION_REFLECTION',

    qualityA:
      'ADAPTIVE_INTELLIGENCE',

    qualityB:
      'REFLECTIVE_DISCERNMENT',

    relationshipName:
      'Adaptation and Reflection',

    status:
      'PROVISIONAL_APPROVED',

    defaultRelationship:
      'COMPLEMENT',

    functionalRationale:
      'Adaptive intelligence concerns flexible information processing and response, while reflective discernment concerns deeper examination and inner inquiry.',

    supportedSupportedStatement:
      'Flexible information processing and adaptation can operate alongside deeper reflective examination and discernment.',

    qualityASupportedQualityBUnderSupportedStatement:
      'Adaptive information processing may be more readily supported than sustained reflective examination.',

    qualityAUnderSupportedQualityBSupportedStatement:
      'Reflective examination and discernment may be more readily supported than rapid adaptation or flexible information exchange.',

    allowedDomains: [
      'CORE',
      'PROBLEM_SOLVING',
      'DECISION_MAKING',
      'CAREER',
      'BUSINESS',
      'GUIDANCE',
    ],

    tensionAllowed: false,

    structuralSupremacyRequired:
      true,

    automaticNeededNumberAllowed:
      false,

    automaticRemedyAllowed:
      false,

    automaticY3Allowed:
      false,

    restrictions:
      CROSS_QUALITY_UNIVERSAL_RESTRICTIONS,
  },
]

/**
 * Research candidates.
 *
 * These must NOT generate production
 * cross-quality conclusions.
 */
export const RESEARCH_CROSS_QUALITY_PAIRS =
  [
    [
      'INDIVIDUAL_AGENCY',
      'ADAPTIVE_RESTRUCTURING',
    ],

    [
      'INDIVIDUAL_AGENCY',
      'ADAPTIVE_INTELLIGENCE',
    ],

    [
      'RELATIONAL_RECEPTIVITY',
      'REFLECTIVE_DISCERNMENT',
    ],

    [
      'RELATIONAL_RECEPTIVITY',
      'DIRECTED_FORCE',
    ],

    [
      'ADAPTIVE_RESTRUCTURING',
      'ADAPTIVE_INTELLIGENCE',
    ],

    [
      'ADAPTIVE_RESTRUCTURING',
      'REFLECTIVE_DISCERNMENT',
    ],

    [
      'REFLECTIVE_DISCERNMENT',
      'STRUCTURED_RESPONSIBILITY',
    ],

    [
      'STRUCTURED_RESPONSIBILITY',
      'DIRECTED_FORCE',
    ],
  ] as const

/**
 * Governing methodology rules.
 */
export const CROSS_QUALITY_GOVERNING_RULES =
  {
    noApprovedRuleDefaultsTo:
      'COEXIST',

    differentQualitiesAutomaticallyCreateTension:
      false,

    asymmetricSupportAutomaticallyCreatesTension:
      false,

    pairIdentityAloneCanCreateTension:
      false,

    structuralEvidenceMustNotBeDoubleCounted:
      true,

    crossQualityCanDetermineNeededNumber:
      false,

    crossQualityCanDetermineRemedy:
      false,

    crossQualityCanDetermineY3:
      false,

    clientValidationCanIncreaseMethodologyStrength:
      false,

    paymentCanIncreaseDiagnosisStrength:
      false,
  } as const

/**
 * Find a provisional approved rule regardless
 * of the order in which the two qualities
 * are supplied.
 */
export function findCrossQualityRule(
  qualityA: FunctionalQualityId,
  qualityB: FunctionalQualityId
): CrossQualityRule | undefined {
  return PROVISIONAL_CROSS_QUALITY_RULES.find(
    rule =>
      (
        rule.qualityA === qualityA &&
        rule.qualityB === qualityB
      ) ||
      (
        rule.qualityA === qualityB &&
        rule.qualityB === qualityA
      )
  )
}

/**
 * Returns true only when the pair is still
 * explicitly classified as research.
 */
export function isResearchCrossQualityPair(
  qualityA: FunctionalQualityId,
  qualityB: FunctionalQualityId
): boolean {
  return RESEARCH_CROSS_QUALITY_PAIRS.some(
    pair =>
      (
        pair[0] === qualityA &&
        pair[1] === qualityB
      ) ||
      (
        pair[0] === qualityB &&
        pair[1] === qualityA
      )
  )
}