import { redirect } from 'next/navigation'
import { ReportPortal } from '@/components/report-portal'
import { createClient } from '@/lib/supabase/server'
import { getPortalData } from './report-data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle<{ full_name: string | null }>()

  if (error) {
    console.error('[profile] lookup failed', {
      code: error.code,
    })
  }

  const fullName = profile?.full_name?.trim()

  if (!fullName) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ed] p-6 text-center">
        <div className="max-w-sm rounded-2xl border border-[#e8dfd3] bg-white p-8">
          <h1 className="font-serif text-xl font-semibold text-[#24354c]">
            Profile unavailable
          </h1>

          <p className="mt-2 text-sm text-[#8d8275]">
            Your account profile could not be loaded. Please contact your
            administrator.
          </p>
        </div>
      </main>
    )
  }

  const {
    reports,
    clients,
    clientSources,
    employees,
  } = await getPortalData(user.id)

  return (
    <ReportPortal
      fullName={fullName}
      reports={reports}
      clients={clients}
      clientSources={clientSources}
      employees={employees}
    />
  )
}