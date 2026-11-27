// Customer-facing report only. Keep calculation evidence and birth dates server-side.
// This contract is not connected to existing customer reports yet.
export const PERSONAL_COMPATIBILITY_REPORT_VERSION = "JS_COMPATIBILITY_PERSONAL_1" as const

export type CompatibilityExpectation = {
  title: string
  description: string
}

export type CompatibilityPersonPortrait = {
  name: string
  introduction: string
  expectations: CompatibilityExpectation[]
  possibleMisunderstanding: string
  contribution: string
}

export type CompatibilityInteraction = {
  id: string
  area: string
  firstPerspective: string
  secondPerspective: string
  betweenYou: string
  firstAdjustment: string
  secondAdjustment: string
}

export type CompatibilitySharedPotential = {
  id: string
  title: string
  description: string
}

export type MarriageComparisonCard = {
  title: string
  firstPerspective: string
  secondPerspective: string
  betweenYou: string
}

export type MarriageNumberComparison = MarriageComparisonCard & {
  firstNumber: number
  secondNumber: number
}

export type PersonalCompatibilityReport = {
  version: typeof PERSONAL_COMPATIBILITY_REPORT_VERSION
  kind: string
  relationship: string
  people: [CompatibilityPersonPortrait, CompatibilityPersonPortrait]
  connection: { title: string; description: string }
  marriageGrid?: {
    cells: {
      digit: number
      first: number
      second: number
      joint: number
    }[]
    lines: {
      title: string
      digits: number[]
      missing: number[]
      status: string
    }[]
  }
  marriageComparison?: {
    numbers: MarriageNumberComparison[]
    characteristics: MarriageComparisonCard[]
  }
  interactions: CompatibilityInteraction[]
  sharedPotential: CompatibilitySharedPotential[]
  conclusion: {
    strongestConnection: string
    mainDifference: string
    firstNextStep: string
    secondNextStep: string
  }
  limitation: string
}
