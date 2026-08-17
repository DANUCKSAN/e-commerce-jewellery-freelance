import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const seed = JSON.parse(
  fs.readFileSync(
    path.join(projectRoot, "scripts/catalogue-seed-data.json"),
    "utf8",
  ),
);
const resources = JSON.parse(
  fs.readFileSync(
    path.join(projectRoot, "appwrite/catalogue-resources.json"),
    "utf8",
  ),
);

const dryRun = process.argv.includes("--dry-run");
const publicRead = 'read("any")';
const team = `team:${resources.adminTeamId}`;
const owner = `${team}/owner`;
const catalogueManager = `${team}/catalogue-manager`;
const inventoryManager = `${team}/inventory-manager`;
const cataloguePermissions = [
  `read("${team}")`,
  `create("${catalogueManager}")`,
  `create("${owner}")`,
  `update("${catalogueManager}")`,
  `update("${owner}")`,
  `delete("${owner}")`,
];

const varchar = (key, size, options = {}) => ({
  type: "varchar",
  body: { key, size, required: true, array: false, encrypt: false, ...options },
});
const mediumtext = (key, options = {}) => ({
  type: "mediumtext",
  body: { key, required: true, array: false, encrypt: false, ...options },
});
const enumeration = (key, elements, options = {}) => ({
  type: "enum",
  body: { key, elements, required: true, array: false, ...options },
});
const integer = (key, options = {}) => ({
  type: "integer",
  body: { key, required: true, min: 0, array: false, ...options },
});
const float = (key, options = {}) => ({
  type: "float",
  body: { key, required: true, min: 0, array: false, ...options },
});
const boolean = (key, options = {}) => ({
  type: "boolean",
  body: { key, required: true, array: false, ...options },
});
const datetime = (key, options = {}) => ({
  type: "datetime",
  body: { key, required: true, array: false, ...options },
});

