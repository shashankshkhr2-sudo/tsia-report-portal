import type { NumerologyCalculationResult } from "@/lib/numerology/types"
import { runNumerologyV3FromCalculation } from "@/lib/numerology-intelligence/engine"
import type { NumerologyV3Result } from "@/lib/numerology-intelligence/engine"
import { PROFESSION_AREAS, PROFESSION_CATALOGUE_VERSION } from "./profession-catalogue"

export const PROFESSION_READING_VERSION = "JS_PROFESSION_READING_DRAFT_1" as const

const CORE_SOURCES = [
  { layer: "MULANK", label: "Birth number" },
  { layer: "BHAGYANK", label: "Life-path number" },
  { layer: "NAME_NUMBER", label: "Chaldean name number" }
] as const

// Select general qualities from positive core evidence.
// Catalogue connections are separate editorial examples, not V3 career conclusions.
// Source order is presentation order, not a profession suitability ranking.
export function selectProfessionExploration(result: NumerologyV3Result) {
  const findings = PROFESSION_AREAS.flatMap(area => {
    const conclusion = result.conclusions.conclusions.find(
      item => item.functionalQualityId === area.quality
    )
    if (!conclusion || conclusion.strength === "INSUFFICIENT_EVIDENCE") return []

    const support = result.evidence.filter(item =>
      item.functionalQualityId === area.quality &&
      item.direction === "SUPPORTS" &&
      conclusion.supportingEvidenceIds.includes(item.id)
    )
    const sources = CORE_SOURCES.filter(source =>
      support.some(item => item.layer === source.layer)
    )
    if (!sources.length) return []

    const hasMixedContext =
      conclusion.strength === "CONTEXT_DEPENDENT" ||
      conclusion.moderatingEvidenceIds.length > 0 ||
      conclusion.tensionEvidenceIds.length > 0 ||
      result.evidence.some(item =>
        item.functionalQualityId === area.quality &&
        item.direction === "UNDER_SUPPORTS"
      )

    return [{
      id: area.id,
      qualityTitle: area.qualityTitle,
      qualityDescription: area.qualityDescription,
      sources: sources.map(source => source.label),
      evidenceIds: support
        .filter(item => CORE_SOURCES.some(source => source.layer === item.layer))
        .map(item => item.id),
      contextNote: hasMixedContext
        ? "Other parts of your reading add development or balancing themes. Treat this as a quality to explore, rather than an ability already established."
        : null,
      professionArea: {
        title: area.title,
        examples: area.examples,
        connection: area.connection,
        practicalRequirement: area.practicalRequirement
      },
      sourceOrder: CORE_SOURCES.findIndex(source => source.layer === sources[0].layer)
    }]
  })

  return findings.sort((a, b) => a.sourceOrder - b.sourceOrder || a.id.localeCompare(b.id))
    .map(({ sourceOrder, ...finding }) => finding)
}

// Only name-and-DOB calculations enter this function.
// Occupation, goals and problems are deliberately not accepted.
export function buildProfessionReading(calculation: NumerologyCalculationResult) {
  const result = runNumerologyV3FromCalculation(calculation)
  const findings = selectProfessionExploration(result)
  return {
    version: PROFESSION_READING_VERSION,
    catalogueVersion: PROFESSION_CATALOGUE_VERSION,
    calculationVersion: calculation.calculationVersion,
    basis: "Name and date of birth",
    introduction: "Your numerology reading highlights these qualities and related work areas to explore.",
    findings,
    emptyMessage: findings.length
      ? null
      : "We could not prepare a clear set of profession suggestions from this reading.",
    note: "These are numerology-based interpretations, not an assessment of your skills or qualifications. Your interests and experience also matter.",
    nextQuestion: "We have not asked about your current profession yet. What do you do?"
  }
}
