import type {
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  IntelligenceEvidence,
  InferenceRestriction,
} from './types'

/**
 * TSIA Numerology Intelligence V3
 * Methodology Constraint Engine
 *
 * This file protects the methodology from
 * conclusions that are mathematically,
 * structurally or methodologically invalid.
 *
 * IMPORTANT:
 * This engine does NOT interpret the client.
 * It decides what the Intelligence system
 * is NOT allowed to conclude.
 */

export type ConstraintSeverity =
  | 'BLOCK'
  | 'WARNING'

export type ConstraintCode =
  | 'IMPOSSIBLE_MULANK_MISSING'
  | 'IMPOSSIBLE_BHAGYANK_MISSING'
  | 'NAME_NUMBER_DOES_NOT_FILL_LO_SHU'
  | 'COMPOUND_NOT_INDEPENDENT_ROOT_CONFIRMATION'
  | 'MISSING_NOT_NEEDED'
  | 'MISSING_NOT_REMEDY'
  | 'MISSING_NOT_Y3'
  | 'COMPOUND_NOT_NEEDED'
  | 'COMPOUND_NOT_REMEDY'
  | 'COMPOUND_NOT_Y3'
  | 'NUM_GRAHA_NOT_AST_GRAHA'
  | 'CLIENT_FACT_NOT_NUMEROLOGY_EVIDENCE'
  | 'CLIENT_CONFIRMATION_NOT_EVIDENCE_UPGRADE'
  | 'CLIENT_DISAGREEMENT_NOT_RULE_ERASURE'
  | 'PREMIUM_PAYMENT_NOT_DIAGNOSIS'
  | 'SINGLE_NUMBER_NOT_SPECIFIC_OUTCOME'
  | 'DEVELOPMENT_SIGNIFICANCE_NOT_NEEDED_NUMBER'

export type ConstraintViolation = {
  code: ConstraintCode

  severity: ConstraintSeverity

  message: string

  evidence