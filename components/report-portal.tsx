<div className="grid gap-4 sm:grid-cols-3">
  <button
    type="button"
    onClick={() =>
      setView('clients')
    }
    className="group rounded-2xl border border-[#e8dfd3] bg-white p-5 text-left transition hover:border-[#d6b47b] hover:shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-[#8e8478]">
          My Clients
        </p>

        <p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">
          {clients.length}
        </p>
      </div>

      <div className="flex size-9 items-center justify-center rounded-xl bg-[#f3eadc] text-[#ad7b40]">
        <Users className="size-[18px]" />
      </div>
    </div>

    <div className="mt-5 flex items-center gap-1.5 border-t border-[#f0ebe4] pt-3 text-xs font-semibold text-[#9a7b4f]">
      View all clients

      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </div>
  </button>

  <button
    type="button"
    onClick={() =>
      setView('reports')
    }
    className="group rounded-2xl border border-[#e8dfd3] bg-white p-5 text-left transition hover:border-[#d6b47b] hover:shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-[#8e8478]">
          Reports
        </p>

        <p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">
          {reports.length}
        </p>
      </div>

      <div className="flex size-9 items-center justify-center rounded-xl bg-[#f3eadc] text-[#ad7b40]">
        <FileText className="size-[18px]" />
      </div>
    </div>

    <div className="mt-5 flex items-center gap-1.5 border-t border-[#f0ebe4] pt-3 text-xs font-semibold text-[#9a7b4f]">
      View reports

      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </div>
  </button>

  <div className="rounded-2xl border border-[#e8dfd3] bg-white p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-[#8e8478]">
          In Progress
        </p>

        <p className="mt-3 font-serif text-3xl font-semibold text-[#24354c]">
          {processing}
        </p>
      </div>

      <div className="flex size-9 items-center justify-center rounded-xl bg-[#f3eadc] text-[#ad7b40]">
        <Clock3 className="size-[18px]" />
      </div>
    </div>

    <p className="mt-5 border-t border-[#f0ebe4] pt-3 text-xs text-[#9a8d7e]">
      Reports currently processing
    </p>
  </div>
</div>