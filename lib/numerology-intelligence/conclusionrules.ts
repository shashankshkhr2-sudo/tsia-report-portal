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
 * Rules:
 * - Complement before Tension.
 * - Tension requires explicit evidence.
 * - Under-support is NOT reinforcement.
 * - Context does not replace primary evidence.
 * - Evidence count alone does not create strength.
 */

export function hasIndependentSupport(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  const supporting = evidence.filter(
    item => item.direction === 'SUPPORTS'
  )

  for (
    let i = 0;
    i < supporting.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < supporting.length;
      j++
    ) {
      if (
        canStrengthenConclusion(
          supporting[i],
          supporting[j]
        )
      ) {
        return true
      }
    }
  }

  return false
}

export function hasSupport(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item => item.direction === 'SUPPORTS'
  )
}

export function hasUnderSupport(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction === 'UNDER_SUPPORTS'
  )
}

export function hasCompensation(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction === 'COMPENSATES'
  )
}

export function hasModeration(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item => item.direction === 'MODERATES'
  )
}

export function hasExplicitTension(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item => item.direction === 'TENSION'
  )
}

export function hasContext(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction === 'CONTEXTUALIZES'
  )
}

/**
 * Resolve the relationship between
 * evidence objects for ONE functional quality.
 *
 * Important:
 * COMPLEMENT is mainly a cross-quality
 * operation. Within a single quality,
 * multiple independent SUPPORTS normally
 * mean REINFORCE.
 */
export function resolveOperation(
  evidence: readonly IntelligenceEvidence[]
): ResolutionOperation {
  if (evidence.length === 0) {
    return 'INSUFFICIENT'
  }

  const support = hasSupport(evidence)
  const underSupport =
    hasUnderSupport(evidence)
  const compensation =
    hasCompensation(evidence)
  const moderation =
    hasModeration(evidence)
  const tension =
    hasExplicitTension(evidence)
  const context =
    hasContext(evidence)

  /**
   * Genuine tension must be explicit.
   */
  if (tension) {
    return 'TENSION'
  }

  /**
   * Compensation matters when an
   * under-supported quality is being
   * offset by another approved capability.
   */
  if (underSupport && compensation) {
    return 'COMPENSATE'
  }

  /**
   * Moderation changes how a supported
   * quality is likely to express.
   */
  if (support && moderation) {
    return 'MODERATE'
  }

  /**
   * Primary/supporting evidence with
   * contextual evidence remains a
   * supported quality with context.
   */
  if (support && context) {
    return 'CONTEXTUALIZE'
  }

  /**
   * Independent supporting evidence
   * genuinely reinforces the quality.
   */
  if (
    support &&
    hasIndependentSupport(evidence)
  ) {
    return 'REINFORCE'
  }

  /**
   * A supported quality may stand as a
   * primary finding even without a second
   * independent confirmation.
   */
  if (support) {
    return 'REINFORCE'
  }

  /**
   * Critical safeguard:
   *
   * UNDER_SUPPORTS must never be called
   * REINFORCE simply because it is the
   * only evidence available.
   *
   * The current ResolutionOperation type
   * has no separate DEVELOPMENT operation.
   * Therefore the responsible resolution
   * is CONTEXTUALIZE while development
   * significance remains separately
   * handled by the Conclusion Engine.
   */
  if (underSupport) {
    return 'CONTEXTUALIZE'
  }

  /**
   * Compound/context evidence alone
   * cannot establish a