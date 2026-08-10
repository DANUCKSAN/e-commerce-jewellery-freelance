# AURELLE Fine Jewellery

A portfolio-grade luxury jewellery storefront built with the Next.js App Router. AURELLE is a fictional Australian fine-jewellery house offering modern heirlooms in diamond, gold, silver, and platinum.

The repository is intentionally frontend-only. Its catalogue is supplied by typed local jewellery data, every route runs without external services, and interactive commerce controls clearly identify themselves as portfolio previews.

## Experience

- Editorial, responsive home page with original campaign photography
- Dedicated collection page with URL-backed material, piece, price, and sort filters
- Eight statically generated product detail pages
- Interactive size selection, favourites, and add-to-bag feedback
- Polished checkout concept, authentication screens, loading state, and product 404
- Accessible mobile navigation, visible keyboard focus, reduced-motion support, and responsive imagery
- Original AURELLE wordmark, design system, product naming, copy, and AI-generated jewellery photography

## Stack

- Next.js 16.2 and React 19
- TypeScript and Tailwind CSS 4
- Lucide icons
- Optimised local WebP campaign and product imagery

## Local development

Use Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No database, authentication provider, payment service, or environment configuration is required.

## Project structure

- `src/app/(root)` — storefront, collection, product, and checkout routes
- `src/app/(auth)` — sign-in and account creation experiences
- `src/components` — shared editorial and commerce UI
- `src/lib/catalogue.ts` — typed Aurelle catalogue and product fixtures
- `src/lib/storefront-products.ts` — presentation adapter for jewellery cards and filters
- `public/images/aurelle` — original, locally served campaign and product imagery

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

The production build requires the Node.js version declared in `package.json`.

## Scope boundary

Backend services are deliberately absent from this showcase. A future implementation can add jewellery-specific accounts, persistent wishlists, carts, inventory, orders, and payments behind the existing UI without carrying forward assumptions from the previous marketplace.
