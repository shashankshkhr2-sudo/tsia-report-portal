import type { NumerologyCalculationResult, NumerologyDigit } from '@/lib/numerology/types'

/** Reviewed presentation context only. Does not add independent evidence or alter V2/V3 scoring. */
export type ApprovedRepetitionRule = {
  number: NumerologyDigit
  count: 2 | 3 | 4
  status: 'APPROVED'
  methodology: 'PERSONAL_LO_SHU_DOB_MULANK_BHAGYANK'
  version: string
  reviewedBy: string
  reviewedOn: string
  conflictsResolved: true
  title: string
  strength: string
  balance: string
  sources: readonly string[]
}

// Populate only after individual practitioner review. No research draft is imported here.
export const APPROVED_REPETITION_RULES: readonly ApprovedRepetitionRule[] = []

export function approvedRepetitionContext(calculation: NumerologyCalculationResult) {
  return APPROVED_REPETITION_RULES.filter(rule =>
    rule.status === 'APPROVED' && rule.conflictsResolved === true &&
    rule.methodology === 'PERSONAL_LO_SHU_DOB_MULANK_BHAGYANK' &&
    rule.reviewedBy.trim().length > 0 && rule.version.trim().length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(rule.reviewedOn) &&
    rule.title.trim().length > 0 && rule.sources.length > 0 &&
    calculation.loShu.counts[rule.number] === rule.count
  ).map(rule => ({
    number: rule.number, count: rule.count, title: rule.title,
    strength: rule.strength, balance: rule.balance, ruleVersion: rule.version,
    // Retain count provenance: inserted Mulank/Bhagyank are not independent birth digits.
    isMulank: calculation.mulank.final === rule.number,
    isBhagyank: calculation.bhagyank.final === rule.number,
  }))
}
