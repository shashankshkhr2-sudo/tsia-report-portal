import type {
  IntelligenceEvidence,
  ResolutionOperation,
} from './types'

/**
 * TSIA Conclusion Resolution Matrix
 * Draft 1.0
 *
 * Deterministic only.
 * No AI, API or database calls.
 */

export function sameQuality(
  a: IntelligenceEvidence,
  b: IntelligenceEvidence
): boolean {
  return (
    !!a.functionalQualityId &&
    a.functionalQualityId ===
      b.functionalQualityId
  )
}

export function canReinforce(
  a: IntelligenceEvidence,
  b: IntelligenceEvidence
): boolean {
  if (!sameQuality(a, b)) {
    return false
  }

  if (
    a.direction !== 'SUPPORTS' ||
    b.direction !== 'SUPPORTS'
  ) {
    return false
  }

  if (
    a.provenanceGroup ===
    b.provenanceGroup
  ) {
    return false
  }

  if (
    a.independence === 'DEPENDENT' ||
    b.independence === 'DEPENDENT'
  ) {
    return false
  }

  return true
}

export function isContextOnly(
  evidence: IntelligenceEvidence
): boolean {
  return (
    evidence.layer ===
      'COMPOUND_BIRTH_CONTEXT' ||
    evidence.direction ===
      'CONTEXTUALIZES'
  )
}

export function hasUnderSupport(
  evidence: IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction ===
      'UNDER_SUPPORTS'
  )
}

export function hasCompensation(
  evidence: IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction ===
      'COMPENSATES'
  )
}

export function hasModeration(
  evidence: IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction ===
      'MODERATES'
  )
}

export function hasExplicitTension(
  evidence: IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction ===
      'TENSION'
  )
}

/**
 * Complement before Tension.
 *
 *