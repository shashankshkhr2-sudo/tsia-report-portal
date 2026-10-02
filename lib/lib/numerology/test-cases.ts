// lib/numerology/test-cases.ts

import {
  calculateNumerologyV2,
} from './calculations'

import type {
  NumberCounts,
  NumerologyDigit,
} from './types'

type ExpectedTestResult = {
  mulankCompound: number
  mulankFinal: NumerologyDigit

  bhagyankCompound: number
  bhagyankFinal: NumerologyDigit

  nameCompound: number
  nameFinal: NumerologyDigit

  loShuCounts: NumberCounts

  missingNumbers: NumerologyDigit[]

  goldenRajyog: {
    presentCount: number
    status: 'complete' | 'partial' | 'absent'
  }

  silverRajyog: {
    presentCount: number
    status: 'complete' | 'partial' | 'absent'
  }
}

type NumerologyTestCase = {
  name: string
  fullName: string
  dateOfBirth: string
  expected: ExpectedTestResult
}

export type TestCaseResult = {
  name: string
  passed: boolean
  errors: string[]
}

export type TestSuiteResult = {
  passed: boolean
  totalTests: number
  passedTests: number
  failedTests: number
  results: TestCaseResult[]
}

const TEST_CASES: NumerologyTestCase[] = [
  {
    name: 'Anita Goel',
    fullName: 'Anita Goel',
    dateOfBirth: '15/03/1956',

    expected: {
      mulankCompound: 15,
      mulankFinal: 6,

      bhagyankCompound: 30,
      bhagyankFinal: 3,

      nameCompound: 30,
      nameFinal: 3,

      loShuCounts: {
        1: 2,
        2: 0,
        3: 2,
        4: 0,
        5: 2,
        6: 2,
        7: 0,
        8: 0,
        9: 1,
      },

      missingNumbers: [2, 4, 7, 8],

      goldenRajyog: {
        presentCount: 2,
        status: 'partial',
      },

      silverRajyog: {
        presentCount: 1,
        status: 'absent',
      },
    },
  },

  {
    name: 'Anushka Das',
    fullName: 'Anushka Das',
    dateOfBirth: '29/03/1983',

    expected: {
      mulankCompound: 29,
      mulankFinal: 2,

      bhagyankCompound: 35,
      bhagyankFinal: 8,

      nameCompound: 31,
      nameFinal: 4,

      loShuCounts: {
        1: 1,
        2: 2,
        3: 2,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 2,
        9: 2,
      },

      missingNumbers: [4, 5, 6, 7],

      goldenRajyog: {
        presentCount: 0,
        status: 'absent',
      },

      silverRajyog: {
        presentCount: 2,
        status: 'partial',
      },
    },
  },
]

function compareCounts(
  actual: NumberCounts,
  expected: NumberCounts
): boolean {
  const numbers: NumerologyDigit[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]

  return numbers.every(
    (number) =>
      actual[number] === expected[number]
  )
}

function compareNumberArrays(
  actual: NumerologyDigit[],
  expected: NumerologyDigit[]
): boolean {
  if (actual.length !== expected.length) {
    return false
  }

  return actual.every(
    (value, index) =>
      value === expected[index]
  )
}

function runTestCase(
  test: NumerologyTestCase
): TestCaseResult {
  const result = calculateNumerologyV2({
    fullName: test.fullName,
    dateOfBirth: test.dateOfBirth,
  })

  const errors: string[] = []

  if (
    result.mulank.compound !==
    test.expected.mulankCompound
  ) {
    errors.push(
      `Mulank compound expected ${test.expected.mulankCompound}, received ${result.mulank.compound}.`
    )
  }

  if (
    result.mulank.final !==
    test.expected.mulankFinal
  ) {
    errors.push(
      `Mulank expected ${test.expected.mulankFinal}, received ${result.mulank.final}.`
    )
  }

  if (
    result.bhagyank.compound !==
    test.expected.bhagyankCompound
  ) {
    errors.push(
      `Bhagyank compound expected ${test.expected.bhagyankCompound}, received ${result.bhagyank.compound}.`
    )
  }

  if (
    result.bhagyank.final !==
    test.expected.bhagyankFinal
  ) {
    errors.push(
      `Bhagyank expected ${test.expected.bhagyankFinal}, received ${result.bhagyank.final}.`
    )
  }

  if (
    result.nameNumber.compoundTotal !==
    test.expected.nameCompound
  ) {
    errors.push(
      `Name compound expected ${test.expected.nameCompound}, received ${result.nameNumber.compoundTotal}.`
    )
  }

  if (
    result.nameNumber.finalNumber !==
    test.expected.nameFinal
  ) {
    errors.push(
      `Name Number expected ${test.expected.nameFinal}, received ${result.nameNumber.finalNumber}.`
    )
  }

  if (
    !compareCounts(
      result.loShu.counts,
      test.expected.loShuCounts
    )
  ) {
    errors.push(
      'Personal Lo Shu counts do not match the locked expected result.'
    )
  }

  if (
    !compareNumberArrays(
      result.loShu.missingNumbers,
      test.expected.missingNumbers
    )
  ) {
    errors.push(
      `Missing numbers expected ${test.expected.missingNumbers.join(
        ', '
      )}, received ${result.loShu.missingNumbers.join(
        ', '
      )}.`
    )
  }

  if (
    result.rajyog.golden.presentCount !==
      test.expected.goldenRajyog.presentCount ||
    result.rajyog.golden.status !==
      test.expected.goldenRajyog.status
  ) {
    errors.push(
      `Golden Rajyog expected ${test.expected.goldenRajyog.presentCount}/3 ${test.expected.goldenRajyog.status}, received ${result.rajyog.golden.presentCount}/3 ${result.rajyog.golden.status}.`
    )
  }

  if (
    result.rajyog.silver.presentCount !==
      test.expected.silverRajyog.presentCount ||
    result.rajyog.silver.status !==
      test.expected.silverRajyog.status
  ) {
    errors.push(
      `Silver Rajyog expected ${test.expected.silverRajyog.presentCount}/3 ${test.expected.silverRajyog.status}, received ${result.rajyog.silver.presentCount}/3 ${result.rajyog.silver.status}.`
    )
  }

  return {
    name: test.name,
    passed: errors.length === 0,
    errors,
  }
}

export function runNumerologyRegressionTests():
  TestSuiteResult {
  const results = TEST_CASES.map(
    runTestCase
  )

  const passedTests = results.filter(
    (result) => result.passed
  ).length

  const failedTests =
    results.length - passedTests

  return {
    passed: failedTests === 0,
    totalTests: results.length,
    passedTests,
    failedTests,
    results,
  }
}