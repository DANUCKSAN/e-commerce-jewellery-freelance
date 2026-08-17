import type { Metadata } from "next";
import Image from "next/image";

import heroRings from "../../../public/images/aurelle/hero-rings.webp";
import CatalogueUnavailable from "../../../components/CatalogueUnavailable";
import ProductCatalogue, {
  type CategoryFilter,
  type PriceFilter,
  type ProductTypeFilter,
  type SortOrder,
} from "../../../components/ProductCatalogue";
import { getCatalogue } from "../../../lib/catalogue";
import {
  jewelleryCategories,
  jewelleryProductTypes,
} from "../../../lib/catalogue-model";
import { createStorefrontProducts } from "../../../lib/storefront-products";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Explore modern diamond, gold, silver and platinum jewellery from Aurelle.",
};

type CollectionSearchParams = Promise<{
  category?: string | string[];
  type?: string | string[];
  price?: string | string[];
  sort?: string | string[];
}>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readCategory(value: string | undefined): CategoryFilter {
  return jewelleryCategories.includes(value as never)
    ? (value as CategoryFilter)
    : "all";
}

function readProductType(value: string | undefined): ProductTypeFilter {
  return jewelleryProductTypes.includes(value as never)
    ? (value as ProductTypeFilter)
    : "all";
}

function readPrice(value: string | undefined): PriceFilter {
  return ["under-1000", "1000-3000", "over-3000"].includes(value ?? "")
    ? (value as PriceFilter)
    : "all";
}

function readSort(value: string | undefined): SortOrder {
  return ["price-asc", "price-desc"].includes(value ?? "")
    ? (value as SortOrder)
    : "curated";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: CollectionSearchParams;
}) {
  const [query, catalogue] = await Promise.all([searchParams, getCatalogue()]);
  const products = catalogue.ok ? createStorefrontProducts(catalogue.data) : [];
  const category = readCategory(firstValue(query.category));

  return (
    <main className="overflow-clip bg-light-100 text-dark-900">
      <section className="relative overflow-hidden bg-light-200 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-y-0 right-0 hidden w-[38%] lg:block">
          <Image
            src={heroRings}
            alt=""
            fill
            sizes="38vw"
            className="object-cover object-right opacity-60 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-light-200 via-light-200/45 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[94rem]">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-oxblood">
            The collection · {String(products.length).padStart(2, "0")} pieces
          </p>
          <h1 className="mt-4 max-w-[10ch] font-display text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.78] tracking-[-0.06em]">
            Find your forever piece.
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-dark-700 sm:text-base">
            Diamond light, the warmth of gold, sculptural silver and enduring
            platinum — each Aurelle piece is made to become part of your story.
          </p>
        </div>
      </section>

      {catalogue.ok ? (
        <ProductCatalogue
          products={products}
          category={category}
          productType={readProductType(firstValue(query.type))}
          price={readPrice(firstValue(query.price))}
          sort={readSort(firstValue(query.sort))}
        />
      ) : (
        <CatalogueUnavailable compact />
      )}
    </main>
  );
}
