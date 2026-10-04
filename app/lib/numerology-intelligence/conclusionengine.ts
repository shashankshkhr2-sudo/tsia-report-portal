import type {
  FunctionalQualityId,
  IntelligenceEvidence,
  ResolvedConclusion,
  EvidenceStrength,
} from './types'

import {
  FUNCTIONAL_QUALITIES,
} from './functionalqualities'

import {
  resolveOperation,
  hasIndependentSupport,
} from './conclusionrules'

/**
 * TSIA Numerology Intelligence V3
 * Conclusion Engine
 *
 * Deterministic only.
 * No AI.
 * No database.
 * No network.
 */

function evidenceForQuality(
  evidence: IntelligenceEvidence[],
  qualityId: FunctionalQualityId
): IntelligenceEvidence[] {
  return evidence.filter(
    item =>
      item.functionalQualityId ===
      qualityId
  )
}

function getStrength(
  evidence: IntelligenceEvidence[]
): EvidenceStrength {
  if (evidence.length === 0) {
    return 'INSUFFICIENT_EVIDENCE'
  }

  const hasPrimary =
    evidence.some(
      item =>
        item.role === 'PRIMARY_CORE'
    )

  const hasStructural =
    evidence.some(
      item =>
        item.role === 'STRUCTURAL'
    )

  const independent =
    hasIndependentSupport(evidence)

  if (hasPrimary && independent) {
    return 'STRONGLY_SUPPORTED'
  }

  if (hasPrimary) {
    return 'PRIMARY_FINDING'
  }

  if (hasStructural || independent) {
    return 'SUPPORTED'
  }

  return 'CONTEXT_DEPENDENT'
}

function getStatement(
  evidence: IntelligenceEvidence[],
  fallback: string
): string {
  const primary =
    evidence.find(
      item =>
        item.role === 'PRIMARY_CORE'
    )

  if (primary) {
    return primary.statement
  }

  const structural =
    evidence.find(
      item =>
        item.role === 'STRUCTURAL'
    )

  if (structural) {
    return structural.statement
  }

  return (
    evidence[0]?.statement ??
    fallback
  )
}

function resolveQuality(
  evidence: IntelligenceEvidence[],
  qualityId: FunctionalQualityId,
  title: string
): ResolvedConclusion {
  const relevant =
    evidenceForQuality(
      evidence,
      qualityId
    )

  const operation =
    resolveOperation(relevant)

  const strength =
    getStrength(relevant)

  return {
    id: `CONCLUSION_${qualityId}`,
    functionalQualityId: qualityId,
    statement: getStatement(
      relevant,
      `Insufficient evidence to establish ${title}.`
    ),
    evidenceStrength: strength,
    resolutionType: operation,
    supportingEvidence:
      relevant.filter(
        item =>
          item.direction ===
          'SUPPORTS'
      ),
    moderatingEvidence:
      relevant.filter(
        item =>
          item.direction ===
          'MODERATES'
      ),
    compensatingEvidence:
      relevant.filter(
        item =>
          item.direction ===
          'COMPENSATES'
      ),
    tensionEvidence:
      relevant.filter(
        item =>
          item.direction ===
          'TENSION'
      ),
    contextualEvidence:
      relevant.filter(
        item =>
          item.direction ===
          'CONTEXTUALIZES'
      ),
    developmentSignificance:
      'STANDARD',
    manifestationStatus:
      'NOT_ASSESSED',
  }
}

export function buildResolvedConclusions(
  evidence: IntelligenceEvidence[]
): ResolvedConclusion[] {
  return FUNCTIONAL_QUALITIES.map(
    quality =>
      resolveQuality(
        evidence,
        quality.id,
        quality.title
      )
  )
}