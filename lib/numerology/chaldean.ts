// lib/numerology/chaldean.ts

import type {
  ChaldeanLetterCalculation,
  ChaldeanNameCalculation,
  ChaldeanWordCalculation,
  NumerologyDigit,
} from './types'

const CHALDEAN_VALUES: Record<string, number> = {
  A: 1,
  I: 1,
  J: 1,
  Q: 1,
  Y: 1,

  B: 2,
  K: 2,
  R: 2,

  C: 3,
  G: 3,
  L: 3,
  S: 3,

  D: 4,
  M: 4,
  T: 4,

  E: 5,
  H: 5,
  N: 5,
  X: 5,

  U: 6,
  V: 6,
  W: 6,

  O: 7,
  Z: 7,

  F: 8,
  P: 8,
}

export function reduceToDigit(
  value: number
): NumerologyDigit {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(
      'Numerology value must be a positive integer.'
    )
  }

  let result = value

  while (result > 9) {
    result = String(result)
      .split('')
      .reduce(
        (sum, digit) => sum + Number(digit),
        0
      )
  }

  return result as NumerologyDigit
}

function normalizeWord(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

function calculateWord(
  word: string
): ChaldeanWordCalculation {
  const normalizedWord = normalizeWord(word)

  if (!normalizedWord) {
    throw new Error(
      `Unable to calculate the name word "${word}".`
    )
  }

  const letters: ChaldeanLetterCalculation[] =
    Array.from(normalizedWord).map((letter) => {
      const value = CHALDEAN_VALUES[letter]

      if (!value) {
        throw new Error(
          `No Chaldean value found for "${letter}".`
        )
      }

      return {
        letter,
        value,
      }
    })

  const total = letters.reduce(
    (sum, item) => sum + item.value,
    0
  )

  return {
    word: normalizedWord,
    total,
    finalNumber: reduceToDigit(total),
    letters,
  }
}

export function calculateChaldeanName(
  fullName: string
): ChaldeanNameCalculation {
  const originalName = fullName.trim()

  if (!originalName) {
    throw new Error(
      'Full name is required for Chaldean calculation.'
    )
  }

  const rawWords = originalName
    .split(/\s+/)
    .filter(Boolean)

  const words = rawWords
    .map((word) => normalizeWord(word))
    .filter(Boolean)
    .map((word) => calculateWord(word))

  if (words.length === 0) {
    throw new Error(
      'Full name must contain letters A-Z.'
    )
  }

  const compoundTotal = words.reduce(
    (sum, word) => sum + word.total,
    0
  )

  const normalizedName = words
    .map((word) => word.word)
    .join(' ')

  return {
    originalName,
    normalizedName,
    compoundTotal,
    finalNumber: reduceToDigit(compoundTotal),
    words,
  }
}

export function getChaldeanLetterValue(
  letter: string
): number | null {
  const normalized = normalizeWord(letter)

  if (normalized.length !== 1) {
    return null
  }

  return CHALDEAN_VALUES[normalized] ?? null
}