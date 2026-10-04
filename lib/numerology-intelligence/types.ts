import type {
  NumerologyDigit,
  GrahaName,
} from '@/lib/numerology/types'

/**
 * TSIA Numerology Intelligence V3
 *
 * This layer sits ABOVE the frozen
 * Numerology Version 2 calculation engine.
 *
 * It must not change V2 calculations.
 */

export const NUMEROLOGY_INTELLIGENCE_VERSION =
  'TSIA_NUM_INTELLIGENCE_V3_DRAFT_1.0' as const

export const CONCLUSION_MATRIX_VERSION =
  'TSIA_CONCLUSION_MATRIX_DRAFT_1.0' as const

/**
 * Core Functional Qualities
 */

export type FunctionalQualityId =
  | 'INDIVIDUAL_AGENCY'
  | 'RELATIONAL_RECEPTIVITY'
  | 'KNOWLEDGE_EXPRESSION'
  | 'ADAPTIVE_RESTRUCTURING'
  | 'ADAPTIVE_INTELLIGENCE'
  | 'HARMONIOUS_CONNECTION'
  | 'REFLECTIVE_DISCERNMENT'
  | 'STRUCTURED_RESPONSIBILITY'
  | 'DIRECTED_FORCE'

export type FunctionalQuality = {
  number: NumerologyDigit
  graha: GrahaName
  id: FunctionalQualityId
  title: string
  balancedExpression: readonly string[]
  possibleOverExpression: readonly string[]
  underSupportedExpression: readonly string[]
}

/**
 * Evidence layers
 */

export type EvidenceLayer =
  | 'MULANK'
  | 'BHAGYANK'
  | 'NAME_NUMBER'
  | 'RAW_LO_SHU'
  | 'DERIVED_LO_SHU'
  | 'REPETITION'
  | 'MISSING_NUMBER'
  | 'ROW'
  | 'COLUMN'
  | 'RAJYOG'
  | 'COMPOUND_BIRTH_CONTEXT'

/**
 * Where evidence ultimately originated.
 *
 * This is different from its methodological role.
 */

export type EvidenceProvenance =
  | 'DOB_DAY'
  | 'DOB_FULL'
  | 'DOB_RAW_DIGIT'
  | 'MULANK_INSERTION'
  | 'BHAGYANK_INSERTION'
  | 'FULL_NAME'
  | 'DERIVED_STRUCTURE'

/**
 * Methodological role.
 *
 * Mulank and Bhagyank may both come from DOB,
 * while still serving different roles.
 */

export type EvidenceRole =
  | 'PRIMARY_CORE'
  | 'DEVELOPMENT_DIRECTION'
  | 'NAME_EXPRESSION'
  | 'STRUCTURAL'
  | 'COMPOUND_CONTEXT'
  | 'SUPPORTING_CONTEXT'

/**
 * Direction of evidence relative to a
 * functional conclusion.
 */

export type EvidenceDirection =
  | 'SUPPORTS'
  | 'UNDER_SUPPORTS'
  | 'MODERATES'
  | 'COMPENSATES'
  | 'CONTEXTUALIZES'
  | 'TENSION'

/**
 * Independence is kept separate from
 * role distinctness.
 */

export type IndependenceStatus =
  | 'INDEPENDENT'
  | 'PARTIALLY_DEPENDENT'
  | 'DEPENDENT'

export type RoleDistinctness =
  | 'DISTINCT_ROLE'
  | 'SAME_ROLE'

/**
 * Every meaningful observation entering
 * the Conclusion Engine becomes an
 * IntelligenceEvidence object.
 */

export type IntelligenceEvidence = {
  id: string

  layer: EvidenceLayer

  provenance: EvidenceProvenance

  provenanceGroup: string

  role: EvidenceRole

  roleDistinctness: RoleDistinctness

  independence: IndependenceStatus

  number?: NumerologyDigit

  functionalQualityId?: FunctionalQualityId

  direction: EvidenceDirection

  statement: string

  sourceValue?: string | number

  structureId?: string

  methodologyRuleId?: string
}

/**
 * Frozen Conclusion Resolution Matrix
 * Draft 1.0 operations.
 *
 * Important:
 * COMPLEMENT is evaluated before TENSION.
 */

