
'use client'

type DobInputProps = {
  value: string
  onChange: (value: string) => void
}

export function DobInput({ value, onChange }: DobInputProps) {
  const displayValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(0, 4)}`
    : ''

  function handleChange(text: string) {
    if (text === '') {
      onChange('')
      return
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(text)) return

    const [day, month, year] = text.split('/').map(Number)
    const date = new Date(year, month - 1, day)

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date <= new Date()
    ) {
      onChange(
        `${year.toString().padStart(4, '0')}-${month
          .toString()
          .padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      )
    }
  }

  return (
    <input
      type="date"
      value={value}
      max={new Date().toISOString().slice(0, 10)}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Date of birth"
      className="mt-2 h-12 w-full rounded-xl border border-[#e5d9d2] bg-white px-4 text-sm"
    />
  )
}
