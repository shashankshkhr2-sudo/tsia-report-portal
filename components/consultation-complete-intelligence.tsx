'use client'

import {
  useState,
} from 'react'

import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import type {
  DevelopmentAssessment,
  ResolvedConclusion,
} from '@/lib/numerology-intelligence/types'

import type {
  CrossQualityResolution,
} from '@/lib/numerology-intelligence/crossqualityresolver'

type Props = {
  conclusions:
    readonly ResolvedConclusion[]

  developmentAssessments:
    readonly DevelopmentAssessment[]

  crossQualityResolutions:
    readonly CrossQualityResolution[]
}

export function ConsultationCompleteIntelligence({
  conclusions,
  developmentAssessments,
  crossQualityResolutions,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false)

  const usableConclusions =
    conclusions.filter(
      (item) =>
        item.strength !==
        'INSUFFICIENT_EVIDENCE'
    )

  const development =
    developmentAssessments.filter(
      (item) =>
        item.significance !== 'NONE'
    )

  const combined =
    crossQualityResolutions.filter(
      (item) =>
        item.status === 'RESOLVED'
    )

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#e7dccd] bg-white">

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Deeper Analysis
          </p>

          <h3 className="mt-1 font-serif text-lg font-semibold text-[#24354c]">
            Complete Numerology Intelligence
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#776d61]">
            Explore the complete verified
            V3 intelligence available for
            this client.
          </p>
        </div>

        {open ? (
          <ChevronUp className="ml-3 size-5 shrink-0 text-[#9a7b4f]" />
        ) : (
          <ChevronDown className="ml-3 size-5 shrink-0 text-[#9a7b4f]" />
        )}
      </button>

      {open && (
        <div className="border-t border-[#eadfce] p-4">

          <SectionHeading
            title="Core Functional Intelligence"
            subtitle="Resolved individual functional qualities"
          />

          {usableConclusions.length >
          0 ? (
            <div className="space-y-3">
              {usableConclusions.map(
                (conclusion) => (
                  <CoreConclusionCard
                    key={conclusion.id}
                    conclusion={
                      conclusion
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState />
          )}

          <SectionDivider />

          <SectionHeading
            title="Development Intelligence"
            subtitle="Areas where the evidence indicates development significance"
          />

          {development.length > 0 ? (
            <div className="space-y-2">
              {development.map(
                (item) => (
                  <DevelopmentCard
                    key={
                      item.functionalQualityId
                    }
                    assessment={item}
                    conclusion={
                      conclusions.find(
                        (conclusion) =>
                          conclusion
                            .functionalQualityId ===
                          item
                            .functionalQualityId
                      )
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState
              text="No development significance is currently identified."
            />
          )}

          <SectionDivider />

          <SectionHeading
            title="Combined Intelligence"
            subtitle="Approved resolved interactions between functional qualities"
          />

          {combined.length > 0 ? (
            <div className="space-y-3">
              {combined.map(
                (resolution) => (
                  <CombinedCard
                    key={resolution.id}
                    resolution={
                      resolution
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState
              text="No approved resolved cross-quality interactions are currently available."
            />
          )}

          <div className="mt-5 rounded-xl bg-[#fbf6ec] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
              Methodology Protection
            </p>

            <p className="mt-2 text-sm leading-6 text-[#776d61]">
              Development significance
              does not automatically
              determine a Needed Number,
              remedy or Y3. Client
              responses also remain
              separate from numerological
              evidence strength.
            </p>
          </div>

        </div>
      )}
    </div>
  )
}

function CoreConclusionCard({
  conclusion,
}: {
  conclusion: ResolvedConclusion
}) {
  return (
    <div className="rounded-xl bg-[#f8f4ed] p-4">

      <p className="font-serif text-base font-semibold text-[#24354c]">
        {conclusion.title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#776d61]">
        {conclusion.statement}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatusTag
          text={conclusion.strength}
        />

        <StatusTag
          text={conclusion.resolution}
        />

        {conclusion
          .developmentSignificance !==
          'NONE' && (
          <StatusTag
            text={
              `Development: ${conclusion.developmentSignificance}`
            }
          />
        )}
      </div>

      {conclusion
        .relevantStructureIds
        .length > 0 && (
        <div className="mt-3 border-t border-[#e7dccd] pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Structural Context
          </p>

          <p className="mt-1 text-sm leading-6 text-[#776d61]">
            {conclusion
              .relevantStructureIds
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}

function DevelopmentCard({
  assessment,
  conclusion,
}: {
  assessment: DevelopmentAssessment
  conclusion?: ResolvedConclusion
}) {
  return (
    <div className="rounded-xl border border-[#eadfce] p-4">

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[#24354c]">
            {conclusion?.title ||
              `Number ${assessment.number}`}
          </p>

          <p className="mt-1 text-xs text-[#776d61]">
            Number {assessment.number}
          </p>
        </div>

        <StatusTag
          text={assessment.significance}
        />
      </div>

      {conclusion?.statement && (
        <p className="mt-3 text-sm leading-6 text-[#776d61]">
          {conclusion.statement}
        </p>
      )}

      {assessment
        .neededNumberAssessmentEligible && (
        <div className="mt-3 rounded-lg bg-[#fbf6ec] p-3">
          <p className="text-xs font-semibold text-[#9a7b4f]">
            Separate Needed Number
            assessment may be eligible.
          </p>

          <p className="mt-1 text-xs leading-5 text-[#776d61]">
            Eligibility does not mean a
            Needed Number has been
            determined.
          </p>
        </div>
      )}
    </div>
  )
}

function CombinedCard({
  resolution,
}: {
  resolution: CrossQualityResolution
}) {
  return (
    <div className="rounded-xl bg-[#f8f4ed] p-4">

      <div className="flex flex-wrap gap-2">
        <StatusTag
          text={
            resolution.relationship
          }
        />

        <StatusTag
          text={
            resolution.qualityAState
          }
        />

        <StatusTag
          text={
            resolution.qualityBState
          }
        />
      </div>

      <p className="mt-3 text-sm font-medium leading-6 text-[#24354c]">
        {resolution.statement}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#776d61]">
        {resolution.rationale}
      </p>

      {resolution
        .relevantStructureIds
        .length > 0 && (
        <div className="mt-3 border-t border-[#e7dccd] pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Structural Context
          </p>

          <p className="mt-1 text-sm leading-6 text-[#776d61]">
            {resolution
              .relevantStructureIds
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-3">
      <h4 className="font-serif text-lg font-semibold text-[#24354c]">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-[#776d61]">
        {subtitle}
      </p>
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="my-6 border-t border-[#eadfce]" />
  )
}

function StatusTag({
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

function EmptyState({
  text = 'No verified intelligence is currently available in this section.',
}: {
  text?: string
}) {
  return (
    <div className="rounded-xl bg-[#f8f4ed] p-4">
      <p className="text-xs leading-5 text-[#776d61]">
        {text}
      </p>
    </div>
  )
}