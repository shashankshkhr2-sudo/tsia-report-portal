'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Mic,
} from 'lucide-react'

import {
  generateNumerologyV2,
} from '@/app/actions/numerology'

import {
  ConsultationV3Insights,
} from '@/components/consultation-v3-insights'

import {
  ConsultationCompleteIntelligence,
} from '@/components/consultation-complete-intelligence'

import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  NumerologyV3Result,
} from '@/lib/numerology-intelligence/engine'

import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

import type {
  EmployeeInterpretation,
} from '@/lib/numerology-intelligence/employeeinterpretation'

import type {
  ConsultationClient,
  ConsultationMode,
  ConsultationPurpose,
} from '@/components/consultation-workspace'

type Props = {
  client: ConsultationClient
  mode: ConsultationMode
  purpose: ConsultationPurpose
  note: string
  onBack: () => void
}

type Result = {
  calculation: NumerologyCalculationResult

  intelligence: NumerologyV3Result

  employeeOutput: {
    version: string
    insights: readonly EmployeeInsight[]
    warnings: readonly string[]
  }

  employeeInterpretation: {
    version: string
    interpretations:
      readonly EmployeeInterpretation[]
    warnings: readonly string[]
  }
}

const labels: Record<string, string> = {
  numerology_report: 'Numerology Report',
  future_numerology: 'Future Numerology',
  career: 'Career',
  business: 'Business',
  money: 'Money & Wealth',
  family: 'Family',
  relationship: 'Relationship',
  marriage: 'Marriage',
  personal_direction: 'Personal Direction',
  follow_up: 'Follow-up',
  other: 'Other',
}

const grid: NumerologyDigit[] = [
  4, 9, 2,
  3, 5, 7,
  8, 1, 6,
]

