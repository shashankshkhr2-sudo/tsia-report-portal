// Only explicit local destinations are accepted; never redirect to arbitrary query input.
export const compatibilitySignInPath = '/website/start?next=compatibility'
export const nameGuidanceSignInPath = '/website/start?next=name-guidance'
export function customerDestination(search: string) {
 const next = new URLSearchParams(search).get('next')
 if (next === 'compatibility') return '/website/compatibility'
 if (next === 'name-guidance') return '/website/name-discovery'
 if (next === "shared-compatibility") return "/website/shared-compatibility"
 return '/website/welcome'
}
