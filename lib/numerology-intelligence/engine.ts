import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import type {
  NumerologyCalculationInput,
  NumerologyCalculationResult,
} from '@/lib/numerology/types'

import {
  buildIntelligenceEvidence,
} from './evidence'

import {
  runConclusionEngine,
} from './conclusionengine'

import {
  runCrossQualityResolver,
} from './crossqualityresolver'

import type {
  ConclusionEngineResult,
  IntelligenceEvidence,
} from './types'

import type {
  CrossQualityResolverResult,
} from './crossqualityresolver'

/**
 * TSIA Numerology Intelligence V3
 * Production Orchestration Engine
 *
 * IMPORTANT:
 *
 * V3 does NOT replace or modify the
 * frozen V2 calculation methodology.
 *
 * V2 remains the deterministic
 * calculation foundation.
 *
 * Pipeline:
 *
 * Input
 * -> Frozen V2 Calculation
 * -> V3 Evidence
 * -> Single-Quality Conclusion Engine
 * -> Cross-Quality Resolver
 * -> V3 Intelligence Result
 */

export const
  NUMEROLOGY_V3_ENGINE_VERSION =
    'TSIA_NUM_V3_ENGINE_1.0' as const

export type NumerologyV3Result = {
  engineVersion:
    typeof NUMEROLOGY_V3_ENGINE_VERSION

  calculation:
    NumerologyCalculationResult

  evidence:
    readonly IntelligenceEvidence[]

  conclusions:
    ConclusionEngineResult

  crossQuality:
    CrossQualityResolverResult
}

/**
 * Run V3 intelligence from an already
 * verified V2 calculation.
 *
 * This entry point is useful when another
 * part of TSIA has already calculated V2
 * and we must not calculate it twice.
 */
export function
runNumerologyV3FromCalculation(
  calculation: NumerologyCalculationResult
): NumerologyV3Result {
  const evidence =
    buildIntelligenceEvidence(
      calculation
    )

  const conclusions =
    runConclusionEngine(
      evidence
    )

  const crossQuality =
    runCrossQualityResolver(
      evidence
    )

  return {
    engineVersion:
      NUMEROLOGY_V3_ENGINE_VERSION,

    calculation,

    evidence,

    conclusions,

    crossQuality,
  }
}

/**
 * Main V3 production entry point.
 *
 * The deterministic calculation is
 * delegated entirely to frozen V2.
 */
export function runNumerologyV3(
  input: NumerologyCalculationInput
): NumerologyV3Result {
  const calculation =
    calculateNumerologyV2(
      input
    )

  return runNumerologyV3FromCalculation(
    calculation
  )
}