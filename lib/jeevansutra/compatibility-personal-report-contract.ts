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

export type PersonalCompatibilityReport = {
  version: typeof PERSONAL_COMPATIBILITY_REPORT_VERSION
  kind: string
  relationship: string
  people: [CompatibilityPersonPortrait, CompatibilityPersonPortrait]
  connection: { title: string; description: string }
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
