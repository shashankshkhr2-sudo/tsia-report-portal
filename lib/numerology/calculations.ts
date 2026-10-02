// lib/numerology/calculations.ts

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
  GrahaMap,
  NumerologyCalculationInput,
  NumerologyCalculationResult,
} from './types'

const GRAHA_MAP: GrahaMap = {
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

type ParsedDateOfBirth = {
  day: number
  month: number
  year: number
  canonical: string
}

function isLeapYear(year: number): boolean {
  return (
    year % 400 === 0 ||
    (year % 4 === 0 && year % 100 !== 0)
  )
}

function getDaysInMonth(
  month: number,
  year: number
): number {
  switch (month) {
    case 2:
      return isLeapYear(year) ? 29 : 28

    case 4:
    case 6:
    case 9:
    case 11:
      return 30

    default:
      return 31
  }
}

function parseDateOfBirth(
  value: string
): ParsedDateOfBirth {
  const input = value.trim()

  if (!input) {
    throw new Error('Date of birth is required.')
  }

  let day: number
  let month: number
  let year: number

  // Database / HTML date input format:
  // YYYY-MM-DD
  const isoMatch = input.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  )

  if (isoMatch) {
    year = Number(isoMatch[1])
    month = Number(isoMatch[2])
    day = Number(isoMatch[3])
  } else {
    // Human display/input formats:
    // DD/MM/YYYY
    // DD-MM-YYYY
    // DD.MM.YYYY
    const displayMatch = input.match(
      /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/
    )

    if (!displayMatch) {
      throw new Error(
        'Date of birth must use YYYY-MM-DD or DD/MM/YYYY format.'
      )
    }

    day = Number(displayMatch[1])
    month = Number(displayMatch[2])
    year = Number(displayMatch[3])
  }

  if (
    !Number.isInteger(year) ||
    year < 1000 ||
    year > 9999
  ) {
    throw new Error('Date of birth year is invalid.')
  }

  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error('Date of birth month is invalid.')
  }

  const maxDay = getDaysInMonth(month, year)

  if (
    !Number.isInteger(day) ||
    day < 1 ||
    day > maxDay
  ) {
    throw new Error('Date of birth day is invalid.')
  }

  const canonical = [
    String(day).padStart(2, '0'),
    String(month).padStart(2, '0'),
    String(year),
  ].join('/')

  return {
    day,
    month,
    year,
    canonical,
  }
}

function sumDigits(value: string): number {
  return value
    .replace(/\D/g, '')
    .split('')
    .reduce(
      (sum, digit) => sum + Number(digit),
      0
    )
}

export function calculateNumerologyV2(
  input: NumerologyCalculationInput
): NumerologyCalculationResult {
  const fullName = input.fullName.trim()

  if (!fullName) {
    throw new Error(
      'Full name is required for Version 2 calculation.'
    )
  }

  const dob = parseDateOfBirth(
    input.dateOfBirth
  )

  // MULANK
  // Birth day reduced to final single digit.
  const mulankCompound = dob.day
  const mulankFinal = reduceToDigit(
    mulankCompound
  )

  // BHAGYANK
  // Sum every digit of the complete DOB,
  // including zero mathematically.
  const bhagyankCompound = sumDigits(
    dob.canonical
  )

  const bhagyankFinal = reduceToDigit(
    bhagyankCompound
  )

  // CHALDEAN NAME NUMBER
  const nameNumber =
    calculateChaldeanName(fullName)

  // TSIA PERSONAL LO SHU
  // Non-zero DOB digits
  // + final Mulank
  // + final Bhagyank.
  //
  // Name Number is NOT inserted.
  const loShu = calculatePersonalLoShu(
    dob.canonical,
    mulankFinal,
    bhagyankFinal
  )

  // STRUCTURAL PATTERNS
  const rows = calculateRows(
    loShu.counts
  )

  const columns = calculateColumns(
    loShu.counts
  )

  const rajyog = calculateRajyog(
    loShu.counts
  )

  return {
    input: {
      fullName,
      dateOfBirth: dob.canonical,
    },

    birthDay: dob.day,

    mulank: {
      compound: mulankCompound,
      final: mulankFinal,
    },

    bhagyank: {
      compound: bhagyankCompound,
      final: bhagyankFinal,
    },

    nameNumber,

    loShu,

    rows,

    columns,

    rajyog,

    grahas: GRAHA_MAP,

    calculationVersion:
      'TSIA_V2_CALC_1.0',
  }
}