export type ResolutionOperation =
  | 'REINFORCE'
  | 'COMPLEMENT'
  | 'MODERATE'
  | 'COMPENSATE'
  | 'TENSION'
  | 'CONTEXTUALIZE'
  | 'INSUFFICIENT'

/**
 * Evidence strength is NOT a percentage.
 *
 * Do not derive it merely by counting
 * evidence objects.
 */

export type EvidenceStrength =
  | 'PRIMARY_FINDING'
  | 'STRONGLY_SUPPORTED'
  | 'SUPPORTED'
  | 'CONTEXT_DEPENDENT'
  | 'INSUFFICIENT_EVIDENCE'

/**
 * Client validation remains separate
 * from numerological evidence strength.
 */

export type ManifestationStatus =
  | 'NOT_ASSESSED'
  | 'CLIENT_VALIDATED'
  | 'PARTLY_VALIDATED'
  | 'DIFFERENT_MANIFESTATION'
  | 'NOT_CURRENTLY_OBSERVED'
  | 'CLIENT_CONTRADICTED'

/**
 * Missing Number and Development
 * Significance are not the same thing.
 */

export type DevelopmentSignificance =
  | 'NONE'
  | 'STANDARD'
  | 'ELEVATED'
  | 'HIGH'

/**
 * Domains where resolved intelligence
 * may eventually be applied.
 */

export type IntelligenceDomain =
  | 'CORE'
  | 'PROBLEM_SOLVING'
  | 'DECISION_MAKING'
  | 'FAMILY'
  | 'PARTNER'
  | 'ROMANCE'
  | 'CAREER'
  | 'BUSINESS'
  | 'MONEY'
  | 'GUIDANCE'

/**
 * Restricts unsupported conclusions.
 */

export type InferenceRestriction =
  | 'NO_SPECIFIC_LIFE_EVENT'
  | 'NO_RELATIONSHIP_STATUS'
  | 'NO_RELATIONSHIP_OUTCOME'
  | 'NO_CAREER_OUTCOME'
  | 'NO_BUSINESS_SUCCESS_PREDICTION'
  | 'NO_WEALTH_PREDICTION'
  | 'NO_HEALTH_EVENT'
  | 'NO_ASTROLOGICAL_GRAHA_DIAGNOSIS'
  | 'NO_AUTOMATIC_NEEDED_NUMBER'
  | 'NO_AUTOMATIC_REMEDY'
  | 'NO_AUTOMATIC_Y3'

/**
 * Final language-neutral conclusion object.
 *
 * Report prose should be generated from
 * this layer rather than directly from
 * raw numbers.
 */

export type ResolvedConclusion = {
  id: string

  functionalQualityId?: FunctionalQualityId

  title: string

  statement: string

  strength: EvidenceStrength

  resolution: ResolutionOperation

  supportingEvidenceIds: readonly string[]

  moderatingEvidenceIds: readonly string[]

  compensatingEvidenceIds: readonly string[]

  tensionEvidenceIds: readonly string[]

  contextualEvidenceIds: readonly string[]

  relevantStructureIds: readonly string[]

  allowedDomains: readonly IntelligenceDomain[]

  restrictions: readonly InferenceRestriction[]

  developmentSignificance:
    DevelopmentSignificance

  manifestationStatus:
    ManifestationStatus
}

/**
 * Development significance must NEVER
 * directly become a Needed Number.
 *
 * It may only make the case eligible
 * for a separate future assessment.
 */

export type DevelopmentAssessment = {
  functionalQualityId: FunctionalQualityId

  number: NumerologyDigit

  significance: DevelopmentSignificance

  evidenceIds: readonly string[]

  neededNumberAssessmentEligible: boolean

  neededNumberDetermined: false
}

/**
 * Result returned by the future
 * Conclusion Engine.
 */

export type ConclusionEngineResult = {
  intelligenceVersion:
    typeof NUMEROLOGY_INTELLIGENCE_VERSION

  conclusionMatrixVersion:
    typeof CONCLUSION_MATRIX_VERSION

  evidence: readonly IntelligenceEvidence[]

  conclusions: readonly ResolvedConclusion[]

  developmentAssessments:
    readonly DevelopmentAssessment[]

  warnings: readonly string[]
}