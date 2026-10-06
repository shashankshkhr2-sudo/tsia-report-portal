'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  CalendarDays,
} from 'lucide-react'

type Props = {
  value: string
  onChange: (
    value: string
  ) => void
  required?: boolean
  disabled?: boolean
}

function databaseToDisplay(
  value: string
) {
  if (!value) {
    return ''
  }

  const match =
    value.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    )

  if (!match) {
    return ''
  }

  const [, year, month, day] =
    match

  return `${day}/${month}/${year}`
}

function displayToDatabase(
  value: string
) {
  const match =
    value.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/
    )

  if (!match) {
    return null
  }

  const [, day, month, year] =
    match

  const dayNumber =
    Number(day)

  const monthNumber =
    Number(month)

  const yearNumber =
    Number(year)

  const date =
    new Date(
      yearNumber,
      monthNumber - 1,
      dayNumber
    )

  const valid =
    date.getFullYear() ===
      yearNumber &&
    date.getMonth() ===
      monthNumber - 1 &&
    date.getDate() ===
      dayNumber

  if (!valid) {
    return null
  }

  const today =
    new Date()

  today.setHours(
    23,
    59,
    59,
    999
  )

  if (date > today) {
    return null
  }

  return `${year}-${month}-${day}`
}

function formatTypedDate(
  input: string
) {
  const digits =
    input
      .replace(/\D/g, '')
      .slice(0, 8)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 4) {
    return `${digits.slice(
      0,
      2
    )}/${digits.slice(2)}`
  }

  return `${digits.slice(
    0,
    2
  )}/${digits.slice(
    2,
    4
  )}/${digits.slice(4)}`
}

function todayForInput() {
  const now =
    new Date()

  const year =
    now.getFullYear()

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, '0')

  const day =
    String(
      now.getDate()
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function DobInput({
  value,
  onChange,
  required = false,
  disabled = false,
}: Props) {
  const [
    displayValue,
    setDisplayValue,
  ] = useState(
    databaseToDisplay(value)
  )

  const [
    error,
    setError,
  ] = useState('')

  const calendarRef =
    useRef<HTMLInputElement>(
      null
    )

  useEffect(() => {
    setDisplayValue(
      databaseToDisplay(value)
    )
  }, [value])

  const validateAndSave = (
    display: string
  ) => {
    if (!display) {
      setError('')

      onChange('')
      return
    }

    if (
      display.length < 10
    ) {
      setError(
        'Enter date as DD/MM/YYYY.'
      )

      onChange('')
      return
    }

    const databaseValue =
      displayToDatabase(
        display
      )

    if (!databaseValue) {
      setError(
        'Please enter a valid date of birth.'
      )

      onChange('')
      return
    }

    setError('')

    onChange(
      databaseValue
    )
  }

  const handleTyping = (
    input: string
  ) => {
    const formatted =
      formatTypedDate(input)

    setDisplayValue(
      formatted
    )

    if (!formatted) {
      setError('')

      onChange('')
      return
    }

    if (
      formatted.length === 10
    ) {
      validateAndSave(
        formatted
      )
    } else {
      setError('')
      onChange('')
    }
  }

  const handleCalendar = (
    calendarValue: string
  ) => {
    if (!calendarValue) {
      return
    }

    const display =
      databaseToDisplay(
        calendarValue
      )

    setDisplayValue(
      display
    )

    setError('')

    onChange(
      calendarValue
    )
  }

  const openCalendar = () => {
    if (disabled) {
      return
    }

    const input =
      calendarRef.current

    if (!input) {
      return
    }

    if (
      typeof input.showPicker ===
      'function'
    ) {
      input.showPicker()
      return
    }

    input.click()
  }

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={(event) =>
            handleTyping(
              event.target.value
            )
          }
          onBlur={() =>
            validateAndSave(
              displayValue
            )
          }
          inputMode="numeric"
          autoComplete="bday"
          placeholder="DD/MM/YYYY"
          maxLength={10}
          required={required}
          disabled={disabled}
          aria-invalid={
            Boolean(error)
          }
          className={`h-11 w-full rounded-xl border bg-white px-3 pr-12 text-sm text-[#24354c] outline-none transition ${
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-[#ddd4c8] focus:border-[#ad7b40]'
          } ${
            disabled
              ? 'cursor-not-allowed opacity-60'
              : ''
          }`}
        />

        <button
          type="button"
          onClick={
            openCalendar
          }
          disabled={disabled}
          aria-label="Select date of birth"
          className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-lg text-[#ad7b40] transition hover:bg-[#f6ecdf] disabled:opacity-50"
        >
          <CalendarDays className="size-[18px]" />
        </button>

        <input
          ref={calendarRef}
          type="date"
          value={value}
          max={todayForInput()}
          onChange={(event) =>
            handleCalendar(
              event.target.value
            )
          }
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}