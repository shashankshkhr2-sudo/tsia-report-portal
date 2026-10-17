import 'server-only'
// Interpretation tables remain draft: V2 cannot be enabled in production.
export function compatibilityDraftEnabled() {
 return process.env.VERCEL_ENV === 'preview' && process.env.JS_COMPATIBILITY_V2_DRAFT_ENABLED === 'true'
}
