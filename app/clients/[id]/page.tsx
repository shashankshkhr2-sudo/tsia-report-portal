import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{
    id: string
  }>
}

type Consultation = {
  id: string
  consultation_number: number
  consultation_mode: string
  status: string
  started_at: string
  ended_at: string | null
  main_concern_summary: string | null
  follow_up_required: boolean
}

export default async function ConsultationsPage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: client, error: clientError } =
    await supabase
      .from('clients')
      .select(`
        id,
        client_number,
        full_name
      `)
      .eq('id', id)
      .maybeSingle()

  if (clientError) {
    console.error(
      '[consultations] client lookup failed',
      {
        code: clientError.code,
      }
    )
  }

  if (!client) {
    notFound()
  }

  const {
    data: consultationData,
    error: consultationError,
  } = await supabase
    .from('consultations')
    .select(`
      id,
      consultation_number,
      consultation_mode,
      status,
      started_at,
      ended_at,
      main_concern_summary,
      follow_up_required
    `)
    .eq('client_id', id)
    .order('consultation_number', {
      ascending: false,
    })

  if (consultationError) {
    console.error(
      '[consultations] history lookup failed',
      {
        code: consultationError.code,
      }
    )
  }

  const consultations =
    (consultationData ?? []) as Consultation[]

  const completedCount =
    consultations.filter(
      (item) => item.status === 'completed'
    ).length

  const inProgressCount =
    consultations.filter(
      (item) => item.status === 'in_progress'
    ).length

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-5 sm:p-8">
      <div className="mx-auto max-w-5xl">

        <Link
          href={`/clients/${id}`}
          className="text-sm font-medium text-[#ad7b40]"
        >
          ← Master Client
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ad7b40]">
            Consultation History
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24354c]">
            {client.full_name}
          </h1>

          <p className="mt-1 text-sm text-[#81776b]">
            {client.client_number || 'No Client ID'}
          </p>
        </header>

        <section className="mt-7 grid grid-cols-3 gap-3">
          <Stat
            label="Total"
            value={consultations.length}
          />

          <Stat
            label="Completed"
            value={completedCount}
          />

          <Stat
            label="In Progress"
            value={inProgressCount}
          />
        </section>

        <section className="mt-8 rounded-2xl border border-[#e8dfd3] bg-white p-5">
          <div className="flex items-center justify-between gap-4">

            <div>
              <h2 className="font-serif text-xl font-semibold text-[#24354c]">
                Consultations
              </h2>

              <p className="mt-1 text-sm text-[#81776b]">
                Complete consultation history for this client.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="shrink-0 rounded-xl bg-[#24354c] px-4 py-3 text-sm font-semibold text-white opacity-60"
            >
              Start New
            </button>

          </div>

          <p className="mt-3 text-xs text-[#9b9186]">
            New consultation creation will be activated
            after the consultation workflow is connected.
          </p>
        </section>

        <section className="mt-6">

          {consultations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d8cbbb] bg-white p-8 text-center">

              <h2 className="font-serif text-xl font-semibold text-[#24354c]">
                No previous consultations
              </h2>

              <p className="mt-2 text-sm text-[#81776b]">
                This client will begin with their first consultation.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {consultations.map(
                (consultation) => (
                  <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                  />
                )
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  )
}

function Stat({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-[#e8dfd3] bg-white p-3">
      <p className="text-xs text-[#81776b]">
        {label}
      </p>

      <p className="mt-1 font-serif text-2xl font-semibold text-[#24354c]">
        {value}
      </p>
    </div>
  )
}

function ConsultationCard({
  consultation,
}: {
  consultation: Consultation
}) {
  const status =
    consultation.status === 'in_progress'
      ? 'In Progress'
      : consultation.status === 'completed'
        ? 'Completed'
        : formatText(consultation.status)

  return (
    <article className="rounded-2xl border border-[#e8dfd3] bg-white p-5">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="font-serif text-lg font-semibold text-[#24354c]">
            Consultation #{consultation.consultation_number}
          </p>

          <p className="mt-1 text-sm text-[#81776b]">
            {formatText(
              consultation.consultation_mode
            )}
          </p>
        </div>

        <span className="rounded-full bg-[#f3eadc] px-3 py-1 text-xs font-semibold text-[#8d744f]">
          {status}
        </span>

      </div>

      <div className="mt-