import { redirect } from 'next/navigation'
import PortalApp from '@/components/report-portal'
import { createClient } from '@/lib/supabase/server'
import { clients, reports } from './report-data'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <PortalApp userId="" reportItems={[]} clientItems={[]} />
  return <PortalApp userId={user.id} reportItems={reports} clientItems={clients} />
}

export const dynamic = 'force-dynamic'
