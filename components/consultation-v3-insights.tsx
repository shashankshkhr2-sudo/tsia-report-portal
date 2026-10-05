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

type Props = {
  insights:
    readonly EmployeeInsight[]

  interpretations?:
    readonly EmployeeInterpretation[]
}

export function ConsultationV3Insights({
  insights,
  interpretations = [],
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
        <p className="text-xs leading-5 text-[#776d61]">
          No V3 employee insights are
          currently available.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {insights
        .slice(0, 5)
        .map((insight, index) => {
          const interpretation =
            interpretations.find(
              (item) =>
                item.sourceInsightId ===
                insight.id
            )

          const isOpen =
            openInsightId ===
            insight.id

          return (
            <div
              key={insight.id}
              className="rounded-xl bg-[#f8f4ed] p-3"
            >
              <div className="flex gap-3">
                <span className="font-semibold text-[#ad7b40]">
                  {index + 1}.
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#24354c]">
                    {insight.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#776d61]">
                    {insight.statement}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {insight.strength && (
                      <InsightTag
                        text={
                          insight.strength
                        }
                      />
                    )}

                    {insight.relationship && (
                      <InsightTag
                        text={
                          insight.relationship
                        }
                      />
                    )}

                    {insight
                      .developmentSignificance &&
                      insight
                        .developmentSignificance !==
                        'NONE' && (
                        <InsightTag
                          text={
                            `Development: ${insight.developmentSignificance}`
                          }
                        />
                      )}
                  </div>

                  {interpretation && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenInsightId(
                            isOpen
                              ? null
                              : insight.id
                          )
                        }
                        className="mt-3 flex w-full items-center justify-between border-t border-[#e7dccd] pt-3 text-left"
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9a7b4f]">
                          Consultation Guidance
                        </span>

                        {isOpen ? (
                          <ChevronUp className="size-4 text-[#9a7b4f]" />
                        ) : (
                          <ChevronDown className="size-4 text-[#9a7b4f]" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="mt-3 space-y-4 rounded-xl border border-[#eadfce] bg-white p-4">
                          <GuidanceBlock
                            label="Practitioner Meaning"
                            text={
                              interpretation
                                .practitionerMeaning
                            }
                          />

                          <GuidanceBlock
                            label="Evidence"
                            text={
                              interpretation
                                .evidenceSummary
                            }
                          />

                          <GuidanceBlock
                            label="Explore With Client"
                            text={
                              interpretation
                                .explorationFocus
                            }
                          />

                          <div className="rounded-lg bg-[#fbf6ec] p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                              Suggested Question
                            </p>

                            <p className="mt-2 text-[16px] font-medium leading-6 text-[#24354c]">
                              {
                                interpretation
                                  .validationQuestion
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

function GuidanceBlock({
  label,
  text,
}: {
  label: string
  text: string
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
        {label}
      </p>

      <p className="mt-2 text-[16px] leading-6 text-[#776d61]">
        {text}
      </p>
    </div>
  )
}

function InsightTag({
  text,
}: {
  text: string
}) {
  return (
    <span className="rounded-full border border-[#e3d8c9] bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#8b7658]">
      {text.replaceAll('_', ' ')}
    </span>
  )
}