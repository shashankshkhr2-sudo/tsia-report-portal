import "server-only"
import type { PersonalCompatibilityEvidence } from "./compatibility-personal-evidence"
import type { CompatibilitySharedPotential } from "./compatibility-personal-report-contract"

// Adopted draft meanings. Customer IDs do not expose calculation identifiers.
const PATTERN_COPY: Record<string, CompatibilitySharedPotential> = {
  "row_492": {
    "id": "considering-options",
    "title": "Seeing a decision from different sides",
    "description": "This traditional theme concerns examining a situation and forming a considered view. Its useful expression is making room for another perspective while checking the practical details."
  },
  "row_357": {
    "id": "understanding-experiences",
    "title": "Making sense of experiences",
    "description": "This traditional theme concerns recognising feelings and finding ways to express them. An experience can affect each person differently, even when both were present."
  },
  "row_816": {
    "id": "everyday-support",
    "title": "Care expressed through everyday actions",
    "description": "This traditional theme concerns practical responsibilities and support. It offers a way to explore how care becomes visible through actions, without assigning all the work to one person."
  },
  "column_438": {
    "id": "organising-plans",
    "title": "Giving an idea a workable shape",
    "description": "This traditional theme concerns organising information and putting steps in a useful order. It connects an intention with the arrangements needed to carry it out."
  },
  "column_951": {
    "id": "maintaining-direction",
    "title": "Staying with a chosen direction",
    "description": "This traditional theme concerns determination. Its constructive expression is commitment to a goal both people want, with room to reconsider the approach when circumstances change."
  },
  "column_276": {
    "id": "considered-action",
    "title": "Turning consideration into action",
    "description": "This traditional theme concerns acting with attention to people and practical details. Support is most useful when the action matches what is actually needed."
  },
  "golden_456": {
    "id": "opportunity-and-progress",
    "title": "Exploring opportunity and progress",
    "description": "Within the adopted tradition, this theme is associated with favourable opportunities, recognition, progress and material comfort. It is a symbolic theme to explore, not a forecast of status, income or success."
  },
  "silver_258": {
    "id": "lasting-foundations",
    "title": "Building something lasting",
    "description": "Within the adopted tradition, this theme is associated with property, tangible assets and material security. It does not establish that either person will acquire property or that joining their lives or work will produce financial gains."
  }
}

export function buildPersonalSharedPotential(evidence: PersonalCompatibilityEvidence) {
  const items: CompatibilitySharedPotential[] = []
  const references: { itemId: string; patternId: string; formation: string }[] = []
  const unsupportedPatterns: string[] = []
  for (const pattern of evidence.patterns) {
    if (!pattern.jointComplete) continue
    const copy = PATTERN_COPY[pattern.id]
    if (!copy) { unsupportedPatterns.push(pattern.id); continue }
    let introduction: string
    if (pattern.formation === "newly_together") {
      introduction = "This theme emerges in your combined reading rather than appearing fully in either individual reading."
    } else if (pattern.formation === "both_individuals") {
      introduction = "This theme appears in both individual readings. That suggests a shared symbolic emphasis, not identical behaviour."
    } else if (pattern.formation === "first_individual" || pattern.formation === "second_individual") {
      const person = pattern.formation === "first_individual" ? evidence.source.self : evidence.source.other
      introduction = person.name + " brings this theme from their individual reading; it is not newly created by the combination."
    } else {
      throw new Error("Complete pattern has an inconsistent formation status.")
    }
    items.push({ id: copy.id, title: copy.title, description: introduction + " " + copy.description })
    references.push({ itemId: copy.id, patternId: pattern.id, formation: pattern.formation })
  }
  return { items, evidence: { references, unsupportedPatterns } }
}
