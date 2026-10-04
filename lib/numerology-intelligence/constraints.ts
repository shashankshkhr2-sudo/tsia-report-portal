import type {
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  IntelligenceEvidence,
} from './types'

/**
 * TSIA Numerology Intelligence V3
 * Methodology Constraint Engine
 *
 * Hard safeguards against invalid
 * methodological jumps.
 */

export type ConstraintSeverity =
  | 'BLOCK'
  | 'WARNING'

export type ConstraintViolation = {
  code: string
  severity: ConstraintSeverity
  message: string
  evidenceId?: string
}

/**
 * Personal Lo Shu contains:
 * raw non-zero DOB digits
 * + final Mulank
 * + final Bhagyank.
 *
 * Therefore Mulank and Bhagyank
 * cannot be missing from Personal Lo Shu.
 */
export function validateLoShuState(
  mulank: NumerologyDigit,
  bhagyank: NumerologyDigit,
  missing: readonly NumerologyDigit[]
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = []

  if (missing.includes(mulank)) {
    violations.push({
      code: 'IMPOSSIBLE_MULANK_MISSING',
      severity: 'BLOCK',
      message:
        `Mulank ${mulank} cannot be missing from Personal Lo Shu.`,
    })
  }

  if (missing.includes(bhagyank)) {
    violations.push({
      code: 'IMPOSSIBLE_BHAGYANK_MISSING',
      severity: 'BLOCK',
      message:
        `Bhagyank ${bhagyank} cannot be missing from Personal Lo Shu.`,
    })
  }

  return violations
}

/**
 * Name Number never fills a missing
 * Personal Lo Shu cell.
 */
export function nameNumberFillsLoShu(): false {
  return false
}

/**
 * Missing Number is NOT automatically
 * a Needed Number.
 */
export function missingDeterminesNeeded(): false {
  return false
}

/**
 * Missing Number alone cannot
 * prescribe a remedy.
 */
export function missingDeterminesRemedy(): false {
  return false
}

/**
 * Missing Number alone cannot
 * establish Y3 eligibility.
 */
export function missingDeterminesY3(): false {
  return false
}

/**
 * Compound context cannot independently
 * determine Needed Number.
 */
export function compoundDeterminesNeeded(): false {
  return false
}

/**
 * Compound context cannot independently
 * prescribe remedy.
 */
export function compoundDeterminesRemedy(): false {
  return false
}

/**
 * Compound context cannot independently
 * establish Y3 eligibility.
 */
export function compoundDeterminesY3(): false {
  return false
}

/**
 * Numerological Graha association is
 * NOT an astrological Graha diagnosis.
 */
export function numerologyGrahaIsAstrologyDiagnosis(): false {
  return false
}

/**
 * Development Significance may make a
 * case eligible for a future Needed Number
 * assessment.
 *
 * It cannot determine the Needed Number.
 */
export function developmentDeterminesNeeded(): false {
  return false
}

/**
 * Client confirmation validates
 * manifestation only.
 *
 * It must not upgrade methodology
 * evidence strength.
 */
export function clientConfirmationUpgradesEvidence(): false {
  return false
}

/**
 * Client disagreement does not erase
 * the TSIA methodology finding.
 */
export function clientDisagreementErasesFinding(): false {
  return false
}

/**
 * Payment / product entitlement cannot
 * strengthen diagnosis.
 */
export function paymentStrengthensDiagnosis(): false {
  return false
}

/**
 * Generates warnings for evidence that
 * must remain behind the remedy firewall.
 */
export function auditRemedyBoundary(
  evidence: readonly IntelligenceEvidence[]
): ConstraintViolation[] {
  const warnings: ConstraintViolation[] = []

  for (const item of evidence) {
    if (item.layer === 'MISSING_NUMBER') {
      warnings.push({
        code: 'MISSING_REMEDY_FIREWALL',
        severity: 'WARNING',
        message:
          'Missing Number cannot automatically become Needed Number, remedy or Y3.',
        evidenceId: item.id,
      })
    }

    if (
      item.layer ===
      'COMPOUND_BIRTH_CONTEXT'
    ) {
      warnings.push({
        code: 'COMPOUND_REMEDY_FIREWALL',
        severity: 'WARNING',
        message:
          'Compound context cannot automatically become Needed Number, remedy or Y3.',
        evidenceId: item.id,
      })
    }
  }

  return warnings
}

export type ConstraintAudit = {
  valid: boolean
  blocks: readonly ConstraintViolation[]
  warnings: readonly ConstraintViolation[]
}

/**
 * Main constraint audit.
 */
export function runConstraintAudit(params: {
  mulank: NumerologyDigit
  bhagyank: NumerologyDigit
  missing: readonly NumerologyDigit[]
  evidence: readonly IntelligenceEvidence[]
}): ConstraintAudit {

  const structural =
    validateLoShuState(
      params.mulank,
      params.bhagyank,
      params.missing
    )

  const remedyWarnings =
    auditRemedyBoundary(
      params.evidence
    )

  const blocks =
    structural.filter(
      item => item.severity === 'BLOCK'
    )

  return {
    valid: blocks.length === 0,
    blocks,
    warnings: remedyWarnings,
  }
}