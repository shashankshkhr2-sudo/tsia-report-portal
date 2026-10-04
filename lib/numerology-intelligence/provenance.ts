import type {
  IntelligenceEvidence,
  IndependenceStatus,
  RoleDistinctness,
} from './types'

/**
 * TSIA Numerology Intelligence V3
 * Provenance & Independence Engine
 */

export function determineRoleDistinctness(
  a: IntelligenceEvidence,
  b: IntelligenceEvidence
): RoleDistinctness {
  return a.role === b.role
    ? 'SAME_ROLE'
    : 'DISTINCT_ROLE'
}

export function determineIndependence(
  a: IntelligenceEvidence,
  b: IntelligenceEvidence
): IndependenceStatus {

  if (a.id === b.id) {
    return 'DEPENDENT'
  }

  if (
    a.provenanceGroup ===
    b.provenanceGroup
  ) {
    return 'DEPENDENT'
  }

  // Mulank and its Lo Shu insertion
  if (
    (a.layer === 'MULANK' &&
      b.provenance === 'MULANK_INSERTION') ||
    (b.layer === 'MULANK' &&
      a.provenance === 'MULANK_INSERTION')
  ) {
    return 'DEPENDENT'
  }

  // Bhagyank and its Lo Shu insertion
  if (
    (a.layer === 'BHAGYANK' &&
      b.provenance === 'BHAGYANK_INSERTION') ||
    (b.layer === 'BHAGYANK' &&
      a.provenance === 'BHAGYANK_INSERTION')
  ) {
    return 'DEPENDENT'
  }

  // Birth compound and Mulank share birth-day source
  if (
    (a.layer === 'MULANK' &&
      b.layer === 'COMPOUND_BIRTH_CONTEXT') ||
    (b.layer === 'MULANK' &&
      a.layer === 'COMPOUND_BIRTH_CONTEXT')
  ) {
    return 'DEPENDENT'
  }

  // Raw DOB evidence and structures derived from it
  if (
    (a.provenance === 'DOB_RAW_DIGIT' &&
      b.provenance === 'DERIVED_STRUCTURE') ||
    (b.provenance === 'DOB_RAW_DIGIT' &&
      a.provenance === 'DERIVED_STRUCTURE')
  ) {
    return 'PARTIALLY_DEPENDENT'
  }

  // Mulank and Bhagyank have distinct roles
  // but share DOB provenance.
  if (
    (a.layer === 'MULANK' &&
      b.layer === 'BHAGYANK') ||
    (b.layer === 'MULANK' &&
      a.layer === 'BHAGYANK')
  ) {
    return 'PARTIALLY_DEPENDENT'
  }

  // Name evidence has separate provenance.
  if (
    a.provenance === 'FULL_NAME' ||
    b.provenance === 'FULL_NAME'
  ) {
    return 'INDEPENDENT'
  }

  return 'INDEPENDENT'
}

export function canStrengthenConclusion(
  primary: IntelligenceEvidence,
  candidate: IntelligenceEvidence
): boolean {
  return (
    determineIndependence(
      primary,
      candidate
    ) !== 'DEPENDENT'
  )
}

export function canStronglyReinforce(
  primary: IntelligenceEvidence,
  candidate: IntelligenceEvidence
): boolean {
  return (
    determineIndependence(
      primary,
      candidate
    ) === 'INDEPENDENT'
  )
}

export function isCompoundContextOnly(
  evidence: IntelligenceEvidence
): boolean {
  return (
    evidence.layer ===
    'COMPOUND_BIRTH_CONTEXT'
  )
}

export function getIndependentEvidence(
  primary: IntelligenceEvidence,
  candidates: readonly IntelligenceEvidence[]
): IntelligenceEvidence[] {
  return candidates.filter(
    candidate =>
      candidate.id !== primary.id &&
      determineIndependence(
        primary,
        candidate
      ) === 'INDEPENDENT'
  )
}