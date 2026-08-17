# Catalogue data model

The first single-vendor commerce feature is a read-only public product catalogue backed by Appwrite TablesDB and Storage. Resource IDs live in `appwrite/catalogue-resources.json`, which is shared by runtime configuration and the provisioning command.

## Tables

### `products`

Owns product identity, merchandising copy, classification, SEO-ready descriptions, publication state, featured state, and curated order. A unique index protects `slug`; a composite index supports the public `status + sortOrder` query.

### `product-variants`

Owns sellable data that can vary independently: SKU, price in minor currency units, currency, stock, availability, weight, lead time, active state, and order. SKU is unique. `productId` is a stable product row ID.

### `product-media`

Maps a product to an Appwrite Storage file with accessible alt text, primary state, and position. `(productId, position)` is unique.

### `product-attributes`

Stores ordered display specifications with typed text, number, or boolean values and an optional unit. `(productId, code)` is unique.

## Access control

- All tables enable row security and have no public table permissions.
- Provisioned published rows receive only `read("any")`.
- The image bucket enables file security and has no public bucket permissions.
- Provisioned product files receive only `read("any")`.
- The server API key is used by the provisioning command only and must never be exposed as a `NEXT_PUBLIC_` variable.

## Runtime behaviour

The repository reads published products and their active variants, media, and attributes in parallel. Appwrite responses are validated before they reach UI components. Successful snapshots are cached for 60 seconds; missing configuration, timeouts, API errors, or invalid relational data produce a finite, user-friendly unavailable state rather than a retry loop or fixture fallback.

## Provisioning behaviour

`npm run catalogue:check` validates all seed relationships and local image files without network access. `npm run catalogue:provision` creates missing resources and upserts deterministic rows and files. It deliberately does not delete rows that are absent from the seed; removals should be an explicit future administration workflow.
