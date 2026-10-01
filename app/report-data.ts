import type { PortalData, Tone } from '@/lib/portal-types'
import { createClient } from '@/lib/supabase/server'

export type ClientSourceOption = {
  id: string
  name: string
}

export type EmployeeOption = {
  id: string
  fullName: string
  role: string
  specialization: string | null
  locationId: string | null
}

export type PortalFormData = {
  clientSources: ClientSourceOption[]
  employees: EmployeeOption[]
}

export type FullPortalData = PortalData & PortalFormData

export async function getPortalData(
  userId: string
): Promise<FullPortalData> {
  const supabase = await createClient()

  // -------------------------------------------------------
  // 1. Get logged-in user's profile
  // -------------------------------------------------------

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      role,
      is_active,
      organization_id,
      location_id,
      specialization
    `)
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    console.error('[portal] profile lookup failed', profileError)

    return {
      reports: [],
      clients: [],
      clientSources: [],
      employees: [],
    }
  }

  if (!profile.is_active) {
    return {
      reports: [],
      clients: [],
      clientSources: [],
      employees: [],
    }
  }

  // -------------------------------------------------------
  // 2. Load clients
  //
  // For the moment:
  // - admin / super admin = organisation clients
  // - other users = their assigned clients
  //
  // We can expand this later for State Head / Location Head.
  // -------------------------------------------------------

  let clientQuery = supabase
    .from('clients')
    .select(`
      id,
      client_number,
      full_name,
      current_name,
      date_of_birth,
      mobile,
      email,
      notes,
      status,
      primary_employee_id,
      organization_id,
      location_id,
      created_at
    `)
    .eq('organization_id', profile.organization_id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const normalizedRole = String(profile.role || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '')

  const isManagement =
    normalizedRole === 'admin' ||
    normalizedRole === 'superadmin'

  if (!isManagement) {
    clientQuery = clientQuery.eq(
      'primary_employee_id',
      userId
    )
  }

  const {
    data: clientData,
    error: clientError,
  } = await clientQuery

  if (clientError) {
    console.error('[clients] lookup failed', {
      code: clientError.code,
      message: clientError.message,
    })
  }

  const clients = (clientData ?? []).map((client) => ({
    id: client.id,

    name: client.full_name,

    initials: client.full_name
      .split(/\s+/)
      .filter(Boolean)
      .map((part: string) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),

    dob: client.date_of_birth ?? '',
    phone: client.mobile ?? '',
    email: client.email ?? '',
    notes: client.notes ?? '',

    joined: client.created_at
      ? new Date(client.created_at).toLocaleDateString()
      : '',

    tone: 'navy' as Tone,
  }))

  // -------------------------------------------------------
  // 3. Load active Client Sources for this organisation
  // -------------------------------------------------------

  const {
    data: sourceData,
    error: sourceError,
  } = await supabase
    .from('client_sources')
    .select('id, name, sort_order')
    .eq('organization_id', profile.organization_id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (sourceError) {
    console.error(
      '[client sources] lookup failed',
      sourceError
    )
  }

  const clientSources: ClientSourceOption[] =
    (sourceData ?? []).map((source) => ({
      id: source.id,
      name: source.name,
    }))

  // -------------------------------------------------------
  // 4. Load employees available for assignment
  //
  // Same organisation only.
  // -------------------------------------------------------

  const {
    data: employeeData,
    error: employeeError,
  } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      role,
      specialization,
      location_id
    `)
    .eq('organization_id', profile.organization_id)
    .eq('is_active', true)
    .order('full_name', { ascending: true })

  if (employeeError) {
    console.error(
      '[employees] lookup failed',
      employeeError
    )
  }

  const employees: EmployeeOption[] =
    (employeeData ?? []).map((employee) => ({
      id: employee.id,
      fullName: employee.full_name,
      role: employee.role,
      specialization: employee.specialization,
      locationId: employee.location_id,
    }))

  // -------------------------------------------------------
  // 5. Reports
  //
  // Existing portal currently does not load real reports.
  // We leave this untouched until we build Reports properly.
  // -------------------------------------------------------

  return {
    reports: [],
    clients,
    clientSources,
    employees,
  }
}