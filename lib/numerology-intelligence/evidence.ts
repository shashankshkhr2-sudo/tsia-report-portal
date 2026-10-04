import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  IntelligenceEvidence,
} from './types'

import {
  getFunctionalQuality,
} from './functionalqualities'

import {
  getCompoundRule,
} from './compounds'

/**
 * TSIA Numerology Intelligence V3
 * Evidence Builder
 *
 * Converts verified V2 calculation output
 * into standardized V3 evidence objects.
 *
 * It does NOT change V2 calculations.
 */

function makeId(
  type: string,
  value: string | number
): string {
  return `${type}_${value}`
}

/**
 * MULANK
 */
function buildMulankEvidence(
  result: NumerologyCalculationResult
): IntelligenceEvidence {
  const number = result.mulank.final
  const quality = getFunctionalQuality(number)

  return {
    id: makeId('MULANK', number),
    layer: 'MULANK',
    provenance: 'DOB_DAY',
    provenanceGroup: 'DOB_DAY',
    role: 'PRIMARY_CORE',
    roleDistinctness: 'DISTINCT_ROLE',
    independence: 'PARTIALLY_DEPENDENT',
    number,
    functionalQualityId: quality.id,
    direction: 'SUPPORTS',
    statement:
      `Mulank ${number} supports ${quality.title}.`,
    sourceValue: result.mulank.compound,
    methodologyRuleId:
      `NUM_MULANK_${number}`,
  }
}

/**
 * BHAGYANK
 */
function buildBhagyankEvidence(
  result: NumerologyCalculationResult
): IntelligenceEvidence {
  const number = result.bhagyank.final
  const quality = getFunctionalQuality(number)

  return {
    id: makeId('BHAGYANK', number),
    layer: 'BHAGYANK',
    provenance: 'DOB_FULL',
    provenanceGroup: 'DOB_FULL',
    role: 'DEVELOPMENT_DIRECTION',
    roleDistinctness: 'DISTINCT_ROLE',
    independence: 'PARTIALLY_DEPENDENT',
    number,
    functionalQualityId: quality.id,
    direction: 'SUPPORTS',
    statement:
      `Bhagyank ${number} supports ${quality.title} as a broader development direction.`,
    sourceValue: result.bhagyank.compound,
    methodologyRuleId:
      `NUM_BHAGYANK_${number}`,
  }
}

/**
 * NAME NUMBER
 */
function buildNameEvidence(
  result: NumerologyCalculationResult
): IntelligenceEvidence {
  const number =
    result.nameNumber.finalNumber

  const quality =
    getFunctionalQuality(number)

  return {
    id: makeId('NAME', number),
    layer: 'NAME_NUMBER',
    provenance: 'FULL_NAME',
    provenanceGroup: 'FULL_NAME',
    role: 'NAME_EXPRESSION',
    roleDistinctness: 'DISTINCT_ROLE',
    independence: 'INDEPENDENT',
    number,
    functionalQualityId: quality.id,
    direction: 'SUPPORTS',
    statement:
      `Name Number ${number} supports ${quality.title} in outward or name-based expression.`,
    sourceValue:
      result.nameNumber.compoundTotal,
    methodologyRuleId:
      `NUM_NAME_${number}`,
  }
}

/**
 * COMPOUND BIRTH CONTEXT
 *
 * Only birth days 10-31 enter this layer.
 * Birth days 1-9 use root evidence only.
 */
function buildCompoundEvidence(
  result: NumerologyCalculationResult
): IntelligenceEvidence | null {
  const rule =
    getCompoundRule(result.birthDay)

  if (!rule) {
    return null
  }

  const quality =
    getFunctionalQuality(rule.root)

  return {
    id: makeId(
      'BIRTH_COMPOUND',
      rule.compound
    ),
    layer: 'COMPOUND_BIRTH_CONTEXT',
    provenance: 'DOB_DAY',
    provenanceGroup: 'DOB_DAY',
    role: 'COMPOUND_CONTEXT',
    roleDistinctness: 'DISTINCT_ROLE',
    independence: 'DEPENDENT',
    number: rule.root,
    functionalQualityId: quality.id,
    direction: 'CONTEXTUALIZES',
    statement: rule.contextualMeaning,
    sourceValue: rule.compound,
    methodologyRuleId:
      `CHEIRO_BIRTH_${rule.compound}`,
  }
}

/**
 * MISSING NUMBERS
 *
 * Missing means structurally absent from
 * Personal Lo Shu.
 *
 * It does NOT mean Needed Number.
 */
function buildMissingEvidence(
  result: NumerologyCalculationResult
): IntelligenceEvidence[] {
  return result.loShu.missingNumbers.map(
    number => {
      const quality =
        getFunctionalQuality(number)

      return {
        id: makeId('MISSING', number),
        layer: 'MISSING_NUMBER',
        provenance: 'DERIVED_STRUCTURE',
        provenanceGroup:
          `LO_SHU_MISSING_${number}`,
        role: 'STRUCTURAL',
        roleDistinctness: 'DISTINCT_ROLE',
        independence:
          'PARTIALLY_DEPENDENT',
        number,
        functionalQualityId: quality.id,
        direction: 'UNDER_SUPPORTS',
        statement:
          `${quality.title} is structurally under-supported in the Personal Lo Shu.`,
        sourceValue: number,
        methodologyRuleId:
          `NUM_MISSING_${number}`,
      }
    }
  )
}

/**
 * REPETITIONS
 *
 * Strength-first:
 * repetition means stronger representation.
 * It does NOT automatically mean excess.
 */
function buildRepetitionEvidence(
  result: NumerologyCalculationResult
): IntelligenceEvidence[] {
  const evidence: IntelligenceEvidence[] = []

  for (
    let number = 1;
    number <= 9;
    number++
  ) {
    const digit =
      number as NumerologyDigit

    const count =
      result.loShu.repeatedNumbers[digit]

    if (!count || count < 2) {
      continue
    }

    const quality =
      getFunctionalQuality(digit)

    evidence.push({
      id: makeId(
        'REPETITION',
        `${digit}x${count}`
      ),
      layer: 'REPETITION',
      provenance: 'DERIVED_STRUCTURE',
      provenanceGroup:
        `LO_SHU_REPEAT_${digit}`,
      role: 'STRUCTURAL',
      roleDistinctness: 'DISTINCT_ROLE',
      independence:
        'PARTIALLY_DEPENDENT',
      number: digit,
      functionalQualityId: quality.id,
      direction: 'SUPPORTS',
      statement:
        `${quality.title} has stronger representation with ${count} occurrences of ${digit}.`,
      sourceValue: count,
      methodologyRuleId:
        `NUM_REPEAT_${digit}`,
    })
  }

  return evidence
}

/**
 * Main V2 -> V3 evidence bridge.
 */
export function buildIntelligenceEvidence(
  result: NumerologyCalculationResult
): IntelligenceEvidence[] {
  const evidence: IntelligenceEvidence[] = []

  evidence.push(
    buildMulankEvidence(result)
  )

  evidence.push(
    buildBhagyankEvidence(result)
  )

  evidence.push(
    buildNameEvidence(result)
  )

  const compound =
    buildCompoundEvidence(result)

  if (compound) {
    evidence.push(compound)
  }

  evidence.push(
    ...buildMissingEvidence(result)
  )

  evidence.push(
    ...buildRepetitionEvidence(result)
  )

  return evidence
}