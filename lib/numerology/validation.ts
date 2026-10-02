// lib/numerology/validation.ts

import {
  calculateChaldeanName,
  reduceToDigit,
} from './chaldean'

import { calculatePersonalLoShu } from './loshu'

import {
  calculateColumns,
  calculateRajyog,
  calculateRows,
} from './patterns'

import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from './types'

export type ValidationStatus =
  | 'PASSED'
  | 'FAILED'

export type ValidationCheck = {
  name: string
  passed: boolean
  message: string
}

export type NumerologyValidationResult = {
  status: ValidationStatus
  checks: ValidationCheck[]
  errors: string[]
}

function sameArray(
  a: NumerologyDigit[],
  b: NumerologyDigit[]
): boolean {
  if (a.length !== b.length) {
    return false
  }

  return a.every(
    (value, index) => value === b[index]
  )
}

function addCheck(
  checks: ValidationCheck[],
  name: string,
  passed: boolean,
  successMessage: string,
  failureMessage: string
) {
  checks.push({
    name,
    passed,
    message: passed
      ? successMessage
      : failureMessage,
  })
}

export function validateNumerologyV2(
  result: NumerologyCalculationResult
): NumerologyValidationResult {
  const checks: ValidationCheck[] = []

  // 1. MULANK
  const expectedMulank = reduceToDigit(
    result.birthDay
  )

  addCheck(
    checks,
    'Mulank',
    expectedMulank === result.mulank.final,
    `Mulank verified as ${result.mulank.final}.`,
    `Mulank mismatch. Expected ${expectedMulank}, received ${result.mulank.final}.`
  )

  // 2. BHAGYANK
  const dobDigits = result.input.dateOfBirth
    .replace(/\D/g, '')
    .split('')
    .map(Number)

  const expectedBhagyankCompound =
    dobDigits.reduce(
      (sum, digit) => sum + digit,
      0
    )

  const expectedBhagyank =
    reduceToDigit(
      expectedBhagyankCompound
    )

  addCheck(
    checks,
    'Bhagyank compound',
    expectedBhagyankCompound ===
      result.bhagyank.compound,
    `Bhagyank compound verified as ${result.bhagyank.compound}.`,
    `Bhagyank compound mismatch. Expected ${expectedBhagyankCompound}, received ${result.bhagyank.compound}.`
  )

  addCheck(
    checks,
    'Bhagyank final',
    expectedBhagyank ===
      result.bhagyank.final,
    `Bhagyank verified as ${result.bhagyank.final}.`,
    `Bhagyank mismatch. Expected ${expectedBhagyank}, received ${result.bhagyank.final}.`
  )

  // 3. CHALDEAN NAME NUMBER
  const expectedName =
    calculateChaldeanName(
      result.input.fullName
    )

  addCheck(
    checks,
    'Name compound',
    expectedName.compoundTotal ===
      result.nameNumber.compoundTotal,
    `Name compound verified as ${result.nameNumber.compoundTotal}.`,
    `Name compound mismatch. Expected ${expectedName.compoundTotal}, received ${result.nameNumber.compoundTotal}.`
  )

  addCheck(
    checks,
    'Name final',
    expectedName.finalNumber ===
      result.nameNumber.finalNumber,
    `Name Number verified as ${result.nameNumber.finalNumber}.`,
    `Name Number mismatch. Expected ${expectedName.finalNumber}, received ${result.nameNumber.finalNumber}.`
  )

  // 4. PERSONAL LO SHU
  const expectedLoShu =
    calculatePersonalLoShu(
      result.input.dateOfBirth,
      result.mulank.final,
      result.bhagyank.final
    )

  const countsMatch =
    JSON.stringify(expectedLoShu.counts) ===
    JSON.stringify(result.loShu.counts)

  addCheck(
    checks,
    'Lo Shu counts',
    countsMatch,
    'Personal Lo Shu counts verified.',
    'Personal Lo Shu counts do not match the TSIA Version 2 rule.'
  )

  addCheck(
    checks,
    'Present numbers',
    sameArray(
      expectedLoShu.presentNumbers,
      result.loShu.presentNumbers
    ),
    'Present numbers verified.',
    'Present-number calculation mismatch.'
  )

  addCheck(
    checks,
    'Missing numbers',
    sameArray(
      expectedLoShu.missingNumbers,
      result.loShu.missingNumbers
    ),
    'Missing numbers verified.',
    'Missing-number calculation mismatch.'
  )

  // 5. ROWS
  const expectedRows =
    calculateRows(
      expectedLoShu.counts
    )

  addCheck(
    checks,
    'Lo Shu rows',
    JSON.stringify(expectedRows) ===
      JSON.stringify(result.rows),
    'All Lo Shu rows verified.',
    'Lo Shu row analysis mismatch.'
  )

  // 6. COLUMNS
  const expectedColumns =
    calculateColumns(
      expectedLoShu.counts
    )

  addCheck(
    checks,
    'Lo Shu columns',
    JSON.stringify(expectedColumns) ===
      JSON.stringify(result.columns),
    'All Lo Shu columns verified.',
    'Lo Shu column analysis mismatch.'
  )

  // 7. RAJYOG
  const expectedRajyog =
    calculateRajyog(
      expectedLoShu.counts
    )

  addCheck(
    checks,
    'Rajyog',
    JSON.stringify(expectedRajyog) ===
      JSON.stringify(result.rajyog),
    'Golden and Silver Rajyog verified.',
    'Rajyog calculation mismatch.'
  )

  // 8. GRAHA MAP
  const expectedGrahas = {
    1: 'Surya',
    2: 'Chandra',
    3: 'Guru',
    4: 'Rahu',
    5: 'Budh',
    6: 'Shukra',
    7: 'Ketu',
    8: 'Shani',
    9: 'Mangal',
  }

  addCheck(
    checks,
    'Graha mapping',
    JSON.stringify(expectedGrahas) ===
      JSON.stringify(result.grahas),
    'Graha mapping verified.',
    'Graha mapping mismatch.'
  )

  const errors = checks
    .filter((check) => !check.passed)
    .map((check) => check.message)

  return {
    status:
      errors.length === 0
        ? 'PASSED'
        : 'FAILED',
    checks,
    errors,
  }
}