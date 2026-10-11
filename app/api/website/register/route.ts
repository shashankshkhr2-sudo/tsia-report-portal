
import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JS_ORGANIZATION_ID =
  'd7e678c2-2d43-4fd9-9ef4-48a791b6a5ba'

const MAX_BODY_BYTES = 10000

const allowedGenders = new Set([
  'male',
  'female',
  'other',
  'prefer_not_to_say',
])

const allowedCategories = new Set([
  'free',
  'other',
])

function reply(
  error: string,
  status: number,
  extraHeaders: Record<string, string> = {}
) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        ...extraHeaders,
      },
    }
  )
}

function stringValue(value: unknown): string {
  return typeof value === 'string'
    ? value.trim()
    : ''
}

function validDate(value: string): string | null {
  const match =
    /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)

  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  if (
    year < 1900 ||
    year > new Date().getUTCFullYear()
  ) {
    return null
  }

  const date = new Date(
    Date.UTC(year, month - 1, day)
  )

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

function safeEqual(
  supplied: string,
  expected: string
): boolean {
  const a = Buffer.from(supplied)
  const b = Buffer.from(expected)

  return (
    a.length === b.length &&
    timingSafeEqual(a, b)
  )
}

function hmac(
  secret: string,
  value: string
): string {
  return createHmac('sha256', secret)
    .update(value)
    .digest('hex')
}

