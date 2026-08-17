import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

import ProductCard from "./ProductCard";
import type { JewelleryCategory, ProductType } from "../lib/catalogue-model";
import type { StorefrontProduct } from "../lib/storefront-products";

export type CategoryFilter = "all" | JewelleryCategory;
export type ProductTypeFilter = "all" | ProductType;
export type PriceFilter = "all" | "under-1000" | "1000-3000" | "over-3000";
export type SortOrder = "curated" | "price-asc" | "price-desc";

export interface ProductCatalogueProps {
  products: StorefrontProduct[];
  category?: CategoryFilter;
  productType?: ProductTypeFilter;
  price?: PriceFilter;
  sort?: SortOrder;
  mode?: "featured" | "catalogue";
}

const categoryFilters: ReadonlyArray<{ value: CategoryFilter; label: string }> =
  [
    { value: "all", label: "All pieces" },
    { value: "diamond", label: "Diamond" },
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
    { value: "platinum", label: "Platinum" },
  ];

const productTypeFilters: ReadonlyArray<{
  value: ProductTypeFilter;
  label: string;
}> = [
  { value: "all", label: "All types" },
  { value: "ring", label: "Rings" },
  { value: "earrings", label: "Earrings" },
  { value: "necklace", label: "Necklaces" },
  { value: "pendant", label: "Pendants" },
  { value: "bracelet", label: "Bracelets" },
];

function matchesPrice(priceCents: number, filter: PriceFilter) {
  if (filter === "under-1000") return priceCents < 100_000;
  if (filter === "1000-3000")
    return priceCents >= 100_000 && priceCents <= 300_000;
  if (filter === "over-3000") return priceCents > 300_000;
  return true;
}

function catalogueHref({
  category,
  productType,
  price,
  sort,
}: {
  category: CategoryFilter;
  productType: ProductTypeFilter;
  price: PriceFilter;
  sort: SortOrder;
}) {
  const query = new URLSearchParams();
  if (category !== "all") query.set("category", category);
  if (productType !== "all") query.set("type", productType);
  if (price !== "all") query.set("price", price);
  if (sort !== "curated") query.set("sort", sort);
  const search = query.toString();
  return `/products${search ? `?${search}` : ""}#collection`;
}

export default function ProductCatalogue({
  products,
  category = "all",
  productType = "all",
  price = "all",
  sort = "curated",
  mode = "catalogue",
}: ProductCatalogueProps) {
  if (mode === "featured") {
    const featuredProducts = products
      .filter((product) => product.featured)
      .slice(0, 4);

    return (
      <section
        id="featured"
        aria-labelledby="featured-heading"
        className="bg-light-100 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-[94rem]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-oxblood">
                The Aurelle edit
              </p>
              <h2
                id="featured-heading"
                className="mt-3 font-display text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.88] tracking-[-0.05em]"
              >
                Pieces to begin with.
              </h2>
            </div>
            <Link
              href="/products"
              className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-dark-900/20 px-5 text-xs font-bold text-dark-900 transition-colors hover:border-oxblood hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 sm:self-auto"
            >
              View all pieces
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <ul className="mt-9 grid gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {featuredProducts.map((product) => (
              <li key={product.id} className="min-w-0">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const filteredProducts = products
    .filter(
      (product) =>
        (category === "all" || product.category === category) &&
        (productType === "all" || product.productType === productType) &&
        matchesPrice(product.priceCents, price),
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.priceCents - b.priceCents;
      if (sort === "price-desc") return b.priceCents - a.priceCents;
      return Number(b.featured) - Number(a.featured);
    });

  const hasActiveFilters =
    category !== "all" || productType !== "all" || price !== "all";

  return (
    <section
      id="collection"
      aria-label="Aurelle product collection"
      className="scroll-mt-28 bg-light-100 px-4 pb-18 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28"
    >
      <div className="mx-auto max-w-[94rem]">
        <div className="border-y border-dark-900/12 py-5">
          <nav
            aria-label="Filter collection by material"
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categoryFilters.map((filter) => (
              <Link
                key={filter.value}
                href={catalogueHref({
                  category: filter.value,
                  productType,
                  price,
                  sort,
                })}
                aria-current={category === filter.value ? "page" : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-[0.67rem] font-bold uppercase tracking-[0.11em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 ${
                  category === filter.value
                    ? "border-dark-900 bg-dark-900 text-white"
                    : "border-dark-900/13 bg-transparent text-dark-700 hover:border-oxblood hover:text-oxblood"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </nav>

          <form
            action="/products"
            method="get"
            className="mt-4 grid gap-3 border-t border-dark-900/10 pt-4 sm:grid-cols-2 lg:grid-cols-[auto_minmax(10rem,14rem)_minmax(10rem,14rem)_minmax(10rem,14rem)_1fr_auto] lg:items-end"
          >
            <div className="hidden min-h-11 items-center gap-2 text-xs font-semibold text-dark-700 lg:flex">
              <SlidersHorizontal
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.5}
              />
              Refine
            </div>
            {category !== "all" ? (
              <input type="hidden" name="category" value={category} />
            ) : null}

            <label className="grid gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-dark-700">
              Piece
              <select
                name="type"
                defaultValue={productType}
                className="min-h-11 rounded-none border border-dark-900/15 bg-light-100 px-3 text-xs normal-case tracking-normal text-dark-900 outline-none transition-[border-color,box-shadow] focus:border-oxblood focus:ring-2 focus:ring-oxblood/10"
              >
                {productTypeFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-dark-700">
              Price
              <select
                name="price"
                defaultValue={price}
                className="min-h-11 rounded-none border border-dark-900/15 bg-light-100 px-3 text-xs normal-case tracking-normal text-dark-900 outline-none transition-[border-color,box-shadow] focus:border-oxblood focus:ring-2 focus:ring-oxblood/10"
              >
                <option value="all">Any price</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-3000">$1,000–$3,000</option>
                <option value="over-3000">$3,000+</option>
              </select>
            </label>

            <label className="grid gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-dark-700">
              Sort
              <select
                name="sort"
                defaultValue={sort}
                className="min-h-11 rounded-none border border-dark-900/15 bg-light-100 px-3 text-xs normal-case tracking-normal text-dark-900 outline-none transition-[border-color,box-shadow] focus:border-oxblood focus:ring-2 focus:ring-oxblood/10"
              >
                <option value="curated">Curated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>

            <p
              aria-live="polite"
              className="self-center text-xs text-dark-700 lg:justify-self-end"
            >
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-oxblood px-5 text-xs font-bold text-white transition-colors hover:bg-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
              >
                Apply
              </button>
              {hasActiveFilters ? (
                <Link
                  href="/products#collection"
                  aria-label="Clear all filters"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-dark-900/15 text-dark-900 transition-colors hover:border-oxblood hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
                >
                  <X aria-hidden="true" className="size-4" />
                </Link>
              ) : null}
            </div>
          </form>
        </div>

        {filteredProducts.length > 0 ? (
          <ul className="mt-9 grid gap-x-4 gap-y-12 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
            {filteredProducts.map((product) => (
              <li key={product.id} className="min-w-0">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-9 border border-dashed border-dark-900/20 bg-light-200 px-5 py-20 text-center">
            <p className="font-display text-[2.2rem] font-semibold">
              Nothing quite matches.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-dark-700">
              Try another combination or return to the full Aurelle collection.
            </p>
            <Link
              href="/products#collection"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-dark-900 px-5 text-xs font-bold text-white hover:bg-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
            >
              View all pieces
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
