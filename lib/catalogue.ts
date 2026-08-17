import "server-only";

import { unstable_cache } from "next/cache";
import { Query } from "appwrite";
import { z } from "zod";

import {
  catalogueCacheTag,
  catalogueResources,
} from "./appwrite/catalogue-config";
import {
  jewelleryCategories,
  jewelleryMetals,
  jewelleryProductTypes,
  productAvailabilities,
  type CatalogueAttribute,
  type CatalogueFailureReason,
  type CatalogueProductDetail,
  type CatalogueResult,
} from "./catalogue-model";

export {
  jewelleryCategories,
  jewelleryMetals,
  jewelleryProductTypes,
  productAvailabilities,
} from "./catalogue-model";
export type {
  CatalogueAttribute,
  CatalogueFailureReason,
  CatalogueProduct,
  CatalogueProductDetail,
  CatalogueResult,
  JewelleryCategory,
  JewelleryGemstone,
  JewelleryMetal,
  JewelleryProductType,
  ProductAvailability,
  ProductType,
} from "./catalogue-model";

const rowMetadataSchema = z.object({
  $id: z.string().min(1),
});

const productRowSchema = rowMetadataSchema.extend({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(jewelleryCategories),
  productType: z.enum(jewelleryProductTypes),
  productTypeLabel: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  brand: z.string().min(1),
  material: z.string().min(1),
  metals: z.array(z.enum(jewelleryMetals)).min(1),
  gemstones: z.array(z.literal("diamond")),
  specification: z.string().min(1),
  modelNumber: z.string().nullable().optional(),
  manufacturerPartNumber: z.string().nullable().optional(),
  taxInclusive: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  status: z.literal("published"),
});

const variantRowSchema = rowMetadataSchema.extend({
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().length(3),
  stock: z.number().int().nonnegative(),
  availability: z.enum(productAvailabilities),
  weightG: z.number().nonnegative().nullable().optional(),
  leadTimeDays: z.number().int().nonnegative(),
  active: z.literal(true),
  sortOrder: z.number().int().nonnegative(),
});

const mediaRowSchema = rowMetadataSchema.extend({
  productId: z.string().min(1),
  fileId: z.string().min(1),
  altText: z.string().min(1),
  position: z.number().int().nonnegative(),
  isPrimary: z.boolean(),
});

const attributeRowSchema = rowMetadataSchema.extend({
  productId: z.string().min(1),
  code: z.string().min(1),
  name: z.string().min(1),
  dataType: z.enum(["text", "number", "boolean"]),
  valueText: z.string().nullable().optional(),
  valueNumber: z.number().nullable().optional(),
  valueBoolean: z.boolean().nullable().optional(),
  unitSymbol: z.string().nullable().optional(),
  position: z.number().int().nonnegative(),
});

type ProductRow = z.infer<typeof productRowSchema>;
type VariantRow = z.infer<typeof variantRowSchema>;
type MediaRow = z.infer<typeof mediaRowSchema>;
type AttributeRow = z.infer<typeof attributeRowSchema>;

class CatalogueConfigurationError extends Error {}
class CatalogueRequestError extends Error {}
class CatalogueDataError extends Error {}

const categoryNames = {
  diamond: "Diamond",
  gold: "Gold",
  silver: "Silver",
  platinum: "Platinum",
} as const;

function readPublicConfiguration() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.trim();
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID?.trim();

  if (!endpoint || !projectId) {
    throw new CatalogueConfigurationError(
      "Missing public Appwrite configuration.",
    );
  }

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new CatalogueConfigurationError("Invalid Appwrite endpoint.");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new CatalogueConfigurationError(
      "Invalid Appwrite endpoint protocol.",
    );
  }

  return { endpoint: endpoint.replace(/\/$/, ""), projectId };
}

function rowsUrl(endpoint: string, tableId: string, queries: string[]) {
  const url = new URL(
    `${endpoint}/tablesdb/${encodeURIComponent(catalogueResources.databaseId)}/tables/${encodeURIComponent(tableId)}/rows`,
  );
  for (const query of queries) url.searchParams.append("queries[]", query);
  url.searchParams.set("total", "false");
  url.searchParams.set("ttl", "30");
  return url;
}

async function requestRows(
  configuration: ReturnType<typeof readPublicConfiguration>,
  tableId: string,
  queries: string[],
) {
  const { endpoint, projectId } = configuration;
  const response = await fetch(rowsUrl(endpoint, tableId, queries), {
    headers: { "X-Appwrite-Project": projectId },
    signal: AbortSignal.timeout(6_000),
  });

  if (!response.ok) {
    throw new CatalogueRequestError(
      `Appwrite returned ${response.status} for ${tableId}.`,
    );
  }

  const payload = await response.json();
  return z.object({ rows: z.array(z.unknown()) }).parse(payload).rows;
}

function productImageUrl(
  configuration: ReturnType<typeof readPublicConfiguration>,
  fileId: string,
) {
  const { endpoint, projectId } = configuration;
  const url = new URL(
    `${endpoint}/storage/buckets/${encodeURIComponent(catalogueResources.imagesBucketId)}/files/${encodeURIComponent(fileId)}/view`,
  );
  url.searchParams.set("project", projectId);
  return url.toString();
}

