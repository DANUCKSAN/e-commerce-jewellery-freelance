"use client";

import { Archive, ArrowLeft, ImagePlus, Plus, Save, Send, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AdminClientError, adminFetch } from "@/lib/admin/client";
import type { AdminProduct, AdminProductInput } from "@/lib/admin/contracts";
import { AdminHeader, AdminLoading, AdminNotice, fieldClass, primaryButton, secondaryButton, textareaClass } from "./AdminUi";

const categories = [
  ["diamond", "Diamond"],
  ["gold", "Gold"],
  ["silver", "Silver"],
  ["platinum", "Platinum"],
] as const;
const productTypes = [
  ["ring", "Ring"],
  ["earrings", "Earrings"],
  ["bracelet", "Bracelet"],
  ["necklace", "Necklace"],
  ["pendant", "Pendant"],
] as const;
const metalOptions = [
  ["18k-yellow-gold", "18k yellow gold"],
  ["18k-white-gold", "18k white gold"],
  ["18k-rose-gold", "18k rose gold"],
  ["sterling-silver", "Sterling silver"],
  ["950-platinum", "950 platinum"],
] as const;

const emptyProduct: AdminProductInput = {
  name: "",
  slug: "",
  category: "gold",
  productType: "ring",
  productTypeLabel: "Ring",
  shortDescription: "",
  description: "",
  brand: "Aurelle",
  material: "",
  metals: ["18k-yellow-gold"],
  gemstones: [],
  specification: "",
  modelNumber: null,
  manufacturerPartNumber: null,
  taxInclusive: true,
  featured: false,
  sortOrder: 0,
  seoTitle: null,
  seoDescription: null,
  variant: {
    name: "Default",
    sku: "",
    priceCents: 0,
    currency: "AUD",
    weightG: null,
    leadTimeDays: 3,
    active: true,
    trackInventory: true,
    lowStockThreshold: 2,
  },
  attributes: [],
};

