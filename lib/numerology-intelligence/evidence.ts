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

import {
  buildLoShuProvenance,
} from './loshuprovenance'

import {
  evaluateStructuralPatterns,
} from './structuralpatterns'

import {
  buildStructuralEvidence,
} from './structuralevidence'

function makeId(
  type: string,
  value: string | number
): string {
  return `${type}_${value}`
}

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

export function buildIntelligenceEvidence(
  result: NumerologyCalculationResult
): IntelligenceEvidence[] {
  const evidence: IntelligenceEvidence[] = []

  evidence.push(
    buildMulankEvidence(result),
    buildBhagyankEvidence(result),
    buildNameEvidence(result)
  )

  const compound =
    buildCompoundEvidence(result)

  if (compound) {
    evidence.push(compound)
  }

  evidence.push(
    ...buildMissingEvidence(result),
    ...buildRepetitionEvidence(result)
  )

  /*
   * Build provenance once.
   * Then reuse it for every structural pattern.
   *
   * No API call.
   * No database call.
   * No AI call.
   */
  const loShu =
    buildLoShuProvenance(result)

  const patterns =
    evaluateStructuralPatterns(loShu)

  evidence.push(
    ...buildStructuralEvidence(patterns)
  )

  return evidence
}