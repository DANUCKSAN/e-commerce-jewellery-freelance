import type { Metadata } from "next";
import { ArrowRight, Gem, Hammer, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import ProductCard from "../../../../components/ProductCard";
import ProductExperience from "../../../../components/ProductExperience";
import { getCatalogue, getCatalogueProduct } from "../../../../lib/catalogue";
import { createProductDetail, getProductImage, getSimilarProducts } from "../../../../lib/product-details";
import { getSiteUrl } from "../../../../lib/site-url";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedCatalogue = cache(getCatalogue);
const getCachedCatalogueProduct = cache(getCatalogueProduct);

export async function generateStaticParams() {
  const catalogue = await getCachedCatalogue();
  return catalogue.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const source = await getCachedCatalogueProduct(slug);
  const product = source ? createProductDetail(source) : null;

  if (!product) return { title: "Piece not found" };

  const siteUrl = getSiteUrl();
  const socialImage = siteUrl ? new URL(getProductImage(product.slug), siteUrl) : null;

  return {
    title: product.name,
    description: product.shortDescription ?? product.specification,
    openGraph: {
      title: `${product.name} | AURELLE`,
      description: product.shortDescription ?? product.specification,
      ...(socialImage
        ? { images: [{ url: socialImage, alt: `${product.name} by Aurelle` }] }
        : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [source, catalogue] = await Promise.all([
    getCachedCatalogueProduct(slug),
    getCachedCatalogue(),
  ]);
  const product = source ? createProductDetail(source) : null;

  if (!product) notFound();

  const similarProducts = getSimilarProducts(catalogue, product);

  return (
    <main className="overflow-clip bg-light-100 text-dark-900">
      <ProductExperience product={product} />

      <section aria-labelledby="story-heading" className="bg-dark-900 px-4 py-18 text-light-100 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[94rem] gap-10 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div>
            <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-champagne">
              <Sparkles aria-hidden="true" className="size-4" />
              The piece
            </p>
          </div>
          <div>
            <h2 id="story-heading" className="max-w-[13ch] font-display text-[clamp(3.2rem,6.2vw,6.7rem)] font-medium leading-[0.86] tracking-[-0.05em]">
              Designed to become part of your story.
            </h2>
            <p className="mt-8 max-w-3xl text-[1.05rem] leading-8 text-white/60 sm:text-[1.2rem] sm:leading-9">
              {product.description ?? product.shortDescription ?? product.specification}
            </p>

            <div className="mt-12 grid gap-px overflow-hidden bg-white/10 sm:grid-cols-3">
              {[
                { icon: Gem, title: "Precious by nature", copy: product.material },
                { icon: Hammer, title: "Finished by hand", copy: "Made in small batches by specialist jewellers" },
                { icon: ShieldCheck, title: "Kept for a lifetime", copy: "Annual care and inspection included" },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="flex min-h-52 flex-col justify-between bg-dark-900 p-6 ring-1 ring-inset ring-white/8">
                  <Icon aria-hidden="true" className="size-5 text-champagne" strokeWidth={1.35} />
                  <div>
                    <h3 className="font-display text-[1.55rem] font-semibold">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/48">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="details-heading" className="bg-light-100 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[94rem]">
          <div className="grid gap-7 border-b border-dark-900/12 pb-9 lg:grid-cols-[.7fr_1.3fr] lg:items-end lg:gap-20 lg:pb-12">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-oxblood">Materials & dimensions</p>
              <h2 id="details-heading" className="mt-3 font-display text-[clamp(3rem,5.5vw,5.8rem)] font-medium leading-[0.88] tracking-[-0.05em]">
                Every detail considered.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-dark-700 lg:justify-self-end">
              Natural variations are part of each piece&apos;s character. Measurements
              may differ subtly because every Aurelle piece is finished by hand.
            </p>
          </div>

          <dl className="grid sm:grid-cols-2 lg:grid-cols-3">
            {product.attributes.map((attribute, index) => (
              <div key={attribute.code} className="border-b border-dark-900/12 py-6 sm:px-6 sm:[&:nth-child(2n+1)]:pl-0 lg:py-8 lg:[&:nth-child(2n+1)]:pl-6 lg:[&:nth-child(3n+1)]:pl-0">
                <dt className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-dark-500">
                  <span className="text-champagne">{String(index + 1).padStart(2, "0")}</span>
                  {attribute.label}
                </dt>
                <dd className="mt-3 font-display text-[1.5rem] font-semibold leading-tight">{attribute.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-col gap-4 bg-light-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-display text-[1.65rem] font-semibold">Questions about this piece?</p>
              <p className="mt-1 text-xs leading-5 text-dark-700">Our jewellery specialists are here to help with sizing, stones and care.</p>
            </div>
            <a href={`mailto:concierge@aurelle.com.au?subject=${encodeURIComponent(product.name)}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full bg-dark-900 px-5 text-xs font-bold text-white transition-colors hover:bg-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 sm:self-auto">
              Ask a specialist
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="similar-heading" className="border-t border-dark-900/10 bg-light-200 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[94rem]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-oxblood">You may also love</p>
              <h2 id="similar-heading" className="mt-3 font-display text-[clamp(3rem,5vw,5.4rem)] font-medium leading-[0.88] tracking-[-0.05em]">
                Kindred pieces.
              </h2>
            </div>
            <Link href="/products" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-dark-900/18 px-5 text-xs font-bold transition-colors hover:border-oxblood hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 sm:self-auto">
              View the collection
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <ul className="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7">
            {similarProducts.map((similarProduct) => (
              <li key={similarProduct.id} className="min-w-0">
                <ProductCard product={similarProduct} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
