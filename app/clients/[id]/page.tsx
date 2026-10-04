import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ClientPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: client, error } = await supabase
    .from('clients')
    .select(`
      id,
      client_number,
      full_name,
      date_of_birth,
      mobile,
      email,
      status,
      gender,
      birth_time,
      birth_place_name,
      birth_state_region,
      birth_country
    `)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('[client workspace] lookup failed', {
      code: error.code,
    })
  }

  if (!client) {
    notFound()
  }

  const initials = client.full_name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('')

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm font-medium text-[#ad7b40]"
        >
          ← Dashboard
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
            Master Client
          </p>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f3eadc] text-lg font-semibold text-[#8d744f]">
              {initials || '?'}
            </div>

            <div className="min-w-0">
              <h1 className="truncate font-serif text-3xl font-semibold text-[#24354c]">
                {client.full_name}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#81776b]">
                <span>
                  {client.client_number || 'No Client ID'}
                </span>

                <span>•</span>

                <span className="capitalize">
                  {client.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-7">
          <details className="rounded-2xl border border-[#e8dfd3] bg-white">
            <summary className="cursor-pointer list-none p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#24354c]">
                    Client Profile
                  </h2>

                  <p className="mt-1 text-sm text-[#81776b]">
                    Personal, contact and birth details
                  </p>
                </div>

                <span className="text-sm font-semibold text-[#ad7b40]">
                  View details
                </span>
              </div>
            </summary>

            <div className="border-t border-[#eee5da] p-5">
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                <ProfileField
                  label="Full Name"
                  value={client.full_name}
                />

                <ProfileField
                  label="Date of Birth"
                  value={client.date_of_birth}
                />

                <ProfileField
                  label="Gender"
                  value={client.gender}
                />

                <ProfileField
                  label="Mobile"
                  value={client.mobile}
                />

                <ProfileField
                  label="Email"
                  value={client.email}
                />

                <ProfileField
                  label="Birth Time"
                  value={client.birth_time}
                />

                <ProfileField
                  label="Birth Place"
                  value={client.birth_place_name}
                />

                <ProfileField
                  label="State / Region"
                  value={client.birth_state_region}
                />

                <ProfileField
                  label="Country"
                  value={client.birth_country}
                />
              </div>
            </div>
          </details>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ad7b40]">
                Employee Workspace
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#24354c]">
                Consultation
              </h2>

              <p className="mt-1 text-sm text-[#81776b]">
                Understand the client, continue previous discussions and begin a new consultation.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#e8dfd3] bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <ConsultationInfo
                label="Consultation History"
                value="Not loaded yet"
              />

              <ConsultationInfo
                label="Follow-up"
                value="Not loaded yet"
              />

              <ConsultationInfo
                label="Last Consultation"
                value="Not loaded yet"
              />
            </div>

            <div className="mt-5 border-t border-[#eee5da] pt-5">
              <button
                type="button"
                disabled
                className="w-full rounded-xl bg-[#24354c] px-5 py-3 text-sm font-semibold text-white opacity-60 sm:w-auto"
              >
                Start New Consultation
              </button>

              <p className="mt-2 text-xs text-[#9b9186]">
                Consultation history will be connected before this action is enabled.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-[#24354c]">
            Client Intelligence
          </h2>

          <p className="mt-1 text-sm text-[#81776b]">
            Reports available for this client will support the consultation workspace.
          </p>

          <div className="mt-4 rounded-2xl border border-dashed border-[#d8cbbb] p-5">
            <p className="text-sm font-medium text-[#24354c]">
              Report intelligence not connected yet
            </p>

            <p className="mt-1 text-xs text-[#81776b]">
              We will connect verified client reports here without mixing report management with the live consultation.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <DestinationCard
            title="Reports"
            text="Generate, review, quality-check, deliver and view this client's reports."
          />

          <DestinationCard
            title="Products"
            text="View purchased services, product access and client entitlements."
          />
        </section>
      </div>
    </main>
  )
}

function ProfileField({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[#9b9186]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#24354c]">
        {value || '—'}
      </p>
    </div>
  )
}

function ConsultationInfo({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-[#faf7f2] p-4">
      <p className="text-xs text-[#9b9186]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#24354c]">
        {value}
      </p>
    </div>
  )
}

function DestinationCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#24354c]">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-5 text-[#81776b]">
            {text}
          </p>
        </div>

        <span className="shrink-0 text-[#ad7b40]">
          →
        </span>
      </div>
    </div>
  )
}