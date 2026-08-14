# AURELLE Fine Jewellery

A portfolio-grade luxury jewellery storefront built with the Next.js App Router. AURELLE is a fictional Australian fine-jewellery house offering modern heirlooms in diamond, gold, silver, and platinum.

The catalogue and commerce preview are currently frontend-led and supplied by typed local jewellery data. Customer registration, sign-in, session restoration, initials avatars, and sign-out are backed by Appwrite Authentication.

## Experience

- Editorial, responsive home page with original campaign photography
- Dedicated collection page with URL-backed material, piece, price, and sort filters
- Eight statically generated product detail pages
- Interactive size selection, favourites, and add-to-bag feedback
- Polished checkout concept, Appwrite email/password authentication, loading state, and product 404
- Accessible mobile navigation, visible keyboard focus, reduced-motion support, and responsive imagery
- Original AURELLE wordmark, design system, product naming, copy, and AI-generated jewellery photography

## Stack

- Next.js 16.2 and React 19
- TypeScript and Tailwind CSS 4
- Appwrite Authentication
- Lucide icons
- Optimised local WebP campaign and product imagery

## Local development

Use Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT_ID` in `.env.local`, then open [http://localhost:3000](http://localhost:3000).

In the Appwrite Console, enable email/password authentication and add both `localhost` and the production hostname as Web platforms. The browser values above identify the public Appwrite endpoint and project; they are not API keys.

## Project structure

- `app/(root)` — storefront, collection, product, and checkout routes
- `app/(auth)` — sign-in and account creation experiences
- `components` — shared editorial and commerce UI
- `lib/appwrite` — Appwrite client configuration and account workflow
- `lib/catalogue.ts` — typed Aurelle catalogue and product fixtures
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

Appwrite currently provides customer authentication. Persistent wishlists, carts, inventory, orders, vendor operations, and payments remain future backend phases; the related storefront controls are still clearly marked as portfolio previews.
