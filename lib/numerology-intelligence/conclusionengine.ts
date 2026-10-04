import type {
  ConclusionEngineResult,
  DevelopmentAssessment,
  DevelopmentSignificance,
  EvidenceStrength,
  FunctionalQualityId,
  IntelligenceEvidence,
  ResolvedConclusion,
  ResolutionOperation,
} from './types'

import {
  CONCLUSION_MATRIX_VERSION,
  NUMEROLOGY_INTELLIGENCE_VERSION,
} from './types'

import {
  getNumberForFunctionalQuality,
} from './functionalqualities'

const QUALITY_IDS: FunctionalQualityId[] = [
  'INDIVIDUAL_AGENCY',
  'RELATIONAL_RECEPTIVITY',
  'KNOWLEDGE_EXPRESSION',
  'ADAPTIVE_RESTRUCTURING',
  'ADAPTIVE_INTELLIGENCE',
  'HARMONIOUS_CONNECTION',
  'REFLECTIVE_DISCERNMENT',
  'STRUCTURED_RESPONSIBILITY',
  'DIRECTED_FORCE',
]

function evidenceForQuality(
  evidence: readonly IntelligenceEvidence[],
  qualityId: FunctionalQualityId
): IntelligenceEvidence[] {
  return evidence.filter(
    item => item.functionalQualityId === qualityId
  )
}

function ids(
  evidence: readonly IntelligenceEvidence[]
): string[] {
  return evidence.map(item => item.id)
}

function getResolution(
  evidence: readonly IntelligenceEvidence[]
): ResolutionOperation {
  if (evidence.length === 0) {
    return 'INSUFFICIENT'
  }

  if (
    evidence.some(
      item => item.direction === 'COMPENSATES'
    )
  ) {
    return 'COMPENSATE'
  }

  if (
    evidence.some(
      item => item.direction === 'MODERATES'
    )
  ) {
    return 'MODERATE'
  }

  if (
    evidence.some(
      item => item.direction === 'CONTEXTUALIZES'
    )
  ) {
    return 'CONTEXTUALIZE'
  }

  /*
   * Complement before Tension.
   *
   * Different qualities must not be treated
   * as psychological conflict automatically.
   * TENSION only applies when evidence has
   * explicitly been classified as TENSION.
   */
  if (
    evidence.some(
      item => item.direction === 'TENSION'
    )
  ) {
    return 'TENSION'
  }

  return 'REINFORCE'
}

function getStrength(
  evidence: readonly IntelligenceEvidence[]
): EvidenceStrength {
  if (evidence.length === 0) {
    return 'INSUFFICIENT_EVIDENCE'
  }

  const hasPrimary = evidence.some(
    item => item.role === 'PRIMARY_CORE'
  )

  const hasIndependentSupport = evidence.some(
    item =>
      item.direction === 'SUPPORTS' &&
      item.independence === 'INDEPENDENT'
  )

  const hasContextDependence = evidence.some(
    item =>
      item.direction === 'MODERATES' ||
      item.direction === 'COMPENSATES' ||
      item.direction === 'TENSION'
  )

  if (hasContextDependence) {
    return 'CONTEXT_DEPENDENT'
  }

  if (hasPrimary && hasIndependentSupport) {
    return 'STRONGLY_SUPPORTED'
  }

  if (hasPrimary) {
    return 'PRIMARY_FINDING'
  }

  return 'SUPPORTED'
}

function getDevelopmentSignificance(
  evidence: readonly IntelligenceEvidence[]
): DevelopmentSignificance {
  const underSupported = evidence.filter(
    item => item.direction === 'UNDER_SUPPORTS'
  )

  if (underSupported.length === 0) {
    return 'NONE'
  }

  const structural = underSupported.filter(
    item =>
      item.role === 'STRUCTURAL' ||
      item.layer === 'ROW' ||
      item.layer === 'COLUMN' ||
      item.layer === 'RAJYOG'
  )

  if (structural.length >= 2) {
    return 'HIGH'
  }

  if (structural.length === 1) {
    return 'ELEVATED'
  }

  return 'STANDARD'
}

function buildConclusion(
  qualityId: FunctionalQualityId,
  evidence: readonly IntelligenceEvidence[]
): ResolvedConclusion | null {
  const relevant = evidenceForQuality(
    evidence,
    qualityId
  )

  if (relevant.length === 0) {
    return null
  }

  const supporting = relevant.filter(
    item => item.direction === 'SUPPORTS'
  )

  const moderating = relevant.filter(
    item => item.direction === 'MODERATES'
  )

  const compensating = relevant.filter(
    item => item.direction === 'COMPENSATES'
  )

  const tension = relevant.filter(
    item => item.direction === 'TENSION'
  )

  const contextual = relevant.filter(
    item => item.direction === 'CONTEXTUALIZES'
  )

  const structures = relevant
    .map(item => item.structureId)
    .filter(
      (value): value is string =>
        typeof value === 'string'
    )

  const development =
    getDevelopmentSignificance(relevant)

  const number =
    getNumberForFunctionalQuality(qualityId)

  return {
    id: `CONCLUSION_${qualityId}`,

    functionalQualityId: qualityId,

    title: `Number ${number} Intelligence`,

    statement:
      `Resolved TSIA intelligence for number ${number}.`,

    strength: getStrength(relevant),

    resolution: getResolution(relevant),

    supportingEvidenceIds: ids(supporting),

    moderatingEvidenceIds: ids(moderating),

    compensatingEvidenceIds: ids(compensating),

    tensionEvidenceIds: ids(tension),

    contextualEvidenceIds: ids(contextual),

    relevantStructureIds: [
      ...new Set(structures),
    ],

    allowedDomains: ['CORE'],

    restrictions: [
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
    ],

    developmentSignificance: development,

    manifestationStatus: 'NOT_ASSESSED',
  }
}

function buildDevelopmentAssessment(
  qualityId: FunctionalQualityId,
  evidence: readonly IntelligenceEvidence[]
): DevelopmentAssessment | null {
  const relevant = evidenceForQuality(
    evidence,
    qualityId
  )

  const underSupported = relevant.filter(
    item => item.direction === 'UNDER_SUPPORTS'
  )

  if (underSupported.length === 0) {
    return null
  }

  const significance =
    getDevelopmentSignificance(relevant)

  return {
    functionalQualityId: qualityId,

    number:
      getNumberForFunctionalQuality(qualityId),

    significance,

    evidenceIds: ids(underSupported),

    neededNumberAssessmentEligible:
      significance === 'HIGH',

    neededNumberDetermined: false,
  }
}

export function runConclusionEngine(
  evidence: readonly IntelligenceEvidence[]
): ConclusionEngineResult {
  const conclusions = QUALITY_IDS
    .map(
      qualityId =>
        buildConclusion(qualityId, evidence)
    )
    .filter(
      (
        item
      ): item is ResolvedConclusion =>
        item !== null
    )

  const developmentAssessments = QUALITY_IDS
    .map(
      qualityId =>
        buildDevelopmentAssessment(
          qualityId,
          evidence
        )
    )
    .filter(
      (
        item
      ): item is DevelopmentAssessment =>
        item !== null
    )

  return {
    intelligenceVersion:
      NUMEROLOGY_INTELLIGENCE_VERSION,

    conclusionMatrixVersion:
      CONCLUSION_MATRIX_VERSION,

    evidence,

    conclusions,

    developmentAssessments,

    warnings: [],
  }
}