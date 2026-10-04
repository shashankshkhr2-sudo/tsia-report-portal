import type { Client } from '@/lib/portal-types'

type Props = {
  client: Client
}

export function ClientCard({ client }: Props) {
  return (
    <article className="rounded-2xl border border-[#e8dfd3] bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f3eadc] font-semibold text-[#8d744f]">
          {client.initials}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[#24354c]">
            {client.name}
          </h3>

          <p className="truncate text-sm text-[#81776b]">
            {client.phone || 'No phone'}
          </p>

          <p className="truncate text-xs text-[#9b9186]">
            {client.email || 'No email'}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#9b9186]">
        Joined: {client.joined || '—'}
      </p>
    </article>
  )
}