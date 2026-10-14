export function ProfileDob({ dob }: { dob: string }) {
 const display = /^\d{4}-\d{2}-\d{2}$/.test(dob) ? dob.split('-').reverse().join('/') : dob
 return <p className="mt-3 inline-flex flex-wrap items-center gap-x-2 rounded-lg border border-[#C5A15A]/30 bg-[#FAF7F0] px-3 py-2 text-base font-bold text-[#64263B]"><span>Date of Birth</span><time dateTime={/^\d{4}-\d{2}-\d{2}$/.test(dob) ? dob : undefined}>{display}</time></p>
}
