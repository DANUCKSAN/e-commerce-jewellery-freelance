import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "Illustrative terms for the Aurelle fine-jewellery portfolio concept.",
};

const sections = [
  {
    title: "Portfolio status",
    copy: "Aurelle is a fictional showcase storefront. Products, prices, availability, appointments and delivery promises are sample content and do not form an offer for sale.",
  },
  {
    title: "Orders and payments",
    copy: "The checkout is a frontend demonstration. No order is created and no payment is taken. Production commerce terms, taxes, refunds and payment-provider rules will be added with the backend.",
  },
  {
    title: "Product information",
    copy: "Imagery and specifications illustrate a proposed catalogue experience. Diamond weights, precious-metal descriptions and dimensions must be verified before real products are published.",
  },
  {
    title: "Delivery, returns and care",
    copy: "Delivery, returns and lifetime-care language is conceptual. Final eligibility, timeframes, insurance, exclusions and consumer guarantees require operational and legal review.",
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Concept terms"
      title="The details, considered."
      introduction="These notes keep the portfolio experience transparent while the commercial and backend layers are still intentionally out of scope."
      sections={sections}
    />
  );
}
