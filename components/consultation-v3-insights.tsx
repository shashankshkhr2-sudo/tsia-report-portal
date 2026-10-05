'use client'

import {
  useState,
} from 'react'

import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

import type {
  EmployeeInterpretation,
} from '@/lib/numerology-intelligence/employeeinterpretation'

import type {
  FunctionalQualityId,
  IntelligenceEvidence,
} from '@/lib/numerology-intelligence/types'

import {
  FUNCTIONAL_QUALITIES,
} from '@/lib/numerology-intelligence/functionalqualities'

import {
  buildEmployeeExplanation,
} from '@/lib/numerology-intelligence/employeeexplanation'

type Props = {
  insights:
    readonly EmployeeInsight[]

  interpretations?:
    readonly EmployeeInterpretation[]

  evidence?:
    readonly IntelligenceEvidence[]
}

export function ConsultationV3Insights({
  insights,
  interpretations = [],
  evidence = [],
}: Props) {
  const [
    openInsightId,
    setOpenInsightId,
  ] = useState<string | null>(
    null
  )

  if (insights.length === 0) {
    return (
      <div className="rounded-xl bg-[#f8f4ed] p-4">
        <p className="text-sm leading-6 text-[#776d61]">
          No client understanding is
          currently available.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {insights
        .slice(0, 5)
        .map((insight, index) => {
          const insightEvidence =
            evidence.filter(
              (item) =>
                insight.evidenceIds.includes(
                  item.id
                )
            )

          const explanation =
            buildEmployeeExplanation(
              insight,
              evidence
            )

          const isOpen =
            openInsightId ===
            insight.id

          return (
            <div
              key={insight.id}
              className="rounded-2xl border border-[#eadfce] bg-[#f8f4ed] p-4"
            >
              <div className="flex gap-3">

                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ad7b40] text-xs font-semibold text-white">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9a7b4f]">
                    What the Numbers Show
                  </p>

                  <p className="mt-2 text-base font-semibold leading-6 text-[#24354c]">
                    {insight.statement}
                  </p>

                  <div className="mt-4 border-t border-[#e7dccd] pt-4">

                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9a7b4f]">
                      Why We Say This
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#655d54]">
                      {
                        explanation
                          .whyWeSayThis
                      }
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenInsightId(
                        isOpen
                          ? null
                          : insight.id
                      )
                    }
                    className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#dfd2bf] bg-white px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#24354c]">
                        Numerology Behind This
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-[#8a8177]">
                        See the numbers,
                        Grahas and actual
                        evidence behind this
                        finding
                      </p>
                    </div>

                    {isOpen ? (
                      <ChevronUp className="size-4 shrink-0 text-[#ad7b40]" />
                    ) : (
                      <ChevronDown className="size-4 shrink-0 text-[#ad7b40]" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mt-3 space-y-4 rounded-xl border border-[#eadfce] bg-white p-4">

                      <FunctionalQualityDetails
                        qualityIds={
                          insight
                            .functionalQualityIds
                        }
                      />

                      {insightEvidence.length >
                      0 ? (
                        <div className="space-y-3">
                          {insightEvidence.map(
                            (item) => (
                              <EvidenceBlock
                                key={
                                  item.id
                                }
                                evidence={
                                  item
                                }
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <div className="rounded-lg bg-[#fbf7f1] p-3">
                          <p className="text-sm leading-5 text-[#776d61]">
                            The detailed V3
                            evidence for this
                            finding is not
                            available in the
                            current view.
                          </p>
                        </div>
                      )}

                      {insight
                        .relevantStructureIds
                        .length > 0 && (
                        <div className="border-t border-[#eee5d8] pt-3">

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                            Relevant Structure
                          </p>

                          <p className="mt-2 text-sm leading-5 text-[#776d61]">
                            {insight
                              .relevantStructureIds
                              .map(
                                cleanStructureId
                              )
                              .join(', ')}
                          </p>

                        </div>
                      )}

                    </div>
                  )}

                  <div className="mt-4 rounded-xl bg-white/70 p-4">

                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9a7b4f]">
                      Understand From Client
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#655d54]">
                      {
                        explanation
                          .understandFromClient
                      }
                    </p>

                  </div>

                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

function FunctionalQualityDetails({
  qualityIds,
}: {
  qualityIds:
    readonly FunctionalQualityId[]
}) {
  if (qualityIds.length === 0) {
    return null
  }

  return (
    <div>

      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
        Number & Graha
      </p>

      <div className="mt-2 space-y-2">

        {qualityIds.map(
          (qualityId) => {
            const quality =
              findFunctionalQuality(
                qualityId
              )

            if (!quality) {
              return null
            }

            return (
              <div
                key={qualityId}
                className="rounded-lg bg-[#fbf6ec] p-3"
              >
                <p className="text-sm font-semibold text-[#24354c]">
                  {quality.number}
                  {' · '}
                  {quality.graha}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#776d61]">
                  {
                    getSimpleQualityName(
                      qualityId
                    )
                  }
                </p>
              </div>
            )
          }
        )}

      </div>
    </div>
  )
}

function EvidenceBlock({
  evidence,
}: {
  evidence:
    IntelligenceEvidence
}) {
  return (
    <div className="border-t border-[#eee5d8] pt-3">

      <div className="flex flex-wrap items-center gap-2">

        <span className="rounded-full bg-[#fbf6ec] px-2 py-1 text-[10px] font-semibold text-[#9a7b4f]">
          {
            getEvidenceLayerLabel(
              evidence.layer
            )
          }
        </span>

        {evidence.number !==
          undefined && (
          <span className="text-xs font-semibold text-[#24354c]">
            Number{' '}
            {evidence.number}
          </span>
        )}

      </div>

      <p className="mt-2 text-sm leading-6 text-[#655d54]">
        {evidence.statement}
      </p>

      {hasSourceValue(
        evidence
      ) && (
        <p className="mt-2 text-xs leading-5 text-[#8a8177]">
          Source:{' '}
          {String(
            evidence.sourceValue
          )}
        </p>
      )}

    </div>
  )
}

function findFunctionalQuality(
  id: FunctionalQualityId
) {
  return Object.values(
    FUNCTIONAL_QUALITIES
  ).find(
    (quality) =>
      quality.id === id
  )
}

function getSimpleQualityName(
  id: FunctionalQualityId
): string {
  switch (id) {
    case 'INDIVIDUAL_AGENCY':
      return 'Self-Direction'

    case 'RELATIONAL_RECEPTIVITY':
      return 'Understanding Others & Emotional Sensitivity'

    case 'KNOWLEDGE_EXPRESSION':
      return 'Learning & Expressing Ideas'

    case 'ADAPTIVE_RESTRUCTURING':
      return 'Handling Change & Different Approaches'

    case 'ADAPTIVE_INTELLIGENCE':
      return 'Communication & Adaptability'

    case 'HARMONIOUS_CONNECTION':
      return 'Care, Harmony & Connection'

    case 'REFLECTIVE_DISCERNMENT':
      return 'Thinking Deeply Before Deciding'

    case 'STRUCTURED_RESPONSIBILITY':
      return 'Responsibility & Persistence'

    case 'DIRECTED_FORCE':
      return 'Courage & Taking Action'
  }
}

function getEvidenceLayerLabel(
  layer:
    IntelligenceEvidence['layer']
): string {
  switch (layer) {
    case 'MULANK':
      return 'Mulank'

    case 'BHAGYANK':
      return 'Bhagyank'

    case 'NAME_NUMBER':
      return 'Name Number'

    case 'RAW_LO_SHU':
      return 'Birth Numbers in Lo Shu'

    case 'DERIVED_LO_SHU':
      return 'Personal Lo Shu'

    case 'REPETITION':
      return 'Repeated Number'

    case 'MISSING_NUMBER':
      return 'Missing Number'

    case 'ROW':
      return 'Lo Shu Row'

    case 'COLUMN':
      return 'Lo Shu Column'

    case 'RAJYOG':
      return 'Rajyog'

    case 'COMPOUND_BIRTH_CONTEXT':
      return 'Birth Date Compound'
  }
}

function hasSourceValue(
  evidence:
    IntelligenceEvidence
): boolean {
  return (
    evidence.sourceValue !==
      undefined &&
    evidence.sourceValue !==
      null &&
    String(
      evidence.sourceValue
    ).trim() !== ''
  )
}

function cleanStructureId(
  value: string
): string {
  return value
    .replaceAll('_', ' ')
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}