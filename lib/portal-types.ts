export type Tone = 'plum' | 'terracotta' | 'olive' | 'navy'

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
  fullName: string
  clientNumber: string
  dateOfBirth: string
  mobile: string
  email: string
  joined: string
  status: string
  tone: Tone
}

export type PortalData = {
  reports: Report[]
  clients: Client[]
}