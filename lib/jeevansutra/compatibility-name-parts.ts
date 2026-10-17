// Literal text matching only; never render customer names as HTML.
export function compatibilityNameParts(text: string, names: string[]) {
 const candidates = names.map((name, person) => ({ name, person })).filter(x => x.name.length > 0).sort((a,b) => b.name.length-a.name.length)
 const result: { text: string; person: number | null }[] = []
 const lower = text.toLowerCase(); let cursor = 0
 while (cursor < text.length) {
  let best: { index: number; name: string; person: number } | undefined
  for (const entry of candidates) {
   let index = lower.indexOf(entry.name.toLowerCase(), cursor)
   while (index >= 0) {
    const before = text[index-1], after = text[index+entry.name.length]
    if ((!before || !/[A-Za-z]/.test(before)) && (!after || !/[A-Za-z]/.test(after))) break
    index = lower.indexOf(entry.name.toLowerCase(), index+1)
   }
   if (index >= 0 && (!best || index < best.index)) best = { ...entry, index }
  }
  if (!best) { result.push({ text: text.slice(cursor), person: null }); break }
  if (best.index > cursor) result.push({ text: text.slice(cursor,best.index), person: null })
  result.push({ text: text.slice(best.index,best.index+best.name.length), person: best.person })
  cursor = best.index+best.name.length
 }
 return result
}
