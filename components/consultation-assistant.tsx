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

import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

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
  calculation:
    NumerologyCalculationResult

  employeeOutput: {
    version: string
    insights:
      readonly EmployeeInsight[]
    warnings:
      readonly string[]
  }
}

const labels:
  Record<string, string> = {
  numerology_report:
    'Numerology Report',

  future_numerology:
    'Future Numerology',

  career:
    'Career',

  business:
    'Business',

  money:
    'Money & Wealth',

  family:
    'Family',

  relationship:
    'Relationship',

  marriage:
    'Marriage',

  personal_direction:
    'Personal Direction',

  follow_up:
    'Follow-up',

  other:
    'Other',
}

const grid:
  NumerologyDigit[] = [
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

        employeeOutput:
          response.result.employeeOutput,
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
            <Title
              small="Numerology Snapshot"
              big="Client at a Glance"
            />

            {loading && (
              <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ed] p-4 text-xs text-[#776d61]">
                <Loader2 className="size-4 animate-spin" />
                Loading verified TSIA
                numerology...
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                {error}
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

                <div className="mt-4 rounded-xl bg-[#f8f4ed] p-4 text-xs leading-6 text-[#776d61]">
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
                  <p className="text-xs font-semibold text-[#24354c]">
                    Core Graha Influence
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[#776d61]">
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

            <Title
              small="Employee Brief"
              big="5 Important Client Insights"
            />

            {loading && (
              <div className="flex items-center gap-2 rounded-xl bg-[#f8f4ed] p-4 text-xs text-[#776d61]">
                <Loader2 className="size-4 animate-spin" />
                Loading TSIA V3
                intelligence...
              </div>
            )}

            {!loading &&
              data?.employeeOutput && (
                <ConsultationV3Insights
                  insights={
                    data.employeeOutput
                      .insights
                  }
                />
              )}

            {!loading &&
              !error &&
              data?.employeeOutput &&
              data.employeeOutput
                .insights.length === 0 && (
                <div className="rounded-xl bg-[#f8f4ed] p-4">
                  <p className="text-xs leading-5 text-[#776d61]">
                    No approved V3
                    employee insights are
                    available for this
                    client yet.
                  </p>
                </div>
              )}

            {note.trim() && (
              <div className="mt-5 rounded-xl bg-[#fbf6ec] p-4">
                <p className="text-[10px] font-semibold uppercase text-[#ad7b40]">
                  Today&apos;s Note
                </p>

                <p className="mt-2 text-xs">
                  {note}
                </p>
              </div>
            )}

            <Title
              small="Live Conversation"
              big="Talk With Client"
            />

            <div className="rounded-2xl border p-4">
              <p className="text-[10px] uppercase text-[#ad7b40]">
                Suggested Question
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-[#24354c]">
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
                        setChoice(
                          item
                        )
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
              <p className="text-[10px] uppercase text-[#ad7b40]">
                Client Says
              </p>

              <textarea
                value={answer}
                onChange