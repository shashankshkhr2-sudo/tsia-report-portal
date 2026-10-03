'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Mic,
} from 'lucide-react'

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

const grid = [4, 9, 2, 3, 5, 7, 8, 1, 6]

export function ConsultationAssistant({
  client,
  mode,
  purpose,
  note,
  onBack,
}: Props) {
  const [choice, setChoice] = useState('')
  const [answer, setAnswer] = useState('')

  const modeLabel =
    mode === 'in_person' ? 'In-Person' : 'Phone'

  return (
    <div className="min-h-full bg-[#f7f3ed] p-4">
      <div className="mx-auto max-w-3xl">

        <button
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
              {client.clientNumber || 'TSIA Client'} · Consultation #1
            </p>

            <div className="mt-4 flex gap-2">
              <Tag text={modeLabel} />
              <Tag text={labels[purpose] || 'Consultation'} />
            </div>
          </header>

          <main className="p-5">

            <Title
              small="Numerology Snapshot"
              big="Client at a Glance"
            />

            <div className="grid grid-cols-3 gap-2">
              <NumberBox title="Mulank" />
              <NumberBox title="Bhagyank" />
              <NumberBox title="Name Number" />
            </div>

            <Title
              small="Lo Shu"
              big="Numerology Structure"
            />

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <p className="mb-2 text-xs font-semibold">
                  Standard
                </p>

                <div className="grid max-w-[230px] grid-cols-3">
                  {grid.map((n) => (
                    <div
                      key={n}
                      className="flex h-14 items-center justify-center border text-sm font-semibold text-[#24354c]"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold">
                  Personal
                </p>

                <div className="rounded-xl bg-[#f8f4ed] p-4 text-xs leading-6 text-[#776d61]">
                  <p>Personal Grid: —</p>
                  <p>Present: —</p>
                  <p>Missing: —</p>
                  <p>Repeated: —</p>
                </div>
              </div>

            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <MiniBox
                title="Golden Rajyog"
                text="4-5-6 · —"
              />

              <MiniBox
                title="Silver Rajyog"
                text="2-5-8 · —"
              />
            </div>

            <div className="mt-3 rounded-xl bg-[#f8f4ed] p-4">
              <p className="text-xs font-semibold text-[#24354c]">
                Key Graha Influence
              </p>

              <p className="mt-1 text-xs text-[#776d61]">
                Verified V2 analysis will load here.
              </p>
            </div>

            <Title
              small="Employee Brief"
              big="5 Important Client Insights"
            />

            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="flex gap-3 rounded-xl bg-[#f8f4ed] p-3"
                >
                  <span className="font-semibold text-[#ad7b40]">
                    {n}.
                  </span>

                  <p className="text-xs text-[#776d61]">
                    Verified TSIA insight will load here.
                  </p>
                </div>
              ))}
            </div>

            {note.trim() && (
              <div className="mt-5 rounded-xl bg-[#fbf6ec] p-4">
                <p className="text-[10px] font-semibold uppercase text-[#ad7b40]">
                  Today's Note
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
                Have you come across numerology before,
                or is this your first experience with it?
              </p>

              <div className="mt-4 grid gap-2">
                {[
                  'First time',
                  'Know a little',
                  'Consultation before',
                  'Know it quite well',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setChoice(item)}
                    className="flex justify-between rounded-xl border p-3 text-left text-sm"
                  >
                    {item}

                    {choice === item && (
                      <Check className="size-4 text-[#ad7b40]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border p-4">
              <p className="text-[10px] uppercase text-[#ad7b40]">
                Client Says
              </p>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={3}
                placeholder="Type the client's response..."
                className="mt-3 w-full rounded-xl border p-3 text-sm"
              />

              <p className="mt-2 flex items-center gap-2 text-xs text-[#9a7b4f]">
                <Mic className="size-4" />
                Voice input - future
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-[#24354c] p-4 text-white">
              <p className="text-[10px] uppercase text-[#d6b47b]">
                Employee Guidance
              </p>

              <p className="mt-2 text-xs leading-5">
                Listen first. Compare the client's
                response with verified numerology
                before explaining the analysis.
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-[#fbf6ec] p-4">
              <p className="text-[10px] uppercase text-[#ad7b40]">
                Talking Point
              </p>

              <p className="mt-2 text-xs leading-5">
                Use numerology as a framework for
                discussing patterns and tendencies,
                while validating them through the
                client's real experience.
              </p>

              <div className="mt-3 flex gap-2">
                <button className="rounded-lg bg-[#24354c] px-4 py-2 text-xs text-white">
                  Mark Used
                </button>

                <button className="rounded-lg border px-4 py-2 text-xs">
                  Skip
                </button>
              </div>
            </div>

            <button
              disabled={!choice}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[#24354c] text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue Consultation
              <ChevronRight className="ml-2 size-4" />
            </button>

          </main>
        </div>
      </div>
    </div>
  )
}

function Tag({ text }: { text: string }) {
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
}: {
  title: string
}) {
  return (
    <div className="rounded-xl bg-[#f8f4ed] p-3">
      <p className="text-[9px] uppercase text-[#8c8175]">
        {title}
      </p>

      <p className="mt-2 font-serif text-2xl text-[#24354c]">
        —
      </p>
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