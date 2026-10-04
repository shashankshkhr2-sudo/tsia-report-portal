import type {
  ConclusionEngineResult,
  DevelopmentAssessment,
  FunctionalQualityId,
  IntelligenceEvidence,
  ResolvedConclusion,
} from './types'

import {
  CONCLUSION_MATRIX_VERSION,
  NUMEROLOGY_INTELLIGENCE_VERSION,
} from './types'

import {
  FUNCTIONAL_QUALITIES,
} from './functionalqualities'

import {
  resolveOperation,
  hasIndependentSupport,
} from './conclusionrules'

const QUALITY_IDS =
  Object.values(FUNCTIONAL_QUALITIES).map(
    quality => quality.id
  )

function evidenceForQuality(
  evidence: readonly IntelligenceEvidence[],
  qualityId: FunctionalQualityId
): IntelligenceEvidence[] {
  return evidence.filter(
    item =>
      item.functionalQualityId === qualityId
  )
}

function getQuality(
  qualityId: FunctionalQualityId
) {
  return Object.values(
    FUNCTIONAL_QUALITIES
  ).find(
    quality => quality.id === qualityId
  )
}

function buildConclusion(
  qualityId: FunctionalQualityId,
  evidence: readonly IntelligenceEvidence[]
): ResolvedConclusion | null {
  const quality = getQuality(qualityId)

  if (!quality) return null

  const relevant =
    evidenceForQuality(
      evidence,
      qualityId
    )

  if (relevant.length === 0) {
    return null
  }

  const supporting =
    relevant.filter(
      item =>
        item.direction === 'SUPPORTS'
    )

  const moderating =
    relevant.filter(
      item =>
        item.direction === 'MODERATES'
    )

  const compensating =
    relevant.filter(
      item =>
        item.direction === 'COMPENSATES'
    )

  const tension =
    relevant.filter(
      item =>
        item.direction === 'TENSION'
    )

  const contextual =
    relevant.filter(
      item =>
        item.direction ===
        'CONTEXTUALIZES'
    )

  const underSupported =
    relevant.filter(
      item =>
        item.direction ===
        'UNDER_SUPPORTS'
    )

  const operation =
    resolveOperation(relevant)

  const strength =
    tension.length > 0 ||
    moderating.length > 0
      ? 'CONTEXT_DEPENDENT'
      : hasIndependentSupport(relevant)
        ? 'STRONGLY_SUPPORTED'
        : supporting.length > 0
          ? 'SUPPORTED'
          : underSupported.length > 0
            ? 'SUPPORTED'
            : 'INSUFFICIENT_EVIDENCE'

  const significance =
    underSupported.some(
      item =>
        item.layer === 'ROW' ||
        item.layer === 'COLUMN' ||
        item.layer === 'RAJYOG'
    )
      ? 'ELEVATED'
      : underSupported.length > 0
        ? 'STANDARD'
        : 'NONE'

  return {
    id: `CONCLUSION_${quality.number}`,

    functionalQualityId:
      quality.id,

    title: quality.title,

    statement:
      supporting.length > 0
        ? quality.balancedExpression[0]
        : underSupported.length > 0
          ? quality.underSupportedExpression[0]
          : quality.title,

    strength,

    resolution: operation,

    supportingEvidenceIds:
      supporting.map(item => item.id),

    moderatingEvidenceIds:
      moderating.map(item => item.id),

    compensatingEvidenceIds:
      compensating.map(item => item.id),

    tensionEvidenceIds:
      tension.map(item => item.id),

    contextualEvidenceIds:
      contextual.map(item => item.id),

    relevantStructureIds:
      relevant
        .filter(
          item => item.structureId
        )
        .map(
          item => item.structureId as string
        ),

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

    developmentSignificance:
      significance,

    manifestationStatus:
      'NOT_ASSESSED',
  }
}

function buildDevelopmentAssessment(
  qualityId: FunctionalQualityId,
  evidence: readonly IntelligenceEvidence[]
): DevelopmentAssessment | null {
  const quality = getQuality(qualityId)

  if (!quality) return null

  const relevant =
    evidenceForQuality(
      evidence,
      qualityId
    )

  const underSupported =
    relevant.filter(
      item =>
        item.direction ===
        'UNDER_SUPPORTS'
    )

  if (underSupported.length === 0) {
    return {
      functionalQualityId:
        quality.id,

      number: quality.number,

      significance: 'NONE',

      evidenceIds: [],

      neededNumberAssessmentEligible:
        false,

      neededNumberDetermined:
        false,
    }
  }

  const structural =
    underSupported.filter(
      item =>
        item.layer === 'ROW' ||
        item.layer === 'COLUMN' ||
        item.layer === 'RAJYOG'
    )

  const significance =
    structural.length >= 2
      ? 'HIGH'
      : structural.length === 1
        ? 'ELEVATED'
        : 'STANDARD'

  return {
    functionalQualityId:
      quality.id,

    number: quality.number,

    significance,

    evidenceIds:
      underSupported.map(
        item => item.id
      ),

    neededNumberAssessmentEligible:
      significance === 'HIGH',

    neededNumberDetermined:
      false,
  }
}

export function runConclusionEngine(
  evidence: readonly IntelligenceEvidence[]
): ConclusionEngineResult {
  const conclusions =
    QUALITY_IDS
      .map(
        qualityId =>
          buildConclusion(
            qualityId,
            evidence
          )
      )
      .filter(
        (
          item
        ): item is ResolvedConclusion =>
          item !== null
      )

  const developmentAssessments =
    QUALITY_IDS
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