const tableDefinitions = [
  {
    id: resources.productsTableId,
    name: "Products",
    permissions: cataloguePermissions,
    columns: [
      varchar("slug", 180),
      varchar("name", 220),
      enumeration("category", ["diamond", "gold", "silver", "platinum"]),
      enumeration("productType", [
        "ring",
        "earrings",
        "bracelet",
        "necklace",
        "pendant",
      ]),
      varchar("productTypeLabel", 120),
      varchar("shortDescription", 1200),
      mediumtext("description"),
      varchar("brand", 120),
      varchar("material", 180),
      varchar("metals", 64, { array: true }),
      varchar("gemstones", 64, { array: true }),
      varchar("specification", 500),
      varchar("modelNumber", 100, { required: false }),
      varchar("manufacturerPartNumber", 120, { required: false }),
      boolean("taxInclusive"),
      enumeration("status", ["draft", "published", "archived"]),
      boolean("featured"),
      integer("sortOrder"),
      varchar("seoTitle", 220, { required: false }),
      varchar("seoDescription", 500, { required: false }),
      datetime("publishedAt", { required: false }),
      varchar("createdBy", 36, { required: false }),
      varchar("updatedBy", 36, { required: false }),
      integer("version", { required: false, default: 1 }),
    ],
    indexes: [
      { key: "slug_unique", type: "unique", columns: ["slug"] },
      {
        key: "status_sort",
        type: "key",
        columns: ["status", "sortOrder"],
        orders: ["ASC", "ASC"],
      },
    ],
  },
  {
    id: resources.variantsTableId,
    name: "Product variants",
    permissions: cataloguePermissions,
    columns: [
      varchar("productId", 36),
      varchar("sku", 100),
      varchar("name", 180),
      integer("priceCents"),
      varchar("currency", 3),
      integer("stock"),
      enumeration("availability", [
        "in-stock",
        "low-stock",
        "made-to-order",
        "out-of-stock",
      ]),
      float("weightG", { required: false }),
      integer("leadTimeDays"),
      boolean("active"),
      integer("sortOrder"),
      boolean("trackInventory", { required: false, default: true }),
      integer("lowStockThreshold", { required: false, default: 2 }),
      integer("reservedStock", { required: false, default: 0 }),
      integer("version", { required: false, default: 1 }),
    ],
    indexes: [
      { key: "sku_unique", type: "unique", columns: ["sku"] },
      { key: "active", type: "key", columns: ["active"] },
      {
        key: "product_sort",
        type: "key",
        columns: ["productId", "sortOrder"],
        orders: ["ASC", "ASC"],
      },
    ],
  },
  {
    id: resources.mediaTableId,
    name: "Product media",
    permissions: cataloguePermissions,
    columns: [
      varchar("productId", 36),
      varchar("fileId", 36),
      varchar("altText", 300),
      integer("position"),
      boolean("isPrimary"),
      varchar("mimeType", 100, { required: false }),
      integer("width", { required: false }),
      integer("height", { required: false }),
      integer("version", { required: false, default: 1 }),
    ],
    indexes: [
      {
        key: "product_position",
        type: "unique",
        columns: ["productId", "position"],
        orders: ["ASC", "ASC"],
      },
    ],
  },
  {
    id: resources.attributesTableId,
    name: "Product attributes",
    permissions: cataloguePermissions,
    columns: [
      varchar("productId", 36),
      varchar("code", 100),
      varchar("name", 160),
      enumeration("dataType", ["text", "number", "boolean"]),
      varchar("valueText", 1000, { required: false }),
      float("valueNumber", { required: false }),
      boolean("valueBoolean", { required: false }),
      varchar("unitSymbol", 32, { required: false }),
      integer("position"),
      integer("version", { required: false, default: 1 }),
    ],
    indexes: [
      {
        key: "product_code_unique",
        type: "unique",
        columns: ["productId", "code"],
      },
      {
        key: "product_position",
        type: "key",
        columns: ["productId", "position"],
        orders: ["ASC", "ASC"],
      },
    ],
  },
  {
    id: resources.inventoryTableId,
    name: "Inventory movements",
    permissions: [
      `read("${team}")`,
      `create("${inventoryManager}")`,
      `create("${catalogueManager}")`,
      `create("${owner}")`,
    ],
    columns: [
      varchar("productId", 36),
      varchar("variantId", 36),
      enumeration("movementType", [
        "restock",
        "adjustment",
        "damage",
        "return",
        "correction",
        "reservation",
        "release",
        "sale",
      ]),
      integer("quantityDelta", { min: -1_000_000, max: 1_000_000 }),
      integer("stockBefore"),
      integer("stockAfter"),
      varchar("reason", 500),
      varchar("referenceId", 100, { required: false }),
      varchar("actorUserId", 36),
      varchar("operationId", 36),
      datetime("occurredAt"),
    ],
    indexes: [
      { key: "operation_unique", type: "unique", columns: ["operationId"] },
      {
        key: "variant_occurred",
        type: "key",
        columns: ["variantId", "occurredAt"],
        orders: ["ASC", "DESC"],
      },
      {
        key: "product_occurred",
        type: "key",
        columns: ["productId", "occurredAt"],
        orders: ["ASC", "DESC"],
      },
    ],
  },
  {
    id: resources.auditTableId,
    name: "Admin audit log",
    permissions: [
      `read("${team}")`,
      `create("${inventoryManager}")`,
      `create("${catalogueManager}")`,
      `create("${owner}")`,
    ],
    columns: [
      enumeration("entityType", ["product", "variant", "media", "inventory"]),
      varchar("entityId", 36),
      varchar("action", 100),
      varchar("actorUserId", 36),
      varchar("summary", 500),
      mediumtext("beforeData", { required: false }),
      mediumtext("afterData", { required: false }),
      datetime("occurredAt"),
    ],
    indexes: [
      {
        key: "entity_occurred",
        type: "key",
        columns: ["entityType", "entityId", "occurredAt"],
        orders: ["ASC", "ASC", "DESC"],
      },
      {
        key: "actor_occurred",
        type: "key",
        columns: ["actorUserId", "occurredAt"],
        orders: ["ASC", "DESC"],
      },
    ],
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(`Seed validation failed: ${message}`);
}

function stableId(prefix, value) {
  const digest = crypto.createHash("sha256").update(value).digest("hex");
  return `${prefix}-${digest.slice(0, 32)}`;
}

function validateSeed() {
  assert(Array.isArray(seed) && seed.length > 0, "no products found");
  const slugs = new Set();
  const skus = new Set();

  for (const product of seed) {
    assert(typeof product.slug === "string" && product.slug, "missing slug");
    assert(!slugs.has(product.slug), `duplicate slug ${product.slug}`);
    slugs.add(product.slug);
    assert(
      typeof product.catalogSku === "string" && product.catalogSku,
      `${product.slug}: missing SKU`,
    );
    assert(
      !skus.has(product.catalogSku),
      `duplicate SKU ${product.catalogSku}`,
    );
    skus.add(product.catalogSku);
    assert(
      Number.isInteger(product.priceCents) && product.priceCents >= 0,
      `${product.slug}: invalid price`,
    );
    assert(
      Number.isInteger(product.stock) && product.stock >= 0,
      `${product.slug}: invalid stock`,
    );
    assert(
      Array.isArray(product.attributes),
      `${product.slug}: attributes must be an array`,
    );

    const codes = new Set();
    for (const attribute of product.attributes) {
      assert(
        !codes.has(attribute.code),
        `${product.slug}: duplicate attribute ${attribute.code}`,
      );
      codes.add(attribute.code);
      if (attribute.dataType === "number") {
        assert(
          Number.isFinite(Number(attribute.valueNumber)),
          `${product.slug}: invalid numeric attribute ${attribute.code}`,
        );
      }
    }

    const relativeImage = product.image.replace(/^\//, "");
    const imagePath = path.resolve(
      projectRoot,
      "public",
      relativeImage.replace(/^public\//, ""),
    );
    const publicRoot = path.resolve(projectRoot, "public") + path.sep;
    assert(
      imagePath.startsWith(publicRoot),
      `${product.slug}: image is outside public/`,
    );
    assert(
      fs.existsSync(imagePath),
      `${product.slug}: missing image ${product.image}`,
    );
  }
}

function prepareRows() {
  return seed.map((product, sortOrder) => {
    const productId = stableId("prd", product.slug);
    const variantId = stableId("var", product.catalogSku);
    const fileId = stableId("img", product.image);
    const mediaId = stableId("med", `${product.slug}:0`);
    const imagePath = path.resolve(
      projectRoot,
      "public",
      product.image.replace(/^\//, ""),
    );

    return {
      image: { fileId, imagePath },
      product: {
        id: productId,
        data: {
          slug: product.slug,
          name: product.name,
          category: product.category,
          productType: product.productType,
          productTypeLabel: product.productTypeLabel,
          shortDescription: product.shortDescription,
          description: product.description,
          brand: product.manufacturer,
          material: product.material,
          metals: product.metals,
          gemstones: product.gemstones,
          specification: product.specification,
          modelNumber: product.modelNumber,
          manufacturerPartNumber: product.manufacturerPartNumber,
          taxInclusive: product.taxInclusive,
          status: "published",
          featured: product.featured,
          sortOrder,
          seoTitle: product.name,
          seoDescription: product.shortDescription.slice(0, 500),
          publishedAt: new Date().toISOString(),
          version: 1,
        },
      },
      variant: {
        id: variantId,
        data: {
          productId,
          sku: product.catalogSku,
          name: "Default",
          priceCents: product.priceCents,
          currency: product.currency,
          stock: product.stock,
          availability: product.availability,
          weightG: product.weightG,
          leadTimeDays: product.leadTimeDays,
          active: true,
          sortOrder: 0,
          trackInventory: product.availability !== "made-to-order",
          lowStockThreshold: 2,
          reservedStock: 0,
          version: 1,
        },
      },
      media: {
        id: mediaId,
        data: {
          productId,
          fileId,
          altText: `${product.name} by Aurelle`,
          position: 0,
          isPrimary: true,
          mimeType: "image/webp",
          version: 1,
        },
      },
      attributes: product.attributes.map((attribute, position) => ({
        id: stableId("atr", `${product.slug}:${attribute.code}`),
        data: {
          productId,
          code: attribute.code,
          name: attribute.name,
          dataType: attribute.dataType,
          valueText: attribute.valueText,
          valueNumber:
            attribute.valueNumber === null
              ? null
              : Number(attribute.valueNumber),
          valueBoolean: attribute.valueBoolean,
          unitSymbol: attribute.unitSymbol,
          position,
          version: 1,
        },
      })),
    };
  });
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const values = {};
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

function readConfiguration() {
  const fileValues = {
    ...parseEnvFile(path.join(projectRoot, ".env")),
    ...parseEnvFile(path.join(projectRoot, ".env.local")),
  };
  const read = (key) => process.env[key]?.trim() || fileValues[key]?.trim();
  const endpoint = read("NEXT_PUBLIC_APPWRITE_ENDPOINT")?.replace(/\/$/, "");
  const projectId = read("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  const apiKey = read("APPWRITE_API_KEY");

  assert(endpoint, "NEXT_PUBLIC_APPWRITE_ENDPOINT is not configured");
  assert(projectId, "NEXT_PUBLIC_APPWRITE_PROJECT_ID is not configured");
  assert(apiKey, "APPWRITE_API_KEY is not configured");
  const url = new URL(endpoint);
  assert(
    ["http:", "https:"].includes(url.protocol),
    "invalid Appwrite endpoint",
  );
  return { endpoint, projectId, apiKey };
}

function createApi(configuration) {
  const headers = {
    "X-Appwrite-Project": configuration.projectId,
    "X-Appwrite-Key": configuration.apiKey,
    "X-Appwrite-Response-Format": "1.9.5",
  };

  return async function request(method, resourcePath, options = {}) {
    const requestHeaders = { ...headers };
    let body;
    if (options.form) {
      body = options.form;
    } else if (options.body !== undefined) {
      requestHeaders["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }

    const response = await fetch(`${configuration.endpoint}${resourcePath}`, {
      method,
      headers: requestHeaders,
      body,
      signal: AbortSignal.timeout(30_000),
    });
    const text = response.status === 204 ? "" : await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!response.ok && !options.allow?.includes(response.status)) {
      const detail =
        payload && typeof payload === "object" && "message" in payload
          ? payload.message
          : `HTTP ${response.status}`;
      throw new Error(`${method} ${resourcePath} failed: ${detail}`);
    }
    return { status: response.status, payload };
  };
}

function encoded(value) {
  return encodeURIComponent(value);
}

async function resourceExists(api, resourcePath) {
  const response = await api("GET", resourcePath, { allow: [404] });
  return response.status === 200 ? response.payload : null;
}

async function waitUntilAvailable(api, resourcePath, label) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const resource = await resourceExists(api, resourcePath);
    if (resource?.status === "available" || !resource?.status) return;
    if (resource?.status === "failed") {
      throw new Error(
        `${label} failed to provision: ${resource.error ?? "unknown error"}`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`${label} did not become available within 60 seconds.`);
}

function assertNoPublicWrite(resource, label) {
  const permissions = resource?.$permissions ?? resource?.permissions ?? [];
  const unsafe = permissions.some(
    (permission) =>
      permission.includes('("any")') &&
      /^(create|update|delete|write)\(/.test(permission),
  );
  assert(!unsafe, `${label} grants public write access`);
}

async function ensureDatabase(api) {
  const resourcePath = `/tablesdb/${encoded(resources.databaseId)}`;
  if (await resourceExists(api, resourcePath)) return;
  await api("POST", "/tablesdb", {
    body: {
      databaseId: resources.databaseId,
      name: "Aurella Commerce",
      enabled: true,
    },
  });
  console.log(`Created database ${resources.databaseId}.`);
}

async function ensureAdminTeam(api) {
  const resourcePath = `/teams/${encoded(resources.adminTeamId)}`;
  if (await resourceExists(api, resourcePath)) return;
  await api("POST", "/teams", {
    body: {
      teamId: resources.adminTeamId,
      name: "Aurella store administrators",
      roles: ["owner", "catalogue-manager", "inventory-manager"],
    },
  });
  console.log(`Created admin team ${resources.adminTeamId}.`);
}

async function ensureTable(api, definition) {
  const base = `/tablesdb/${encoded(resources.databaseId)}/tables`;
  const resourcePath = `${base}/${encoded(definition.id)}`;
  const existing = await resourceExists(api, resourcePath);
  if (!existing) {
    await api("POST", base, {
      body: {
        tableId: definition.id,
        name: definition.name,
        permissions: definition.permissions,
        rowSecurity: true,
        enabled: true,
      },
    });
    console.log(`Created table ${definition.id}.`);
  } else {
    assertNoPublicWrite(existing, `table ${definition.id}`);
    await api("PUT", resourcePath, {
      body: {
        name: definition.name,
        permissions: definition.permissions,
        rowSecurity: true,
        enabled: true,
      },
    });
  }

  for (const column of definition.columns) {
    const columnPath = `${resourcePath}/columns/${encoded(column.body.key)}`;
    if (!(await resourceExists(api, columnPath))) {
      await api("POST", `${resourcePath}/columns/${column.type}`, {
        body: column.body,
      });
      console.log(`Created ${definition.id}.${column.body.key}.`);
    }
    await waitUntilAvailable(
      api,
      columnPath,
      `${definition.id}.${column.body.key}`,
    );
  }

  for (const index of definition.indexes) {
    const indexPath = `${resourcePath}/indexes/${encoded(index.key)}`;
    if (!(await resourceExists(api, indexPath))) {
      await api("POST", `${resourcePath}/indexes`, { body: index });
      console.log(`Created index ${definition.id}.${index.key}.`);
    }
    await waitUntilAvailable(api, indexPath, `${definition.id}.${index.key}`);
  }
}

async function ensureBucket(api) {
  const resourcePath = `/storage/buckets/${encoded(resources.imagesBucketId)}`;
  const permissions = [
    `read("${team}")`,
    `create("${catalogueManager}")`,
    `create("${owner}")`,
    `update("${catalogueManager}")`,
    `update("${owner}")`,
    `delete("${owner}")`,
  ];
  const existing = await resourceExists(api, resourcePath);
  if (!existing) {
    await api("POST", "/storage/buckets", {
      body: {
        bucketId: resources.imagesBucketId,
        name: "Product images",
        permissions,
        fileSecurity: true,
        enabled: true,
        maximumFileSize: 10_000_000,
        allowedFileExtensions: ["webp", "jpg", "jpeg", "png"],
        compression: "none",
        encryption: false,
        antivirus: true,
        transformations: true,
      },
    });
    console.log(`Created bucket ${resources.imagesBucketId}.`);
    return;
  }
  assert(
    existing.fileSecurity === true,
    `${resources.imagesBucketId} must enable file security`,
  );
  assertNoPublicWrite(existing, `bucket ${resources.imagesBucketId}`);
  await api("PUT", resourcePath, {
    body: {
      name: "Product images",
      permissions,
      fileSecurity: true,
      enabled: true,
      maximumFileSize: 10_000_000,
      allowedFileExtensions: ["webp", "jpg", "jpeg", "png"],
      compression: "none",
      encryption: false,
      antivirus: true,
      transformations: true,
    },
  });
}

async function ensureImage(api, image) {
  const base = `/storage/buckets/${encoded(resources.imagesBucketId)}/files`;
  const resourcePath = `${base}/${encoded(image.fileId)}`;
  if (!(await resourceExists(api, resourcePath))) {
    const bytes = fs.readFileSync(image.imagePath);
    const form = new FormData();
    form.append("fileId", image.fileId);
    form.append(
      "file",
      new Blob([bytes], { type: "image/webp" }),
      path.basename(image.imagePath),
    );
    await api("POST", base, { form });
    console.log(`Uploaded ${path.basename(image.imagePath)}.`);
  }
  await api("PUT", resourcePath, { body: { permissions: [publicRead] } });
}

async function upsertRow(api, tableId, row) {
  const resourcePath = `/tablesdb/${encoded(resources.databaseId)}/tables/${encoded(tableId)}/rows/${encoded(row.id)}`;
  await api("PUT", resourcePath, {
    body: { data: row.data, permissions: [publicRead] },
  });
}

async function main() {
  validateSeed();
  const prepared = prepareRows();
  const attributeCount = prepared.reduce(
    (total, product) => total + product.attributes.length,
    0,
  );

  if (dryRun) {
    console.log(
      `Catalogue seed is valid: ${prepared.length} products, ${prepared.length} variants, ${prepared.length} images, ${attributeCount} attributes.`,
    );
    console.log("Dry run complete; no Appwrite resources were changed.");
    return;
  }

  const api = createApi(readConfiguration());
  await ensureDatabase(api);
  await ensureAdminTeam(api);
  for (const definition of tableDefinitions) await ensureTable(api, definition);
  await ensureBucket(api);

  for (const item of prepared) await ensureImage(api, item.image);
  for (const item of prepared)
    await upsertRow(api, resources.variantsTableId, item.variant);
  for (const item of prepared)
    await upsertRow(api, resources.mediaTableId, item.media);
  for (const item of prepared) {
    for (const attribute of item.attributes) {
      await upsertRow(api, resources.attributesTableId, attribute);
    }
  }
  // Publish the product rows last so readers never see products without media or prices.
  for (const item of prepared)
    await upsertRow(api, resources.productsTableId, item.product);

  console.log(`Provisioned ${prepared.length} catalogue products in Appwrite.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
