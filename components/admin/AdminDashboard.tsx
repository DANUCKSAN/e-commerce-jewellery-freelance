"use client";

import { AlertTriangle, ArrowRight, Boxes, CircleDollarSign, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { adminFetch } from "@/lib/admin/client";
import type { AdminProductSummary } from "@/lib/admin/contracts";
import { AdminHeader, AdminLoading, AdminNotice, primaryButton } from "./AdminUi";

const currency = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export default function AdminDashboard() {
  const [products, setProducts] = useState<AdminProductSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminFetch<{ products: AdminProductSummary[] }>("/api/admin/products")
      .then((result) => active && setProducts(result.products))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Could not load overview."));
    return () => { active = false; };
  }, []);

  const published = products?.filter((item) => item.status === "published").length ?? 0;
  const lowStock = products?.filter((item) => item.trackInventory && item.stock - item.reservedStock <= item.lowStockThreshold).length ?? 0;
  const inventoryValue = products?.reduce((total, item) => total + item.priceCents * Math.max(0, item.stock - item.reservedStock), 0) ?? 0;

  return (
    <>
      <AdminHeader
        eyebrow="Store operations"
        title="Overview"
        description="A clear view of catalogue readiness and stock that needs attention."
        actions={<Link href="/admin/products/new" className={primaryButton}>Add product <ArrowRight className="size-4" /></Link>}
      />
      {error ? <AdminNotice>{error}</AdminNotice> : null}
      {!products && !error ? <AdminLoading label="Loading store overview…" /> : null}
      {products ? (
        <div className="space-y-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Store summary">
            <Metric icon={Boxes} label="All products" value={String(products.length)} detail="Draft, live and archived" />
            <Metric icon={PackageCheck} label="Published" value={String(published)} detail="Visible on the storefront" />
            <Metric icon={AlertTriangle} label="Stock alerts" value={String(lowStock)} detail="At or below threshold" warning={lowStock > 0} />
            <Metric icon={CircleDollarSign} label="Stock value" value={currency.format(inventoryValue / 100)} detail="At current retail prices" />
          </section>
          <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6">
              <div><h2 className="font-display text-2xl font-semibold">Needs attention</h2><p className="mt-1 text-sm text-[#746c64]">Tracked products with low or unavailable stock.</p></div>
              <Link href="/admin/inventory" className="text-sm font-semibold text-[#5b2333] hover:underline">Manage inventory</Link>
            </div>
            {products.filter((item) => item.trackInventory && item.stock - item.reservedStock <= item.lowStockThreshold).length ? (
              <div className="divide-y divide-black/10">
                {products.filter((item) => item.trackInventory && item.stock - item.reservedStock <= item.lowStockThreshold).slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                    <div className="min-w-0"><p className="truncate text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-[#746c64]">{item.sku}</p></div>
                    <div className="text-right"><p className="text-sm font-bold text-[#a43d4d]">{Math.max(0, item.stock - item.reservedStock)} available</p><p className="mt-1 text-xs text-[#746c64]">Threshold {item.lowStockThreshold}</p></div>
                  </div>
                ))}
              </div>
            ) : <p className="px-6 py-10 text-center text-sm text-[#746c64]">No stock alerts. Everything looks healthy.</p>}
          </section>
        </div>
      ) : null}
    </>
  );
}

function Metric({ icon: Icon, label, value, detail, warning = false }: { icon: typeof Boxes; label: string; value: string; detail: string; warning?: boolean }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(23,20,17,.035)]">
      <div className={`grid size-10 place-items-center rounded-xl ${warning ? "bg-red-50 text-[#a43d4d]" : "bg-[#f8f4ee] text-[#5b2333]"}`}><Icon className="size-5" /></div>
      <p className="mt-5 text-sm font-semibold text-[#746c64]">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-xs text-[#746c64]">{detail}</p>
    </article>
  );
}

