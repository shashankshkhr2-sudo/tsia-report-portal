import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Application = {
  id: string
  full_name: string
  mobile: string
  email: string
  city: string
  state_region: string
  country: string
  expertise: string
  methods: string
  experience: string
  languages: string
  guidance_areas: string[]
  qualification_type: string
  qualification_details: string
  consultation_mode: string
  availability: string
  introduction: string
  portfolio_url: string | null
  application_status: string
  review_notes: string | null
  created_at: string
}

function label(value: string) {
  return value.replace(/_/g, ' ')
}

function safePortfolio(value: string | null) {
  if (!value) return null

  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol)
      ? url.href
      : null
  } catch {
    return null
  }
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_active, organization_id')
    .eq('id', user.id)
    .maybeSingle<{
      role: string | null
      is_active: boolean | null
      organization_id: string | null
    }>()

  if (
    profileError ||
    profile?.role !== 'admin' ||
    profile.is_active !== true ||
    !profile.organization_id
  ) {
    redirect('/')
  }

  const params = await searchParams
  const requestedPage = Number(params.page || '1')
  const page = Number.isInteger(requestedPage) &&
    requestedPage >= 1 && requestedPage <= 100000
      ? requestedPage
      : 1

  const pageSize = 20
  const start = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from('jeevansutra_practitioner_applications')
    .select(
      'id, full_name, mobile, email, city, state_region, country, expertise, methods, experience, languages, guidance_areas, qualification_type, qualification_details, consultation_mode, availability, introduction, portfolio_url, application_status, review_notes, created_at',
      { count: 'exact' }
    )
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(start, start + pageSize - 1)

  if (error) {
    console.error('[applications] lookup failed', { code: error.code })
  }

  const applications = (data || []) as Application[]
  const total = count || 0

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-5 py-8 text-[#24354c]">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm underline">
          ← Dashboard
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#ad7b40]">
          Jeevan Sutra · Administrator
        </p>

        <h1 className="mt-3 font-serif text-4xl">
          Practitioner Applications
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#81776b]">
          Review numerologist and astrologer applications.
          Application approval and employee access are separate.
        </p>

        {error ? (
          <p role="alert" className="mt-8 rounded-xl bg-white p-5 text-red-700">
            Applications could not be loaded. Please try again.
          </p>
        ) : (
          <>
            <p className="mt-6 text-sm text-[#81776b]">
              {total} applications · Page {page}
            </p>

            <div className="mt-5 space-y-4">
              {applications.map((application) => {
                const portfolio = safePortfolio(application.portfolio_url)

                return (
                  <details
                    key={application.id}
                    className="rounded-2xl border border-[#e7ddd0] bg-white p-5 sm:p-6"
                  >
                    <summary className="cursor-pointer">
                      <span className="font-semibold">
                        {application.full_name}
                      </span>

                      <span className="ml-3 inline-block rounded-full bg-[#f6ecdf] px-3 py-1 text-xs capitalize text-[#72552e]">
                        {label(application.application_status)}
                      </span>

                      <span className="mt-2 block text-sm capitalize text-[#81776b]">
                        {application.expertise} · {application.city}
                        {' · '}{application.languages}
                      </span>

                      <span className="mt-2 block text-xs text-[#81776b]">
                        Applied: {new Date(application.created_at).toLocaleDateString(
                          'en-IN',
                          { timeZone: 'Asia/Kolkata' }
                        )}
                      </span>
                    </summary>

                    <dl className="mt-6 grid gap-5 border-t border-[#e7ddd0] pt-5 sm:grid-cols-2">
                      {[
                        ['Email', application.email],
                        ['Mobile', application.mobile],
                        ['Location', `${application.city}, ${application.state_region}, ${application.country}`],
                        ['Expertise', application.expertise],
                        ['Experience category', label(application.experience)],
                        ['Methods / Traditions', application.methods],
                        ['Languages', application.languages],
                        ['Guidance areas', application.guidance_areas.join(', ') || 'Not specified'],
                        ['Learning background', label(application.qualification_type)],
                        ['Qualifications', application.qualification_details],
                        ['Consultation mode', label(application.consultation_mode)],
                        ['Weekly availability category', label(application.availability)],
                        ['Introduction', application.introduction],
                        ['Review notes', application.review_notes || 'No notes yet'],
                      ].map(([title, value]) => (
                        <div key={title}>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-[#ad7b40]">
                            {title}
                          </dt>
                          <dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-7">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {portfolio && (
                      <a
                        href={portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-block text-sm underline"
                      >
                        Open professional portfolio ↗
                      </a>
                    )}
                  </details>
                )
              })}

              {!applications.length && (
                <p className="rounded-2xl border border-dashed border-[#d8cbbb] p-6 text-sm text-[#81776b]">
                  {total === 0
                    ? 'No applications have been submitted yet.'
                    : 'No applications on this page.'}
                </p>
              )}
            </div>

            <nav aria-label="Application pages" className="mt-7 flex gap-6">
              {page > 1 && (
                <Link
                  href={`/applications?page=${page - 1}`}
                  className="underline"
                >
                  Previous
                </Link>
              )}

              {start + pageSize < total && (
                <Link
                  href={`/applications?page=${page + 1}`}
                  className="underline"
                >
                  Next
                </Link>
              )}
            </nav>
          </>
        )}
      </div>
    </main>
  )
}
