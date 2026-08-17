import type {
  CatalogueAttribute,
  CatalogueProduct,
  CatalogueProductDetail,
  JewelleryCategory,
} from "./catalogue-model";
import {
  cleanCatalogueText,
  createStorefrontProducts,
  type StorefrontProduct,
} from "./storefront-products";

export type ProductAttribute = {
  code: string;
  label: string;
  value: string;
};

export type ProductDetail = StorefrontProduct & {
  slug: string;
  shortDescription: string | null;
  description: string | null;
  modelNumber: string | null;
  catalogSku: string | null;
  manufacturerPartNumber: string | null;
  weightG: number | null;
  leadTimeDays: number;
  currency: string;
  taxInclusive: boolean;
  attributes: ProductAttribute[];
};

function publicCopy(value: string | null) {
  if (!value) return null;
  const cleaned = cleanCatalogueText(value);
  if (!cleaned) return null;
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`;
}

function publicIdentifier(value: string | null) {
  return value?.trim() || null;
}

function formatNumber(value: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) return value;
  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 3,
  }).format(number);
}

function formatAttribute(attribute: CatalogueAttribute) {
  if (attribute.dataType === "number" && attribute.valueNumber !== null) {
    const suffix = attribute.unitSymbol ? ` ${attribute.unitSymbol}` : "";
    return `${formatNumber(attribute.valueNumber)}${suffix}`;
  }

  if (attribute.dataType === "boolean" && attribute.valueBoolean !== null) {
    return attribute.valueBoolean ? "Yes" : "No";
  }

  if (attribute.valueText !== null) {
    const cleaned = cleanCatalogueText(attribute.valueText);
    return cleaned || null;
  }

  return null;
}

const fallbackImageByCategory: Record<JewelleryCategory, string> = {
  diamond: "/images/aurelle/diamond-solitaire.webp",
  gold: "/images/aurelle/gold-necklace.webp",
  silver: "/images/aurelle/silver-cuff.webp",
  platinum: "/images/aurelle/platinum-band.webp",
};

export function getProductFallbackImage(category: JewelleryCategory) {
  return fallbackImageByCategory[category];
}

export function createProductDetail(
  source: CatalogueProductDetail,
): ProductDetail | null {
  const storefront = createStorefrontProducts([source])[0];
  if (!storefront) return null;

  const attributes = source.attributes.flatMap((attribute) => {
    const value = formatAttribute(attribute);
    return value
      ? [{ code: attribute.code, label: attribute.name, value }]
      : [];
  });

  return {
    ...storefront,
    slug: source.slug,
    shortDescription: publicCopy(source.shortDescription),
    description: publicCopy(source.description),
    modelNumber: publicIdentifier(source.modelNumber),
    catalogSku: publicIdentifier(source.catalogSku),
    manufacturerPartNumber: publicIdentifier(source.manufacturerPartNumber),
    weightG: source.weightG,
    leadTimeDays: source.leadTimeDays,
    currency: source.currency,
    taxInclusive: source.taxInclusive,
    attributes,
  };
}

function overlapCount<T>(left: T[], right: T[]) {
  const rightValues = new Set(right);
  return left.reduce(
    (count, value) => count + Number(rightValues.has(value)),
    0,
  );
}

function similarityScore(product: StorefrontProduct, current: ProductDetail) {
  let score = 0;

  if (product.category === current.category) {
    score += 8;
  }
  if (product.productType === current.productType) score += 4;
  score += overlapCount(product.metals, current.metals) * 3;
  score += overlapCount(product.gemstones, current.gemstones) * 2;
  if (product.featured) score += 1;

  return score;
}

export function getSimilarProducts(
  catalogue: CatalogueProduct[],
  current: ProductDetail,
  limit = 3,
): StorefrontProduct[] {
  return createStorefrontProducts(catalogue)
    .filter((product) => product.id !== current.slug)
    .sort((a, b) => {
      const scoreDifference =
        similarityScore(b, current) - similarityScore(a, current);
      if (scoreDifference !== 0) return scoreDifference;
      return a.name.localeCompare(b.name, "en-AU");
    })
    .slice(0, limit);
}

export function getCategoryFallbackImage(category: JewelleryCategory) {
  return fallbackImageByCategory[category];
}
