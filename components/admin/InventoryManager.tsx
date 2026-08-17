"use client";

import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { adminFetch } from "@/lib/admin/client";
import type { AdminProductSummary, InventoryMovement } from "@/lib/admin/contracts";
import { AdminHeader, AdminLoading, AdminNotice, fieldClass, primaryButton } from "./AdminUi";

type InventoryPayload = { products: AdminProductSummary[]; movements: InventoryMovement[] };

export default function InventoryManager() {
  const [data, setData] = useState<InventoryPayload | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [delta, setDelta] = useState("");
  const [movementType, setMovementType] = useState<"restock" | "adjustment" | "damage" | "return" | "correction">("restock");
  const [reason, setReason] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "error" | "success" } | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await adminFetch<InventoryPayload>("/api/admin/inventory");
      setData(result);
      setSelectedId((current) => current || result.products.find((item) => item.trackInventory)?.variantId || "");
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Could not load inventory.", tone: "error" });
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminFetch<InventoryPayload>("/api/admin/inventory")
      .then((result) => {
        if (!active) return;
        setData(result);
        setSelectedId(result.products.find((item) => item.trackInventory)?.variantId ?? "");
      })
      .catch((error: unknown) => {
        if (active) setMessage({ text: error instanceof Error ? error.message : "Could not load inventory.", tone: "error" });
      });
    return () => { active = false; };
  }, []);

  const selected = useMemo(() => data?.products.find((item) => item.variantId === selectedId) ?? null, [data, selectedId]);
  const productNames = useMemo(() => new Map(data?.products.map((item) => [item.id, item.name]) ?? []), [data]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const quantityDelta = Number(delta);
      await adminFetch("/api/admin/inventory", {
        method: "POST",
        body: JSON.stringify({
          variantId: selected.variantId,
          movementType,
          quantityDelta,
          reason,
          referenceId: referenceId || null,
          operationId: crypto.randomUUID(),
          expectedVersion: selected.variantVersion,
        }),
      });
      setDelta("");
      setReason("");
      setReferenceId("");
      setMessage({ text: "Stock adjustment recorded.", tone: "success" });
      await load();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Stock could not be adjusted.", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AdminHeader eyebrow="Operations" title="Inventory" description="Every manual stock change is validated, atomic and recorded in an immutable movement ledger." actions={<button type="button" onClick={() => void load()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-semibold"><RefreshCw className="size-4" />Refresh</button>} />
      {message ? <div className="mb-6"><AdminNotice tone={message.tone}>{message.text}</AdminNotice></div> : null}
      {!data ? <AdminLoading label="Loading inventory…" /> : (
        <div className="grid items-start gap-6 xl:grid-cols-[23rem_minmax(0,1fr)]">
          <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-5 xl:sticky xl:top-10">
            <h2 className="font-display text-2xl font-semibold">Record adjustment</h2>
            <p className="mt-2 text-sm leading-6 text-[#746c64]">Use a clear reason and reference so this change can be traced later.</p>
            <div className="mt-6 space-y-5">
              <Label text="Product"><select required value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className={fieldClass}><option value="" disabled>Select product</option>{data.products.filter((item) => item.trackInventory).map((item) => <option key={item.variantId} value={item.variantId}>{item.name} · {item.sku}</option>)}</select></Label>
              {selected ? <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f8f4ee] p-4"><div><p className="text-xs text-[#746c64]">On hand</p><p className="mt-1 font-display text-2xl font-semibold">{selected.stock}</p></div><div><p className="text-xs text-[#746c64]">Available</p><p className="mt-1 font-display text-2xl font-semibold">{Math.max(0, selected.stock - selected.reservedStock)}</p></div></div> : null}
              <Label text="Movement"><select value={movementType} onChange={(event) => setMovementType(event.target.value as typeof movementType)} className={fieldClass}><option value="restock">Restock</option><option value="adjustment">Manual adjustment</option><option value="damage">Damaged stock</option><option value="return">Customer return</option><option value="correction">Count correction</option></select></Label>
              <Label text="Quantity change" hint="Use a negative number to reduce stock."><input required type="number" step={1} value={delta} onChange={(event) => setDelta(event.target.value)} placeholder="e.g. 5 or -1" className={fieldClass} /></Label>
              <Label text="Reason"><textarea required minLength={3} maxLength={500} value={reason} onChange={(event) => setReason(event.target.value)} className={`${fieldClass} min-h-24 py-3`} /></Label>
              <Label text="Reference" hint="Optional purchase order, return or count reference."><input maxLength={100} value={referenceId} onChange={(event) => setReferenceId(event.target.value)} className={fieldClass} /></Label>
              <button type="submit" disabled={busy || !selected} className={`${primaryButton} w-full`}>{busy ? "Recording…" : "Record adjustment"}</button>
            </div>
          </form>

          <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="border-b border-black/10 px-5 py-5 sm:px-6"><h2 className="font-display text-2xl font-semibold">Movement history</h2><p className="mt-1 text-sm text-[#746c64]">Most recent adjustments first.</p></div>
            {data.movements.length ? <div className="divide-y divide-black/10">{data.movements.map((movement) => <article key={movement.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:px-6"><span className={`grid size-9 place-items-center rounded-full ${movement.quantityDelta > 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-[#a43d4d]"}`}>{movement.quantityDelta > 0 ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="truncate text-sm font-semibold">{productNames.get(movement.productId) ?? movement.productId}</p><span className="rounded-full bg-black/5 px-2 py-0.5 text-[.62rem] font-bold uppercase tracking-wider text-[#746c64]">{movement.movementType}</span></div><p className="mt-1 text-xs leading-5 text-[#746c64]">{movement.reason}{movement.referenceId ? ` · ${movement.referenceId}` : ""}</p></div><div className="text-right"><p className={`font-display text-xl font-semibold ${movement.quantityDelta > 0 ? "text-emerald-800" : "text-[#a43d4d]"}`}>{movement.quantityDelta > 0 ? "+" : ""}{movement.quantityDelta}</p><p className="mt-1 text-xs text-[#746c64]">{movement.stockBefore} → {movement.stockAfter} · {new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(movement.occurredAt))}</p></div></article>)}</div> : <p className="px-6 py-12 text-center text-sm text-[#746c64]">No inventory movements have been recorded yet.</p>}
          </section>
        </div>
      )}
    </>
  );
}

function Label({ text, hint, children }: { text: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{text}</span>{children}{hint ? <span className="mt-1.5 block text-xs leading-5 text-[#746c64]">{hint}</span> : null}</label>;
}
