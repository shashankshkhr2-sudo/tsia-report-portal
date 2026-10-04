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
  resolveEvidence,
} from './conclusionrules'

function evidenceForQuality(
  evidence: readonly IntelligenceEvidence[],
  qualityId: FunctionalQualityId
) {
  return evidence.filter(
    item => item.functionalQualityId === qualityId
  )
}

function buildConclusion(
  qualityId: FunctionalQualityId,
  evidence: readonly IntelligenceEvidence[]
): ResolvedConclusion | null {
  const quality = FUNCTIONAL_QUALITIES.find(
    item => item.id === qualityId
  )

  if (!quality) return null

  const relevant = evidenceForQuality(
    evidence,
    qualityId
  )

  if (relevant.length === 0) return null

  return resolveEvidence(
    quality,
    relevant
  )
}

function buildDevelopmentAssessment(
  qualityId: FunctionalQualityId,
  evidence: readonly IntelligenceEvidence[]
): DevelopmentAssessment | null {
  const quality = FUNCTIONAL_QUALITIES.find(
    item => item.id === qualityId
  )

  if (!quality) return null

  const relevant = evidenceForQuality(
    evidence,
    qualityId
  )

  const underSupported = relevant.filter(
    item => item.direction === 'UNDER_SUPPORTS'
  )

  if (underSupported.length === 0) {
    return {
      functionalQualityId: qualityId,
      number: quality.number,
      significance: 'NONE',
      evidenceIds: [],
      neededNumberAssessmentEligible: false,
      neededNumberDetermined: false,
    }
  }

  const structural = underSupported.filter(
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
    functionalQualityId: qualityId,
    number: quality.number,
    significance,
    evidenceIds: underSupported.map(
      item => item.id
    ),
    neededNumberAssessmentEligible:
      significance === 'HIGH',
    neededNumberDetermined: false,
  }
}

export function runConclusionEngine(
  evidence: readonly IntelligenceEvidence[]
): ConclusionEngineResult {
  const conclusions =
    FUNCTIONAL_QUALITIES
      .map(quality =>
        buildConclusion(
          quality.id,
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
    FUNCTIONAL_QUALITIES
      .map(quality =>
        buildDevelopmentAssessment(
          quality.id,
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