"use client";

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

import { adminFetch } from "@/lib/admin/client";
import type { AuditEntry } from "@/lib/admin/contracts";
import { AdminHeader, AdminLoading, AdminNotice } from "./AdminUi";

export default function AdminActivity() {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminFetch<{ entries: AuditEntry[] }>("/api/admin/activity")
      .then((result) => active && setEntries(result.entries))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Could not load activity."));
    return () => { active = false; };
  }, []);

  return (
    <>
      <AdminHeader eyebrow="Governance" title="Activity" description="An append-only record of important catalogue, media and inventory actions." />
      {error ? <AdminNotice>{error}</AdminNotice> : null}
      {!entries && !error ? <AdminLoading label="Loading activity…" /> : null}
      {entries ? <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">{entries.length ? <ol className="divide-y divide-black/10">{entries.map((entry) => <li key={entry.id} className="grid gap-3 px-5 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:px-6"><span className="grid size-9 place-items-center rounded-full bg-[#f8f4ee] text-[#5b2333]"><Activity className="size-4" /></span><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{entry.summary}</p><span className="rounded-full bg-black/5 px-2 py-0.5 text-[.62rem] font-bold uppercase tracking-wider text-[#746c64]">{entry.entityType}</span></div><p className="mt-1 text-xs text-[#746c64]">Action: {entry.action} · Actor: {entry.actorUserId}</p></div><time dateTime={entry.occurredAt} className="text-xs text-[#746c64]">{new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.occurredAt))}</time></li>)}</ol> : <p className="px-6 py-12 text-center text-sm text-[#746c64]">No admin activity has been recorded yet.</p>}</section> : null}
    </>
  );
}

