export const guidanceAreas = ['Personal & Life Guidance', 'Career & Professional Guidance', 'Relationships & Family', 'Marriage Guidance', 'Business & Financial Direction', 'Names & Numerology', 'Remedies & Yantras', 'Other']
export function applicationInput(body: Record<string, unknown>) {
  const text = (key: string, max: number, required = true) => {
    const value = typeof body[key] === 'string' ? (body[key] as string).trim() : ''
    if ((required && !value) || value.length > max) throw new Error('Please check the required fields and text lengths.')
    return value
  }
  const choice = (key: string, values: string[]) => {
    const value = text(key, 40)
    if (!values.includes(value)) throw new Error('Please check your selections.')
    return value
  }
  const email = text('email', 254).toLowerCase()
  const mobile = text('mobile', 25).replace(/[\s()-]/g, '')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\+?[0-9]{7,15}$/.test(mobile)) throw new Error('Please enter a valid email and mobile number.')
  const portfolio = text('portfolioUrl', 500, false)
  if (portfolio) {
    let url: URL
    try { url = new URL(portfolio) } catch { throw new Error('Please enter a valid portfolio URL.') }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Please enter an HTTP or HTTPS portfolio URL.')
  }
  if (body.accuracyConsent !== true || body.contactConsent !== true) throw new Error('Please confirm both consent statements.')
  if (!Array.isArray(body.guidanceAreas) || body.guidanceAreas.length > guidanceAreas.length || body.guidanceAreas.some(area => typeof area !== 'string' || !guidanceAreas.includes(area))) throw new Error('Please check your guidance areas.')
  return {
    full_name: text('fullName', 150), mobile, email,
    city: text('city', 150), state_region: text('state', 150), country: text('country', 150),
    expertise: choice('expertise', ['numerologist', 'astrologer', 'both']), methods: text('methods', 300),
    experience: choice('experience', ['starting', 'under_1', '1_3', '4_7', '8_15', 'over_15']), languages: text('languages', 300),
    guidance_areas: [...new Set(body.guidanceAreas as string[])],
    qualification_type: choice('qualificationType', ['formal', 'teacher', 'traditional', 'self_taught', 'combined']),
    qualification_details: text('qualificationDetails', 1500),
    consultation_mode: choice('consultationMode', ['online', 'in_person', 'both']),
    availability: choice('availability', ['under_5', '5_10', '11_20', 'over_20', 'flexible']),
    introduction: text('introduction', 1500), portfolio_url: portfolio || null,
    accuracy_consent: true, contact_consent: true,
  }
}
