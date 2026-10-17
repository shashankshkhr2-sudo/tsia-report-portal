// Only explicit local destinations are accepted; never redirect to arbitrary query input.
export const compatibilitySignInPath = '/website/start?next=compatibility'
export function customerDestination(search: string) {
 return new URLSearchParams(search).get('next') === 'compatibility'
  ? '/website/compatibility' : '/website/welcome'
}
