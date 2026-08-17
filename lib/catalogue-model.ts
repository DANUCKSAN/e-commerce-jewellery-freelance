export const jewelleryCategories = [
  "diamond",
  "gold",
  "silver",
  "platinum",
] as const;

export type JewelleryCategory = (typeof jewelleryCategories)[number];

export const jewelleryProductTypes = [
  "ring",
  "earrings",
  "bracelet",
  "necklace",
  "pendant",
] as const;

export type JewelleryProductType = (typeof jewelleryProductTypes)[number];
export type ProductType = JewelleryProductType;

export const jewelleryMetals = [
  "18k-yellow-gold",
  "18k-rose-gold",
  "18k-white-gold",
  "sterling-silver",
  "950-platinum",
] as const;

export type JewelleryMetal = (typeof jewelleryMetals)[number];
export type JewelleryGemstone = "diamond";

export const productAvailabilities = [
  "in-stock",
  "low-stock",
  "made-to-order",
  "out-of-stock",
] as const;

export type ProductAvailability = (typeof productAvailabilities)[number];

export type CatalogueAttribute = {
  code: string;
  name: string;
  dataType: "text" | "number" | "boolean";
  valueText: string | null;
  valueNumber: string | null;
  valueBoolean: boolean | null;
  unitSymbol: string | null;
};

export type CatalogueProduct = {
  slug: string;
  name: string;
  category: JewelleryCategory;
  categoryName: string;
  manufacturer: string;
  productType: JewelleryProductType;
  productTypeLabel: string;
  material: string;
  metals: JewelleryMetal[];
  gemstones: JewelleryGemstone[];
  specification: string;
  image: string;
  priceCents: number;
  currency: string;
  taxInclusive: boolean;
  availability: ProductAvailability;
  stock: number;
  featured: boolean;
};

export type CatalogueProductDetail = CatalogueProduct & {
  variantId: string;
  shortDescription: string;
  description: string;
  modelNumber: string | null;
  catalogSku: string;
  manufacturerPartNumber: string | null;
  weightG: number | null;
  leadTimeDays: number;
  attributes: CatalogueAttribute[];
};

export type CatalogueFailureReason =
  "not-configured" | "request-failed" | "invalid-data";

export type CatalogueResult<T> =
  { ok: true; data: T } | { ok: false; reason: CatalogueFailureReason };
