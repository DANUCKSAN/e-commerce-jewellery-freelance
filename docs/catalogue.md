# Catalogue data model

The single-vendor catalogue is backed by Appwrite TablesDB and Storage. It has a public read model and a protected administration workflow. Resource IDs live in `appwrite/catalogue-resources.json`, which is shared by runtime configuration and the provisioning command.

## Tables

### `products`

Owns product identity, merchandising copy, classification, SEO-ready descriptions, publication state, featured state, and curated order. A unique index protects `slug`; a composite index supports the public `status + sortOrder` query.

### `product-variants`

Owns sellable data that can vary independently: SKU, price in minor currency units, currency, stock, availability, weight, lead time, active state, and order. SKU is unique. `productId` is a stable product row ID.

### `product-media`

Maps a product to an Appwrite Storage file with accessible alt text, primary state, and position. `(productId, position)` is unique.

### `product-attributes`

Stores ordered display specifications with typed text, number, or boolean values and an optional unit. `(productId, code)` is unique.

### `inventory-movements`

Append-only stock ledger. Every adjustment stores the before/after quantity, signed delta, reason, reference, actor, idempotency key, and timestamp. `operationId` is unique so a retried request cannot change stock twice.

### `admin-audit-log`

Append-only history for product, variant, media, and inventory actions. Audit entries include the actor, action, summary, timestamp, and bounded before/after snapshots.

## Access control

- All tables enable row security. The `store-admins` team receives role-specific table permissions.
- Provisioned published rows receive only `read("any")`.
- Draft and archived rows have no public row permissions.
- The image bucket enables file security and grants write access only to catalogue managers and owners.
- Provisioned product files receive only `read("any")`.
- Inventory movements and audit entries are append-only through the application workflow; neither has an admin update/delete path.
- Server API keys must never be exposed as `NEXT_PUBLIC_` variables.

## Runtime behaviour

The repository reads published products and their active variants, media, and attributes in parallel. Appwrite responses are validated before they reach UI components. Successful snapshots are cached by Next.js for 60 seconds and invalidated after admin writes. Appwrite list caching is disabled so there is only one cache authority. Missing configuration, timeouts, API errors, or invalid relational data produce a finite, user-friendly unavailable state rather than a retry loop or fixture fallback.

## Provisioning behaviour

`npm run catalogue:check` validates all seed relationships and local image files without network access. `npm run catalogue:provision` creates or updates the admin team, tables, indexes, permissions, bucket, deterministic rows, and files. It deliberately does not delete rows that are absent from the seed; administrators archive products instead.
