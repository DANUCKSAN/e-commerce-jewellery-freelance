import { z } from "zod";

import {
  jewelleryCategories,
  jewelleryMetals,
  jewelleryProductTypes,
  productAvailabilities,
} from "@/lib/catalogue-model";

export const adminRoles = [
  "owner",
  "catalogue-manager",
  "inventory-manager",
] as const;
export type AdminRole = (typeof adminRoles)[number];

export const productStatuses = ["draft", "published", "archived"] as const;
export const inventoryMovementTypes = [
  "restock",
  "adjustment",
  "damage",
  "return",
  "correction",
  "reservation",
  "release",
  "sale",
] as const;
export const manualMovementTypes = [
  "restock",
  "adjustment",
  "damage",
  "return",
  "correction",
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional()
    .transform((value) => value || null);

export const adminAttributeInputSchema = z
  .object({
    id: z.string().trim().min(1).max(36).optional(),
    code: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(/^[a-z][a-z0-9-]*$/, "Use lower-case letters, numbers and hyphens."),
    name: z.string().trim().min(1).max(160),
    value: z.string().trim().min(1).max(1000),
    unitSymbol: optionalText(32),
  })
  .strict();

export const adminProductInputSchema = z
  .object({
    name: z.string().trim().min(2).max(220),
    slug: z
      .string()
      .trim()
      .min(2)
      .max(180)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lower-case URL slug."),
    category: z.enum(jewelleryCategories),
    productType: z.enum(jewelleryProductTypes),
    productTypeLabel: z.string().trim().min(2).max(120),
    shortDescription: z.string().trim().min(10).max(1200),
    description: z.string().trim().min(20).max(20_000),
    brand: z.string().trim().min(1).max(120).default("Aurelle"),
    material: z.string().trim().min(2).max(180),
    metals: z.array(z.enum(jewelleryMetals)).min(1),
    gemstones: z.array(z.literal("diamond")).max(1),
    specification: z.string().trim().min(2).max(500),
    modelNumber: optionalText(100),
    manufacturerPartNumber: optionalText(120),
    taxInclusive: z.boolean(),
    featured: z.boolean(),
    sortOrder: z.number().int().min(0).max(100_000),
    seoTitle: optionalText(220),
    seoDescription: optionalText(500),
    variant: z
      .object({
        id: z.string().trim().min(1).max(36).optional(),
        name: z.string().trim().min(1).max(180).default("Default"),
        sku: z
          .string()
          .trim()
          .min(2)
          .max(100)
          .regex(/^[A-Za-z0-9._-]+$/, "SKU contains unsupported characters."),
        priceCents: z.number().int().min(0).max(100_000_000),
        currency: z.literal("AUD"),
        weightG: z.number().min(0).max(100_000).nullable(),
        leadTimeDays: z.number().int().min(0).max(365),
        active: z.boolean(),
        trackInventory: z.boolean(),
        lowStockThreshold: z.number().int().min(0).max(100_000),
        version: z.number().int().min(1).optional(),
      })
      .strict(),
    attributes: z.array(adminAttributeInputSchema).max(30),
    version: z.number().int().min(1).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const codes = new Set<string>();
    for (const [index, attribute] of value.attributes.entries()) {
      if (codes.has(attribute.code)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["attributes", index, "code"],
          message: "Attribute codes must be unique.",
        });
      }
      codes.add(attribute.code);
    }
  });

export const productStatusInputSchema = z
  .object({
    status: z.enum(productStatuses),
    expectedVersion: z.number().int().min(1),
  })
  .strict();

export const inventoryAdjustmentInputSchema = z
  .object({
    variantId: z.string().trim().min(1).max(36),
    movementType: z.enum(manualMovementTypes),
    quantityDelta: z.number().int().min(-100_000).max(100_000).refine(Boolean, {
      message: "Quantity change cannot be zero.",
    }),
    reason: z.string().trim().min(3).max(500),
    referenceId: optionalText(100),
    operationId: z.string().uuid(),
    expectedVersion: z.number().int().min(1),
  })
  .strict();

export const mediaMetadataInputSchema = z
  .object({
    altText: z.string().trim().min(3).max(300),
  })
  .strict();

export type AdminProductInput = z.infer<typeof adminProductInputSchema>;
export type ProductStatusInput = z.infer<typeof productStatusInputSchema>;
export type InventoryAdjustmentInput = z.infer<
  typeof inventoryAdjustmentInputSchema
>;

export type AdminMedia = {
  id: string;
  fileId: string;
  url: string;
  altText: string;
  position: number;
  isPrimary: boolean;
  mimeType: string | null;
};

export type AdminAttribute = {
  id: string;
  code: string;
  name: string;
  value: string;
  unitSymbol: string | null;
};

export type AdminProduct = Omit<AdminProductInput, "version" | "variant" | "attributes"> & {
  id: string;
  status: (typeof productStatuses)[number];
  version: number;
  updatedAt: string;
  publishedAt: string | null;
  variant: AdminProductInput["variant"] & {
    id: string;
    stock: number;
    reservedStock: number;
    availability: (typeof productAvailabilities)[number];
    version: number;
  };
  attributes: AdminAttribute[];
  media: AdminMedia[];
};

export type AdminProductSummary = Pick<
  AdminProduct,
  "id" | "name" | "slug" | "category" | "status" | "featured" | "updatedAt" | "version"
> & {
  sku: string;
  priceCents: number;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
  variantId: string;
  variantVersion: number;
};

export type InventoryMovement = {
  id: string;
  productId: string;
  variantId: string;
  movementType: (typeof inventoryMovementTypes)[number];
  quantityDelta: number;
  stockBefore: number;
  stockAfter: number;
  reason: string;
  referenceId: string | null;
  actorUserId: string;
  operationId: string;
  occurredAt: string;
};

export type AuditEntry = {
  id: string;
  entityType: "product" | "variant" | "media" | "inventory";
  entityId: string;
  action: string;
  actorUserId: string;
  summary: string;
  occurredAt: string;
};

export type AdminSession = {
  user: { id: string; name: string; email: string };
  roles: AdminRole[];
  configured: boolean;
};
