// lib/numerology/patterns.ts

import type {
  ColumnsAnalysis,
  NumberCounts,
  NumerologyDigit,
  PatternResult,
  PatternStatus,
  RajyogAnalysis,
  RowsAnalysis,
} from './types'

function getPatternStatus(
  presentCount: number,
  totalCount: number
): PatternStatus {
  if (presentCount === totalCount) {
    return 'complete'
  }

  if (presentCount === 2) {
    return 'partial'
  }

  return 'absent'
}

function analyzePattern(
  numbers: NumerologyDigit[],
  counts: NumberCounts
): PatternResult {
  const present = numbers.filter(
    (number) => counts[number] > 0
  )

  const missing = numbers.filter(
    (number) => counts[number] === 0
  )

  return {
    numbers,
    present,
    missing,
    presentCount: present.length,
    totalCount: numbers.length,
    status: getPatternStatus(
      present.length,
      numbers.length
    ),
  }
}

export function calculateRows(
  counts: NumberCounts
): RowsAnalysis {
  return {
    mental: analyzePattern(
      [4, 9, 2],
      counts
    ),

    emotionalWill: analyzePattern(
      [3, 5, 7],
      counts
    ),

    practicalMaterial: analyzePattern(
      [8, 1, 6],
      counts
    ),
  }
}

export function calculateColumns(
  counts: NumberCounts
): ColumnsAnalysis {
  return {
    first: analyzePattern(
      [4, 3, 8],
      counts
    ),

    middle: analyzePattern(
      [9, 5, 1],
      counts
    ),

    third: analyzePattern(
      [2, 7, 6],
      counts
    ),
  }
}

export function calculateRajyog(
  counts: NumberCounts
): RajyogAnalysis {
  return {
    golden: analyzePattern(
      [4, 5, 6],
      counts
    ),

    silver: analyzePattern(
      [2, 5, 8],
      counts
    ),
  }
}