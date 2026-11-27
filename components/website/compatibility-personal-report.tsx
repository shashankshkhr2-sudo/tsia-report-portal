import type { PersonalCompatibilityReport } from "@/lib/jeevansutra/compatibility-personal-report-contract"

const jointMarriageThemes: Record<number, {
  graha: string
  title: string
  reading: string
  question: string
}> = {
  "1": {
    "graha": "Surya",
    "title": "Having a say in decisions",
    "reading": "Taking initiative can help a couple get things done. Takraar may start when a decision that affects both people is announced before both have had a say.",
    "question": "If a parent asks whether you can both visit this weekend, what can either of you promise on the spot, and what should you check together first?"
  },
  "2": {
    "graha": "Chandra",
    "title": "Feeling heard and cared for",
    "reading": "Small gestures can carry weight in a relationship. Someone who shares a worry may want a warm response before hearing a solution.",
    "question": "After a difficult day, would you prefer a call, some quiet company or help with one particular thing?"
  },
  "3": {
    "graha": "Guru",
    "title": "Sharing ideas and listening",
    "reading": "Talking can bring fresh ideas into a marriage. When both people have something to add, a quieter concern can easily go unheard.",
    "question": "If one of you wants to take a course or try a new line of work, how would you hear the whole idea before discussing whether it is practical?"
  },
  "4": {
    "graha": "Rahu",
    "title": "Agreeing on the details",
    "reading": "Clear arrangements can make daily life easier. Differences may come out when each person has a particular way of getting the same job done.",
    "question": "If you were arranging a family function together, which details would you settle jointly and which would you leave to the person handling the task?"
  },
  "5": {
    "graha": "Budh",
    "title": "Keeping your balance when plans change",
    "reading": "A dependable arrangement can still leave room for change. The important part is knowing what the other person has already organised around your promise.",
    "question": "If work delays a visit to family, who will call them, and when will the two of you decide on another time?"
  },
  "6": {
    "graha": "Shukra",
    "title": "Caring for family and sharing the load",
    "reading": "Looking after family can be a meaningful part of married life. A generous offer may also create extra work for a partner who was never asked.",
    "question": "Before offering to host relatives for a week, how would you agree on the time, expense and everyday work involved?"
  },
  "7": {
    "graha": "Ketu",
    "title": "Thinking things through",
    "reading": "A little time to reflect can help with an important choice. A long silence can leave a partner unsure whether the matter is still open.",
    "question": "If one of you needs time before answering a serious question, what could you say now, and when would you return to it?"
  },
  "8": {
    "graha": "Shani",
    "title": "Managing responsibilities",
    "reading": "Steady effort matters when two people are building a home. Remembering bills, appointments and commitments can become a sizeable job even when the expenses are shared.",
    "question": "Which household responsibility could each of you take from beginning to end, including remembering when it is due?"
  },
  "9": {
    "graha": "Mangal",
    "title": "Seeing the future you want",
    "reading": "In the TSIA reading, 9 brings attention to vision and wisdom. Two people can both want to settle down and still picture quite different lives.",
    "question": "When you picture an ordinary Sunday five years after marriage, where are you living, who is nearby and how are you spending the day?"
  }
}

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
    {report.marriageComparison && <>
      <section className="space-y-4">
        <h2 className={heading}>Your numbers, side by side</h2>
        {report.marriageComparison.numbers.map(row => <article key={row.title} className={panel}>
          <h3 className="font-serif text-xl text-[#64263B]">{row.title}</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="min-w-0">
              <p className="break-words font-semibold">{first.name}</p>
              <p className="my-2 font-serif text-3xl text-[#64263B]">{row.firstNumber}</p>
              <p className="leading-7">{row.firstPerspective}</p>
            </div>
            <div className="min-w-0 border-l border-[#DCC9A8] pl-4">
              <p className="break-words font-semibold">{second.name}</p>
              <p className="my-2 font-serif text-3xl text-[#64263B]">{row.secondNumber}</p>
              <p className="leading-7">{row.secondPerspective}</p>
            </div>
          </div>
          <h4 className="mt-5 font-semibold text-[#815020]">Between you</h4>
          <p className="mt-1 leading-7">{row.betweenYou}</p>
        </article>)}
      </section>
      <section className="space-y-4">
        <h2 className={heading}>How you may experience married life</h2>
        {report.marriageComparison.characteristics.map(row => <article key={row.title} className={panel}>
          <h3 className="font-serif text-xl text-[#64263B]">{row.title}</h3>
          {row.firstPerspective === row.secondPerspective
            ? <div className="mt-4">
                <h4 className="font-semibold">For each of you</h4>
                <p className="mt-1 leading-7">{row.firstPerspective}</p>
              </div>
            : <dl className="mt-4 grid grid-cols-2 gap-4">
                <div className="min-w-0"><dt className="break-words font-semibold">{first.name}</dt><dd className="mt-1 leading-7">{row.firstPerspective}</dd></div>
                <div className="min-w-0 border-l border-[#DCC9A8] pl-4"><dt className="break-words font-semibold">{second.name}</dt><dd className="mt-1 leading-7">{row.secondPerspective}</dd></div>
              </dl>}
          <div className="mt-4 rounded-xl bg-[#F8F1E2] p-4">
            <h4 className="font-semibold text-[#704D25]">Between you</h4>
            <p className="mt-1 leading-7">{row.betweenYou}</p>
          </div>
        </article>)}
      </section>
    </>}
    {report.marriageGrid && <section className="space-y-4">
      <h2 className={heading}>Your Lo Shu grids</h2>
      <p className="leading-7">Each repeated digit is shown in its own place.
        An empty cell means that digit is absent. Together, your two grids show
        which lines each of you brings and which ones you complete as a couple.</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {(["first", "second", "joint"] as const).map(side =>
          <section key={side} className="min-w-0 rounded-2xl border border-[#DCC9A8] bg-[#FFFEFB] p-4">
            <h3 className="mb-3 break-words font-serif text-xl text-[#64263B]">
              {side === "first" ? first.name : side === "second" ? second.name : "Your combined grid"}
            </h3>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-[#DCC9A8] bg-[#DCC9A8]">
              {report.marriageGrid!.cells.map(cell =>
                <div key={cell.digit} className="flex min-h-12 min-w-0 items-center justify-center bg-[#FAF7F0] px-1 py-2 text-center">
                  <span className="sr-only">Digit {cell.digit}, count {cell[side]}</span>
                  <span aria-hidden="true" className="break-all font-semibold text-[#64263B]">
                    {String(cell.digit).repeat(cell[side])}
                  </span>
                </div>)}
            </div>
          </section>)}
      </div>

      <section className={panel}>
        <h3 className="font-serif text-xl text-[#64263B]">What your repeated numbers bring into the marriage reading</h3>
        <p className="mt-2 leading-7">Read each theme alongside the two personal counts.
          The question below it is a way to see whether it fits your experience.</p>
        <div className="mt-5 divide-y divide-[#DCC9A8]">
          {report.marriageGrid.cells.filter(cell => cell.joint > 1)
            .sort((a, b) => b.joint - a.joint || a.digit - b.digit)
            .map(cell => {
              const theme = jointMarriageThemes[cell.digit]
              return <article key={cell.digit} className="py-4">
                <p className="text-sm font-semibold text-[#815020]">
                  {cell.digit} · {theme.graha} · {cell.joint} times together
                </p>
                <h4 className="mt-1 font-serif text-xl text-[#64263B]">{theme.title}</h4>
                <p className="mt-2 text-sm leading-6 text-[#69574E]">
                  {cell.first && cell.second
                    ? <>{first.name} brings {cell.first} and {second.name} brings {cell.second}.</>
                    : <>All {cell.joint} occurrences come from {cell.first ? first.name : second.name}’s personal grid.</>}
                </p>
                <p className="mt-3 leading-7">{theme.reading}</p>
                <p className="mt-3 rounded-xl bg-[#F8F1E2] p-3 leading-7">{theme.question}</p>
              </article>
            })}
        </div>
      </section>

      <section className={panel}>
        <h3 className="font-serif text-xl text-[#64263B]">Which lines do you complete?</h3>
        <ul className="mt-4 space-y-3">
          {report.marriageGrid.lines.filter(line => line.missing.length === 0)
            .map(line => <li key={line.digits.join("-")}>
              <strong>{line.title} · {line.digits.join("–")}</strong>
              <p>{line.status}.</p>
            </li>)}
        </ul>
        {report.marriageGrid.lines.every(line => line.missing.length > 0) &&
          <p className="leading-7">Each line still has at least one open cell.</p>}
        {report.marriageGrid.lines.some(line => line.missing.length > 0) &&
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold text-[#64263B]">See the remaining lines</summary>
            <ul className="mt-3 space-y-2">
              {report.marriageGrid.lines.filter(line => line.missing.length > 0)
                .map(line => <li key={line.digits.join("-")}>
                  {line.title} · {line.digits.join("–")} · {line.status}.
                  {" "}Missing {line.missing.join(", ")}.
                </li>)}
            </ul>
          </details>}
      </section>
    </section>}
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
      <h3 className="mt-5 font-semibold">What matters to each of you</h3><p className="mt-2 leading-7">{report.conclusion.strongestConnection}</p>
      <h3 className="mt-5 font-semibold">A question to talk through before marriage</h3><p className="mt-2 leading-7">{report.conclusion.mainDifference}</p>
    </section>
    <footer className="border-t border-[#DCC9A8] px-2 pt-5 text-center text-sm leading-6 text-[#69574E]">{report.limitation}</footer>
  </article>
}
