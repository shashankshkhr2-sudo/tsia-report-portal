
'use client'

import { useState } from 'react'

type DobInputProps = {
  value: string
  onChange: (value: string) => void
}

function toDisplay(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return ''

  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function toISO(text: string): string | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(text)) return null

  const [day, month, year] = text.split('/').map(Number)
  if (year < 1 || year > 9999) return null

  const date = new Date(0)
  date.setFullYear(year, month - 1, day)
  date.setHours(12, 0, 0, 0)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date > new Date()
  ) {
    return null
  }

  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-')
}

export function DobInput({ value, onChange }: DobInputProps) {
  const [draft, setDraft] = useState<string | null>(null)

  const display = draft ?? toDisplay(value)
  const valid = draft === null || draft === '' || toISO(draft) !== null

  function handleTextChange(text: string) {
    const cleaned = text.replace(/[^\d/]/g, '').slice(0, 10)
    setDraft(cleaned)

    if (cleaned === '') {
      onChange('')
      return
    }

    const iso = toISO(cleaned)
    onChange(iso ?? '')
  }

  return (
    <div className="mt-2 flex w-full items-center gap-2">
      <input
        type="text"
        inputMode="numeric"
        placeholder="DD/MM/YYYY"
        aria-label="Date of birth in day month year format"
        aria-invalid={!valid}
        value={display}
        onChange={(event) => handleTextChange(event.target.value)}
        onBlur={() => {
          if (draft && toISO(draft)) setDraft(null)
        }}
        maxLength={10}
        className="h-12 min-w-0 flex-1 rounded-xl border border-[#e5d9d2] bg-white px-3 text-sm text-[#3c3030] outline-none focus:border-[#8b3045]"
      />

      <label className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e5d9d2] bg-white">
        <span aria-hidden="true">📅</span>
        <input
          type="date"
          aria-label="Choose date of birth from calendar"
          value={value}
          max={new Date().toLocaleDateString('en-CA')}
          onChange={(event) => {
            onChange(event.target.value)
            setDraft(null)
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  )
}
