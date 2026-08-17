import { RotateCw } from "lucide-react";

type CatalogueUnavailableProps = {
  compact?: boolean;
};

export default function CatalogueUnavailable({
  compact = false,
}: CatalogueUnavailableProps) {
  return (
    <section
      aria-labelledby="catalogue-unavailable-heading"
      className={
        compact
          ? "bg-light-100 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
          : "flex min-h-[65vh] items-center bg-light-100 px-4 py-20 sm:px-6 lg:px-8"
      }
    >
      <div className="mx-auto w-full max-w-[94rem] border border-dark-900/12 bg-light-200 p-7 sm:p-10">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-oxblood">
          Collection temporarily unavailable
        </p>
        <h2
          id="catalogue-unavailable-heading"
          className="mt-3 max-w-[14ch] font-display text-[clamp(2.7rem,5vw,5rem)] font-medium leading-[0.9] tracking-[-0.045em]"
        >
          Our pieces are being prepared.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-dark-700">
          We couldn&apos;t load the collection just now. Please try again
          shortly.
        </p>
        <a
          href=""
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-dark-900 px-5 text-xs font-bold text-white transition-colors hover:bg-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
        >
          <RotateCw aria-hidden="true" className="size-4" />
          Try again
        </a>
      </div>
    </section>
  );
}
