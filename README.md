# AURELLE Fine Jewellery

A portfolio-grade luxury jewellery storefront built with the Next.js App Router. AURELLE is a fictional Australian fine-jewellery house offering modern heirlooms in diamond, gold, silver, and platinum.

The public catalogue, product media, customer registration, sign-in, session restoration, initials avatars, sign-out, and protected store administration are backed by Appwrite. Product seed data is used only by the provisioning command and is never imported by the storefront runtime.

## Experience

- Editorial, responsive home page with original campaign photography
- Dedicated collection page with URL-backed material, piece, price, and sort filters
- Appwrite-backed collection and product detail pages with validated data and controlled outage states
- Interactive size selection, favourites, and add-to-bag feedback
- Polished checkout concept, Appwrite email/password authentication, loading state, and product 404
- Accessible mobile navigation, visible keyboard focus, reduced-motion support, and responsive imagery
- Original AURELLE wordmark, design system, product naming, copy, and AI-generated jewellery photography
- Role-protected product, publishing, image, inventory, and audit administration

## Stack

- Next.js 16.2 and React 19
- TypeScript and Tailwind CSS 4
- Appwrite Authentication, TablesDB, and Storage
- Lucide icons
- Optimised local WebP campaign and product imagery

## Local development

Use Node.js 20.19 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT_ID` in `.env.local`, then open [http://localhost:3000](http://localhost:3000).

In the Appwrite Console, enable email/password authentication and add both `localhost` and the production hostname as Web platforms. The browser values above identify the public Appwrite endpoint and project; they are not API keys.

### Provision the product catalogue

Create a temporary, narrowly scoped Appwrite server API key that can manage teams, databases/tables/columns/indexes/rows, and storage buckets/files. Add it to `.env.local` as `APPWRITE_API_KEY` without a `NEXT_PUBLIC_` prefix, then run:

```bash
npm run catalogue:check
npm run catalogue:provision
```

The command is idempotent: it creates or updates the admin team, schema, permissions, and product image bucket, uploads deterministic image files, and upserts the catalogue rows. Products are published only after their price, media, and attributes exist. Remove the temporary API key from `.env.local` and revoke it in Appwrite after provisioning.

Tables use row-level permissions. Published seed rows and their files receive public read access, while no public create, update, or delete permissions are granted. The full schema is documented in [`docs/catalogue.md`](docs/catalogue.md).

### Configure store administration

Add the intended administrator to the provisioned `store-admins` Appwrite team with the `owner`, `catalogue-manager`, or `inventory-manager` role. Create a separate runtime key with only `teams.read`, `rows.read`, `rows.write`, `files.read`, and `files.write`, and set it as the server-only `APPWRITE_ADMIN_API_KEY` value. Then sign in and open `/admin`.

The complete role, security, deployment, and operational checklist is in [`docs/admin-products-inventory.md`](docs/admin-products-inventory.md).

## Project structure

- `app/(root)` — storefront, collection, product, and checkout routes
- `app/(auth)` — sign-in and account creation experiences
- `app/(admin)` — protected product and inventory administration
- `app/api/admin` — authenticated, role-checked admin route handlers
- `components` — shared editorial and commerce UI
- `lib/appwrite` — Appwrite resource configuration and account workflow
- `lib/catalogue.ts` — validated, cached Appwrite catalogue repository
- `lib/catalogue-model.ts` — catalogue domain types shared with the UI
- `lib/admin` — validated contracts, Appwrite boundary, and transactional services
- `scripts/provision-catalogue.mjs` — idempotent schema, media, and seed provisioning
- `lib/storefront-products.ts` — presentation adapter for jewellery cards and filters
- `public/images/aurelle` — original, locally served campaign and product imagery

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

The production build requires the Node.js version declared in `package.json`.

## Scope boundary

Appwrite currently provides customer authentication, the public product catalogue, and single-vendor product/inventory administration. Persistent wishlists, carts, orders, fulfilment, and payments remain future backend phases; the related storefront controls are still clearly marked as portfolio previews.
