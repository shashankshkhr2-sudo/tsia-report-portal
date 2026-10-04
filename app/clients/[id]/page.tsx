import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ClientPage({ params }: PageProps) {
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
      gender,
      mobile,
      email,
      status
    `)
    .eq('id', id)
    .single()

  if (error || !client) {
    notFound()
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Not provided'

    const parsedDate = new Date(`${date}T00:00:00`)

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const displayGender = client.gender
    ? client.gender.charAt(0).toUpperCase() + client.gender.slice(1)
    : 'Not provided'

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#24354c]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#9b6c35]"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>

        <section className="rounded-3xl border border-[#e7ddd0] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ad7b40]">
              Master Client
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {client.full_name}
            </h1>

            <p className="text-sm text-[#81776b]">
              {client.client_number || 'Client ID not assigned'}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <InfoCard
              label="Status"
              value={client.status || 'Active'}
            />

            <InfoCard
              label="Date of Birth"
              value={formatDate(client.date_of_birth)}
            />

            <InfoCard
              label="Gender"
              value={displayGender}
            />

            <InfoCard
              label="Mobile"
              value={client.mobile || 'Not provided'}
            />

            <InfoCard
              label="Email"
              value={client.email || 'Not provided'}
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Client Workspace
            </h2>

            <p className="mt-1 text-sm text-[#81776b]">
              Manage this client&apos;s profile, services, reports and consultations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <WorkspaceCard
              href={`/clients/${client.id}/profile`}
              title="Profile"
              description="Personal details, contact information and birth details."
            />

            <WorkspaceCard
              href={`/clients/${client.id}/products`}
              title="Products"
              description="Manage TSIA services and client product access."
            />

            <WorkspaceCard
              href={`/clients/${client.id}/reports`}
              title="Reports"
              description="View generated, pending and delivered reports."
            />

            <WorkspaceCard
              href={`/clients/${client.id}/consultations`}
              title="Consultations"
              description="View consultation history and future client interactions."
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#eee5da] bg-[#fcfaf7] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#9b9186]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-[#24354c]">
        {value}
      </p>
    </div>
  )
}

function WorkspaceCard({
  href,
  title,
  description,
}: {
  href: string
  title: