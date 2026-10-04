import type {
  IntelligenceEvidence,
} from './types'

import type {
  StructuralPatternResult,
} from './structuralpatterns'

import {
  getStructuralRule,
} from './structuralrules'

function makeId(
  pattern: StructuralPatternResult
): string {
  return `STRUCTURE_${pattern.id}`
}

function makeStatement(
  pattern: StructuralPatternResult
): string {
  const rule = getStructuralRule(pattern.id)

  if (pattern.status === 'COMPLETE') {
    return rule.completeMeaning
  }

  if (pattern.status === 'PARTIAL') {
    return rule.partialMeaning
  }

  return rule.absentMeaning
}

function makeSourceValue(
  pattern: StructuralPatternResult
): string {
  const numbers = pattern.numbers.join('-')

  return [
    numbers,
    pattern.status,
    pattern.origin,
  ].join('|')
}

export function buildStructuralEvidence(
  patterns: StructuralPatternResult[]
): IntelligenceEvidence[] {
  return patterns.map(pattern => {
    const rule = getStructuralRule(pattern.id)

    const isComplete =
      pattern.status === 'COMPLETE'

    const isAbsent =
      pattern.status === 'ABSENT'

    return {
      id: makeId(pattern),

      layer: rule.isRajyog
        ? 'RAJYOG'
        : pattern.id.startsWith('ROW_')
          ? 'ROW'
          : 'COLUMN',

      provenance: 'DERIVED_STRUCTURE',

      provenanceGroup:
        `LO_SHU_STRUCTURE_${pattern.id}`,

      role: 'STRUCTURAL',

      roleDistinctness: 'DISTINCT_ROLE',

      independence: 'PARTIALLY_DEPENDENT',

      direction: isComplete
        ? 'SUPPORTS'
        : isAbsent
          ? 'UNDER_SUPPORTS'
          : 'CONTEXTUALIZES',

      statement: makeStatement(pattern),

      sourceValue: makeSourceValue(pattern),

      structureId: pattern.id,

      methodologyRuleId:
        `TSIA_V3_${pattern.id}`,
    }
  })
}