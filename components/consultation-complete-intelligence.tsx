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
  FunctionalQualityId,
  ResolvedConclusion,
} from '@/lib/numerology-intelligence/types'

import type {
  CrossQualityResolution,
  QualitySupportState,
} from '@/lib/numerology-intelligence/crossqualityresolver'

type Props = {
  conclusions:
    readonly ResolvedConclusion[]

  developmentAssessments:
    readonly DevelopmentAssessment[]

  crossQualityResolutions:
    readonly CrossQualityResolution[]
}

const qualityLabels:
  Record<FunctionalQualityId, string> = {
    INDIVIDUAL_AGENCY:
      'Independent Thinking & Self-Direction',

    RELATIONAL_RECEPTIVITY:
      'Understanding Others & Emotional Sensitivity',

    KNOWLEDGE_EXPRESSION:
      'Learning & Expressing Ideas',

    ADAPTIVE_RESTRUCTURING:
      'Handling Change & Finding Different Solutions',

    ADAPTIVE_INTELLIGENCE:
      'Communication & Adaptability',

    HARMONIOUS_CONNECTION:
      'Care, Relationships & Responsibility',

    REFLECTIVE_DISCERNMENT:
      'Thinking Deeply Before Deciding',

    STRUCTURED_RESPONSIBILITY:
      'Responsibility & Persistence',

    DIRECTED_FORCE:
      'Courage & Taking Action',
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
          setOpen(
            (current) => !current
          )
        }
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Deeper Client Understanding
          </p>

          <h3 className="mt-1 font-serif text-lg font-semibold text-[#24354c]">
            Complete Client Understanding
          </h3>

          <p className="mt-1 text-sm leading-6 text-[#776d61]">
            See the client&apos;s main
            strengths, areas that may need
            development, and how different
            qualities may work together.
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
            title="Core Personality & Behaviour"
            subtitle="The main qualities that appear in this client's numerology."
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
            title="Areas to Develop"
            subtitle="Qualities that may need more attention, practice or balance."
          />

          {development.length > 0 ? (
            <div className="space-y-3">
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
              text="No specific development area is highlighted at present."
            />
          )}

          <SectionDivider />

          <SectionHeading
            title="How Different Qualities Work Together"
            subtitle="This helps the employee understand how two important qualities may combine in the client."
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
              text="No clear combined pattern is highlighted at present."
            />
          )}

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
  const title =
    conclusion.functionalQualityId
      ? qualityLabels[
          conclusion
            .functionalQualityId
        ]
      : conclusion.title

  return (
    <div className="rounded-xl bg-[#f8f4ed] p-4">

      <p className="font-serif text-lg font-semibold leading-6 text-[#24354c]">
        {title}
      </p>

      <p className="mt-3 text-[15px] leading-6 text-[#776d61]">
        {conclusion.statement}
      </p>

      <div className="mt-3">
        <SimpleLabel
          text={strengthLabel(
            conclusion.strength
          )}
        />
      </div>

      {conclusion
        .developmentSignificance !==
        'NONE' && (
        <div className="mt-3 rounded-lg bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Development
          </p>

          <p className="mt-1 text-sm leading-5 text-[#776d61]">
            {developmentLabel(
              conclusion
                .developmentSignificance
            )}
          </p>
        </div>
      )}

      {conclusion
        .relevantStructureIds
        .length > 0 && (
        <div className="mt-3 border-t border-[#e7dccd] pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Supporting Numerology Pattern
          </p>

          <p className="mt-1 text-sm leading-6 text-[#776d61]">
            This understanding is also
            connected with the client&apos;s
            Lo Shu structural pattern.
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
  const title =
    qualityLabels[
      assessment.functionalQualityId
    ]

  return (
    <div className="rounded-xl border border-[#eadfce] p-4">

      <p className="font-serif text-lg font-semibold leading-6 text-[#24354c]">
        {title}
      </p>

      <p className="mt-2 text-sm font-medium text-[#ad7b40]">
        {developmentLabel(
          assessment.significance
        )}
      </p>

      {conclusion?.statement && (
        <p className="mt-3 text-[15px] leading-6 text-[#776d61]">
          {conclusion.statement}
        </p>
      )}

      {assessment
        .neededNumberAssessmentEligible && (
        <div className="mt-3 rounded-lg bg-[#fbf6ec] p-3">

          <p className="text-sm font-semibold text-[#24354c]">
            Look at this area more closely
          </p>

          <p className="mt-1 text-sm leading-6 text-[#776d61]">
            This area may justify a
            separate deeper assessment.
            It does not automatically
            mean that a remedy or Needed
            Number is required.
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
  const qualityA =
    qualityLabels[
      resolution.qualityA
    ]

  const qualityB =
    qualityLabels[
      resolution.qualityB
    ]

  return (
    <div className="rounded-xl bg-[#f8f4ed] p-4">

      <SimpleLabel
        text={relationshipLabel(
          resolution.relationship
        )}
      />

      <p className="mt-3 font-serif text-lg font-semibold leading-6 text-[#24354c]">
        {qualityA}
        {' + '}
        {qualityB}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">

        <QualityState
          title={qualityA}
          state={
            resolution.qualityAState
          }
        />

        <QualityState
          title={qualityB}
          state={
            resolution.qualityBState
          }
        />

      </div>

      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
          What This Means
        </p>

        <p className="mt-2 text-[15px] font-medium leading-7 text-[#24354c]">
          {resolution.statement}
        </p>
      </div>

      {resolution.relationship ===
        'CONTEXTUALIZE' && (
        <div className="mt-4 rounded-lg bg-white p-3">

          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Employee Note
          </p>

          <p className="mt-2 text-sm leading-6 text-[#776d61]">
            One quality appears easier
            for the client than the
            other. Understand how this
            difference appears in the
            client&apos;s real life before
            drawing a stronger conclusion.
          </p>

        </div>
      )}

      {resolution.relationship ===
        'COMPLEMENT' && (
        <div className="mt-4 rounded-lg bg-white p-3">

          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Employee Note
          </p>

          <p className="mt-2 text-sm leading-6 text-[#776d61]">
            These two qualities appear
            capable of working well
            together. Ask the client for
            a real example of how this
            combination appears in daily
            life.
          </p>

        </div>
      )}

      {resolution.relationship ===
        'TENSION' && (
        <div className="mt-4 rounded-lg bg-white p-3">

          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Employee Note
          </p>

          <p className="mt-2 text-sm leading-6 text-[#776d61]">
            These qualities may sometimes
            pull the client in different
            directions. Explore when and
            how this happens rather than
            assuming it is always a
            problem.
          </p>

        </div>
      )}

      {resolution
        .relevantStructureIds
        .length > 0 && (
        <div className="mt-3 border-t border-[#e7dccd] pt-3">

          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
            Supporting Numerology Pattern
          </p>

          <p className="mt-1 text-sm leading-6 text-[#776d61]">
            This combination is also
            connected with the
            client&apos;s Lo Shu
            structural pattern.
          </p>

        </div>
      )}
    </div>
  )
}

function QualityState({
  title,
  state,
}: {
  title: string
  state: QualitySupportState
}) {
  return (
    <div className="rounded-lg border border-[#e7dccd] bg-white p-3">

      <p className="text-xs font-semibold leading-5 text-[#24354c]">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-[#776d61]">
        {qualityStateLabel(state)}
      </p>

    </div>
  )
}

function strengthLabel(
  strength:
    ResolvedConclusion['strength']
) {
  switch (strength) {
    case 'PRIMARY_FINDING':
      return 'Key Pattern'

    case 'STRONGLY_SUPPORTED':
      return 'Clear Strength'

    case 'SUPPORTED':
      return 'Strength'

    case 'CONTEXT_DEPENDENT':
      return 'Depends on the Situation'

    case 'INSUFFICIENT_EVIDENCE':
      return 'Not Enough Information Yet'
  }
}

function developmentLabel(
  significance:
    DevelopmentAssessment['significance']
) {
  switch (significance) {
    case 'NONE':
      return 'No specific development concern'

    case 'STANDARD':
      return 'Development Area'

    case 'ELEVATED':
      return 'Important Development Area'

    case 'HIGH':
      return 'Needs Closer Attention'
  }
}

function relationshipLabel(
  relationship:
    CrossQualityResolution['relationship']
) {
  switch (relationship) {
    case 'COMPLEMENT':
      return 'Works Well Together'

    case 'MODERATE':
      return 'Balances Each Other'

    case 'COMPENSATE':
      return 'One May Support the Other'

    case 'TENSION':
      return 'Possible Inner Conflict'

    case 'CONTEXTUALIZE':
      return 'Needs Balance'

    case 'COEXIST':
      return 'Both Are Present'

    case 'INSUFFICIENT':
      return 'Not Enough Information Yet'
  }
}

function qualityStateLabel(
  state: QualitySupportState
) {
  switch (state) {
    case 'SUPPORTED':
      return 'Appears Strong'

    case 'UNDER_SUPPORTED':
      return 'May Need Development'

    case 'MIXED':
      return 'May Vary by Situation'

    case 'NO_EVIDENCE':
      return 'Not Enough Information Yet'
  }
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-4">

      <h4 className="font-serif text-xl font-semibold text-[#24354c]">
        {title}
      </h4>

      <p className="mt-1 text-sm leading-6 text-[#776d61]">
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

function SimpleLabel({
  text,
}: {
  text: string
}) {
  return (
    <span className="inline-flex rounded-full border border-[#e3d8c9] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#8b7658]">
      {text}
    </span>
  )
}

function EmptyState({
  text =
    'No clear client pattern is available in this section yet.',
}: {
  text?: string
}) {
  return (
    <div className="rounded-xl bg-[#f8f4ed] p-4">

      <p className="text-sm leading-6 text-[#776d61]">
        {text}
      </p>

    </div>
  )
}