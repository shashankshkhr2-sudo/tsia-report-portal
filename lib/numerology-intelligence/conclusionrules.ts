import type {
  IntelligenceEvidence,
  ResolutionOperation,
  EvidenceStrength,
} from './types'

/**
 * TSIA Numerology Intelligence V3
 * Conclusion Resolution Rules
 *
 * Draft 1.0
 *
 * IMPORTANT:
 * These rules resolve evidence.
 * They do NOT generate remedies,
 * Needed Numbers or Y3 recommendations.
 */

export type ResolutionDecision = {
  operation: ResolutionOperation
  strength: EvidenceStrength
  reason: string
}

/**
 * Evidence from the same underlying
 * provenance must not be counted as
 * independent confirmation.
 */
function isIndependent(
  a: IntelligenceEvidence,
  b: IntelligenceEvidence
): boolean {
  if (
    a.provenanceGroup ===
    b.provenanceGroup
  ) {
    return false
  }

  if (
    a.independ