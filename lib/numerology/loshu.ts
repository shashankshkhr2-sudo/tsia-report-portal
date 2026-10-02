// lib/numerology/loshu.ts

import type {
  LoShuAnalysis,
  NumberCounts,
  NumerologyDigit,
} from './types'

const NUMEROLOGY_DIGITS: NumerologyDigit[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
]

function createEmptyCounts(): NumberCounts {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  }
}

function getDobDigits(
  dateOfBirth: string
): NumerologyDigit[] {
  const digits = dateOfBirth
    .replace(/\D/g, '')
    .split('')
    .map(Number)
    .filter(
      (digit): digit is NumerologyDigit =>
        digit >= 1 && digit <= 9
    )

  if (digits.length === 0) {
    throw new Error(
      'Date of birth does not contain valid numerology digits.'
    )
  }

  return digits
}

export function calculatePersonalLoShu(
  dateOfBirth: string,
  mulank: NumerologyDigit,
  bhagyank: NumerologyDigit
): LoShuAnalysis {
  if (!dateOfBirth.trim()) {
    throw new Error(
      'Date of birth is required for Lo Shu calculation.'
    )
  }

  const counts = createEmptyCounts()

  // TSIA VERSION 2 LOCKED RULE:
  // Personal Lo Shu =
  // non-zero DOB digits
  // + final Mulank
  // + final Bhagyank.
  //
  // Zero is never inserted.
  // Name Number is never inserted.

  const personalNumbers: NumerologyDigit[] = [
    ...getDobDigits(dateOfBirth),
    mulank,
    bhagyank,
  ]

  for (const number of personalNumbers) {
    counts[number] += 1
  }

  const presentNumbers =
    NUMEROLOGY_DIGITS.filter(
      (number) => counts[number] > 0
    )

  const missingNumbers =
    NUMEROLOGY_DIGITS.filter(
      (number) => counts[number] === 0
    )

  const repeatedNumbers: Partial<
    Record<NumerologyDigit, number>
  > = {}

  for (const number of NUMEROLOGY_DIGITS) {
    if (counts[number] > 1) {
      repeatedNumbers[number] = counts[number]
    }
  }

  return {
    counts,
    presentNumbers,
    missingNumbers,
    repeatedNumbers,
  }
}