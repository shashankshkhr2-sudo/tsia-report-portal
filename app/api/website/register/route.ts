
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const allowedGenders = new Set([
  'male',
  'female',
  'other',
  'prefer_not_to_say',
])

function validDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  if (year < 1900 || year > new Date().getUTCFullYear()) {
    return null
  }

  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-')
}

export async function POST(request: NextRequest) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 10000) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      )
    }

    const body = await request.json()

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid registration details.' },
        { status: 400 }
      )
    }

    const birthName =
      typeof body.birthName === 'string'
        ? body.birthName.trim()
        : ''

    const currentName =
      typeof body.currentName === 'string'
        ? body.currentName.trim()
        : ''

    const mobile =
      typeof body.mobile === 'string'
        ? body.mobile.replace(/\s/g, '')
        : ''

    const email =
      typeof body.email === 'string'
        ? body.email.trim().toLowerCase()
        : ''

    const dob =
      typeof body.dob === 'string'
        ? validDate(body.dob)
        : null

    if (
      !birthName ||
      !currentName ||
      birthName.length > 150 ||
      currentName.length > 150 ||
      !dob ||
      !/^[6-9]\d{9}$/.test(mobile) ||
      body.consent !== true
    ) {
      return NextResponse.json(
        { error: 'Please check the required registration details.' },
        { status: 400 }
      )
    }

    if (
      email &&
      (email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (
      body.gender &&
      (typeof body.gender !== 'string' ||
        !allowedGenders.has(body.gender))
    ) {
      return NextResponse.json(
        { error: 'Invalid gender selection.' },
        { status: 400 }
      )
    }

    if (
      body.category !== 'free' &&
      body.category !== 'other'
    ) {
      return NextResponse.json(
        { error: 'Invalid service category.' },
        { status: 400 }
      )
    }

    if (
      body.category === 'other' &&
      (typeof body.selectedService !== 'string' ||
        !body.selectedService.trim())
    ) {
      return NextResponse.json(
        { error: 'Please select a service.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Registration saving is not configured yet.',
      },
      { status: 503 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Unable to process registration.' },
      { status: 400 }
    )
  }
}
