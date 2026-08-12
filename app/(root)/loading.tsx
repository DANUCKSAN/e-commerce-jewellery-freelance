export default function StorefrontLoading() {
  return (
    <main
      className="min-h-[calc(100svh-4.75rem)] bg-[#F8F4EE] font-jost"
      aria-label="Loading the Aurelle collection"
      aria-busy="true"
    >
      <section className="overflow-hidden bg-[#171411] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[94rem] animate-pulse motion-reduce:animate-none">
          <div className="h-2.5 w-40 rounded-full bg-[#C2A36B]/22" />
          <div className="mt-7 h-18 max-w-2xl rounded-2xl bg-white/8 sm:h-28" />
          <div className="mt-5 h-4 max-w-xl rounded-full bg-white/6" />
          <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-22 rounded-xl border border-white/6 bg-white/[0.045]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[94rem] animate-pulse motion-reduce:animate-none">
          <div className="flex items-end justify-between gap-8">
            <div className="w-full max-w-xl">
              <div className="h-2.5 w-28 rounded-full bg-[#5B2333]/12" />
              <div className="mt-5 h-12 max-w-lg rounded-xl bg-[#171411]/8 sm:h-16" />
            </div>
            <div className="hidden h-11 w-32 rounded-full border border-[#171411]/8 sm:block" />
          </div>
          <div className="mt-9 h-24 rounded-[1.25rem] border border-[#171411]/7 bg-white/55 sm:h-28" />
          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[0.82] rounded-[1.4rem] bg-[#171411]/7" />
                <div className="mt-4 h-3 w-2/3 rounded-full bg-[#171411]/8" />
                <div className="mt-3 h-2.5 w-1/3 rounded-full bg-[#C2A36B]/20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
