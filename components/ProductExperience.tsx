"use client";

import {
  Check,
  ChevronLeft,
  Heart,
  PackageCheck,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import ProductImage from "./ProductImage";
import { getProductFallbackImage, type ProductDetail } from "../lib/product-details";

const ringSizes = ["H", "J", "L", "N", "P"] as const;

const availabilityCopy = {
  "in-stock": "Ready to ship in 2–3 business days",
  "low-stock": "Low availability · ready to ship",
  "made-to-order": "Made to order in 3–4 weeks",
  "out-of-stock": "Available by private enquiry",
} as const;

export default function ProductExperience({ product }: { product: ProductDetail }) {
  const [selectedSize, setSelectedSize] = useState<(typeof ringSizes)[number]>("L");
  const [saved, setSaved] = useState(false);
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");
  const resetTimer = useRef<number | null>(null);
  const isRing = product.productType === "ring";
  const isUnavailable = product.availability === "out-of-stock";

  const price = useMemo(
    () =>
      new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: product.currency,
        maximumFractionDigits: 0,
      }).format(product.priceCents / 100),
    [product.currency, product.priceCents],
  );

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  function addToBag() {
    if (cartState === "adding" || isUnavailable) return;
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    setCartState("adding");
    window.setTimeout(() => {
      setCartState("added");
      resetTimer.current = window.setTimeout(() => setCartState("idle"), 4000);
    }, 450);
  }

  return (
    <section className="bg-light-200 px-4 pb-16 pt-5 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-[94rem]">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-dark-700">
          <Link href="/products" className="inline-flex min-h-10 items-center gap-1 rounded-md transition-colors hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood">
            <ChevronLeft aria-hidden="true" className="size-4" />
            Collection
          </Link>
          <span aria-hidden="true" className="text-dark-500">/</span>
          <span className="truncate text-dark-900">{product.productTypeLabel}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,.9fr)] lg:gap-12 xl:gap-20">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_11rem]">
            <div className="relative isolate aspect-[4/5] overflow-hidden bg-stone">
              <ProductImage
                src={product.image}
                fallbackSrc={getProductFallbackImage(product.category)}
                alt={`${product.name} product view`}
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover transition-transform duration-1000 hover:scale-[1.025] motion-reduce:transition-none"
              />
              <span className="absolute left-4 top-4 bg-light-100/88 px-3 py-2 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-dark-900 backdrop-blur sm:left-6 sm:top-6">
                {product.categoryLabel} collection
              </span>
              <p className="absolute bottom-5 left-5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-dark-900/55 sm:bottom-7 sm:left-7">
                Aurelle · Sydney
              </p>
            </div>

            <div className="hidden gap-3 sm:grid lg:grid-cols-2 xl:grid-cols-1">
              <div className="relative min-h-48 overflow-hidden bg-stone xl:min-h-64">
                <ProductImage
                  src={product.image}
                  fallbackSrc={getProductFallbackImage(product.category)}
                  alt=""
                  fill
                  sizes="12rem"
                  className="scale-150 object-cover"
                />
              </div>
              <div className="flex min-h-48 flex-col justify-between bg-dark-900 p-5 text-light-100 xl:min-h-64">
                <Sparkles aria-hidden="true" className="size-5 text-champagne" strokeWidth={1.4} />
                <p className="font-display text-[1.55rem] font-medium leading-[1.05]">
                  Designed to hold the light.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-32 lg:self-start lg:py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-oxblood">
                {product.productTypeLabel}
              </p>
              <button
                type="button"
                aria-pressed={saved}
                onClick={() => setSaved((value) => !value)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[0.65rem] font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 ${saved ? "border-oxblood bg-oxblood text-white" : "border-dark-900/15 hover:border-oxblood hover:text-oxblood"}`}
              >
                <Heart aria-hidden="true" className="size-3.5" fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
            </div>

            <h1 className="mt-5 max-w-[11ch] font-display text-[clamp(3.4rem,6vw,6.6rem)] font-medium leading-[0.82] tracking-[-0.055em]">
              {product.name}
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-dark-700 sm:text-base">
              {product.shortDescription ?? product.specification}
            </p>

            <div className="mt-7 flex items-end justify-between gap-4 border-y border-dark-900/12 py-6">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-dark-500">Price</p>
                <p className="mt-1 font-display text-[2.35rem] font-semibold leading-none tracking-[-0.025em]">{price}</p>
              </div>
              <p className="text-right text-[0.65rem] leading-5 text-dark-700">
                {product.currency}<br />Tax included
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-dark-900">Material</p>
                <span className="text-xs text-dark-700">{product.material}</span>
              </div>
              <div className="mt-3 flex min-h-14 items-center gap-3 border border-dark-900/15 bg-light-100 px-4">
                <span className={`size-4 rounded-full border border-dark-900/15 ${product.material.toLowerCase().includes("gold") ? "bg-[#c7a15d]" : "bg-[#d7d7d5]"}`} />
                <span className="text-sm font-semibold">{product.material}</span>
                <Check aria-hidden="true" className="ml-auto size-4 text-oxblood" />
              </div>
            </div>

            {isRing ? (
              <fieldset className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <legend className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-dark-900">Ring size</legend>
                  <Link href="#details-heading" className="inline-flex min-h-8 items-center gap-1.5 text-[0.65rem] font-semibold text-dark-700 underline underline-offset-4 hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood">
                    <Ruler aria-hidden="true" className="size-3.5" />
                    Size guide
                  </Link>
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {ringSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-12 border text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 ${selectedSize === size ? "border-dark-900 bg-dark-900 text-white" : "border-dark-900/15 bg-light-100 hover:border-oxblood hover:text-oxblood"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <button
              type="button"
              disabled={cartState === "adding" || isUnavailable}
              aria-busy={cartState === "adding"}
              onClick={addToBag}
              className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-oxblood px-6 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_16px_35px_rgba(91,35,51,.2)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-dark-900 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
            >
              {cartState === "added" ? <Check aria-hidden="true" className="size-4" /> : <ShoppingBag aria-hidden="true" className="size-4" />}
              {cartState === "adding" ? "Adding…" : cartState === "added" ? "Added to your bag" : isUnavailable ? "Enquire about this piece" : "Add to bag"}
            </button>

            <div role="status" aria-live="polite" className={`mt-3 grid overflow-hidden bg-dark-900 text-light-100 transition-[grid-template-rows,opacity] duration-500 ${cartState === "added" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="min-h-0 overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs">
                  <span>Beautiful choice. This piece is saved in the preview bag.</span>
                  <Link href="/checkout" className="shrink-0 font-bold text-champagne underline underline-offset-4">View sample checkout</Link>
                </div>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 border-t border-dark-900/12 pt-5 text-xs text-dark-700 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <li className="flex items-start gap-2.5">
                <PackageCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-oxblood" strokeWidth={1.5} />
                <span>{availabilityCopy[product.availability]}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-oxblood" strokeWidth={1.5} />
                <span>Complimentary insured delivery & lifetime care</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
