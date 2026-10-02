// lib/numerology/patternrules.ts

import type {
  NumerologyDigit,
  PatternStatus,
} from './types'

export type PatternRule = {
  key: string
  title: string
  numbers: NumerologyDigit[]
  category:
    | 'row'
    | 'column'
    | 'rajyog'

  theme: string

  completeMeaning: string[]
  partialMeaning: string[]
  absentMeaning: string[]

  interpretationPrinciples: string[]
}

export const PATTERN_RULES = {
  mentalRow: {
    key: 'mentalRow',
    title: 'Mental Row',
    numbers: [4, 9, 2],
    category: 'row',

    theme:
      'Mental processing, ideas, perception and the way thought is organised and expressed.',

    completeMeaning: [
      'The Mental Row is fully represented.',
      'Mental processing receives support from structure, purposeful action and emotional awareness.',
      'The combination can support organised thinking together with sensitivity and drive.',
    ],

    partialMeaning: [
      'The Mental Row is partially represented.',
      'Some mental-processing qualities are naturally available while the missing number indicates an area for further development.',
      'Interpret the present numbers