export function ConsultationAssistant({
  client,
  mode,
  purpose,
  note,
  onBack,
}: Props) {
  const [choice, setChoice] =
    useState('')

  const [answer, setAnswer] =
    useState('')

  const [data, setData] =
    useState<Result | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')

      const response =
        await generateNumerologyV2(
          client.id
        )

      if (!active) {
        return
      }

      if (
        response.error ||
        !response.result
      ) {
        setError(
          response.error ||
            'Unable to load numerology.'
        )

        setLoading(false)
        return
      }

      setData({
        calculation:
          response.result.calculation,

        intelligence:
          response.result.intelligence,

        employeeOutput:
          response.result.employeeOutput,

        employeeInterpretation:
          response.result
            .employeeInterpretation,
      })

      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [client.id])

  const calculation =
    data?.calculation

  const modeLabel =
    mode === 'in_person'
      ? 'In-Person'
      : mode === 'phone'
        ? 'Phone'
        : 'Consultation'

  return (
    <div className="min-h-full bg-[#f7f3ed] p-4">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-xs text-[#9a7b4f]"
        >
          <ArrowLeft className="size-4" />
          Context Check
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

          <header className="bg-[#24354c] p-5 text-white">
            <p className="text-[10px] uppercase tracking-widest text-[#d6b47b]">
              TSIA Live Consultation
            </p>

            <h1 className="mt-2 font-serif text-2xl font-semibold">
              {client.name}
            </h1>

            <p className="mt-1 text-xs text-gray-300">
              {client.clientNumber ||
                'TSIA Client'}
              {' · '}
              Consultation #1
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tag text={modeLabel} />

              <Tag
                text={
                  labels[purpose] ||
                  'Consultation'
                }
              />
            </div>
          </header>

          <main className="p-5">

            {note.trim() && (
              <div className="rounded-xl bg-[#fbf6ec] p-4">
                <p className="text-[10px] font-semibold uppercase text-[#ad7b40]">
                  Today&apos;s Note
                </p>

                <p className="mt-2 text-sm leading-6 text-[#24354c]">
                  {note}
                </p>
              </div>
            )}

            <Title
              small="Live Conversation"
              big="Talk With Client"
            />

            <div className="rounded-2xl border p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                Opening Question
              </p>

              <p className="mt-2 text-base font-semibold leading-6 text-[#24354c]">
                Have you come across
                numerology before, or is
                this your first experience
                with it?
              </p>

              <div className="mt-4 grid gap-2">
                {[
                  'First time',
                  'Know a little',
                  'Consultation before',
                  'Know it quite well',
                ].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setChoice(item)
                      }
                      className="flex justify-between rounded-xl border p-3 text-left text-sm"
                    >
                      {item}

                      {choice ===
                        item && (
                        <Check className="size-4 text-[#ad7b40]" />
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ad7b40]">
                Client Says
              </p>

              <textarea
                value={answer}
                onChange={(event) =>
                  setAnswer(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Type the client's response..."
                className="mt-3 w-full rounded-xl border p-3 text-sm"
              />

              <p className="mt-2 flex items-center gap-2 text-xs text-[#9a7b4f]">
                <Mic className="size-4" />
                Voice input - future
              </p>
            </div>

            <button
              type="button"
              disabled={!choice}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[#24354c] text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue Consultation

              <ChevronRight className="ml-2 size-4" />
            </button>

            <Title
              small="Employee Brief"
              big="Key Client Insights"
            />

            {loading && (
              <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ed] p-4 text-xs text-[#776d61]">
                <Loader2 className="size-4 animate-spin" />
                Loading TSIA V3
                intelligence...
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                {error}
              </div>
            )}

            {!loading &&
              data?.employeeOutput &&
              data.employeeOutput.insights
                .length > 0 && (
                <ConsultationV3Insights
                  insights={
                    data.employeeOutput
                      .insights
                  }
                  interpretations={
                    data
                      .employeeInterpretation
                      .interpretations
                  }
                  evidence={
                    data.intelligence
                      .evidence
                  }
                />
              )}

            {!loading &&
              !error &&
              data?.employeeOutput &&
              data.employeeOutput.insights
                .length === 0 && (
                <div className="rounded-xl bg-[#f8f4ed] p-4">
                  <p className="text-xs leading-5 text-[#776d61]">
                    No approved V3
                    employee insights are
                    available for this
                    client yet.
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              data?.intelligence && (
                <>
                  <Title
                    small="Deep Analysis"
                    big="Complete Numerology Intelligence"
                  />

                  <ConsultationCompleteIntelligence
                    conclusions={
                      data.intelligence
                        .conclusions
                        .conclusions
                    }
                    developmentAssessments={
                      data.intelligence
                        .conclusions
                        .developmentAssessments
                    }
                    crossQualityResolutions={
                      data.intelligence
                        .crossQuality
                        .resolutions
                    }
                  />
                </>
              )}

            <Title
              small="Numerology Reference"
              big="Client at a Glance"
            />

            {loading && (
              <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ed] p-4 text-xs text-[#776d61]">
                <Loader2 className="size-4 animate-spin" />
                Loading verified TSIA
                numerology...
              </div>
            )}

            {calculation && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <NumberBox
                    title="Mulank"
                    value={formatCompound(
                      calculation.mulank
                        .compound,
                      calculation.mulank
                        .final
                    )}
                    graha={
                      calculation.grahas[
                        calculation.mulank
                          .final
                      ]
                    }
                  />

                  <NumberBox
                    title="Bhagyank"
                    value={formatCompound(
                      calculation.bhagyank
                        .compound,
                      calculation.bhagyank
                        .final
                    )}
                    graha={
                      calculation.grahas[
                        calculation.bhagyank
                          .final
                      ]
                    }
                  />

                  <NumberBox
                    title="Name Number"
                    value={formatCompound(
                      calculation.nameNumber
                        .compoundTotal,
                      calculation.nameNumber
                        .finalNumber
                    )}
                    graha={
                      calculation.grahas[
                        calculation.nameNumber
                          .finalNumber
                      ]
                    }
                  />
                </div>

                <Title
                  small="Lo Shu"
                  big="Numerology Structure"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold">
                      Standard Lo Shu
                    </p>

                    <div className="grid max-w-[230px] grid-cols-3">
                      {grid.map(
                        (number) => (
                          <GridCell
                            key={number}
                            text={String(
                              number
                            )}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold">
                      Personal Lo Shu
                    </p>

                    <div className="grid max-w-[230px] grid-cols-3">
                      {grid.map(
                        (number) => (
                          <GridCell
                            key={number}
                            text={repeatNumber(
                              number,
                              calculation
                                .loShu
                                .counts[
                                number
                              ]
                            )}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-[#f8f4ed] p-4 text-sm leading-6 text-[#776d61]">
                  <p>
                    <b>Present:</b>{' '}
                    {joinNumbers(
                      calculation.loShu
                        .presentNumbers
                    )}
                  </p>

                  <p>
                    <b>Missing:</b>{' '}
                    {joinNumbers(
                      calculation.loShu
                        .missingNumbers
                    )}
                  </p>

                  <p>
                    <b>Repeated:</b>{' '}
                    {formatRepeated(
                      calculation.loShu
                        .repeatedNumbers
                    )}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <MiniBox
                    title="Golden Rajyog"
                    text={`4-5-6 · ${statusLabel(
                      calculation.rajyog
                        .golden.status
                    )}`}
                  />

                  <MiniBox
                    title="Silver Rajyog"
                    text={`2-5-8 · ${statusLabel(
                      calculation.rajyog
                        .silver.status
                    )}`}
                  />
                </div>

                <div className="mt-3 rounded-xl border p-4">
                  <p className="text-sm font-semibold text-[#24354c]">
                    Core Graha Influence
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#776d61]">
                    Mulank:{' '}
                    <b>
                      {
                        calculation.grahas[
                          calculation.mulank
                            .final
                        ]
                      }
                    </b>

                    <br />

                    Bhagyank:{' '}
                    <b>
                      {
                        calculation.grahas[
                          calculation.bhagyank
                            .final
                        ]
                      }
                    </b>

                    <br />

                    Name Number:{' '}
                    <b>
                      {
                        calculation.grahas[
                          calculation.nameNumber
                            .finalNumber
                        ]
                      }
                    </b>
                  </p>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}

function formatCompound(
  compound: number,
  final: number
) {
  return compound === final
    ? String(final)
    : `${compound}/${final}`
}

function repeatNumber(
  number: number,
  count: number
) {
  if (!count) {
    return ''
  }

  return String(number).repeat(
    count
  )
}

function joinNumbers(
  numbers: NumerologyDigit[]
) {
  return numbers.length
    ? numbers.join(', ')
    : 'None'
}

function formatRepeated(
  repeated: Partial<
    Record<
      NumerologyDigit,
      number
    >
  >
) {
  const items =
    Object.entries(repeated)
      .filter(
        ([, count]) =>
          Number(count) > 1
      )
      .map(
        ([number, count]) =>
          `${number} × ${count}`
      )

  return items.length
    ? items.join(', ')
    : 'None'
}

function statusLabel(
  status: string
) {
  if (status === 'complete') {
    return 'Complete'
  }

  if (status === 'partial') {
    return 'Partial'
  }

  return 'Absent'
}

function Tag({
  text,
}: {
  text: string
}) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px]">
      {text}
    </span>
  )
}

function Title({
  small,
  big,
}: {
  small: string
  big: string
}) {
  return (
    <div className="mb-4 mt-7 border-t pt-5">
      <p className="text-[10px] uppercase text-[#ad7b40]">
        {small}
      </p>

      <h2 className="mt-1 font-serif text-xl font-semibold text-[#24354c]">
        {big}
      </h2>
    </div>
  )
}

function NumberBox({
  title,
  value,
  graha,
}: {
  title: string
  value: string
  graha: string
}) {
  return (
    <div className="rounded-xl bg-[#f8f4ed] p-3">
      <p className="text-[9px] uppercase text-[#8c8175]">
        {title}
      </p>

      <p className="mt-2 font-serif text-xl text-[#24354c]">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-[#ad7b40]">
        {graha}
      </p>
    </div>
  )
}

function GridCell({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex h-14 items-center justify-center border text-sm font-semibold text-[#24354c]">
      {text || ' '}
    </div>
  )
}

function MiniBox({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-[10px] font-semibold text-[#24354c]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#776d61]">
        {text}
      </p>
    </div>
  )
}