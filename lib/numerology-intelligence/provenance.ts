import type {
  IntelligenceEvidence,
  IndependenceStatus,
  RoleDistinctness,
} from './types'

/**
 * TSIA Numerology Intelligence V3
 * Provenance & Independence Engine
 *
 * Prevents dependent evidence from being
 * counted as independent confirmation.
 */

export function sharesProvenance(
  a: IntelligenceEvidence,
  b: IntelligenceEvidence
): boolean {
  return (
    a.provenanceGroup ===
    b.provenanceGroup
  )
}

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

  if (sharesProvenance(a, b)) {
    return 'DEPENDENDENT'
  }

  const mulankInsertionPair =
    (
      a.layer === 'MULANK' &&
      b.provenance === 'MULANK_INSERTION'
    ) ||
    (
      b.layer === 'MULANK' &&
      a.provenance === 'MULANK_INSERTION'
    )

  if (mulankInsertionPair) {
    return 'DEPENDENT'
  }

  const bhagyankInsertionPair =
    (
      a.layer === 'BHAGYANK' &&
      b.provenance === 'BHAGYANK_INSERTION'
    ) ||
    (
      b.layer === 'BHAGYANK' &&
      a.provenance === 'BHAGYANK_INSERTION'
    )

  if (bhagyankInsertionPair) {
    return 'DEPENDENT'
  }

  const compoundMulankPair =
    (
      a.layer === 'MULANK' &&
      b.layer === 'COMPOUND_BIRTH_CONTEXT'
    ) ||
    (
      b.layer === 'MULANK' &&
      a.layer === 'COMPOUND_BIRTH_CONTEXT'
    )

  if (compoundMulankPair) {
    return 'DEPENDENT'
  }

  const rawStructurePair =
    (
      a.provenance === 'DOB_RAW_DIGIT' &&
      b.provenance === 'DERIVED_STRUCTURE'
    ) ||
    (
      b.provenance === 'DOB_RAW_DIGIT' &&
      a.provenance === 'DERIVED_STRUCTURE'
    )

  if (rawStructurePair) {
    return 'PARTIALLY_DEPENDENT'
  }

  const mulankBhagyankPair =
    (
      a.layer === 'MULANK' &&
      b.layer === 'BHAGYANK'
    ) ||
    (
      b.layer === 'MULANK' &&
      a.layer === 'BHAGYANK'
    )

  if (mulankBhagyankPair) {
    return 'PARTIALLY_DEPENDENT'
  }

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
    (candidate) =>
      candidate.id !== primary.id &&
      determineIndependence(
        primary,
        candidate
      ) === 'INDEPENDENT'
  )
}

export function getRoleDistinctEvidence(
  primary: IntelligenceEvidence,
  candidates: readonly IntelligenceEvidence[]
): IntelligenceEvidence[] {
  return candidates.filter(
    (candidate) =>
      candidate.id !== primary.id &&
      determineRoleDistinctness(
        primary,
        candidate
      ) === 'DISTINCT_ROLE'
  )
}

export type ProvenanceAuditResult = {
  evidenceId: string
  comparedWithId: string
  independence: IndependenceStatus
  roleDistinctness: RoleDistinctness
 