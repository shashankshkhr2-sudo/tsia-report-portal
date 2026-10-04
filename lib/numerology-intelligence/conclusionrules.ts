import type {
  IntelligenceEvidence,
  ResolutionOperation,
} from './types'

import {
  canStrengthenConclusion,
} from './provenance'

function hasDirection(
  evidence: readonly IntelligenceEvidence[],
  direction: IntelligenceEvidence['direction']
): boolean {
  return evidence.some(
    item => item.direction === direction
  )
}

function hasPrimarySupport(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  return evidence.some(
    item =>
      item.direction === 'SUPPORTS' &&
      item.role === 'PRIMARY_CORE'
  )
}

export function hasIndependentSupport(
  evidence: readonly IntelligenceEvidence[]
): boolean {
  const supporting = evidence.filter(
    item => item.direction === 'SUPPORTS'
  )

  for (let i = 0; i < supporting.length; i++) {
    for (let j = i + 1; j < supporting.length; j++) {
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

export function resolveOperation(
  evidence: readonly IntelligenceEvidence[]
): ResolutionOperation {
  if (evidence.length === 0) {
    return 'INSUFFICIENT'
  }

  const support =
    hasDirection(evidence, 'SUPPORTS')

  const underSupport =
    hasDirection(evidence, 'UNDER_SUPPORTS')

  const compensation =
    hasDirection(evidence, 'COMPENSATES')

  const moderation =
    hasDirection(evidence, 'MODERATES')

  const tension =
    hasDirection(evidence, 'TENSION')

  const context =
    hasDirection(evidence, 'CONTEXTUALIZES')

  const primarySupport =
    hasPrimarySupport(evidence)

  if (tension) {
    return 'TENSION'
  }

  if (underSupport && compensation) {
    return 'COMPENSATE'
  }

  if (support && moderation) {
    return 'MODERATE'
  }

  if (primarySupport) {
    return 'REINFORCE'
  }

  if (
    support &&
    hasIndependentSupport(evidence)
  ) {
    return 'REINFORCE'
  }

  if (support && context) {
    return 'CONTEXTUALIZE'
  }

  if (support) {
    return 'REINFORCE'
  }

  if (underSupport) {
    return 'INSUFFICIENT'
  }

  if (context) {
    return 'CONTEXTUALIZE'
  }

  return 'INSUFFICIENT'
}