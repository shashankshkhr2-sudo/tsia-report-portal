"use client"
import { useState } from "react"
import { WORK_TYPES, ONE_YEAR_GOALS, PROFESSION_QUESTION_COPY, type WorkTypeId, type OneYearGoalId } from "@/lib/jeevansutra/profession-questions"

export function ProfessionWorkForm() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<WorkTypeId[]>([])

  const [details, setDetails] = useState<Partial<Record<WorkTypeId, { work: string; role: string }>>>({})
  const [goals, setGoals] = useState<OneYearGoalId[]>([])
  const [goalDetail, setGoalDetail] = useState("")
  const [obstacle, setObstacle] = useState("")
  const field = "mt-2 block w-full rounded-xl border border-[#D2B577]/60 bg-white p-3 text-base text-[#392E30]"

  function updateDetail(id: WorkTypeId, key: "work" | "role", value: string) {
    setDetails(previous => ({ ...previous, [id]: { work: previous[id]?.work || "", role: previous[id]?.role || "", [key]: value } }))
  }

  function toggleGoal(id: OneYearGoalId) {
    setGoals(previous => previous.includes(id)
      ? previous.filter(value => value !== id)
      : id === "unsure" ? ["unsure"] : [...previous.filter(value => value !== "unsure"), id])
  }

  function toggle(id: WorkTypeId) {
    setSelected(previous => previous.includes(id)
      ? previous.filter(value => value !== id)
      : [...previous, id])
  }

  return <section aria-labelledby="your-work-title" className="mt-6 rounded-3xl border border-[#D2B577]/60 bg-white p-5 text-[#64263B] sm:p-7">
    <h2 id="your-work-title" className="font-serif text-2xl">Now, tell us about your work</h2>
    <p className="mt-3 leading-7 text-[#65544D]">The reading above uses your name and date of birth. We have not asked about your current profession yet.</p>
    <button type="button" aria-expanded={open} aria-controls="profession-work-questions" onClick={() => setOpen(value => !value)} className="mt-4 min-h-12 rounded-xl bg-[#64263B] px-5 py-3 font-semibold text-[#FAF0DE]">{open ? "Hide work questions ↑" : "Continue to my work →"}</button>
    <div id="profession-work-questions" hidden={!open} className="mt-5">
      <fieldset>
        <legend className="font-semibold">{PROFESSION_QUESTION_COPY.workType}</legend>
        <p className="mt-2 text-sm text-[#766B67]">{PROFESSION_QUESTION_COPY.selectionHelp}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {WORK_TYPES.map(option => <label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#D2B577]/60 p-3">
            <input type="checkbox" checked={selected.includes(option.id)} onChange={() => toggle(option.id)} className="h-5 w-5 shrink-0 accent-[#64263B]" />
            <span>{option.label}</span>
          </label>)}
        </div>
      </fieldset>
      {selected.length > 0 && <p role="status" className="mt-4 text-sm leading-6 text-[#766B67]">Selected: {WORK_TYPES.filter(option => selected.includes(option.id)).map(option => option.label).join(" · ")}</p>}
      {selected.length > 0 && <div className="mt-5 space-y-5">
        {WORK_TYPES.filter(option => selected.includes(option.id)).map(option => <fieldset key={option.id} className="rounded-2xl bg-[#FAF7F0] p-4">
          <legend className="px-1 font-semibold">{option.label}</legend>
          <label className="block text-sm font-medium">{option.workQuestion}
            <input value={details[option.id]?.work || ""} onChange={event => updateDetail(option.id, "work", event.target.value)} maxLength={800} className={field} />
          </label>
          <label className="mt-4 block text-sm font-medium">{option.roleQuestion}
            <input value={details[option.id]?.role || ""} onChange={event => updateDetail(option.id, "role", event.target.value)} maxLength={800} className={field} />
          </label>
        </fieldset>)}
        <fieldset>
          <legend className="font-semibold">{PROFESSION_QUESTION_COPY.goal}</legend>
          <p className="mt-2 text-sm text-[#766B67]">Choose more than one, or select “I am not sure yet”.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ONE_YEAR_GOALS.map(goal => <label key={goal.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#D2B577]/60 p-3">
              <input type="checkbox" checked={goals.includes(goal.id)} onChange={() => toggleGoal(goal.id)} className="h-5 w-5 shrink-0 accent-[#64263B]" />
              <span className="text-sm">{goal.label}</span>
            </label>)}
          </div>
        </fieldset>
        <label className="block text-sm font-medium">{PROFESSION_QUESTION_COPY.goalDetail}
          <textarea value={goalDetail} onChange={event => setGoalDetail(event.target.value)} maxLength={800} rows={3} className={field} />
        </label>
        <label className="block text-sm font-medium">{goals.includes("unsure") ? PROFESSION_QUESTION_COPY.unsureObstacle : PROFESSION_QUESTION_COPY.obstacle}
          <textarea value={obstacle} onChange={event => setObstacle(event.target.value)} maxLength={800} rows={3} className={field} />
        </label>
      </div>}
      <p className="mt-4 text-xs leading-5 text-[#766B67]">Your answers stay on this page and clear when you reload. They do not change the reading above.</p>
    </div>
  </section>
}
