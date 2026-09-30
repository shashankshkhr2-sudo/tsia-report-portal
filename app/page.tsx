import { redirect } from 'next/navigation'
import { ReportPortal } from '@/components/report-portal'
import { createClient } from '@/lib/supabase/server'
import { getPortalData } from './report-data'

export const dynamic = 'force-dynamic'

const FALLBACK_NAME = 'Team member'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle<{ full_name: string | null }>()

  if (error) console.error('[profile] lookup failed', { code: error.code })

  const fullName = profile?.full_name?.trim() || FALLBACK_NAME
  const { reports, clients } = await getPortalData(user.id)

  return <ReportPortal fullName={fullName} reports={reports} clients={clients} />
}
