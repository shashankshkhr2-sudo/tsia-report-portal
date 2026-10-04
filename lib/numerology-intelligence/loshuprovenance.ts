import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from '../numerology/types'

export type LoShuSource =
  | 'RAW_DOB'
  | 'MULANK_INSERTION'
  | 'BHAGYANK_INSERTION'

export type LoShuOccurrence = {
  number: NumerologyDigit
  source: LoShuSource
}

export type ProvenanceCount = {
  total: number
  rawDob: number
  mulankInsertion: number
  bhagyankInsertion: number
}

export type LoShuProvenanceResult = {
  sourceGrid: Record<NumerologyDigit, number>
  personalGrid: Record<NumerologyDigit, number>
  provenance: Record<NumerologyDigit, ProvenanceCount>
  occurrences: LoShuOccurrence[]
}

function emptyCounts(): Record<NumerologyDigit, number> {
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

function emptyProvenance(): Record<
  NumerologyDigit,
  ProvenanceCount
> {
  return {
    1: makeCount(),
    2: makeCount(),
    3: makeCount(),
    4: makeCount(),
    5: makeCount(),
    6: makeCount(),
    7: makeCount(),
    8: makeCount(),
    9: makeCount(),
  }
}

function makeCount(): ProvenanceCount {
  return {
    total: 0,
    rawDob: 0,
    mulankInsertion: 0,
    bhagyankInsertion: 0,
  }
}

function isDigit(value: number): value is NumerologyDigit {
  return value >= 1 && value <= 9
}

function rawDobDigits(
  dateOfBirth: string
): NumerologyDigit[] {
  return dateOfBirth
    .replace(/\D/g, '')
    .split('')
    .map(Number)
    .filter(isDigit)
}

export function buildLoShuProvenance(
  result: NumerologyCalculationResult
): LoShuProvenanceResult {
  const sourceGrid = emptyCounts()
  const personalGrid = emptyCounts()
  const provenance = emptyProvenance()
  const occurrences: LoShuOccurrence[] = []

  const add = (
    number: NumerologyDigit,
    source: LoShuSource
  ) => {
    personalGrid[number] += 1
    provenance[number].total += 1

    if (source === 'RAW_DOB') {
      sourceGrid[number] += 1
      provenance[number].rawDob += 1
    }

    if (source === 'MULANK_INSERTION') {
      provenance[number].mulankInsertion += 1
    }

    if (source === 'BHAGYANK_INSERTION') {
      provenance[number].bhagyankInsertion += 1
    }

    occurrences.push({
      number,
      source,
    })
  }

  for (const number of rawDobDigits(
    result.input.dateOfBirth
  )) {
    add(number, 'RAW_DOB')
  }

  add(
    result.mulank.final,
    'MULANK_INSERTION'
  )

  add(
    result.bhagyank.final,
    'BHAGYANK_INSERTION'
  )

  return {
    sourceGrid,
    personalGrid,
    provenance,
    occurrences,
  }
}

export function isSourcePresent(
  result: LoShuProvenanceResult,
  number: NumerologyDigit
): boolean {
  return result.sourceGrid[number] > 0
}

export function isPersonalPresent(
  result: LoShuProvenanceResult,
  number: NumerologyDigit
): boolean {
  return result.personalGrid[number] > 0
}

export function isInsertedOnly(
  result: LoShuProvenanceResult,
  number: NumerologyDigit
): boolean {
  return (
    result.sourceGrid[number] === 0 &&
    result.personalGrid[number] > 0
  )
}