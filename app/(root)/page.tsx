import HeroExperience from "../../components/HeroExperience";
import HomeEditorial from "../../components/HomeEditorial";
import ProductCatalogue from "../../components/ProductCatalogue";
import CatalogueUnavailable from "../../components/CatalogueUnavailable";
import { getCatalogue } from "../../lib/catalogue";
import { createStorefrontProducts } from "../../lib/storefront-products";

export default async function StorefrontPage() {
  const catalogue = await getCatalogue();
  const featured = catalogue.ok ? (
    <ProductCatalogue
      products={createStorefrontProducts(catalogue.data)}
      mode="featured"
    />
  ) : (
    <CatalogueUnavailable compact />
  );

  return (
    <main className="overflow-clip bg-light-200 font-sans text-dark-900">
      <HeroExperience />
      <HomeEditorial featured={featured} />
    </main>
  );
}
