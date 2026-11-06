import type { buildProfessionReading } from "@/lib/jeevansutra/profession-reading"

type Reading = ReturnType<typeof buildProfessionReading>

export function ProfessionReadingView({ reading }: { reading: Reading }) {
  return <section aria-labelledby="profession-reading-title" className="space-y-5">
    <header className="rounded-3xl bg-[#64263B] p-5 text-[#FAF0DE] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#D2B577]">Based on your name and date of birth</p>
      <h1 id="profession-reading-title" className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Your qualities. Your work possibilities.</h1>
      <p className="mt-3 leading-7">{reading.introduction}</p>
    </header>

    {reading.emptyMessage ? <p role="status" className="rounded-2xl border border-[#D2B577]/50 bg-white p-5">{reading.emptyMessage}</p> : <>
      <section aria-labelledby="work-qualities-title">
        <h2 id="work-qualities-title" className="font-serif text-2xl text-[#64263B]">Qualities highlighted in your reading</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {reading.findings.map(finding => <article key={finding.id} className="rounded-2xl border border-[#E4D8C4] bg-white p-5">
            <h3 className="font-serif text-xl text-[#64263B]">{finding.qualityTitle}</h3>
            <p className="mt-2 leading-7 text-[#65544D]">{finding.qualityDescription}</p>
            {finding.contextNote && <p className="mt-3 text-sm leading-6 text-[#766B67]">{finding.contextNote}</p>}
            <details className="mt-3 text-sm text-[#766B67]">
              <summary className="min-h-11 cursor-pointer py-3 font-medium text-[#64263B]">Basis of this interpretation</summary>
              <p className="pb-2">{finding.sources.join(" · ")}</p>
            </details>
          </article>)}
        </div>
      </section>

      <section aria-labelledby="profession-areas-title">
        <h2 id="profession-areas-title" className="font-serif text-2xl text-[#64263B]">Profession areas to explore</h2>
        <p className="mt-2 text-sm leading-6 text-[#766B67]">These examples connect the qualities above with different kinds of work. They are not ranked.</p>
        <div className="mt-4 space-y-4">
          {reading.findings.map(finding => <article key={finding.id} className="rounded-2xl border border-[#D2B577]/60 bg-white p-5">
            <h3 className="font-serif text-xl text-[#64263B]">{finding.professionArea.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {finding.professionArea.examples.map(example => <li key={example} className="rounded-lg bg-[#F4EBD9] px-3 py-2 text-sm text-[#64263B]">{example}</li>)}
            </ul>
            <p className="mt-4 text-sm font-semibold text-[#64263B]">Connection with your reading: {finding.qualityTitle}</p>
            <p className="mt-2 leading-7 text-[#65544D]">{finding.professionArea.connection}</p>
            <p className="mt-3 text-sm leading-6 text-[#766B67]">{finding.professionArea.practicalRequirement}</p>
          </article>)}
        </div>
      </section>
    </>}
    <p className="text-sm leading-6 text-[#766B67]">{reading.note}</p>
  </section>
}
