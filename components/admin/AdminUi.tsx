import type { ReactNode } from "react";

export function AdminHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#5b2333]">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#746c64]">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

export function AdminNotice({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "success" | "info" }) {
  const colors = tone === "success" ? "border-emerald-800/20 bg-emerald-50 text-emerald-900" : tone === "info" ? "border-blue-800/20 bg-blue-50 text-blue-900" : "border-red-800/20 bg-red-50 text-red-900";
  return <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm leading-6 ${colors}`}>{children}</div>;
}

export function AdminLoading({ label = "Loading…" }: { label?: string }) {
  return <div role="status" className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-[#746c64]">{label}</div>;
}

export const primaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#171411] px-5 text-sm font-semibold text-white transition hover:bg-[#5b2333] disabled:cursor-wait disabled:opacity-50";
export const secondaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-semibold transition hover:bg-[#f8f4ee] disabled:cursor-wait disabled:opacity-50";
export const fieldClass = "min-h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm outline-none transition placeholder:text-black/35 focus:border-[#5b2333] focus:ring-2 focus:ring-[#5b2333]/15 disabled:bg-black/[.03]";
export const textareaClass = `${fieldClass} min-h-28 py-3`;

