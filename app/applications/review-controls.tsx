'use client'
import { useState } from 'react'
import { reviewApplication } from './actions'
export default function ReviewControls({ id, employeeId, locations }: { id: string; employeeId: string | null; locations: { id: string; name: string }[] }) {
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  if (employeeId) return <p className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-900">Employee activated. Manage availability in Clients → Employees.</p>
  async function save(status: string) {
    setBusy(true); setMessage(''); setLink('')
    try {
      const result = await reviewApplication({ id, status, notes, location })
      if (result.error) { setMessage(result.error); return }
      if (result.token) {
        setLink(`${window.location.origin}/website/practitioner-onboarding#invite=${result.token}`)
        setMessage('Approved. Copy this private link and share it with the applicant. It expires in 7 days. Issuing another approval replaces the previous link.')
      } else setMessage('Review saved.')
    } catch { setMessage('Unable to save. Please try again.') }
    finally { setBusy(false) }
  }
  return <section className="mt-6 border-t pt-5">
    <label className="block text-sm">Review notes (required)<textarea value={notes} onChange={e => setNotes(e.target.value)} maxLength={2000} rows={3} className="mt-2 w-full rounded-xl border p-3" /></label>
    <label className="mt-4 block text-sm">Employee work location<select value={location} onChange={e => setLocation(e.target.value)} className="mt-2 w-full rounded-xl border bg-white p-3"><option value="">No location assigned yet</option>{locations.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <p className="mt-2 text-xs">Approval allows verified onboarding as an ordinary employee. Assignment availability starts off. A work location is needed for employee client creation.</p>
    <div className="mt-4 flex flex-wrap gap-3">{[['under_review', 'Mark Under Review'], ['approved', 'Approve / Issue Onboarding Link'], ['rejected', 'Reject']].map(([value, title]) => <button key={value} type="button" disabled={busy || !notes.trim()} onClick={() => save(value)} className="rounded-xl bg-[#64263B] px-4 py-3 text-sm text-white disabled:opacity-50">{title}</button>)}</div>
    {message && <p role="status" className="mt-4 text-sm">{message}</p>}
    {link && <div className="mt-4"><label className="text-sm">Private onboarding link<input readOnly value={link} onFocus={e => e.target.select()} className="mt-2 w-full rounded-xl border p-3" /></label><button type="button" className="mt-3 underline" onClick={async () => { try { await navigator.clipboard.writeText(link); setMessage('Link copied. Share it privately with the applicant.') } catch { setMessage('Press and hold the link field to copy it.') } }}>Copy onboarding link</button></div>}
  </section>
}
