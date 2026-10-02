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
       