import type { NumerologyDigit } from '../numerology/types'
import type { LoShuProvenanceResult } from './loshuprovenance'

export type StructuralPatternId =
  | 'ROW_4_9_2'
  | 'ROW_3_5_7'
  | 'ROW_8_1_6'
  | 'COLUMN_4_3_8'
  | 'COLUMN_9_5_1'
  | 'COLUMN_2_7_6'
  | 'GOLDEN_RAJYOG_4_5_6'
  | 'SILVER_RAJYOG_2_5_8'

export type StructuralStatus =
  | 'COMPLETE'
  | 'PARTIAL'
  | 'ABSENT'

export type StructuralOrigin =
  | 'SOURCE_NATIVE'
  | 'TSIA_INTEGRATED'
  | 'NOT_COMPLETE'

export type StructuralPatternResult = {
  id: StructuralPatternId
  numbers: NumerologyDigit[]
  status: StructuralStatus
  origin: StructuralOrigin
  sourcePresent: NumerologyDigit[]
  personalPresent: NumerologyDigit[]
  missing: NumerologyDigit[]
  completedByInsertion: NumerologyDigit[]
}

const PATTERNS: Record<
  StructuralPatternId,
  NumerologyDigit[]
> = {
  ROW_4_9_2: [4, 9, 2],
  ROW_3_5_7: [3, 5, 7],
  ROW_8_1_6: [8, 1, 6],
  COLUMN_4_3_8: [4, 3, 8],
  COLUMN_9_5_1: [9, 5, 1],
  COLUMN_2_7_6: [2, 7, 6],
  GOLDEN_RAJYOG_4_5_6: [4, 5, 6],
  SILVER_RAJYOG_2_5_8: [2, 5, 8],
}

function evaluate(
  id: StructuralPatternId,
  grid: LoShuProvenanceResult
): StructuralPatternResult {
  const numbers = PATTERNS[id]

  const sourcePresent = numbers.filter(
    n => grid.sourceGrid[n] > 0
  )

  const personalPresent = numbers.filter(
    n => grid.personalGrid[n] > 0
  )

  const missing = numbers.filter(
    n => grid.personalGrid[n] === 0
  )

  let status: StructuralStatus = 'ABSENT'

  if (personalPresent.length === 3) {
    status = 'COMPLETE'
  } else if (personalPresent.length > 0) {
    status = 'PARTIAL'
  }

  let origin: StructuralOrigin = 'NOT_COMPLETE'

  if (status === 'COMPLETE') {
    origin =
      sourcePresent.length === 3
        ? 'SOURCE_NATIVE'
        : 'TSIA_INTEGRATED'
  }

  const completedByInsertion =
    status === 'COMPLETE'
      ? numbers.filter(
          n =>
            grid.sourceGrid[n] === 0 &&
            grid.personalGrid[n] > 0
        )
      : []

  return {
    id,
    numbers,
    status,
    origin,
    sourcePresent,
    personalPresent,
    missing,
    completedByInsertion,
  }
}

export function evaluateStructuralPatterns(
  grid: LoShuProvenanceResult
): StructuralPatternResult[] {
  const ids =
    Object.keys(PATTERNS) as StructuralPatternId[]

  return ids.map(id => evaluate(id, grid))
}

export function getStructuralPattern(
  results: StructuralPatternResult[],
  id: StructuralPatternId
) {
  return results.find(result => result.id === id)
}