function groupByProduct<T extends { productId: string }>(rows: T[]) {
  const grouped = new Map<string, T[]>();
  for (const row of rows) {
    const values = grouped.get(row.productId) ?? [];
    values.push(row);
    grouped.set(row.productId, values);
  }
  return grouped;
}

function toAttribute(row: AttributeRow): CatalogueAttribute {
  return {
    code: row.code,
    name: row.name,
    dataType: row.dataType,
    valueText: row.valueText ?? null,
    valueNumber:
      row.valueNumber === null || row.valueNumber === undefined
        ? null
        : String(row.valueNumber),
    valueBoolean: row.valueBoolean ?? null,
    unitSymbol: row.unitSymbol ?? null,
  };
}

function assembleProduct(
  configuration: ReturnType<typeof readPublicConfiguration>,
  product: ProductRow,
  variants: VariantRow[],
  media: MediaRow[],
  attributes: AttributeRow[],
): CatalogueProductDetail {
  const variant = [...variants].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  )[0];
  const image = [...media].sort((left, right) => {
    if (left.isPrimary !== right.isPrimary) return left.isPrimary ? -1 : 1;
    return left.position - right.position;
  })[0];

  if (!variant || !image) {
    throw new CatalogueDataError(
      `Published product ${product.slug} requires an active variant and image.`,
    );
  }

  return {
    variantId: variant.$id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    categoryName: categoryNames[product.category],
    manufacturer: product.brand,
    productType: product.productType,
    productTypeLabel: product.productTypeLabel,
    material: product.material,
    metals: [...product.metals],
    gemstones: [...product.gemstones],
    specification: product.specification,
    image: productImageUrl(configuration, image.fileId),
    priceCents: variant.priceCents,
    currency: variant.currency.toUpperCase(),
    taxInclusive: product.taxInclusive,
    availability: variant.availability,
    stock: variant.stock,
    featured: product.featured,
    shortDescription: product.shortDescription,
    description: product.description,
    modelNumber: product.modelNumber ?? null,
    catalogSku: variant.sku,
    manufacturerPartNumber: product.manufacturerPartNumber ?? null,
    weightG: variant.weightG ?? null,
    leadTimeDays: variant.leadTimeDays,
    attributes: [...attributes]
      .sort((left, right) => left.position - right.position)
      .map(toAttribute),
  };
}

async function loadCatalogue(
  configuration: ReturnType<typeof readPublicConfiguration>,
): Promise<CatalogueProductDetail[]> {
  const [productPayload, variantPayload, mediaPayload, attributePayload] =
    await Promise.all([
      requestRows(configuration, catalogueResources.productsTableId, [
        Query.equal("status", ["published"]),
        Query.orderAsc("sortOrder"),
        Query.limit(500),
      ]),
      requestRows(configuration, catalogueResources.variantsTableId, [
        Query.equal("active", [true]),
        Query.limit(2_000),
      ]),
      requestRows(configuration, catalogueResources.mediaTableId, [
        Query.limit(2_000),
      ]),
      requestRows(configuration, catalogueResources.attributesTableId, [
        Query.limit(5_000),
      ]),
    ]);

  const products = z.array(productRowSchema).parse(productPayload);
  const variants = z.array(variantRowSchema).parse(variantPayload);
  const media = z.array(mediaRowSchema).parse(mediaPayload);
  const attributes = z.array(attributeRowSchema).parse(attributePayload);
  const variantsByProduct = groupByProduct(variants);
  const mediaByProduct = groupByProduct(media);
  const attributesByProduct = groupByProduct(attributes);

  return products.map((product) =>
    assembleProduct(
      configuration,
      product,
      variantsByProduct.get(product.$id) ?? [],
      mediaByProduct.get(product.$id) ?? [],
      attributesByProduct.get(product.$id) ?? [],
    ),
  );
}

const getCachedCatalogue = unstable_cache(loadCatalogue, ["catalogue-v1"], {
  revalidate: 60,
  tags: [catalogueCacheTag],
});

function failureReason(error: unknown): CatalogueFailureReason {
  if (error instanceof CatalogueConfigurationError) return "not-configured";
  if (error instanceof z.ZodError || error instanceof CatalogueDataError) {
    return "invalid-data";
  }
  return "request-failed";
}

function reportFailure(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`[catalogue] ${message}`);
}

/** Returns a validated public catalogue snapshot without exposing backend errors. */
export async function getCatalogue(): Promise<
  CatalogueResult<CatalogueProductDetail[]>
> {
  try {
    // Passing public configuration makes it part of the cache key and prevents
    // data from one Appwrite project being reused after an environment change.
    const products = await getCachedCatalogue(readPublicConfiguration());
    return { ok: true, data: products };
  } catch (error) {
    reportFailure(error);
    return { ok: false, reason: failureReason(error) };
  }
}

export async function getCatalogueProduct(
  slug: string,
): Promise<CatalogueResult<CatalogueProductDetail | null>> {
  const result = await getCatalogue();
  if (!result.ok) return result;
  return {
    ok: true,
    data: result.data.find((product) => product.slug === slug) ?? null,
  };
}
