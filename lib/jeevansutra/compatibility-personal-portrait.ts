import "server-only"
import type { NumerologyCalculationResult } from "@/lib/numerology/types"
import type { CompatibilityPersonPortrait } from "./compatibility-personal-report-contract"
import { PERSONAL_NATURE_RULES } from "./compatibility-personal-nature-rules"
import { PERSONAL_SUPPORT_RULES } from "./compatibility-personal-support-rules"

// Return customer text and private rule references separately.
export function buildPersonalPortrait(person: NumerologyCalculationResult) {
  const primary = person.mulank.final
  const direction = person.bhagyank.final
  const expression = person.nameNumber.finalNumber
  const base = PERSONAL_NATURE_RULES[primary]
  const paragraphs: string[] = [base.nature]
  const references: { role: "mulank" | "bhagyank" | "name" | "integration"; number: NumerologyCalculationResult["mulank"]["final"]; rule: string }[] = [{ role: "mulank", number: primary, rule: base.id }]
  if (direction !== primary) {
    paragraphs.push(PERSONAL_SUPPORT_RULES[direction].direction)
    references.push({ role: "bhagyank", number: direction, rule: `direction-${direction}` })
  }
  if (expression !== primary && expression !== direction) {
    paragraphs.push(PERSONAL_SUPPORT_RULES[expression].expression)
    references.push({ role: "name", number: expression, rule: `expression-${expression}` })
  }
  const distinct = [...new Set([primary, direction, expression])]
  let possibleMisunderstanding: string = base.misunderstanding
  let contribution: string = base.contribution
  // Explicit interaction between everyday sensitivity and private expression.
  if (primary === 2 && expression === 7) {
    paragraphs.push("Wanting closeness and needing quiet time can coexist: you may care deeply about a response while taking time to explain why it matters.")
    possibleMisunderstanding = "You may want reassurance while keeping the concern private, leaving the other person unsure whether to approach you or give you space."
    contribution = "Explain whether you need reassurance or time to think, and agree when you will return to the conversation."
    references.push({ role: "integration", number: primary, rule: "mulank-2-name-7" })
  }
  // Explicit interaction between flexibility, self-direction and expression.
  if (primary === 5 && direction === 1 && expression === 3) {
    paragraphs.push("Enjoying a conversation does not necessarily mean wanting someone else to choose for you. You may welcome ideas while still wanting ownership of your decisions.")
    possibleMisunderstanding = "Your willingness to discuss options could be mistaken for agreement, especially if you later choose a different approach."
    contribution = "Make clear when you are exploring an idea and when you are agreeing to a commitment that affects both people."
    references.push({ role: "integration", number: primary, rule: "mulank-5-direction-1-name-3" })
  }
  const portrait: CompatibilityPersonPortrait = {
    name: person.input.fullName,
    introduction: paragraphs.join(" "),
    expectations: distinct.map(number => ({ ...PERSONAL_NATURE_RULES[number].expectation })),
    possibleMisunderstanding,
    contribution,
  }
  return { portrait, evidence: { references, expectationRules: distinct.map(number => ({ number, rule: `nature-${number}-expectation` })) } }
}
