"use client"
let saved: { token: string; response: Promise<Response> } | null = null
export function clearCustomerPhoto() { saved = null }
export async function loadCustomerPhoto(token: string): Promise<Response> {
 if (!saved || saved.token !== token) {
  const entry = { token, response: fetch("/api/website/customer-photo", { headers: { Authorization: "Bearer " + token }, cache: "no-store" }) }
  saved = entry
  void entry.response.then(response => { if (!response.ok && saved === entry) saved = null }, () => { if (saved === entry) saved = null })
 }
 return (await saved.response).clone()
}
