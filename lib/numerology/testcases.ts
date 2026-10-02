// lib/numerology/testcases.ts

import { calculateNumerologyV2 } from './calculations'
import type { NumberCounts, NumerologyDigit } from './types'

type Expected = {
  mulankCompound: number
  mulankFinal: NumerologyDigit
  bhagyankCompound: number
  bhagyankFinal: NumerologyDigit
  nameCompound: number
  nameFinal: NumerologyDigit
  loShuCounts: NumberCounts
  missingNumbers: NumerologyDigit[]
  goldenCount: number
  goldenStatus: 'complete' | 'partial' | 'absent'
  silverCount: number
  silverStatus: 'complete' | 'partial' | 'absent'
}

type TestCase = {
  name: string
  fullName: string
  dob: string
  expected: Expected
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

const TESTS: TestCase[] = [
  {
    name: 'Anita Goel',
    fullName: 'Anita Goel',
    dob: '15/03/1956',
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
      goldenCount: 2,
      goldenStatus: 'partial',
      silverCount: 1,
      silverStatus: 'absent',
    },
  },
  {
    name: 'Anushka Das',
    fullName: 'Anushka Das',
    dob: '29/03/1983',
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
      goldenCount: 0,
      goldenStatus: 'absent',
      silverCount: 2,
      silverStatus: 'partial',
    },
  },
]

function runTest(test: TestCase): TestCaseResult {
  const r = calculateNumerologyV2({
    fullName: test.fullName,
    dateOfBirth: test.dob,
  })

  const e = test.expected
  const errors: string[] = []

  if (r.mulank.compound !== e.mulankCompound)
    errors.push('Mulank compound mismatch.')

  if (r.mulank.final !== e.mulankFinal)
    errors.push('Mulank final mismatch.')

  if (r.bhagyank.compound !== e.bhagyankCompound)
    errors.push('Bhagyank compound mismatch.')

  if (r.bhagyank.final !== e.bhagyankFinal)
    errors.push('Bhagyank final mismatch.')

  if (r.nameNumber.compoundTotal !== e.nameCompound)
    errors.push('Name compound mismatch.')

  if (r.nameNumber.finalNumber !== e.nameFinal)
    errors.push('Name Number mismatch.')

  if (
    JSON.stringify(r.loShu.counts) !==
    JSON.stringify(e.loShuCounts)
  )
    errors.push('Lo Shu counts mismatch.')

  if (
    JSON.stringify(r.loShu.missingNumbers) !==
    JSON.stringify(e.missingNumbers)
  )
    errors.push('Missing numbers mismatch.')

  if (
    r.rajyog.golden.presentCount !== e.goldenCount ||
    r.rajyog.golden.status !== e.goldenStatus
  )
    errors.push('Golden Rajyog mismatch.')

  if (
    r.rajyog.silver.presentCount !== e.silverCount ||
    r.rajyog.silver.status !== e.silverStatus
  )
    errors.push('Silver Rajyog mismatch.')

  return {
    name: test.name,
    passed: errors.length === 0,
    errors,
  }
}

export function runNumerologyRegressionTests():
  TestSuiteResult {
  const results = TESTS.map(runTest)

  const passedTests = results.filter(
    (test) => test.passed
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