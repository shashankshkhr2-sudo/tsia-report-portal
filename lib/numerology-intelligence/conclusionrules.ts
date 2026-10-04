import type {
  IntelligenceEvidence,
  ResolutionOperation,
} from './types'

import {
  canStrengthenConclusion,
} from './provenance'

/**
 * TSIA Conclusion Resolution Matrix
 * Draft 1.0
 *
 * Important:
 * Different qualities are complementary
 * unless an approved rule establishes
 * genuine tension.
 */

export function hasIndependentSupport(
  evidence: IntelligenceEvidence[]
): boolean {
  for (let i = 0; i < evidence.length; i++) {
    for (
      let j = i + 1;
      j < evidence.length;
      j++
    ) {
      if (
        canStrengthenConclusion(
          evidence[i],
          evidence[j]
        )
      ) {
        return true
      }
    }
  }

  return false
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

export function hasContext(
  evidence: IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction ===
      'CONTEXTUALIZES'
  )
}

/**
 * Complement before Tension.
 *
 * Tension is returned only when evidence
 * explicitly carries TENSION direction.
 */
export function resolveOperation(
  evidence: IntelligenceEvidence[]
): ResolutionOperation {
  if (evidence.length === 0) {
    return 'INSUFFICIENT'
  }

  if (hasExplicitTension(evidence)) {
    return 'TENSION'
  }

  if (hasCompensation(evidence)) {
    return 'COMPENSATE'
  }

  if (hasModeration(evidence)) {
    return 'MODERATE'
  }

  if (hasIndependentSupport(evidence)) {
    return 'REINFORCE'
  }

  if (hasContext(evidence)) {
    return 'CONTEXTUALIZE'
  }

  if (evidence.length > 1) {
    return 'COMPLEMENT'
  }

  return 'REINFORCE'
}