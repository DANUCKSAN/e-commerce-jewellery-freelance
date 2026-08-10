import Link from "next/link";

export interface BrandMarkProps {
  className?: string;
  light?: boolean;
  compact?: boolean;
}

export function BrandMark({
  className = "",
  light = false,
  compact = false,
}: BrandMarkProps) {
  const ink = light ? "text-light-100" : "text-dark-900";

  return (
    <Link
      href="/"
      aria-label="Aurelle home"
      className={`group inline-flex items-center gap-2.5 rounded-md ${ink} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-4 ${light ? "focus-visible:ring-offset-dark-900" : "focus-visible:ring-offset-light-100"} ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="size-9 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-[-5deg]"
        fill="none"
      >
        <path d="M20 2.5 36.5 20 20 37.5 3.5 20 20 2.5Z" stroke="currentColor" strokeWidth="1" />
        <path d="m11.5 28 8.35-18 8.65 18M15 21.5h10" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="20" cy="20" r="2" fill="#C2A36B" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.38rem] font-semibold tracking-[0.16em]">
          AURELLE
        </span>
        {!compact ? (
          <span className="mt-1 block text-[0.53rem] font-semibold uppercase tracking-[0.31em] opacity-55">
            Fine Jewellery
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export default BrandMark;
