import "server-only"
import type { NumerologyCalculationResult } from "@/lib/numerology/types"
import type { CompatibilityInteraction } from "./compatibility-personal-report-contract"
import { PERSONAL_PAIR_RULES, type PersonalPairRule } from "./compatibility-personal-pair-rules"

// Base interactions only. Relationship-specific context is applied separately.
export function buildPersonalInteractions(first: NumerologyCalculationResult, second: NumerologyCalculationResult) {
  const numberFor = (person: NumerologyCalculationResult, role: PersonalPairRule["role"]) =>
    role === "name" ? person.nameNumber.finalNumber : person[role].final
  const interactions: CompatibilityInteraction[] = []
  const references: { interactionId: string; ruleId: string; role: PersonalPairRule["role"]; firstNumber: number; secondNumber: number }[] = []
  const coveredRoles = new Set<PersonalPairRule["role"]>()
  const seen = new Set<string>()
  for (const rule of PERSONAL_PAIR_RULES) {
    const a = numberFor(first, rule.role)
    const b = numberFor(second, rule.role)
    const forward = a === rule.left && b === rule.right
    const reverse = a === rule.right && b === rule.left
    if (!forward && !reverse) continue
    if (seen.has(rule.id)) continue
    seen.add(rule.id)
    coveredRoles.add(rule.role)
    interactions.push({
      id: rule.id,
      area: rule.area,
      firstPerspective: forward ? rule.leftPerspective : rule.rightPerspective,
      secondPerspective: forward ? rule.rightPerspective : rule.leftPerspective,
      betweenYou: rule.betweenYou,
      firstAdjustment: forward ? rule.leftAdjustment : rule.rightAdjustment,
      secondAdjustment: forward ? rule.rightAdjustment : rule.leftAdjustment,
    })
    references.push({ interactionId: rule.id, ruleId: rule.ruleId, role: rule.role, firstNumber: a, secondNumber: b })
  }
  const roles: PersonalPairRule["role"][] = ["mulank", "bhagyank", "name"]
  return {
    interactions,
    evidence: {
      references,
      unsupportedRoles: roles.filter(role => !coveredRoles.has(role)),
    },
  }
}
