import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export type LegalSection = {
  title: string;
  copy: string;
};

export default function LegalPage({
  eyebrow,
  title,
  introduction,
  sections,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-light-100 text-dark-900">
      <header className="bg-dark-900 px-4 py-14 text-light-100 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[76rem]">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] text-white/58 transition-colors hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
            Return home
          </Link>
          <p className="mt-10 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-champagne">
            <ShieldCheck aria-hidden="true" className="size-4" strokeWidth={1.5} />
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-[11ch] font-display text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[0.84] tracking-[-0.055em]">
            {title}
          </h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-[76rem] gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(15rem,.55fr)_minmax(0,1.45fr)] lg:gap-20 lg:px-8 lg:py-24">
        <aside>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-oxblood">
            Portfolio notice
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-dark-700">
            Aurelle is a fictional portfolio concept. This plain-language page is
            illustrative and should be reviewed before any production launch.
          </p>
        </aside>

        <article>
          <p className="max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.15] tracking-[-0.025em]">
            {introduction}
          </p>
          <div className="mt-12 divide-y divide-dark-900/12 border-y border-dark-900/12">
            {sections.map((section, index) => (
              <section key={section.title} className="grid gap-4 py-7 sm:grid-cols-[2.5rem_1fr] sm:py-9">
                <span className="text-[0.65rem] font-bold text-champagne">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-display text-[1.65rem] font-semibold tracking-[-0.02em]">
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-dark-700">
                    {section.copy}
                  </p>
                </div>
              </section>
            ))}
          </div>
          <a
            href="mailto:concierge@aurelle.com.au"
            className="mt-9 inline-flex min-h-12 items-center rounded-full bg-oxblood px-6 text-xs font-bold text-white transition-colors hover:bg-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
          >
            Contact the concierge
          </a>
        </article>
      </div>
    </main>
  );
}
