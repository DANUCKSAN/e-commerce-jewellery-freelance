import type {
  CatalogueProduct,
  JewelleryGemstone,
  JewelleryMetal,
  JewelleryProductType,
  JewelleryCategory,
  ProductAvailability,
} from "@/lib/catalogue";

export type StorefrontProduct = {
  id: string;
  category: JewelleryCategory;
  categoryLabel: string;
  name: string;
  brand: string;
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

const categoryLabels: Record<JewelleryCategory, string> = {
  diamond: "Diamond",
  gold: "Gold",
  silver: "Silver",
  platinum: "Platinum",
};

export function cleanCatalogueText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function createStorefrontProducts(
  products: CatalogueProduct[],
): StorefrontProduct[] {
  return products.map((product) => ({
    id: product.slug,
    category: product.category,
    categoryLabel: categoryLabels[product.category],
    name: cleanCatalogueText(product.name),
    brand: product.manufacturer,
    productType: product.productType,
    productTypeLabel: product.productTypeLabel,
    material: product.material,
    metals: [...product.metals],
    gemstones: [...product.gemstones],
    specification: cleanCatalogueText(product.specification),
    image: product.image,
    priceCents: product.priceCents,
    currency: product.currency,
    taxInclusive: product.taxInclusive,
    availability: product.availability,
    stock: product.stock,
    featured: product.featured,
  }));
}
