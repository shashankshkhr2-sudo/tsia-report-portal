// lib/numerology/types.ts

export type NumerologyDigit =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9

export type GrahaName =
  | 'Surya'
  | 'Chandra'
  | 'Guru'
  | 'Rahu'
  | 'Budh'
  | 'Shukra'
  | 'Ketu'
  | 'Shani'
  | 'Mangal'

export type NumberCounts = Record<NumerologyDigit, number>

export type PatternStatus =
  | 'complete'
  | 'partial'
  | 'absent'

export type PatternResult = {
  numbers: NumerologyDigit[]
  present: NumerologyDigit[]
  missing: NumerologyDigit[]
  presentCount: number
  totalCount: number
  status: PatternStatus
}

export type LoShuAnalysis = {
  counts: NumberCounts
  presentNumbers: NumerologyDigit[]
  missingNumbers: NumerologyDigit[]
  repeatedNumbers: Partial<
    Record<NumerologyDigit, number>
  >
}

export type RowsAnalysis = {
  mental: PatternResult
  emotionalWill: PatternResult
  practicalMaterial: PatternResult
}

export type ColumnsAnalysis = {
  first: PatternResult
  middle: PatternResult
  third: PatternResult
}

export type RajyogAnalysis = {
  golden: PatternResult
  silver: PatternResult
}

export type ChaldeanLetterCalculation = {
  letter: string
  value: number
}

export type ChaldeanWordCalculation = {
  word: string
  total: number
  finalNumber: NumerologyDigit
  letters: ChaldeanLetterCalculation[]
}

export type ChaldeanNameCalculation = {
  originalName: string
  normalizedName: string
  compoundTotal: number
  finalNumber: NumerologyDigit
  words: ChaldeanWordCalculation[]
}

export type GrahaMap = Record<
  NumerologyDigit,
  GrahaName
>

export type NumerologyCalculationInput = {
  fullName: string
  dateOfBirth: string
}

export type NumerologyCalculationResult = {
  input: {
    fullName: string
    dateOfBirth: string
  }

  birthDay: number

  mulank: {
    compound: number
    final: NumerologyDigit
  }

  bhagyank: {
    compound: number
    final: NumerologyDigit
  }

  nameNumber: ChaldeanNameCalculation

  loShu: LoShuAnalysis

  rows: RowsAnalysis

  columns: ColumnsAnalysis

  rajyog: RajyogAnalysis

  grahas: GrahaMap

  calculationVersion: 'TSIA_V2_CALC_1.0'
}