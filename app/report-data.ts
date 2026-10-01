import type {
  Client,
  ClientSourceOption,
  EmployeeOption,
  PortalData,
  Tone,
} from '@/lib/portal-types'

import { createClient } from '@/lib/supabase/server'

export type PortalFormData = {
  clientSources: ClientSourceOption[]
  employees: EmployeeOption[]
}

export type FullPortalData = PortalData & PortalFormData

export async function getPortalData(
  userId: string
): Promise<FullPortalData> {
  const supabase = await createClient()

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
    console.error(
      '[portal] profile lookup failed',
      profileError
    )

    return {
      reports: [],
      clients: [],
      clientSources: [],
      employees: [],
    }
  }

  if (
    !profile.is_active ||
    !profile.organization_id
  ) {
    return {
      reports: [],
      clients: [],
      clientSources: [],
      employees: [],
    }
  }

  const normalizedRole = String(
    profile.role || ''
  )
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '')

  const isManagement =
    normalizedRole === 'admin' ||
    normalizedRole === 'superadmin'

  /*
   * Load active employees.
   */
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
    .eq(
      'organization_id',
      profile.organization_id
    )
    .eq('is_active', true)
    .order('full_name', {
      ascending: true,
    })

  if (employeeError) {
    console.error(
      '[employees] lookup failed',
      employeeError
    )
  }

  const employees: EmployeeOption[] =
    (employeeData ?? []).map(
      (employee) => ({
        id: employee.id,
        fullName:
          employee.full_name ||
          'Unnamed employee',
        role: employee.role || '',
        specialization:
          employee.specialization,
        locationId:
          employee.location_id,
      })
    )

  const employeeNames = new Map(
    employees.map((employee) => [
      employee.id,
      employee.fullName,
    ])
  )

  /*
   * Load client source master.
   */
  const {
    data: sourceData,
    error: sourceError,
  } = await supabase
    .from('client_sources')
    .select(`
      id,
      name,
      sort_order
    `)
    .eq(
      'organization_id',
      profile.organization_id
    )
    .eq('is_active', true)
    .order('sort_order', {
      ascending: true,
    })

  if (sourceError) {
    console.error(
      '[client sources] lookup failed',
      sourceError
    )
  }

  const clientSources: ClientSourceOption[] =
    (sourceData ?? []).map(
      (source) => ({
        id: source.id,
        name: source.name,
      })
    )

  const sourceNames = new Map(
    clientSources.map((source) => [
      source.id,
      source.name,
    ])
  )

  /*
   * Load active clients.
   */
  let clientQuery = supabase
    .from('clients')
    .select(`
      id,
      client_number,
      full_name,
      current_name,
      date_of_birth,
      gender,
      birth_time,
      birth_place_name,
      birth_state_region,
      birth_country,
      mobile,
      whatsapp_number,
      email,
      source_id,
      referred_by,
      primary_employee_id,
      notes,
      status,
      created_at,
      updated_at
    `)
    .eq(
      'organization_id',
      profile.organization_id
    )
    .eq('status', 'active')
    .order('updated_at', {
      ascending: false,
    })

  /*
   * Ordinary employees see only
   * clients assigned to them.
   */
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
    console.error(
      '[clients] lookup failed',
      {
        code: clientError.code,
        message: clientError.message,
      }
    )
  }

  const clients: Client[] =
    (clientData ?? []).map(
      (client) => {
        const fullName =
          client.full_name || ''

        return {
          id: client.id,

          clientNumber:
            client.client_number ||
            undefined,

          name: fullName,

          currentName:
            client.current_name ||
            undefined,

          initials: fullName
            .split(/\s+/)
            .filter(Boolean)
            .map(
              (part: string) =>
                part[0]
            )
            .slice(0, 2)
            .join('')
            .toUpperCase(),

          dob:
            client.date_of_birth ||
            '',

          gender:
            client.gender ||
            undefined,

          birthTime:
            client.birth_time ||
            undefined,

          birthPlace:
            client.birth_place_name ||
            undefined,

          birthStateRegion:
            client.birth_state_region ||
            undefined,

          birthCountry:
            client.birth_country ||
            undefined,

          phone:
            client.mobile || '',

          whatsapp:
            client.whatsapp_number ||
            undefined,

          email:
            client.email || '',

          sourceId:
            client.source_id ||
            undefined,

          sourceName:
            client.source_id
              ? sourceNames.get(
                  client.source_id
                ) || undefined
              : undefined,

          referredBy:
            client.referred_by ||
            undefined,

          primaryEmployeeId:
            client.primary_employee_id ||
            undefined,

          primaryEmployeeName:
            client.primary_employee_id
              ? employeeNames.get(
                  client.primary_employee_id
                ) || undefined
              : undefined,

          /*
           * These will be connected
           * when Reports and Questions
           * modules are implemented.
           */
          reportCount: 0,
          questionCount: 0,

          /*
           * Temporary factual activity
           * date until the full activity
           * system is connected.
           */
          lastActivity:
            client.updated_at
              ? new Date(
                  client.updated_at
                ).toLocaleDateString()
              : '',

          notes:
            client.notes || '',

          status:
            client.status === 'inactive'
              ? 'inactive'
              : 'active',

          joined:
            client.created_at
              ? new Date(
                  client.created_at
                ).toLocaleDateString()
              : '',

          tone: 'navy' as Tone,
        }
      }
    )

  return {
    reports: [],
    clients,
    clientSources,
    employees,
  }
}