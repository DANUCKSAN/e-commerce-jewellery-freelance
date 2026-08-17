import "server-only";

import { Query } from "appwrite";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { catalogueCacheTag, catalogueResources } from "@/lib/appwrite/catalogue-config";
import {
  inventoryMovementTypes,
  productStatuses,
  type AdminProduct,
  type AdminProductInput,
  type AdminProductSummary,
  type AuditEntry,
  type InventoryAdjustmentInput,
  type InventoryMovement,
} from "@/lib/admin/contracts";
import {
  AdminApiError,
  appwriteRequest,
  newResourceId,
  publicReadPermissions,
  storageFileUrl,
  tableRowPath,
  tableRowsPath,
} from "@/lib/admin/server";
import {
  jewelleryCategories,
  jewelleryMetals,
  jewelleryProductTypes,
  productAvailabilities,
} from "@/lib/catalogue-model";

const metadataSchema = z.object({
  $id: z.string(),
  $updatedAt: z.string(),
});
const productRowSchema = metadataSchema.extend({
  slug: z.string(),
  name: z.string(),
  category: z.enum(jewelleryCategories),
  productType: z.enum(jewelleryProductTypes),
  productTypeLabel: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  brand: z.string(),
  material: z.string(),
  metals: z.array(z.enum(jewelleryMetals)),
  gemstones: z.array(z.literal("diamond")),
  specification: z.string(),
  modelNumber: z.string().nullable().optional(),
  manufacturerPartNumber: z.string().nullable().optional(),
  taxInclusive: z.boolean(),
  status: z.enum(productStatuses),
  featured: z.boolean(),
  sortOrder: z.number().int(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  version: z.number().int().nullable().optional(),
});
const variantRowSchema = metadataSchema.extend({
  productId: z.string(),
  sku: z.string(),
  name: z.string(),
  priceCents: z.number().int(),
  currency: z.string(),
  stock: z.number().int(),
  availability: z.enum(productAvailabilities),
  weightG: z.number().nullable().optional(),
  leadTimeDays: z.number().int(),
  active: z.boolean(),
  sortOrder: z.number().int(),
  trackInventory: z.boolean().nullable().optional(),
  lowStockThreshold: z.number().int().nullable().optional(),
  reservedStock: z.number().int().nullable().optional(),
  version: z.number().int().nullable().optional(),
});
const mediaRowSchema = metadataSchema.extend({
  productId: z.string(),
  fileId: z.string(),
  altText: z.string(),
  position: z.number().int(),
  isPrimary: z.boolean(),
  mimeType: z.string().nullable().optional(),
  version: z.number().int().nullable().optional(),
});
const attributeRowSchema = metadataSchema.extend({
  productId: z.string(),
  code: z.string(),
  name: z.string(),
  dataType: z.enum(["text", "number", "boolean"]),
  valueText: z.string().nullable().optional(),
  valueNumber: z.number().nullable().optional(),
  valueBoolean: z.boolean().nullable().optional(),
  unitSymbol: z.string().nullable().optional(),
  position: z.number().int(),
  version: z.number().int().nullable().optional(),
});
const movementRowSchema = metadataSchema.extend({
  productId: z.string(),
  variantId: z.string(),
  movementType: z.enum(inventoryMovementTypes),
  quantityDelta: z.number().int(),
  stockBefore: z.number().int(),
  stockAfter: z.number().int(),
  reason: z.string(),
  referenceId: z.string().nullable().optional(),
  actorUserId: z.string(),
  operationId: z.string(),
  occurredAt: z.string(),
});
const auditRowSchema = metadataSchema.extend({
  entityType: z.enum(["product", "variant", "media", "inventory"]),
  entityId: z.string(),
  action: z.string(),
  actorUserId: z.string(),
  summary: z.string(),
  occurredAt: z.string(),
});

type ProductRow = z.infer<typeof productRowSchema>;
type VariantRow = z.infer<typeof variantRowSchema>;
type MediaRow = z.infer<typeof mediaRowSchema>;
type AttributeRow = z.infer<typeof attributeRowSchema>;

const asVersion = (value: number | null | undefined) => value ?? 1;

function rowQueries(queries: string[] = [], transactionId?: string) {
  const params = new URLSearchParams();
  for (const query of queries) params.append("queries[]", query);
  params.set("total", "false");
  params.set("ttl", "0");
  if (transactionId) params.set("transactionId", transactionId);
  return params;
}

async function listRows<T extends { $id: string }>(
  tableId: string,
  schema: z.ZodType<T>,
  queries: string[] = [],
  transactionId?: string,
  maximumRows = 5_000,
) {
  const collected: T[] = [];
  let cursor: string | undefined;
  while (collected.length < maximumRows) {
    const pageQueries = [
      ...queries,
      Query.limit(Math.min(100, maximumRows - collected.length)),
      ...(cursor ? [Query.cursorAfter(cursor)] : []),
    ];
    const params = rowQueries(pageQueries, transactionId);
    const result = await appwriteRequest<{ rows?: unknown[] }>(
      "GET",
      `${tableRowsPath(tableId)}?${params}`,
      { useAdminKey: true },
    );
    const page = z.array(schema).parse(result.rows ?? []);
    collected.push(...page);
    if (page.length < 100) break;
    cursor = page.at(-1)?.$id;
    if (!cursor) break;
  }
  return collected;
}

async function getRow<T>(
  tableId: string,
  rowId: string,
  schema: z.ZodType<T>,
  transactionId?: string,
) {
  const suffix = transactionId
    ? `?transactionId=${encodeURIComponent(transactionId)}`
    : "";
  return schema.parse(
    await appwriteRequest("GET", `${tableRowPath(tableId, rowId)}${suffix}`, {
      useAdminKey: true,
    }),
  );
}

async function createRow(
  tableId: string,
  rowId: string,
  data: Record<string, unknown>,
  permissions: string[],
  transactionId?: string,
) {
  return appwriteRequest("POST", tableRowsPath(tableId), {
    useAdminKey: true,
    body: { rowId, data, permissions, transactionId },
  });
}

async function updateRow(
  tableId: string,
  rowId: string,
  data: Record<string, unknown>,
  permissions?: string[],
  transactionId?: string,
) {
  return appwriteRequest("PATCH", tableRowPath(tableId, rowId), {
    useAdminKey: true,
    body: { data, permissions, transactionId },
  });
}

async function deleteRow(tableId: string, rowId: string, transactionId?: string) {
  return appwriteRequest("DELETE", tableRowPath(tableId, rowId), {
    useAdminKey: true,
    body: { transactionId },
  });
}

async function beginTransaction() {
  return z.object({ $id: z.string() }).parse(
    await appwriteRequest("POST", "/tablesdb/transactions", {
      useAdminKey: true,
      body: { ttl: 60 },
    }),
  ).$id;
}

async function finishTransaction(transactionId: string, commit: boolean) {
  return appwriteRequest("PATCH", `/tablesdb/transactions/${encodeURIComponent(transactionId)}`, {
    useAdminKey: true,
    body: commit ? { commit: true } : { rollback: true },
  });
}

async function inTransaction<T>(work: (transactionId: string) => Promise<T>) {
  const transactionId = await beginTransaction();
  try {
    const result = await work(transactionId);
    await finishTransaction(transactionId, true);
    return result;
  } catch (error) {
    await finishTransaction(transactionId, false).catch(() => undefined);
    throw error;
  }
}

function attributeValue(row: AttributeRow) {
  if (row.dataType === "number") return String(row.valueNumber ?? "");
  if (row.dataType === "boolean") return row.valueBoolean ? "Yes" : "No";
  return row.valueText ?? "";
}

function assembleProduct(
  product: ProductRow,
  variants: VariantRow[],
  media: MediaRow[],
  attributes: AttributeRow[],
): AdminProduct {
  const variant = variants.sort((a, b) => a.sortOrder - b.sortOrder)[0];
  if (!variant) {
    throw new AdminApiError(422, "missing_variant", `Product ${product.name} has no variant.`);
  }
  return {
    id: product.$id,
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
    modelNumber: product.modelNumber ?? null,
    manufacturerPartNumber: product.manufacturerPartNumber ?? null,
    taxInclusive: product.taxInclusive,
    featured: product.featured,
    sortOrder: product.sortOrder,
    seoTitle: product.seoTitle ?? null,
    seoDescription: product.seoDescription ?? null,
    status: product.status,
    publishedAt: product.publishedAt ?? null,
    version: asVersion(product.version),
    updatedAt: product.$updatedAt,
    variant: {
      id: variant.$id,
      name: variant.name,
      sku: variant.sku,
      priceCents: variant.priceCents,
      currency: "AUD",
      weightG: variant.weightG ?? null,
      leadTimeDays: variant.leadTimeDays,
      active: variant.active,
      trackInventory: variant.trackInventory ?? true,
      lowStockThreshold: variant.lowStockThreshold ?? 2,
      stock: variant.stock,
      reservedStock: variant.reservedStock ?? 0,
      availability: variant.availability,
      version: asVersion(variant.version),
    },
    media: media
      .sort((a, b) => (a.isPrimary === b.isPrimary ? a.position - b.position : a.isPrimary ? -1 : 1))
      .map((item) => ({
        id: item.$id,
        fileId: item.fileId,
        url: storageFileUrl(item.fileId),
        altText: item.altText,
        position: item.position,
        isPrimary: item.isPrimary,
        mimeType: item.mimeType ?? null,
      })),
    attributes: attributes
      .sort((a, b) => a.position - b.position)
      .map((item) => ({
        id: item.$id,
        code: item.code,
        name: item.name,
        value: attributeValue(item),
        unitSymbol: item.unitSymbol ?? null,
      })),
  };
}

async function relatedRows(productId: string, transactionId?: string) {
  const query = [Query.equal("productId", [productId])];
  const [variants, media, attributes] = await Promise.all([
    listRows(catalogueResources.variantsTableId, variantRowSchema, query, transactionId),
    listRows(catalogueResources.mediaTableId, mediaRowSchema, query, transactionId),
    listRows(catalogueResources.attributesTableId, attributeRowSchema, query, transactionId),
  ]);
  return { variants, media, attributes };
}

export async function getAdminProduct(productId: string) {
  const product = await getRow(catalogueResources.productsTableId, productId, productRowSchema);
  const related = await relatedRows(productId);
  return assembleProduct(product, related.variants, related.media, related.attributes);
}

export async function listAdminProducts(): Promise<AdminProductSummary[]> {
  const [products, variants, media] = await Promise.all([
    listRows(catalogueResources.productsTableId, productRowSchema, [Query.orderDesc("$updatedAt")]),
    listRows(catalogueResources.variantsTableId, variantRowSchema),
    listRows(catalogueResources.mediaTableId, mediaRowSchema),
  ]);
  const variantsByProduct = new Map(variants.map((variant) => [variant.productId, variant]));
  const mediaByProduct = new Map(
    media
      .sort((a, b) => (a.isPrimary === b.isPrimary ? a.position - b.position : a.isPrimary ? -1 : 1))
      .map((item) => [item.productId, item]),
  );
  return products.flatMap((product) => {
    const variant = variantsByProduct.get(product.$id);
    if (!variant) return [];
    const image = mediaByProduct.get(product.$id);
    return [{
      id: product.$id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      status: product.status,
      featured: product.featured,
      updatedAt: product.$updatedAt,
      version: asVersion(product.version),
      sku: variant.sku,
      priceCents: variant.priceCents,
      stock: variant.stock,
      reservedStock: variant.reservedStock ?? 0,
      lowStockThreshold: variant.lowStockThreshold ?? 2,
      trackInventory: variant.trackInventory ?? true,
      imageUrl: image ? storageFileUrl(image.fileId) : null,
      imageAlt: image?.altText ?? null,
      variantId: variant.$id,
      variantVersion: asVersion(variant.version),
    }];
  });
}

function productData(input: AdminProductInput, actorUserId: string, version: number) {
  return {
    slug: input.slug,
    name: input.name,
    category: input.category,
    productType: input.productType,
    productTypeLabel: input.productTypeLabel,
    shortDescription: input.shortDescription,
    description: input.description,
    brand: input.brand,
    material: input.material,
    metals: input.metals,
    gemstones: input.gemstones,
    specification: input.specification,
    modelNumber: input.modelNumber,
    manufacturerPartNumber: input.manufacturerPartNumber,
    taxInclusive: input.taxInclusive,
    featured: input.featured,
    sortOrder: input.sortOrder,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    updatedBy: actorUserId,
    version,
  };
}

function variantData(input: AdminProductInput, productId: string, version: number) {
  const currentStock = 0;
  return {
    productId,
    sku: input.variant.sku,
    name: input.variant.name,
    priceCents: input.variant.priceCents,
    currency: "AUD",
    weightG: input.variant.weightG,
    leadTimeDays: input.variant.leadTimeDays,
    active: input.variant.active,
    sortOrder: 0,
    trackInventory: input.variant.trackInventory,
    lowStockThreshold: input.variant.lowStockThreshold,
    reservedStock: 0,
    stock: currentStock,
    availability: input.variant.trackInventory ? "out-of-stock" : "made-to-order",
    version,
  };
}

function attributeData(input: AdminProductInput["attributes"][number], productId: string, position: number) {
  return {
    productId,
    code: input.code,
    name: input.name,
    dataType: "text",
    valueText: input.value,
    valueNumber: null,
    valueBoolean: null,
    unitSymbol: input.unitSymbol,
    position,
    version: 1,
  };
}

async function createAudit(
  transactionId: string,
  actorUserId: string,
  entityType: "product" | "variant" | "media" | "inventory",
  entityId: string,
  action: string,
  summary: string,
  beforeData?: unknown,
  afterData?: unknown,
) {
  const serialize = (value: unknown) => value === undefined ? null : JSON.stringify(value).slice(0, 50_000);
  return createRow(
    catalogueResources.auditTableId,
    newResourceId(),
    {
      entityType,
      entityId,
      action,
      actorUserId,
      summary,
      beforeData: serialize(beforeData),
      afterData: serialize(afterData),
      occurredAt: new Date().toISOString(),
    },
    [],
    transactionId,
  );
}

export async function createAdminProduct(input: AdminProductInput, actorUserId: string) {
  const productId = newResourceId();
  const variantId = newResourceId();
  await inTransaction(async (transactionId) => {
    await createRow(
      catalogueResources.productsTableId,
      productId,
      {
        ...productData(input, actorUserId, 1),
        status: "draft",
        publishedAt: null,
        createdBy: actorUserId,
      },
      [],
      transactionId,
    );
    await createRow(
      catalogueResources.variantsTableId,
      variantId,
      variantData(input, productId, 1),
      [],
      transactionId,
    );
    for (const [position, attribute] of input.attributes.entries()) {
      await createRow(
        catalogueResources.attributesTableId,
        newResourceId(),
        attributeData(attribute, productId, position),
        [],
        transactionId,
      );
    }
    await createAudit(
      transactionId,
      actorUserId,
      "product",
      productId,
      "product.created",
      `Created draft product ${input.name}.`,
      undefined,
      input,
    );
  });
  revalidateTag(catalogueCacheTag, "max");
  return getAdminProduct(productId);
}

export async function updateAdminProduct(
  productId: string,
  input: AdminProductInput,
  actorUserId: string,
) {
  await inTransaction(async (transactionId) => {
    const product = await getRow(
      catalogueResources.productsTableId,
      productId,
      productRowSchema,
      transactionId,
    );
    if (asVersion(product.version) !== input.version) {
      throw new AdminApiError(409, "stale_product", "This product changed. Refresh before saving again.");
    }
    const related = await relatedRows(productId, transactionId);
    const variant = related.variants.find((item) => item.$id === input.variant.id) ?? related.variants[0];
    if (!variant) throw new AdminApiError(422, "missing_variant", "This product has no variant.");
    if (asVersion(variant.version) !== input.variant.version) {
      throw new AdminApiError(409, "stale_variant", "Inventory or pricing changed. Refresh before saving again.");
    }
    const permissions = publicReadPermissions(product.status === "published");
    await updateRow(
      catalogueResources.productsTableId,
      productId,
      productData(input, actorUserId, asVersion(product.version) + 1),
      permissions,
      transactionId,
    );
    await updateRow(
      catalogueResources.variantsTableId,
      variant.$id,
      {
        ...variantData(input, productId, asVersion(variant.version) + 1),
        stock: variant.stock,
        reservedStock: variant.reservedStock ?? 0,
        availability: availabilityFor(
          variant.stock,
          variant.reservedStock ?? 0,
          input.variant.trackInventory,
          input.variant.lowStockThreshold,
        ),
      },
      permissions,
      transactionId,
    );

    const incomingIds = new Set(input.attributes.map((attribute) => attribute.id).filter(Boolean));
    for (const existing of related.attributes) {
      if (!incomingIds.has(existing.$id)) {
        await deleteRow(catalogueResources.attributesTableId, existing.$id, transactionId);
      }
    }
    for (const [position, attribute] of input.attributes.entries()) {
      if (attribute.id && related.attributes.some((item) => item.$id === attribute.id)) {
        await updateRow(
          catalogueResources.attributesTableId,
          attribute.id,
          attributeData(attribute, productId, position),
          permissions,
          transactionId,
        );
      } else {
        await createRow(
          catalogueResources.attributesTableId,
          newResourceId(),
          attributeData(attribute, productId, position),
          permissions,
          transactionId,
        );
      }
    }
    await createAudit(
      transactionId,
      actorUserId,
      "product",
      productId,
      "product.updated",
      `Updated ${input.name}.`,
      product,
      input,
    );
  });
  revalidateTag(catalogueCacheTag, "max");
  return getAdminProduct(productId);
}

function availabilityFor(stock: number, reserved: number, tracked: boolean, threshold: number) {
  if (!tracked) return "made-to-order" as const;
  const sellable = Math.max(0, stock - reserved);
  if (sellable === 0) return "out-of-stock" as const;
  if (sellable <= threshold) return "low-stock" as const;
  return "in-stock" as const;
}

async function setFilePermissions(fileId: string, published: boolean) {
  return appwriteRequest(
    "PUT",
    `/storage/buckets/${encodeURIComponent(catalogueResources.imagesBucketId)}/files/${encodeURIComponent(fileId)}`,
    { useAdminKey: true, body: { permissions: publicReadPermissions(published) } },
  );
}

export async function changeProductStatus(
  productId: string,
  status: (typeof productStatuses)[number],
  expectedVersion: number,
  actorUserId: string,
) {
  const before = await getAdminProduct(productId);
  if (before.version !== expectedVersion) {
    throw new AdminApiError(409, "stale_product", "This product changed. Refresh before changing status.");
  }
  if (status === "published") {
    if (!before.variant.active) throw new AdminApiError(422, "inactive_variant", "Activate the variant before publishing.");
    if (before.media.length === 0) throw new AdminApiError(422, "missing_image", "Add a product image before publishing.");
    await Promise.all(before.media.map((item) => setFilePermissions(item.fileId, true)));
  }

  try {
    await inTransaction(async (transactionId) => {
      const product = await getRow(catalogueResources.productsTableId, productId, productRowSchema, transactionId);
      if (asVersion(product.version) !== expectedVersion) {
        throw new AdminApiError(409, "stale_product", "This product changed. Refresh before changing status.");
      }
      const related = await relatedRows(productId, transactionId);
      const permissions = publicReadPermissions(status === "published");
      await updateRow(
        catalogueResources.productsTableId,
        productId,
        {
          status,
          publishedAt: status === "published" ? product.publishedAt ?? new Date().toISOString() : null,
          updatedBy: actorUserId,
          version: asVersion(product.version) + 1,
        },
        permissions,
        transactionId,
      );
      for (const variant of related.variants) {
        await updateRow(
          catalogueResources.variantsTableId,
          variant.$id,
          { sortOrder: variant.sortOrder },
          permissions,
          transactionId,
        );
      }
      for (const item of related.media) {
        await updateRow(
          catalogueResources.mediaTableId,
          item.$id,
          { position: item.position },
          permissions,
          transactionId,
        );
      }
      for (const attribute of related.attributes) {
        await updateRow(
          catalogueResources.attributesTableId,
          attribute.$id,
          { position: attribute.position },
          permissions,
          transactionId,
        );
      }
      await createAudit(
        transactionId,
        actorUserId,
        "product",
        productId,
        `product.${status}`,
        `Changed ${product.name} to ${status}.`,
        { status: product.status },
        { status },
      );
    });
  } catch (error) {
    if (status === "published") {
      await Promise.allSettled(before.media.map((item) => setFilePermissions(item.fileId, false)));
    }
    throw error;
  }
  if (status !== "published") {
    await Promise.allSettled(before.media.map((item) => setFilePermissions(item.fileId, false)));
  }
  revalidateTag(catalogueCacheTag, "max");
  return getAdminProduct(productId);
}

export async function adjustInventory(input: InventoryAdjustmentInput, actorUserId: string) {
  const existing = await listRows(catalogueResources.inventoryTableId, movementRowSchema, [
    Query.equal("operationId", [input.operationId]),
  ], undefined, 1);
  if (existing[0]) return toMovement(existing[0]);

  const movementId = newResourceId();
  await inTransaction(async (transactionId) => {
    const variant = await getRow(
      catalogueResources.variantsTableId,
      input.variantId,
      variantRowSchema,
      transactionId,
    );
    if (asVersion(variant.version) !== input.expectedVersion) {
      throw new AdminApiError(409, "stale_inventory", "Stock changed. Refresh before adjusting it again.");
    }
    if (!(variant.trackInventory ?? true)) {
      throw new AdminApiError(422, "inventory_not_tracked", "This made-to-order product does not track stock.");
    }
    const stockAfter = variant.stock + input.quantityDelta;
    if (stockAfter < 0) {
      throw new AdminApiError(422, "negative_stock", "This adjustment would make stock negative.");
    }
    const version = asVersion(variant.version) + 1;
    await updateRow(
      catalogueResources.variantsTableId,
      variant.$id,
      {
        stock: stockAfter,
        availability: availabilityFor(
          stockAfter,
          variant.reservedStock ?? 0,
          true,
          variant.lowStockThreshold ?? 2,
        ),
        version,
      },
      undefined,
      transactionId,
    );
    const movement = {
      productId: variant.productId,
      variantId: variant.$id,
      movementType: input.movementType,
      quantityDelta: input.quantityDelta,
      stockBefore: variant.stock,
      stockAfter,
      reason: input.reason,
      referenceId: input.referenceId,
      actorUserId,
      operationId: input.operationId,
      occurredAt: new Date().toISOString(),
    };
    await createRow(catalogueResources.inventoryTableId, movementId, movement, [], transactionId);
    await createAudit(
      transactionId,
      actorUserId,
      "inventory",
      movementId,
      "inventory.adjusted",
      `Adjusted ${variant.sku} by ${input.quantityDelta}.`,
      { stock: variant.stock },
      { stock: stockAfter, reason: input.reason },
    );
  });
  revalidateTag(catalogueCacheTag, "max");
  return getRow(catalogueResources.inventoryTableId, movementId, movementRowSchema).then(toMovement);
}

function toMovement(row: z.infer<typeof movementRowSchema>): InventoryMovement {
  return {
    id: row.$id,
    productId: row.productId,
    variantId: row.variantId,
    movementType: row.movementType,
    quantityDelta: row.quantityDelta,
    stockBefore: row.stockBefore,
    stockAfter: row.stockAfter,
    reason: row.reason,
    referenceId: row.referenceId ?? null,
    actorUserId: row.actorUserId,
    operationId: row.operationId,
    occurredAt: row.occurredAt,
  };
}

export async function listInventoryMovements(limit = 50) {
  const rows = await listRows(catalogueResources.inventoryTableId, movementRowSchema, [
    Query.orderDesc("occurredAt"),
  ], undefined, Math.min(limit, 100));
  return rows.slice(0, Math.min(limit, 100)).map(toMovement);
}

export async function uploadProductImage(
  productId: string,
  file: File,
  altText: string,
  actorUserId: string,
) {
  const product = await getAdminProduct(productId);
  const fileId = newResourceId();
  const upload = new FormData();
  upload.set("fileId", fileId);
  upload.set("file", file, file.name);
  await appwriteRequest(
    "POST",
    `/storage/buckets/${encodeURIComponent(catalogueResources.imagesBucketId)}/files`,
    { useAdminKey: true, form: upload },
  );
  if (product.status === "published") await setFilePermissions(fileId, true);

  const mediaId = newResourceId();
  try {
    await inTransaction(async (transactionId) => {
      const related = await relatedRows(productId, transactionId);
      for (const item of related.media.filter((candidate) => candidate.isPrimary)) {
        await updateRow(
          catalogueResources.mediaTableId,
          item.$id,
          { isPrimary: false },
          publicReadPermissions(product.status === "published"),
          transactionId,
        );
      }
      await createRow(
        catalogueResources.mediaTableId,
        mediaId,
        {
          productId,
          fileId,
          altText,
          position: related.media.reduce((highest, item) => Math.max(highest, item.position), -1) + 1,
          isPrimary: true,
          mimeType: file.type,
          version: 1,
        },
        publicReadPermissions(product.status === "published"),
        transactionId,
      );
      await createAudit(
        transactionId,
        actorUserId,
        "media",
        mediaId,
        "media.uploaded",
        `Uploaded a primary image for ${product.name}.`,
        undefined,
        { fileId, altText },
      );
    });
  } catch (error) {
    await appwriteRequest(
      "DELETE",
      `/storage/buckets/${encodeURIComponent(catalogueResources.imagesBucketId)}/files/${encodeURIComponent(fileId)}`,
      { useAdminKey: true },
    ).catch(() => undefined);
    throw error;
  }
  revalidateTag(catalogueCacheTag, "max");
  return getAdminProduct(productId);
}

export async function deleteProductImage(productId: string, mediaId: string, actorUserId: string) {
  const product = await getAdminProduct(productId);
  const media = product.media.find((item) => item.id === mediaId);
  if (!media) throw new AdminApiError(404, "media_not_found", "The image was not found.");
  if (product.status === "published" && product.media.length === 1) {
    throw new AdminApiError(422, "last_published_image", "Unpublish the product before removing its last image.");
  }
  await inTransaction(async (transactionId) => {
    await deleteRow(catalogueResources.mediaTableId, mediaId, transactionId);
    if (media.isPrimary) {
      const next = product.media.find((item) => item.id !== mediaId);
      if (next) {
        await updateRow(
          catalogueResources.mediaTableId,
          next.id,
          { isPrimary: true },
          publicReadPermissions(product.status === "published"),
          transactionId,
        );
      }
    }
    await createAudit(
      transactionId,
      actorUserId,
      "media",
      mediaId,
      "media.deleted",
      `Removed an image from ${product.name}.`,
      { fileId: media.fileId, altText: media.altText },
    );
  });
  await appwriteRequest(
    "DELETE",
    `/storage/buckets/${encodeURIComponent(catalogueResources.imagesBucketId)}/files/${encodeURIComponent(media.fileId)}`,
    { useAdminKey: true },
  ).catch(() => undefined);
  revalidateTag(catalogueCacheTag, "max");
  return getAdminProduct(productId);
}

export async function listAuditEntries(limit = 100): Promise<AuditEntry[]> {
  const rows = await listRows(catalogueResources.auditTableId, auditRowSchema, [
    Query.orderDesc("occurredAt"),
  ], undefined, Math.min(limit, 100));
  return rows.slice(0, Math.min(limit, 100)).map((row) => ({
    id: row.$id,
    entityType: row.entityType,
    entityId: row.entityId,
    action: row.action,
    actorUserId: row.actorUserId,
    summary: row.summary,
    occurredAt: row.occurredAt,
  }));
}
