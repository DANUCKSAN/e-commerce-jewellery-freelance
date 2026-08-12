import HeroExperience from "../../components/HeroExperience";
import HomeEditorial from "../../components/HomeEditorial";
import ProductCatalogue from "../../components/ProductCatalogue";
import { getCatalogue } from "../../lib/catalogue";
import { createStorefrontProducts } from "../../lib/storefront-products";

export default async function StorefrontPage() {
  const products = createStorefrontProducts(await getCatalogue());

  return (
    <main className="overflow-clip bg-light-200 font-sans text-dark-900">
      <HeroExperience />
      <HomeEditorial
        featured={<ProductCatalogue products={products} mode="featured" />}
      />
    </main>
  );
}
