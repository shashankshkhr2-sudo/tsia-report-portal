import type { PersonalCompatibilityReport } from "@/lib/jeevansutra/compatibility-personal-report-contract"

function ConnectionArtwork({ category }: { category: 'love' | 'business' | 'family' | 'friendship' }) {
 const right = category === 'business' || category === 'friendship'
 const lower = category === 'family' || category === 'friendship'
 return <div aria-hidden="true" className="pointer-events-none relative mx-auto mb-5 w-full max-w-sm overflow-hidden" style={{ aspectRatio: '1.95 / 1' }}>
  {/* Decorative artwork: the category and people are provided as accessible live text below. */}
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img src="/website/illustrations/connection-collection.webp" alt="" width={1536} height={1024} decoding="async" className="absolute top-0 block h-auto max-w-none" style={{ width: '200%', left: right ? '-100%' : 0, transform: lower ? 'translateY(-50%)' : undefined }} />
 </div>
}

// English review component. Receives customer text only, never private evidence.
export function CompatibilityPersonalReport({ report }: { report: PersonalCompatibilityReport }) {
  const [first, second] = report.people
  const panel = "rounded-2xl border border-[#DCC9A8] bg-[#FFFEFB] p-5 sm:p-8"
  const heading = "font-serif text-2xl leading-tight text-[#64263B] sm:text-3xl"
  return <article lang="en" className="mx-auto max-w-5xl space-y-6 bg-[#FAF7F0] p-3 text-[#463B3B] sm:p-6">
    <header className="rounded-2xl border border-[#DCC9A8] px-5 py-9 text-center sm:px-10">
      <ConnectionArtwork category={/Business|Work|Professional|Meeting/.test(report.kind) ? "business" : /Family/.test(report.kind) ? "family" : /Friendship/.test(report.kind) ? "friendship" : "love"} />
      <p className="text-xs font-semibold uppercase tracking-widest text-[#815020]">Jeevan Sutra · Your connection</p>
      <h1 className="mt-4 break-words font-serif text-3xl leading-tight text-[#64263B] sm:text-5xl">{first.name}<span className="my-2 block text-2xl text-[#A17B42]">&</span>{second.name}</h1>
      <p className="mt-5 text-sm text-[#69574E]">{report.relationship}</p>
    </header>
    <section className={panel}>
      <h2 className={heading}>{report.connection.title}</h2>
      <p className="mt-4 leading-7">{report.connection.description}</p>
    </section>
    <section className="space-y-4">
      <h2 className={heading}>Understanding each of you</h2>
      <div className="grid gap-4 md:grid-cols-2">{report.people.map((person,index) => <section key={index} className={panel}>
        <h3 className="break-words font-serif text-2xl text-[#64263B]">{person.name}</h3>
        <p className="mt-4 leading-7">{person.introduction}</p>
        <h4 className="mt-6 font-semibold">What may be misunderstood</h4>
        <p className="mt-2 leading-7">{person.possibleMisunderstanding}</p>
      </section>)}</div>
    </section>
    <section className={panel}>
      <h2 className={heading}>What you may appreciate from each other</h2>
      <div className="mt-5 grid gap-6 md:grid-cols-2">{report.people.map((person,index) => <div key={index}>
        <h3 className="break-words font-semibold text-[#64263B]">{person.name}</h3>
        <dl className="mt-4 space-y-4">{person.expectations.map(item => <div key={item.title}><dt className="font-semibold">{item.title}</dt><dd className="mt-1 leading-7">{item.description}</dd></div>)}</dl>
      </div>)}</div>
    </section>
    <section className="space-y-4">
      <h2 className={heading}>What happens between you</h2>
      <div className="hidden overflow-hidden rounded-2xl border border-[#DCC9A8] bg-[#FFFEFB] md:block">
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">Your perspectives and how they interact</caption>
          <thead className="bg-[#64263B] text-white"><tr><th scope="col" className="w-[18%] p-4">Area</th><th scope="col" className="w-[24%] break-words p-4">{first.name}</th><th scope="col" className="w-[24%] break-words p-4">{second.name}</th><th scope="col" className="p-4">Between you</th></tr></thead>
          <tbody>{report.interactions.map(row => <tr key={row.id} className="border-t border-[#DCC9A8] align-top"><th scope="row" className="p-4 font-semibold text-[#64263B]">{row.area}</th><td className="p-4 leading-7">{row.firstPerspective}</td><td className="p-4 leading-7">{row.secondPerspective}</td><td className="p-4 leading-7">{row.betweenYou}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="space-y-4 md:hidden">{report.interactions.map(row => <section key={row.id} className={panel}>
        <h3 className="font-serif text-xl text-[#64263B]">{row.area}</h3>
        <dl className="mt-4 space-y-4"><div><dt className="font-semibold">{first.name}</dt><dd className="mt-1 leading-7">{row.firstPerspective}</dd></div><div><dt className="font-semibold">{second.name}</dt><dd className="mt-1 leading-7">{row.secondPerspective}</dd></div><div className="border-t border-[#DCC9A8] pt-4"><dt className="font-semibold text-[#64263B]">Between you</dt><dd className="mt-1 leading-7">{row.betweenYou}</dd></div></dl>
      </section>)}</div>
      {report.interactions.map(row => <details key={row.id} className="rounded-xl border border-[#DCC9A8] bg-[#FFFEFB] p-4"><summary className="cursor-pointer font-semibold text-[#64263B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">One adjustment each: {row.area}</summary><dl className="mt-4 grid gap-4 md:grid-cols-2"><div><dt className="font-semibold">{first.name}</dt><dd className="mt-1 leading-7">{row.firstAdjustment}</dd></div><div><dt className="font-semibold">{second.name}</dt><dd className="mt-1 leading-7">{row.secondAdjustment}</dd></div></dl></details>)}
    </section>
    {report.sharedPotential.length > 0 && <section className="space-y-4"><h2 className={heading}>What you may build together</h2>{report.sharedPotential.map(item => <section key={item.id} className={panel}><h3 className="font-serif text-xl text-[#64263B]">{item.title}</h3><p className="mt-3 leading-7">{item.description}</p></section>)}</section>}
    <section className={panel}>
      <h2 className={heading}>Your compatibility conclusion</h2>
      <h3 className="mt-5 font-semibold">Your potential connection</h3><p className="mt-2 leading-7">{report.conclusion.strongestConnection}</p>
      <h3 className="mt-5 font-semibold">The difference to understand</h3><p className="mt-2 leading-7">{report.conclusion.mainDifference}</p>
    </section>
    <footer className="border-t border-[#DCC9A8] px-2 pt-5 text-center text-sm leading-6 text-[#69574E]">{report.limitation}</footer>
  </article>
}
