"use client"
let saved: { token: string; response: Promise<Response> } | null = null
export function clearCustomerPhoto() { saved = null }
export async function loadCustomerPhoto(token: string): Promise<Response> {
 if (!saved || saved.token !== token) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  const response = (async () => {
   try {
    const result = await fetch("/api/website/customer-photo", { headers: { Authorization: "Bearer " + token }, cache: "no-store", priority: "low", signal: controller.signal })
    const body = await result.blob()
    return new Response(body, { status: result.status, statusText: result.statusText, headers: result.headers })
   } finally { clearTimeout(timer) }
  })()
  const entry = { token, response }
  saved = entry
  void response.then(result => { if (!result.ok && result.status !== 404 && saved === entry) saved = null }, () => { if (saved === entry) saved = null })
 }
 const entry = saved
 return (await entry.response).clone()
}
