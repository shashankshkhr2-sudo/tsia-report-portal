export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c49a5a]/60 bg-[#24354c] text-[#d9b56e]">
        <span className="font-serif text-lg font-semibold">ॐ</span>
        <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#c49a5a] text-[9px] font-bold text-[#24354c]">✦</span>
      </div>
      {!compact && <div><p className="font-serif text-[15px] font-semibold tracking-[0.16em] text-[#24354c]">TSIA</p><p className="text-[9px] uppercase tracking-[0.22em] text-[#9a7b4f]">Report Portal</p></div>}
    </div>
  )
}
