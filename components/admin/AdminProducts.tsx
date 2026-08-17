"use client";

import { Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { adminFetch } from "@/lib/admin/client";
import type { AdminProductSummary } from "@/lib/admin/contracts";
import { AdminHeader, AdminLoading, AdminNotice, fieldClass, primaryButton } from "./AdminUi";

const currency = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProductSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let active = true;
    adminFetch<{ products: AdminProductSummary[] }>("/api/admin/products")
      .then((result) => active && setProducts(result.products))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Could not load products."));
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (products ?? []).filter((product) => {
      const matchesQuery = !query || [product.name, product.sku, product.slug].some((value) => value.toLowerCase().includes(query));
      return matchesQuery && (status === "all" || product.status === status);
    });
  }, [products, search, status]);

  return (
    <>
      <AdminHeader eyebrow="Catalogue" title="Products" description="Create, review, publish and archive the products sold by Aurelle." actions={<Link href="/admin/products/new" className={primaryButton}><Plus className="size-4" />Add product</Link>} />
      {error ? <AdminNotice>{error}</AdminNotice> : null}
      {!products && !error ? <AdminLoading label="Loading products…" /> : null}
      {products ? (
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="grid gap-3 border-b border-black/10 p-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:p-5">
            <label className="relative"><span className="sr-only">Search products</span><Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#746c64]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, SKU or slug" className={`${fieldClass} pl-10`} /></label>
            <label><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClass}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left">
              <thead className="bg-[#f8f4ee] text-[.68rem] uppercase tracking-[.12em] text-[#746c64]"><tr><th className="px-5 py-3 font-bold">Product</th><th className="px-5 py-3 font-bold">Status</th><th className="px-5 py-3 font-bold">Price</th><th className="px-5 py-3 font-bold">Available</th><th className="px-5 py-3 font-bold">Updated</th><th className="px-5 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-black/10">
                {visible.map((product) => (
                  <tr key={product.id} className="hover:bg-black/[.015]">
                    <td className="px-5 py-4"><div className="flex items-center gap-3">{product.imageUrl ? <Image src={product.imageUrl} alt={product.imageAlt ?? ""} width={48} height={48} unoptimized className="size-12 rounded-lg bg-[#f8f4ee] object-cover" /> : <span className="grid size-12 place-items-center rounded-lg bg-[#f8f4ee] text-[.6rem] uppercase text-[#746c64]">No image</span>}<div className="min-w-0"><p className="max-w-xs truncate text-sm font-semibold">{product.name}</p><p className="mt-1 text-xs text-[#746c64]">{product.sku}</p></div></div></td>
                    <td className="px-5 py-4"><Status value={product.status} /></td>
                    <td className="px-5 py-4 text-sm font-semibold">{currency.format(product.priceCents / 100)}</td>
                    <td className="px-5 py-4 text-sm"><span className={product.trackInventory && product.stock - product.reservedStock <= product.lowStockThreshold ? "font-bold text-[#a43d4d]" : "font-semibold"}>{product.trackInventory ? Math.max(0, product.stock - product.reservedStock) : "Made to order"}</span></td>
                    <td className="px-5 py-4 text-sm text-[#746c64]">{new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(new Date(product.updatedAt))}</td>
                    <td className="px-5 py-4 text-right"><Link href={`/admin/products/${product.id}/edit`} className="text-sm font-bold text-[#5b2333] hover:underline">Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visible.length === 0 ? <p className="px-6 py-12 text-center text-sm text-[#746c64]">No products match this view.</p> : null}
        </section>
      ) : null}
    </>
  );
}

function Status({ value }: { value: AdminProductSummary["status"] }) {
  const color = value === "published" ? "bg-emerald-50 text-emerald-800" : value === "archived" ? "bg-black/5 text-[#746c64]" : "bg-amber-50 text-amber-800";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[.68rem] font-bold uppercase tracking-[.1em] ${color}`}>{value}</span>;
}

