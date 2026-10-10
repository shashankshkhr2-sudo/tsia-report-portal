import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPortalData } from '@/app/report-data'
import { ReportPortal } from '@/components/report-portal'

export const dynamic = 'force-dynamic'

export default async function EmployeePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role === 'customer') {
    redirect('/website')
  }

  const portalData = await getPortalData(user.id)

  return (
    <ReportPortal
      fullName={profile.full_name || 'Team Member'}
      reports={portalData.reports}
      clients={portalData.clients}
    />
  )
}