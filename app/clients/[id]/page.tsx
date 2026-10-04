import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ClientPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

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
    console.error('[client] lookup failed', {
      code: error.code,
    })
  }

  if (!client) notFound()

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
              <h1 className="font-serif text-3xl font-semibold text-[#24354c]">
                {client.full_name}
              </h1>

              <p className="mt-1 text-sm text-[#81776b]">
                {client.client_number || 'No Client ID'}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Info label="Status" value={client.status} />
          <Info label="Date of Birth" value={client.date_of_birth} />
          <Info label="Mobile" value={client.mobile} />
          <Info label="Email" value={client.email} />
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-[#24354c]">
            Client Workspace
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <WorkspaceCard
              href={`/clients/${id}/profile`}
              title="Profile"
              text="Personal and birth details"
            />

            <WorkspaceCard
              href={`/clients/${id}/reports`}
              title="Reports"
              text="Client report history"
            />

            <WorkspaceCard
              href={`/clients/${id}/consultations`}
              title="Consultations"
              text="Consultation history"
            />

            <WorkspaceCard
              href={`/clients/${id}/products`}
              title="Products"
              text="Purchased services"
            />

          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-[#24354c]">
            Birth Details
          </h2>

          <div className="mt-4 rounded-2xl border border-[#e8dfd3] bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Gender" value={client.gender} />
              <InfoRow label="Birth Time" value={client.birth_time} />
              <InfoRow
                label="Birth Place"
                value={client.birth_place_name}
              />
              <InfoRow
                label="State / Region"
                value={client.birth_state_region}
              />
              <InfoRow
                label="Country"
                value={client.birth_country}
              />
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className="rounded-xl border border-[#e8dfd3] bg-white p-3">
      <p className="text-xs text-[#9b9186]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#24354c]">
        {value || '—'}
      </p>
    </div>
  )
}

function WorkspaceCard({
  href,
  title,
  text,
}: {
  href: string
  title: string
  text: string
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[#e8dfd3] bg-white p-4 transition hover:border-[#c8ab83]"
    >
      <p className="font-semibold text-[#24354c]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#81776b]">
        {text}
      </p>
    </Link>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div>
      <p className="text-xs text-[#9b9186]">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[#24354c]">
        {value || '—'}
      </p>
    </div>
  )
}