export default function ProductEditor({ productId }: { productId?: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<AdminProductInput>(emptyProduct);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "error" | "success" | "info" } | null>(null);
  const slugTouched = useRef(Boolean(productId));

  useEffect(() => {
    if (!productId) return;
    let active = true;
    adminFetch<{ product: AdminProduct }>(`/api/admin/products/${encodeURIComponent(productId)}`)
      .then(({ product: value }) => {
        if (!active) return;
        setProduct(value);
        setDraft(toDraft(value));
      })
      .catch((reason: unknown) => active && setMessage({ text: errorMessage(reason), tone: "error" }))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [productId]);

  function update<K extends keyof AdminProductInput>(key: K, value: AdminProductInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateVariant<K extends keyof AdminProductInput["variant"]>(key: K, value: AdminProductInput["variant"][K]) {
    setDraft((current) => ({ ...current, variant: { ...current.variant, [key]: value } }));
  }

  function updateName(value: string) {
    setDraft((current) => ({
      ...current,
      name: value,
      slug: slugTouched.current ? current.slug : slugify(value),
      seoTitle: current.seoTitle || value,
    }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    try {
      const path = productId ? `/api/admin/products/${encodeURIComponent(productId)}` : "/api/admin/products";
      const result = await adminFetch<{ product: AdminProduct }>(path, {
        method: productId ? "PUT" : "POST",
        body: JSON.stringify(draft),
      });
      setProduct(result.product);
      setDraft(toDraft(result.product));
      setMessage({ text: "Product details saved.", tone: "success" });
      if (!productId) router.replace(`/admin/products/${result.product.id}/edit`);
    } catch (reason) {
      setMessage({ text: errorMessage(reason), tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(status: AdminProduct["status"]) {
    if (!product || saving) return;
    if (status === "archived" && !window.confirm("Archive this product? It will be removed from the storefront.")) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await adminFetch<{ product: AdminProduct }>(`/api/admin/products/${product.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, expectedVersion: product.version }),
      });
      setProduct(result.product);
      setDraft(toDraft(result.product));
      setMessage({ text: `Product is now ${status}.`, tone: "success" });
    } catch (reason) {
      setMessage({ text: errorMessage(reason), tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product || saving) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSaving(true);
    setMessage(null);
    try {
      const result = await adminFetch<{ product: AdminProduct }>(`/api/admin/products/${product.id}/media`, { method: "POST", body: form });
      setProduct(result.product);
      setDraft(toDraft(result.product));
      formElement.reset();
      setMessage({ text: "Product image uploaded and set as primary.", tone: "success" });
    } catch (reason) {
      setMessage({ text: errorMessage(reason), tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function removeImage(mediaId: string) {
    if (!product || saving || !window.confirm("Remove this image?")) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await adminFetch<{ product: AdminProduct }>(`/api/admin/products/${product.id}/media/${mediaId}`, { method: "DELETE" });
      setProduct(result.product);
      setDraft(toDraft(result.product));
      setMessage({ text: "Image removed.", tone: "success" });
    } catch (reason) {
      setMessage({ text: errorMessage(reason), tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading label="Loading product…" />;

  return (
    <>
      <Link href="/admin/products" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#746c64] hover:text-[#171411]"><ArrowLeft className="size-4" />All products</Link>
      <AdminHeader
        eyebrow={product ? `${product.status} · ${product.variant.sku}` : "New draft"}
        title={product ? product.name : "Add product"}
        description={product ? "Keep catalogue, merchandising and fulfilment details accurate." : "Create the product as a draft. Add imagery and review it before publishing."}
        actions={product ? <StatusActions product={product} busy={saving} changeStatus={changeStatus} /> : undefined}
      />
      {message ? <div className="mb-6"><AdminNotice tone={message.tone}>{message.text}</AdminNotice></div> : null}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <form id="product-details" onSubmit={save} className="space-y-6">
          <Section title="Identity" description="The customer-facing name, URL and merchandising position.">
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Product name"><input required minLength={2} maxLength={220} value={draft.name} onChange={(event) => updateName(event.target.value)} className={fieldClass} /></Field><Field label="URL slug" hint="Lower-case letters, numbers and hyphens."><input required value={draft.slug} onChange={(event) => { slugTouched.current = true; update("slug", slugify(event.target.value)); }} className={fieldClass} /></Field></div>
            <div className="grid gap-5 sm:grid-cols-3"><Field label="Category"><select value={draft.category} onChange={(event) => update("category", event.target.value as AdminProductInput["category"])} className={fieldClass}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Product type"><select value={draft.productType} onChange={(event) => { const value = event.target.value as AdminProductInput["productType"]; const label = productTypes.find(([key]) => key === value)?.[1] ?? value; update("productType", value); update("productTypeLabel", label); }} className={fieldClass}>{productTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Sort order"><input type="number" min={0} value={draft.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} className={fieldClass} /></Field></div>
            <Field label="Short description" hint="Used on product cards and search previews."><textarea required minLength={10} maxLength={1200} value={draft.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} className={textareaClass} /></Field>
            <Field label="Full description"><textarea required minLength={20} value={draft.description} onChange={(event) => update("description", event.target.value)} className={`${textareaClass} min-h-44`} /></Field>
          </Section>

          <Section title="Materials & specification" description="Precise product facts customers can rely on.">
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Brand"><input required value={draft.brand} onChange={(event) => update("brand", event.target.value)} className={fieldClass} /></Field><Field label="Material summary"><input required value={draft.material} onChange={(event) => update("material", event.target.value)} className={fieldClass} /></Field></div>
            <fieldset><legend className="text-sm font-semibold">Metals</legend><div className="mt-2 flex flex-wrap gap-2">{metalOptions.map(([value, label]) => { const selected = draft.metals.includes(value); return <label key={value} className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold ${selected ? "border-[#5b2333] bg-[#5b2333] text-white" : "border-black/15 bg-white"}`}><input type="checkbox" className="sr-only" checked={selected} onChange={() => update("metals", selected ? draft.metals.filter((item) => item !== value) : [...draft.metals, value])} />{label}</label>; })}</div></fieldset>
            <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.gemstones.includes("diamond")} onChange={(event) => update("gemstones", event.target.checked ? ["diamond"] : [])} className="size-4 accent-[#5b2333]" />Contains diamond</label>
            <Field label="Specification"><input required value={draft.specification} onChange={(event) => update("specification", event.target.value)} className={fieldClass} /></Field>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Model number" optional><input value={draft.modelNumber ?? ""} onChange={(event) => update("modelNumber", event.target.value || null)} className={fieldClass} /></Field><Field label="Manufacturer part number" optional><input value={draft.manufacturerPartNumber ?? ""} onChange={(event) => update("manufacturerPartNumber", event.target.value || null)} className={fieldClass} /></Field></div>
          </Section>

          <Section title="Price & fulfilment" description="Stock changes are recorded separately in the inventory ledger.">
            <div className="grid gap-5 sm:grid-cols-3"><Field label="SKU"><input required value={draft.variant.sku} onChange={(event) => updateVariant("sku", event.target.value.toUpperCase())} className={fieldClass} /></Field><Field label="Price (AUD)"><input required type="number" min={0} step="0.01" value={(draft.variant.priceCents / 100).toFixed(2)} onChange={(event) => updateVariant("priceCents", Math.round(Number(event.target.value) * 100))} className={fieldClass} /></Field><Field label="Weight (g)" optional><input type="number" min={0} step="0.01" value={draft.variant.weightG ?? ""} onChange={(event) => updateVariant("weightG", event.target.value ? Number(event.target.value) : null)} className={fieldClass} /></Field></div>
            <div className="grid gap-5 sm:grid-cols-3"><Field label="Lead time (days)"><input type="number" min={0} max={365} value={draft.variant.leadTimeDays} onChange={(event) => updateVariant("leadTimeDays", Number(event.target.value))} className={fieldClass} /></Field><Field label="Inventory mode"><select value={draft.variant.trackInventory ? "tracked" : "made-to-order"} onChange={(event) => updateVariant("trackInventory", event.target.value === "tracked")} className={fieldClass}><option value="tracked">Track stock</option><option value="made-to-order">Made to order</option></select></Field><Field label="Low-stock threshold"><input type="number" min={0} value={draft.variant.lowStockThreshold} disabled={!draft.variant.trackInventory} onChange={(event) => updateVariant("lowStockThreshold", Number(event.target.value))} className={fieldClass} /></Field></div>
            {product ? <div className="rounded-xl bg-[#f8f4ee] px-4 py-3 text-sm"><span className="font-semibold">Current stock: {product.variant.stock}</span><span className="mx-2 text-black/25">·</span><Link href="/admin/inventory" className="font-bold text-[#5b2333] hover:underline">Adjust in inventory</Link></div> : null}
            <div className="flex flex-wrap gap-6"><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.variant.active} onChange={(event) => updateVariant("active", event.target.checked)} className="size-4 accent-[#5b2333]" />Variant active</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.taxInclusive} onChange={(event) => update("taxInclusive", event.target.checked)} className="size-4 accent-[#5b2333]" />Price includes tax</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.featured} onChange={(event) => update("featured", event.target.checked)} className="size-4 accent-[#5b2333]" />Featured product</label></div>
          </Section>

          <Section title="Product attributes" description="Structured details shown on the product page.">
            <div className="space-y-3">{draft.attributes.map((attribute, index) => <div key={attribute.id ?? index} className="grid gap-3 rounded-xl border border-black/10 bg-[#f8f4ee]/60 p-3 sm:grid-cols-[1fr_1fr_1.2fr_.6fr_auto]"><input aria-label={`Attribute ${index + 1} code`} placeholder="code" value={attribute.code} onChange={(event) => updateAttribute(index, "code", slugify(event.target.value))} className={fieldClass} /><input aria-label={`Attribute ${index + 1} name`} placeholder="Label" value={attribute.name} onChange={(event) => updateAttribute(index, "name", event.target.value)} className={fieldClass} /><input aria-label={`Attribute ${index + 1} value`} placeholder="Value" value={attribute.value} onChange={(event) => updateAttribute(index, "value", event.target.value)} className={fieldClass} /><input aria-label={`Attribute ${index + 1} unit`} placeholder="Unit" value={attribute.unitSymbol ?? ""} onChange={(event) => updateAttribute(index, "unitSymbol", event.target.value || null)} className={fieldClass} /><button type="button" aria-label={`Remove attribute ${index + 1}`} onClick={() => update("attributes", draft.attributes.filter((_, itemIndex) => itemIndex !== index))} className="grid size-11 place-items-center rounded-xl text-[#a43d4d] hover:bg-red-50"><Trash2 className="size-4" /></button></div>)}</div>
            <button type="button" onClick={() => update("attributes", [...draft.attributes, { code: "", name: "", value: "", unitSymbol: null }])} className={secondaryButton}><Plus className="size-4" />Add attribute</button>
          </Section>

          <Section title="Search preview" description="Optional metadata used for search engines and sharing.">
            <Field label="SEO title" optional><input maxLength={220} value={draft.seoTitle ?? ""} onChange={(event) => update("seoTitle", event.target.value || null)} className={fieldClass} /></Field><Field label="SEO description" optional><textarea maxLength={500} value={draft.seoDescription ?? ""} onChange={(event) => update("seoDescription", event.target.value || null)} className={textareaClass} /></Field>
          </Section>
        </form>

        <aside className="space-y-6 xl:sticky xl:top-10">
          <section className="rounded-2xl border border-black/10 bg-white p-5"><h2 className="font-display text-2xl font-semibold">Save changes</h2><p className="mt-2 text-sm leading-6 text-[#746c64]">Saving does not publish a draft. Review imagery and details, then publish explicitly.</p><button form="product-details" type="submit" disabled={saving} className={`${primaryButton} mt-5 w-full`}><Save className="size-4" />{saving ? "Saving…" : product ? "Save product" : "Create draft"}</button></section>
          <section className="rounded-2xl border border-black/10 bg-white p-5"><h2 className="font-display text-2xl font-semibold">Images</h2>{!product ? <p className="mt-2 text-sm leading-6 text-[#746c64]">Create the draft first, then upload product images.</p> : <><div className="mt-4 grid grid-cols-2 gap-3">{product.media.map((media) => <figure key={media.id} className="group relative overflow-hidden rounded-xl bg-[#f8f4ee]"><Image src={media.url} alt={media.altText} width={240} height={240} unoptimized className="aspect-square w-full object-cover" />{media.isPrimary ? <span className="absolute left-2 top-2 rounded-full bg-[#171411] px-2 py-1 text-[.58rem] font-bold uppercase tracking-wider text-white">Primary</span> : null}<button type="button" aria-label={`Remove ${media.altText}`} disabled={saving} onClick={() => removeImage(media.id)} className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-white text-[#a43d4d] shadow"><Trash2 className="size-4" /></button></figure>)}</div><form onSubmit={uploadImage} className="mt-5 space-y-3"><Field label="Image file"><input required name="file" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-[#f8f4ee] file:px-3 file:py-2 file:font-semibold" /></Field><Field label="Alternative text"><input required minLength={3} maxLength={300} name="altText" defaultValue={`${draft.name} by Aurelle`} className={fieldClass} /></Field><button type="submit" disabled={saving} className={`${secondaryButton} w-full`}><ImagePlus className="size-4" />Upload image</button></form></>}</section>
        </aside>
      </div>
    </>
  );

  function updateAttribute(index: number, key: "code" | "name" | "value" | "unitSymbol", value: string | null) {
    update("attributes", draft.attributes.map((attribute, itemIndex) => itemIndex === index ? { ...attribute, [key]: value } : attribute));
  }
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"><div className="mb-6 border-b border-black/10 pb-5"><h2 className="font-display text-2xl font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-[#746c64]">{description}</p></div><div className="space-y-5">{children}</div></section>;
}

function Field({ label, hint, optional, children }: { label: string; hint?: string; optional?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold"><span>{label}</span>{optional ? <span className="text-xs font-normal text-[#746c64]">Optional</span> : null}</span>{children}{hint ? <span className="mt-1.5 block text-xs text-[#746c64]">{hint}</span> : null}</label>;
}

function StatusActions({ product, busy, changeStatus }: { product: AdminProduct; busy: boolean; changeStatus: (status: AdminProduct["status"]) => void }) {
  if (product.status === "published") return <><button type="button" disabled={busy} onClick={() => changeStatus("draft")} className={secondaryButton}>Unpublish</button><button type="button" disabled={busy} onClick={() => changeStatus("archived")} className={secondaryButton}><Archive className="size-4" />Archive</button></>;
  if (product.status === "archived") return <button type="button" disabled={busy} onClick={() => changeStatus("draft")} className={secondaryButton}>Restore to draft</button>;
  return <><button type="button" disabled={busy} onClick={() => changeStatus("archived")} className={secondaryButton}><Archive className="size-4" />Archive</button><button type="button" disabled={busy} onClick={() => changeStatus("published")} className={primaryButton}><Send className="size-4" />Publish</button></>;
}

function toDraft(product: AdminProduct): AdminProductInput {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    productType: product.productType,
    productTypeLabel: product.productTypeLabel,
    shortDescription: product.shortDescription,
    description: product.description,
    brand: product.brand,
    material: product.material,
    metals: product.metals,
    gemstones: product.gemstones,
    specification: product.specification,
    modelNumber: product.modelNumber,
    manufacturerPartNumber: product.manufacturerPartNumber,
    taxInclusive: product.taxInclusive,
    featured: product.featured,
    sortOrder: product.sortOrder,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    version: product.version,
    variant: {
      id: product.variant.id,
      name: product.variant.name,
      sku: product.variant.sku,
      priceCents: product.variant.priceCents,
      currency: "AUD",
      weightG: product.variant.weightG,
      leadTimeDays: product.variant.leadTimeDays,
      active: product.variant.active,
      trackInventory: product.variant.trackInventory,
      lowStockThreshold: product.variant.lowStockThreshold,
      version: product.variant.version,
    },
    attributes: product.attributes.map((attribute) => ({ ...attribute })),
  };
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function errorMessage(reason: unknown) {
  if (reason instanceof AdminClientError && reason.code === "validation_failed") return "Some values are incomplete or invalid. Review the form and try again.";
  return reason instanceof Error ? reason.message : "The product could not be saved.";
}
