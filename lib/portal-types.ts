export type Tone =
  | 'plum'
  | 'terracotta'
  | 'olive'
  | 'navy'

export type Report = {
  id: string
  client: string
  initials: string
  dob: string
  version: string
  status: 'Ready' | 'Processing'
  date: string
  tone: Tone
}

export type Client = {
  id: string

  clientNumber?: string

  name: string
  currentName?: string
  initials: string

  dob: string
  gender?: string

  birthTime?: string
  birthPlace?: string
  birthStateRegion?: string
  birthCountry?: string

  phone: string
  whatsapp?: string
  email: string

  sourceId?: string
  sourceName?: string
  referredBy?: string

  primaryEmployeeId?: string
  primaryEmployeeName?: string

  reportCount?: number
  questionCount?: number

  lastActivity?: string

  notes: string

  status?: 'active' | 'inactive'

  joined: string
  tone: Tone
}

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

export type PortalData = {
  reports: Report[]
  clients: Client[]
}

export type PortalFormData = {
  clientSources: ClientSourceOption[]
  employees: EmployeeOption[]
}

export type FullPortalData =
  PortalData & PortalFormData