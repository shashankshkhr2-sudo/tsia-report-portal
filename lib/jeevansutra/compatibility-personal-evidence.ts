import "server-only"
import { calculateCompatibility } from "./compatibility-engine"
import type { NumerologyDigit } from "@/lib/numerology/types"

export const PERSONAL_INTERPRETATION_VERSION = "JS_PERSONAL_RULES_1_DRAFT" as const

export type PersonalCompatibilityInput = {
  self: { name: string; dob: string }
  other: { name: string; dob: string }
  kind: string
  relationship: string
}

// Private evidence only: never spread this object into a customer response.
// Interpretation remains separate from verified arithmetic.
export function buildPersonalCompatibilityEvidence(input: PersonalCompatibilityInput) {
  if (!input.kind.trim() || !input.relationship.trim()) {
    throw new Error("A category and relationship are required.")
  }
  const facts = calculateCompatibility(input)
  const snapshot = (person: typeof facts.a) => ({
    name: person.input.fullName,
    dob: person.input.dateOfBirth,
  })
  const source = {
    self: snapshot(facts.a),
    other: snapshot(facts.b),
    kind: input.kind.trim(),
    relationship: input.relationship.trim(),
  }
  const patterns = facts.lines.map(line => {
    const present = (counts: Record<NumerologyDigit, number>) =>
      line.digits.filter(number => counts[number] > 0)
    const firstPresent = present(facts.a.loShu.counts)
    const secondPresent = present(facts.b.loShu.counts)
    const jointPresent = present(facts.combined)
    const formation = !line.complete ? "incomplete"
      : line.inA && line.inB ? "both_individuals"
      : line.inA ? "first_individual"
      : line.inB ? "second_individual" : "newly_together"
    return {
      id: line.id,
      required: [...line.digits],
      firstPresent,
      secondPresent,
      jointPresent,
      missing: line.digits.filter(number => facts.combined[number] === 0),
      firstExclusive: firstPresent.filter(number => facts.b.loShu.counts[number] === 0),
      secondExclusive: secondPresent.filter(number => facts.a.loShu.counts[number] === 0),
      firstComplete: line.inA,
      secondComplete: line.inB,
      jointComplete: line.complete,
      formation,
    }
  })
  return {
    interpretationVersion: PERSONAL_INTERPRETATION_VERSION,
    calculationVersions: {
      first: facts.a.calculationVersion,
      second: facts.b.calculationVersion,
    },
    source,
    individuals: [facts.a, facts.b] as const,
    jointCounts: facts.combined,
    sharedNumbers: facts.shared,
    firstExclusiveNumbers: facts.onlyA,
    secondExclusiveNumbers: facts.onlyB,
    jointMissingNumbers: facts.missing,
    patterns,
  }
}

export type PersonalCompatibilityEvidence = ReturnType<typeof buildPersonalCompatibilityEvidence>
