import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: client, error } = await supabase
    .from('clients')
    .select(
      'id, client_number, full_name, date_of_birth, gender, mobile, email, status'
    )
    .eq('id', id)
    .single()

  if (error || !client) notFound()

  const items = [
    ['Status', client.status || 'Active'],
    ['Date of Birth', client.date_of_birth || 'Not provided'],
    ['Gender', client.gender || 'Not provided'],
    ['Mobile', client.mobile || 'Not provided'],
    ['Email', client.email || 'Not provided'],
  ]

  const workspace = [
    {
      title: 'Profile',
      text: 'Personal, contact and birth details.',
      href: `/clients/${id}/profile`,
    },
    {
      title: 'Products',
      text: 'TSIA services and client product access.',
      href: `/clients/${id}/products`,
    },
    {
      title: 'Reports',
      text: 'Generated, pending and delivered reports.',
      href: `/clients/${id}/reports`,
    },
    {
      title: 'Consultations',
      text: 'Consultation history and client interactions.',
      href: `/clients/${id}/consultations`,
    },
  ]

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#24354c]">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/"
          className="text-sm font-medium text-[#9b6c35]"
        >
          ← Back to Dashboard
        </Link>

        <section className="mt-5 rounded-3xl border border-[#e7ddd0] bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-widest text-[#ad7b40]">
            Master Client
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            {client.full_name}
          </h1>

          <p className="mt-1 text-sm text-[#81776b]">
            {client.client_number || 'Client ID not assigned'}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {items.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#eee5da] bg-[#fcfaf7] p-4"
              >
                <p className="text-xs uppercase text-[#9b9186]">
                  {label}
                </p>

                <p className="mt-2 break-words text-sm font-semibold">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">

          <h2 className="text-xl font-bold">
            Client Workspace
          </h2>

          <p className="mt-1 text-sm text-[#81776b]">
            Manage this client&apos;s services, reports and consultations.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {workspace.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-[#e7ddd0] bg-white p-5 shadow-sm"
              >
                <div className="flex justify-between gap-4">

                  <div>
                    <h3 className="font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-[#81776b]">
                      {item.text}
                    </p>
                  </div>

                  <span className="text-xl text-[#ad7b40]">
                    ›
                  </span>

                </div>
              </Link>
            ))}
          </div>

        </section>
      </div>
    </main>
  )
}