import { ArrowLeft, Diamond, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="relative flex min-h-[72vh] items-center justify-center overflow-hidden bg-[#171411] px-4 py-20 text-[#F8F4EE] sm:px-6 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-48 size-[34rem] rounded-full border border-[#C2A36B]/13"
      />
      <div
        aria-hidden="true"
        className="absolute -right-22 -top-28 size-[22rem] rounded-full border border-[#C2A36B]/20"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-56 -left-36 size-[34rem] rounded-full bg-[#5B2333]/45 blur-[110px]"
      />

      <div className="relative z-10 w-full max-w-3xl border border-white/10 bg-white/[0.045] p-7 text-center shadow-[0_35px_110px_rgba(0,0,0,.34)] backdrop-blur-md sm:p-12 lg:p-16">
        <span className="mx-auto flex size-14 rotate-45 items-center justify-center border border-[#C2A36B]/55 bg-[#C2A36B]/8 text-[#C2A36B]">
          <Diamond
            aria-hidden="true"
            className="size-6 -rotate-45"
            strokeWidth={1.35}
          />
        </span>
        <p className="mt-9 flex items-center justify-center gap-3 text-footnote font-semibold uppercase tracking-[0.22em] text-[#C2A36B]">
          <span aria-hidden="true" className="h-px w-7 bg-[#C2A36B]/55" />
          Piece unavailable
          <span aria-hidden="true" className="h-px w-7 bg-[#C2A36B]/55" />
        </p>
        <h1 className="mx-auto mt-4 max-w-[12ch] font-serif text-[clamp(2.7rem,8vw,5.5rem)] leading-[0.92] tracking-[-0.055em]">
          This piece has left the collection.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-body leading-7 text-white/58">
          It may have found its forever home or returned to our private archive.
          Explore the current collection to discover another piece worth keeping.
        </p>
        <Link
          href="/products"
          className="group mt-9 inline-flex min-h-13 items-center gap-2.5 rounded-full bg-[#F8F4EE] px-7 text-caption font-semibold text-[#171411] shadow-[0_14px_35px_rgba(0,0,0,.18)] transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#C2A36B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2A36B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171411] active:translate-y-0 motion-reduce:transition-none"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
            strokeWidth={1.7}
          />
          Return to the collection
        </Link>

        <p className="mt-8 flex items-center justify-center gap-2 text-[0.65rem] uppercase tracking-[0.18em] text-white/28">
          <Sparkles aria-hidden="true" className="size-3.5 text-[#C2A36B]/55" />
          Aurelle fine jewellery
        </p>
      </div>
    </main>
  );
}
