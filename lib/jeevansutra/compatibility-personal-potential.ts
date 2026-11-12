import "server-only"
import type { PersonalCompatibilityEvidence } from "./compatibility-personal-evidence"
import type { CompatibilitySharedPotential } from "./compatibility-personal-report-contract"

// Adopted draft meanings. Customer IDs do not expose calculation identifiers.
const PATTERN_COPY: Record<string, CompatibilitySharedPotential> = {
  "row_492": {
    "id": "considering-options",
    "title": "Seeing a decision from different sides",
    "description": "Considering different viewpoints may help you make a more rounded decision. The useful balance is to examine the details without losing sight of what matters to each person."
  },
  "row_357": {
    "id": "understanding-experiences",
    "title": "Making sense of experiences",
    "description": "Putting an experience into words may help you understand its emotional meaning. Even when you experience the same event, allow room for different feelings about it."
  },
  "row_816": {
    "id": "everyday-support",
    "title": "Care expressed through everyday actions",
    "description": "Practical help may be an important way of expressing care. Taking responsibility can support everyday life together, while affection and appreciation still need their own place."
  },
  "column_438": {
    "id": "organising-plans",
    "title": "Giving an idea a workable shape",
    "description": "Turning an idea into clear steps may be a useful contribution. A plan becomes easier to share when both people understand the arrangements and can influence them."
  },
  "column_951": {
    "id": "maintaining-direction",
    "title": "Staying with a chosen direction",
    "description": "Determination may help you stay with a goal through difficulties. That effort becomes a shared strength when both people choose the goal and remain free to reconsider the approach."
  },
  "column_276": {
    "id": "considered-action",
    "title": "Turning consideration into action",
    "description": "Thoughtful action may be a useful way of offering support. Checking what the other person needs can make the difference between welcome help and unwanted involvement."
  },
  "golden_456": {
    "id": "opportunity-and-progress",
    "title": "Exploring opportunity and progress",
    "description": "Your reading introduces a traditional association with opportunity, recognition and material progress. Explore the ambitions you want to support together, without treating this as a promise of success."
  },
  "silver_258": {
    "id": "lasting-foundations",
    "title": "Building something lasting",
    "description": "Your reading introduces a traditional association with building lasting assets, such as a home or property. This is an area to explore together, not an assurance of financial gain."
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
      introduction = "A possibility to explore together."
    } else if (pattern.formation === "both_individuals") {
      introduction = "You may recognise this approach in each other, although you can express it differently."
    } else if (pattern.formation === "first_individual" || pattern.formation === "second_individual") {
      const person = pattern.formation === "first_individual" ? evidence.source.self : evidence.source.other
      introduction = person.name + ", this is one possible contribution you bring to the connection."
    } else {
      throw new Error("Complete pattern has an inconsistent formation status.")
    }
    items.push({ id: copy.id, title: copy.title, description: introduction + " " + copy.description })
    references.push({ itemId: copy.id, patternId: pattern.id, formation: pattern.formation })
  }
  return { items, evidence: { references, unsupportedPatterns } }
}
