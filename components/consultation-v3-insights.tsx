import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

type Props = {
  insights:
    readonly EmployeeInsight[]
}

export function ConsultationV3Insights({
  insights,
}: Props) {
  if (insights.length === 0) {
    return (
      <div className="rounded-xl bg-[#f8f4ed] p-4">
        <p className="text-xs leading-5 text-[#776d61]">
          No V3 employee insights are
          currently available.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {insights
        .slice(0, 5)
        .map((insight, index) => (
          <div
            key={insight.id}
            className="rounded-xl bg-[#f8f4ed] p-3"
          >
            <div className="flex gap-3">
              <span className="font-semibold text-[#ad7b40]">
                {index + 1}.
              </span>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#24354c]">
                  {insight.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#776d61]">
                  {insight.statement}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {insight.strength && (
                    <InsightTag
                      text={
                        insight.strength
                      }
                    />
                  )}

                  {insight.relationship && (
                    <InsightTag
                      text={
                        insight.relationship
                      }
                    />
                  )}

                  {insight
                    .developmentSignificance &&
                    insight
                      .developmentSignificance !==
                      'NONE' && (
                      <InsightTag
                        text={
                          `Development: ${insight.developmentSignificance}`
                        }
                      />
                    )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

function InsightTag({
  text,
}: {
  text: string
}) {
  return (
    <span className="rounded-full border border-[#e3d8c9] bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#8b7658]">
      {text.replaceAll('_', ' ')}
    </span>
  )
}