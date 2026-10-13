import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'
import { database } from '@/lib/jeevansutra/customer-server'

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

const allowedServices = new Set([
  'Personal Numerology Report',
  'Life Path Guidance',
  'Astrology Consultation',
  'Career & Professional Guidance',
  'Relationship & Family Guidance',
  'Personalized Remedies & Yantras',
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

  const now = new Date()

  if (
    year < 1900 ||
    year > now.getUTCFullYear()
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

  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  )

  if (date.getTime() > today) {
    return null
  }

  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-')
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

  /*
    New Supabase secret keys go in the
    apikey header, not in a Bearer header.

    Legacy service-role JWT keys also use
    the Authorization header.
  */
  const headers: Record<string, string> = {
    apikey: supabaseSecret,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (!supabaseSecret.startsWith('sb_secret_')) {
    headers.Authorization =
      `Bearer ${supabaseSecret}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
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

    If unavailable, fail closed.
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
    const errorData = result.data && typeof result.data === 'object'
      && !Array.isArray(result.data)
      ? result.data as Record<string, unknown> : null
    const code = typeof errorData?.code === 'string'
      && /^[A-Za-z0-9_]{1,40}$/.test(errorData.code)
      ? errorData.code : 'unavailable'
    console.error('Jeevan Sutra rate-limit RPC rejected', {
      status: result.status,
      code,
    })
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
  let stage = 'configuration'
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL

    const supabaseSecret =
      process.env.SUPABASE_SECRET_KEY

    const rateLimitHashSecret =
      process.env.JS_RATE_LIMIT_HASH_SECRET

    if (
      !supabaseUrl ||
      !supabaseSecret ||
      !rateLimitHashSecret ||
      rateLimitHashSecret.length < 32
    ) {
      console.error(
        'Jeevan Sutra registration configuration missing',
        {
          missingSupabaseUrl: !supabaseUrl,
          missingSupabaseSecret: !supabaseSecret,
          missingRateLimitHashSecret: !rateLimitHashSecret,
          rateLimitHashSecretTooShort:
            Boolean(rateLimitHashSecret && rateLimitHashSecret.length < 32),
        }
      )

      return reply(
        'Registration service is temporarily unavailable.',
        503
      )
    }

    /*
      LAUNCH GATE

      Leave this environment variable unset
      until OTP delivery and the complete
      registration flow are ready for testing.
    */
    if (
      process.env.JS_PUBLIC_REGISTRATION_ENABLED !==
      'true'
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
      request.headers.get('content-length') || 0
    )

    if (declaredSize > MAX_BODY_BYTES) {
      return reply(
        'Request too large.',
        413
      )
    }

    /*
      VERIFY CUSTOMER ACCESS TOKEN

      The user ID is obtained from Supabase
      Auth, never from the submitted form.
    */
    const authorization =
      request.headers.get('authorization') || ''

    const tokenMatch =
      /^Bearer ([^\s]+)$/i.exec(authorization)

    if (
      !tokenMatch ||
      tokenMatch[1].length > 8192
    ) {
      return reply(
        'Please verify your email before registering.',
        401
      )
    }

    stage = 'verify-account'
    const authResponse = await fetch(
      new URL('/auth/v1/user', supabaseUrl),
      {
        method: 'GET',
        headers: {
          apikey: supabaseSecret,
          Authorization:
            `Bearer ${tokenMatch[1]}`,
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!authResponse.ok) {
      if (
        authResponse.status === 401 ||
        authResponse.status === 403
      ) {
        return reply(
          'Your verification session has expired. Please sign in again.',
          401
        )
      }

      console.error(
        'Jeevan Sutra account verification failed',
        authResponse.status
      )

      return reply(
        'Email verification is temporarily unavailable.',
        503
      )
    }

    const authData: unknown = await authResponse
      .json()
      .catch(() => null)

    if (
      !authData ||
      typeof authData !== 'object' ||
      Array.isArray(authData)
    ) {
      return reply(
        'Unable to confirm your account.',
        503
      )
    }

    const authUser =
      authData as Record<string, unknown>

    if (
      typeof authUser.id !== 'string' ||
      !authUser.id ||
      typeof authUser.email !== 'string' ||
      !authUser.email.trim() ||
      typeof authUser.email_confirmed_at !== 'string' ||
      !authUser.email_confirmed_at ||
      authUser.is_anonymous === true
    ) {
      return reply(
        'Please verify your email before registering.',
        403
      )
    }

    const verifiedUserId = authUser.id

    const verifiedEmail =
      authUser.email.trim().toLowerCase()

    /*
      READ AND PARSE REQUEST
    */
    stage = 'read-request'
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
      VALIDATE REGISTRATION DETAILS
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
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return reply(
        'Please enter a valid email address.',
        400
      )
    }

    if (email !== verifiedEmail) {
      return reply(
        'Please use the email address you verified.',
        403
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
      (
        category === 'other' &&
        !allowedServices.has(selectedService)
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
    stage = 'rate-limit'
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
      ATOMIC VERIFIED REGISTRATION

      The database independently checks the
      confirmed email for this Auth user.

      It saves the Master Client and linked
      registration in one transaction.

      Retries for the same Auth user return
      the existing linked client.
    */
    stage = 'save-registration'
    const result = await callSupabase(
      supabaseUrl,
      supabaseSecret,
      'save_verified_jeevansutra_registration',
      {
        p_auth_user_id: verifiedUserId,
        p_birth_name: birthName,
        p_current_name: currentName,
        p_dob: dob,
        p_mobile: mobile,
        p_email: verifiedEmail,
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

    const savedRow: unknown = result.data[0]

    if (
      !savedRow ||
      typeof savedRow !== 'object' ||
      Array.isArray(savedRow)
    ) {
      return reply(
        'Unable to confirm registration.',
        503
      )
    }

    const saved =
      savedRow as Record<string, unknown>

    if (
      typeof saved.saved_client_id !== 'string' ||
      !saved.saved_client_id ||
      typeof saved.saved_client_number !== 'string' ||
      !saved.saved_client_number
    ) {
      return reply(
        'Unable to confirm registration.',
        503
      )
    }

    stage = 'guidance-access'
    if (process.env.JS_CUSTOMER_GUIDANCE_ENABLED === 'true') {
      const access = await database('js_customer_access?on_conflict=auth_user_id', {
        method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates' },
        body: JSON.stringify({ auth_user_id: verifiedUserId, client_id: saved.saved_client_id, organization_id: JS_ORGANIZATION_ID }),
      })
      if (!access.ok) return reply('Registration saved, but guidance access could not be confirmed. Please retry.', 503)
      const confirmed = await database(`js_customer_access?auth_user_id=eq.${verifiedUserId}&select=client_id,organization_id`)
      const mapping = confirmed.ok ? await confirmed.json() : []
      if (mapping.length !== 1 || mapping[0].client_id !== saved.saved_client_id || mapping[0].organization_id !== JS_ORGANIZATION_ID) {
        return reply('Unable to confirm guidance access. Please contact support.', 503)
      }
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
          'verified',
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    /*
      Avoid logging submitted details,
      credentials or access tokens.
    */
    console.error(
      'Jeevan Sutra registration request failed',
      {
        stage,
        errorType: error instanceof Error ? error.name : 'Unknown',
        reason: error instanceof Error && [
          'Trusted client address unavailable',
          'Registration rate-limit check failed',
          'Unexpected rate-limit response',
        ].includes(error.message) ? error.message : 'Unexpected exception',
      }
    )

    return reply(
      'Registration service is temporarily unavailable.',
      503
    )
  }
}