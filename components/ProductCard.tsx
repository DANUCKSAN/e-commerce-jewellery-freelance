"use client";

import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import ProductImage from "./ProductImage";
import { getProductFallbackImage } from "../lib/product-details";
import type { StorefrontProduct } from "../lib/storefront-products";

export interface ProductCardProps {
  product: StorefrontProduct;
  className?: string;
}

const availabilityLabel = {
  "in-stock": "Ready to ship",
  "low-stock": "Low availability",
  "made-to-order": "Made to order",
  "out-of-stock": "Enquire",
} as const;

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [saved, setSaved] = useState(false);
  const price = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: 0,
  }).format(product.priceCents / 100);

  return (
    <article className={`group relative flex h-full min-w-0 flex-col ${className}`}>
      <Link
        href={`/products/${product.id}`}
        aria-label={`View ${product.name}`}
        className="relative isolate block aspect-[4/5] overflow-hidden bg-light-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-4"
      >
        <ProductImage
          src={product.image}
          fallbackSrc={getProductFallbackImage(product.category)}
          alt={`${product.name} by Aurelle`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
        />
        <span className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-dark-900/12 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-4 right-4 flex size-11 translate-y-3 items-center justify-center rounded-full bg-light-100 text-dark-900 opacity-0 shadow-lg transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
        </span>
        {product.featured ? (
          <span className="absolute left-3 top-3 bg-light-100/88 px-3 py-2 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-dark-900 backdrop-blur sm:left-4 sm:top-4">
            House favourite
          </span>
        ) : null}
      </Link>

      <button
        type="button"
        aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} favourites`}
        aria-pressed={saved}
        title={saved ? "Remove from favourites" : "Save to favourites"}
        onClick={() => setSaved((value) => !value)}
        className={`absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full backdrop-blur transition-[background-color,color,transform] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 sm:right-4 sm:top-4 ${saved ? "bg-oxblood text-white" : "bg-light-100/88 text-dark-900 hover:bg-oxblood hover:text-white"}`}
      >
        <Heart
          aria-hidden="true"
          className="size-[1.05rem]"
          fill={saved ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      </button>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.13em]">
          <p className="text-oxblood">{product.productTypeLabel}</p>
          <p className="text-dark-700">{availabilityLabel[product.availability]}</p>
        </div>
        <Link
          href={`/products/${product.id}`}
          className="mt-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
        >
          <h3 className="font-display text-[1.65rem] font-semibold leading-[1.05] tracking-[-0.025em] text-dark-900 transition-colors group-hover:text-oxblood sm:text-[1.8rem]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-xs leading-5 text-dark-700">{product.material}</p>
        <p className="mt-auto pt-3 text-sm font-semibold tracking-[-0.015em] text-dark-900">
          {price}
        </p>
      </div>
    </article>
  );
}