async function callSupabase(
  supabaseUrl: string,
  supabaseSecret: string,
  functionName: string,
  payload: Record<string, unknown>
): Promise<{
  ok: boolean
  status: number
  data: unknown
}> {
  const url = new URL(
    `/rest/v1/rpc/${functionName}`,
    supabaseUrl
  )

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: supabaseSecret,
      Authorization: `Bearer ${supabaseSecret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  })

  const data: unknown = await response
    .json()
    .catch(() => null)

  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

async function checkRateLimit(
  supabaseUrl: string,
  supabaseSecret: string,
  hashSecret: string,
  request: NextRequest
): Promise<boolean> {
  /*
    Accept only a trusted Vercel-provided
    client address.

    If the header is unavailable, fail
    closed rather than bypassing limits.
  */

  const forwarded =
    request.headers.get('x-vercel-forwarded-for')

  const ip = forwarded
    ?.split(',')[0]
    ?.trim()

  if (!ip) {
    throw new Error(
      'Trusted client address unavailable'
    )
  }

  const requestKey = hmac(
    hashSecret,
    `js-registration:${ip}`
  )

  const result = await callSupabase(
    supabaseUrl,
    supabaseSecret,
    'check_js_registration_rate_limit',
    {
      p_request_key: requestKey,
      p_max_attempts: 5,
      p_window_minutes: 60,
    }
  )

  if (!result.ok) {
    throw new Error(
      'Registration rate-limit check failed'
    )
  }

  if (typeof result.data !== 'boolean') {
    throw new Error(
      'Unexpected rate-limit response'
    )
  }

  return result.data
}

function isDuplicateError(data: unknown): boolean {
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data)
  ) {
    return false
  }

  const error = data as Record<string, unknown>

  return error.code === '23505'
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL

    const supabaseSecret =
      process.env.SUPABASE_SECRET_KEY

    const registrationApiKey =
      process.env.JS_REGISTRATION_API_KEY

    const rateLimitHashSecret =
      process.env.JS_RATE_LIMIT_HASH_SECRET

    if (
      !supabaseUrl ||
      !supabaseSecret ||
      !registrationApiKey ||
      !rateLimitHashSecret ||
      rateLimitHashSecret.length < 32
    ) {
      console.error(
        'Jeevan Sutra registration configuration missing'
      )

      return reply(
        'Registration service is temporarily unavailable.',
        503
      )
    }

    /*
      PRIVATE TESTING GATE

      This API is not yet open to public
      browser submissions.

      Do not expose the testing secret
      in client-side JavaScript.
    */

    const suppliedKey =
      request.headers.get(
        'x-js-registration-key'
      ) || ''

    const expectedKey = hmac(
      registrationApiKey,
      'jeevansutra-registration'
    )

    if (
      !suppliedKey ||
      !safeEqual(suppliedKey, expectedKey)
    ) {
      return reply(
        'Registration is not yet open.',
        403
      )
    }

    /*
      REQUEST SIZE CHECK
    */

    const declaredSize = Number(
      request.headers.get(
        'content-length'
      ) || 0
    )

    if (declaredSize > MAX_BODY_BYTES) {
      return reply(
        'Request too large.',
        413
      )
    }

    const rawBody = await request.text()

    if (
      Buffer.byteLength(rawBody, 'utf8') >
      MAX_BODY_BYTES
    ) {
      return reply(
        'Request too large.',
        413
      )
    }

    let body: Record<string, unknown>

    try {
      const parsed: unknown =
        JSON.parse(rawBody)

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      ) {
        return reply(
          'Invalid registration details.',
          400
        )
      }

      body =
        parsed as Record<string, unknown>
    } catch {
      return reply(
        'Invalid registration request.',
        400
      )
    }

    /*
      NORMALIZE INPUTS
    */

    const birthName =
      stringValue(body.birthName)

    const currentName =
      stringValue(body.currentName)

    const mobile =
      stringValue(body.mobile)
        .replace(/\s/g, '')

    const email =
      stringValue(body.email)
        .toLowerCase()

    const gender =
      stringValue(body.gender)

    const whatsapp =
      stringValue(body.whatsapp)
        .replace(/\s/g, '')

    const category =
      stringValue(body.category)

    const selectedService =
      stringValue(body.selectedService)

    const dob =
      validDate(stringValue(body.dob))

    /*
      VALIDATION
    */

    if (
      !birthName ||
      !currentName ||
      birthName.length > 150 ||
      currentName.length > 150 ||
      !dob ||
      !/^[6-9]\d{9}$/.test(mobile) ||
      body.consent !== true
    ) {
      return reply(
        'Please check the required registration details.',
        400
      )
    }

    if (
      email &&
      (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      )
    ) {
      return reply(
        'Please enter a valid email address.',
        400
      )
    }

    if (
      gender &&
      !allowedGenders.has(gender)
    ) {
      return reply(
        'Invalid gender selection.',
        400
      )
    }

    if (
      !allowedCategories.has(category) ||
      selectedService.length > 150 ||
      (
        category === 'other' &&
        !selectedService
      )
    ) {
      return reply(
        'Please select a valid service.',
        400
      )
    }

    if (
      whatsapp &&
      !/^[6-9]\d{9}$/.test(whatsapp)
    ) {
      return reply(
        'Please enter a valid WhatsApp number.',
        400
      )
    }

    /*
      DATABASE-BACKED RATE LIMIT
    */

    const allowed = await checkRateLimit(
      supabaseUrl,
      supabaseSecret,
      rateLimitHashSecret,
      request
    )

    if (!allowed) {
      return reply(
        'Too many registration attempts. Please try again later.',
        429,
        {
          'Retry-After': '3600',
        }
      )
    }

    /*
      ATOMIC REGISTRATION SAVE

      The Supabase function inserts into:
      1. public.clients
      2. public.jeevansutra_registrations

      The database generates the JS client number.
    */

    const result = await callSupabase(
      supabaseUrl,
      supabaseSecret,
      'save_jeevansutra_registration',
      {
        p_birth_name: birthName,
        p_current_name: currentName,
        p_dob: dob,
        p_mobile: mobile,
        p_email: email || null,
        p_gender: gender || null,
        p_whatsapp: whatsapp || mobile,
        p_category: category,
        p_service:
          category === 'other'
            ? selectedService
            : null,
        p_consent: true,
      }
    )

    if (!result.ok) {
      if (isDuplicateError(result.data)) {
        return reply(
          'This registration could not be completed. Please contact support if you have already registered.',
          409
        )
      }

      console.error(
        'Jeevan Sutra database save failed',
        result.status
      )

      return reply(
        'Unable to save registration. Please try again later.',
        503
      )
    }

    /*
      VERIFY SAVED RESULT
    */

    if (
      !Array.isArray(result.data) ||
      result.data.length !== 1
    ) {
      console.error(
        'Unexpected registration response'
      )

      return reply(
        'Unable to confirm registration.',
        503
      )
    }

    const saved = result.data[0] as
      Record<string, unknown>

    if (
      typeof saved.saved_client_id !== 'string' ||
      typeof saved.saved_client_number !== 'string'
    ) {
      return reply(
        'Unable to confirm registration.',
        503
      )
    }

    /*
      SUCCESS
    */

    return NextResponse.json(
      {
        success: true,
        message:
          'Registration saved successfully.',
        clientId:
          saved.saved_client_id,
        clientNumber:
          saved.saved_client_number,
        organizationId:
          JS_ORGANIZATION_ID,
        verificationStatus:
          'not_verified',
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error(
      'Jeevan Sutra registration failed',
      error instanceof Error
        ? error.message
        : 'Unknown error'
    )

    return reply(
      'Registration service is temporarily unavailable.',
      503
    )
  }
}
