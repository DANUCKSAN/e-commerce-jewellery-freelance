export const jewelleryCategories = [
  "diamond",
  "gold",
  "silver",
  "platinum",
] as const;

export type JewelleryCategory = (typeof jewelleryCategories)[number];

export const jewelleryProductTypes = [
  "ring",
  "earrings",
  "bracelet",
  "necklace",
  "pendant",
] as const;

export type JewelleryProductType = (typeof jewelleryProductTypes)[number];
export type ProductType = JewelleryProductType;

export const jewelleryMetals = [
  "18k-yellow-gold",
  "18k-rose-gold",
  "18k-white-gold",
  "sterling-silver",
  "950-platinum",
] as const;

export type JewelleryMetal = (typeof jewelleryMetals)[number];
export type JewelleryGemstone = "diamond";

export type ProductAvailability =
  | "in-stock"
  | "low-stock"
  | "made-to-order"
  | "out-of-stock";

export type CatalogueAttribute = {
  code: string;
  name: string;
  dataType: string;
  valueText: string | null;
  valueNumber: string | null;
  valueBoolean: boolean | null;
  unitSymbol: string | null;
};

export type CatalogueProduct = {
  slug: string;
  name: string;
  category: JewelleryCategory;
  categoryName: string;
  manufacturer: string;
  productType: JewelleryProductType;
  productTypeLabel: string;
  material: string;
  metals: JewelleryMetal[];
  gemstones: JewelleryGemstone[];
  specification: string;
  image: string;
  priceCents: number;
  currency: string;
  taxInclusive: boolean;
  availability: ProductAvailability;
  stock: number;
  featured: boolean;
};

export type CatalogueProductDetail = CatalogueProduct & {
  variantId: string;
  shortDescription: string;
  description: string;
  modelNumber: string | null;
  catalogSku: string;
  manufacturerPartNumber: string | null;
  weightG: number | null;
  leadTimeDays: number;
  attributes: CatalogueAttribute[];
};

const categoryNames: Record<JewelleryCategory, string> = {
  diamond: "Diamond",
  gold: "Gold",
  silver: "Silver",
  platinum: "Platinum",
};

function textAttribute(
  code: string,
  name: string,
  valueText: string,
): CatalogueAttribute {
  return {
    code,
    name,
    dataType: "text",
    valueText,
    valueNumber: null,
    valueBoolean: null,
    unitSymbol: null,
  };
}

function numberAttribute(
  code: string,
  name: string,
  valueNumber: number,
  unitSymbol: string,
): CatalogueAttribute {
  return {
    code,
    name,
    dataType: "number",
    valueText: null,
    valueNumber: String(valueNumber),
    valueBoolean: null,
    unitSymbol,
  };
}

const aurelleCatalogue: CatalogueProductDetail[] = [
  {
    variantId: "aurelle-elan-001",
    slug: "elan-diamond-solitaire-ring",
    name: "Élan Diamond Solitaire Ring",
    category: "diamond",
    categoryName: categoryNames.diamond,
    manufacturer: "Aurelle",
    productType: "ring",
    productTypeLabel: "Solitaire ring",
    material: "18k white gold",
    metals: ["18k-white-gold"],
    gemstones: ["diamond"],
    specification: "1.00 ct oval-cut diamond · 18k white gold",
    image: "/images/aurelle/diamond-solitaire.webp",
    priceCents: 485_000,
    currency: "AUD",
    taxInclusive: true,
    availability: "in-stock",
    stock: 6,
    featured: true,
    shortDescription:
      "A luminous solitaire composed around an oval-cut diamond, set to welcome light from every angle.",
    description:
      "Élan is Aurelle's study in quiet radiance. A slender, hand-finished band lifts the oval diamond in a refined four-claw setting, balancing modern proportion with the enduring grace of a classic solitaire. Designed in Sydney and finished by specialist jewellers, it is an intimate piece made for a lifetime of everyday light.",
    modelNumber: "AU-R101",
    catalogSku: "AUR-ELAN-WG-075",
    manufacturerPartNumber: null,
    weightG: 3.8,
    leadTimeDays: 3,
    attributes: [
      textAttribute("metal", "Metal", "18k white gold"),
      textAttribute("gemstone", "Gemstone", "Natural diamond"),
      numberAttribute("carat-weight", "Total carat weight", 1, "ct"),
      textAttribute("diamond-cut", "Diamond cut", "Oval brilliant"),
      textAttribute("setting", "Setting", "Four-claw solitaire"),
      numberAttribute("band-width", "Band width", 1.8, "mm"),
      textAttribute("finish", "Finish", "High polish"),
      textAttribute("sizing", "Sizing", "Complimentary first resize"),
    ],
  },
  {
    variantId: "aurelle-maison-001",
    slug: "maison-gold-signet-ring",
    name: "Maison Gold Signet Ring",
    category: "gold",
    categoryName: categoryNames.gold,
    manufacturer: "Aurelle",
    productType: "ring",
    productTypeLabel: "Signet ring",
    material: "18k yellow gold",
    metals: ["18k-yellow-gold"],
    gemstones: ["diamond"],
    specification: "Solid 18k yellow gold · flush-set diamond",
    image: "/images/aurelle/gold-signet.webp",
    priceCents: 265_000,
    currency: "AUD",
    taxInclusive: true,
    availability: "in-stock",
    stock: 9,
    featured: false,
    shortDescription:
      "A contemporary heirloom with a softly rounded profile and a single flush-set diamond.",
    description:
      "Maison reinterprets the traditional signet through Aurelle's restrained, architectural lens. Cast in solid 18k yellow gold, its smooth shoulders frame a single flush-set diamond. The low, tactile profile makes it effortless to wear alone or beside a personal stack.",
    modelNumber: "AU-R204",
    catalogSku: "AUR-MAISON-YG",
    manufacturerPartNumber: null,
    weightG: 8.6,
    leadTimeDays: 4,
    attributes: [
      textAttribute("metal", "Metal", "Solid 18k yellow gold"),
      textAttribute("gemstone", "Gemstone", "Natural diamond"),
      textAttribute("profile", "Profile", "Low-set oval signet"),
      numberAttribute("face-width", "Face width", 12, "mm"),
      textAttribute("finish", "Finish", "Mirror polish"),
      textAttribute("engraving", "Engraving", "Available on request"),
      textAttribute("construction", "Construction", "Solid cast"),
    ],
  },
  {
    variantId: "aurelle-luna-001",
    slug: "luna-sterling-silver-cuff",
    name: "Luna Sterling Silver Cuff",
    category: "silver",
    categoryName: categoryNames.silver,
    manufacturer: "Aurelle",
    productType: "bracelet",
    productTypeLabel: "Cuff bracelet",
    material: "925 sterling silver",
    metals: ["sterling-silver"],
    gemstones: [],
    specification: "925 sterling silver · satin exterior · polished edge",
    image: "/images/aurelle/silver-cuff.webp",
    priceCents: 62_000,
    currency: "AUD",
    taxInclusive: true,
    availability: "in-stock",
    stock: 14,
    featured: true,
    shortDescription:
      "A fluid sterling-silver cuff shaped with a satin surface and a fine line of reflected light.",
    description:
      "Luna follows the natural curve of the wrist in one continuous sweep. Its satin-brushed surface softens reflection while a polished edge catches the light in motion. Gently flexible and intentionally unadorned, it brings sculptural presence to the everyday.",
    modelNumber: "AU-B112",
    catalogSku: "AUR-LUNA-SS",
    manufacturerPartNumber: null,
    weightG: 21.4,
    leadTimeDays: 2,
    attributes: [
      textAttribute("metal", "Metal", "925 sterling silver"),
      textAttribute("finish", "Finish", "Satin brushed with polished edge"),
      numberAttribute("width", "Cuff width", 8, "mm"),
      textAttribute("fit", "Fit", "Gently adjustable"),
      textAttribute("size", "Size", "Small–medium wrist"),
      textAttribute("care", "Care", "Aurelle polishing cloth included"),
    ],
  },
  {
    variantId: "aurelle-celeste-001",
    slug: "celeste-platinum-diamond-pendant",
    name: "Céleste Platinum Diamond Pendant",
    category: "platinum",
    categoryName: categoryNames.platinum,
    manufacturer: "Aurelle",
    productType: "pendant",
    productTypeLabel: "Diamond pendant",
    material: "950 platinum",
    metals: ["950-platinum"],
    gemstones: ["diamond"],
    specification: "0.35 ct pear-cut diamond · 950 platinum",
    image: "/images/aurelle/platinum-pendant.webp",
    priceCents: 395_000,
    currency: "AUD",
    taxInclusive: true,
    availability: "low-stock",
    stock: 5,
    featured: true,
    shortDescription:
      "A pear-cut diamond suspended in platinum, poised like a single drop of captured light.",
    description:
      "Céleste pairs the cool permanence of platinum with the delicate movement of a pear-cut diamond. An open gallery admits light beneath the stone, while a fine adjustable chain lets the pendant settle at either of two lengths. Understated from afar and exquisitely detailed up close.",
    modelNumber: "AU-P310",
    catalogSku: "AUR-CELESTE-PT-035",
    manufacturerPartNumber: null,
    weightG: 4.7,
    leadTimeDays: 3,
    attributes: [
      textAttribute("metal", "Metal", "950 platinum"),
      textAttribute("gemstone", "Gemstone", "Natural diamond"),
      numberAttribute("carat-weight", "Total carat weight", 0.35, "ct"),
      textAttribute("diamond-cut", "Diamond cut", "Pear"),
      textAttribute("setting", "Setting", "Three-claw open gallery"),
      textAttribute("chain", "Chain", "Adjustable platinum trace chain"),
      numberAttribute("chain-length", "Maximum chain length", 45, "cm"),
    ],
  },
  {
    variantId: "aurelle-rosee-001",
    slug: "rosee-rose-gold-hoop-earrings",
    name: "Rosée Rose Gold Hoop Earrings",
    category: "gold",
    categoryName: categoryNames.gold,
    manufacturer: "Aurelle",
    productType: "earrings",
    productTypeLabel: "Hoop earrings",
    material: "18k rose gold",
    metals: ["18k-rose-gold"],
    gemstones: ["diamond"],
    specification: "18k rose gold · pavé diamonds · 18 mm silhouette",
    image: "/images/aurelle/rose-gold-hoops.webp",
    priceCents: 118_000,
    currency: "AUD",
    taxInclusive: true,
    availability: "in-stock",
    stock: 11,
    featured: false,
    shortDescription:
      "Warm rose-gold hoops traced with pavé diamonds and balanced to feel almost weightless.",
    description:
      "Rosée is an everyday hoop distilled to its most graceful line. A fine row of pavé diamonds follows the softly tapered front, while a hollow construction keeps each earring comfortably light. A precise hinged closure completes the seamless profile.",
    modelNumber: "AU-E118",
    catalogSku: "AUR-ROSEE-RG-18",
    manufacturerPartNumber: null,
    weightG: 4.2,
    leadTimeDays: 2,
    attributes: [
      textAttribute("metal", "Metal", "18k rose gold"),
      textAttribute("gemstone", "Gemstone", "Pavé-set natural diamonds"),
      numberAttribute("carat-weight", "Total carat weight", 0.16, "ct"),
      textAttribute("construction", "Construction", "Lightweight hollow form"),
      numberAttribute("diameter", "Outer diameter", 18, "mm"),
      textAttribute("closure", "Closure", "Hinged click fitting"),
      textAttribute("finish", "Finish", "High polish"),
      textAttribute("sold-as", "Sold as", "Pair"),
    ],
  },
  {
    variantId: "aurelle-serenite-001",
    slug: "serenite-gold-chain-necklace",
    name: "Sérénité Gold Pendant Necklace",
    category: "gold",
    categoryName: categoryNames.gold,
    manufacturer: "Aurelle",
    productType: "necklace",
    productTypeLabel: "Pendant necklace",
    material: "18k yellow gold",
    metals: ["18k-yellow-gold"],
    gemstones: [],
    specification: "Solid 18k yellow gold · sculpted organic pendant",
    image: "/images/aurelle/gold-necklace.webp",
    priceCents: 245_000,
    currency: "AUD",
    taxInclusive: true,
    availability: "in-stock",
    stock: 7,
    featured: true,
    shortDescription:
      "A softly sculpted gold pendant suspended from a delicate chain with effortless ease.",
    description:
      "Sérénité turns the fluid movement of molten gold into a small, tactile pendant. Its irregular surface is polished by hand, then suspended from a delicate trace chain at a considered everyday length.",
    modelNumber: "AU-N225",
    catalogSku: "AUR-SERENITE-YG-45",
    manufacturerPartNumber: null,
    weightG: 12.8,
    leadTimeDays: 4,
    attributes: [
      textAttribute("metal", "Metal", "Solid 18k yellow gold"),
      textAttribute("pendant", "Pendant", "Hand-finished organic form"),
      numberAttribute("length", "Length", 45, "cm"),
      numberAttribute("pendant-length", "Pendant length", 18, "mm"),
      textAttribute("closure", "Closure", "Aurelle lobster clasp"),
      textAttribute("finish", "Finish", "High polish"),
    ],
  },
  {
    variantId: "aurelle-eternite-001",
    slug: "eternite-platinum-wedding-band",
    name: "Éternité Platinum Wedding Band",
    category: "platinum",
    categoryName: categoryNames.platinum,
    manufacturer: "Aurelle",
    productType: "ring",
    productTypeLabel: "Wedding band",
    material: "950 platinum",
    metals: ["950-platinum"],
    gemstones: [],
    specification: "950 platinum · 3 mm court profile",
    image: "/images/aurelle/platinum-band.webp",
    priceCents: 285_000,
    currency: "AUD",
    taxInclusive: true,
    availability: "in-stock",
    stock: 8,
    featured: false,
    shortDescription:
      "A perfectly proportioned platinum band with a softly rounded interior made for lasting comfort.",
    description:
      "Éternité celebrates platinum in its purest expression. The classic court profile is subtly weighted and polished by hand, with a curved interior that feels natural from the first wear. Its restrained 3 mm width pairs beautifully or stands with quiet confidence on its own.",
    modelNumber: "AU-R330",
    catalogSku: "AUR-ETERNITE-PT-3",
    manufacturerPartNumber: null,
    weightG: 7.4,
    leadTimeDays: 5,
    attributes: [
      textAttribute("metal", "Metal", "950 platinum"),
      textAttribute("profile", "Profile", "Court"),
      numberAttribute("width", "Band width", 3, "mm"),
      numberAttribute("depth", "Band depth", 1.8, "mm"),
      textAttribute("finish", "Finish", "High polish"),
      textAttribute("sizing", "Sizing", "Complimentary first resize"),
    ],
  },
  {
    variantId: "aurelle-trois-lumieres-001",
    slug: "celestia-diamond-ring-set",
    name: "Celestia Diamond Ring Set",
    category: "diamond",
    categoryName: categoryNames.diamond,
    manufacturer: "Aurelle",
    productType: "ring",
    productTypeLabel: "Diamond ring set",
    material: "950 platinum and 18k yellow gold",
    metals: ["950-platinum", "18k-yellow-gold"],
    gemstones: ["diamond"],
    specification: "1.20 ct oval diamond · platinum solitaire · 18k gold band",
    image: "/images/aurelle/hero-rings.webp",
    priceCents: 720_000,
    currency: "AUD",
    taxInclusive: true,
    availability: "low-stock",
    stock: 3,
    featured: true,
    shortDescription:
      "An oval diamond solitaire and fine gold band composed as a modern, luminous pair.",
    description:
      "Celestia brings together an oval diamond in cool platinum and a fine 18k yellow-gold band. Worn together or apart, the pair balances clarity with warmth in a composition resolved with Aurelle's signature restraint.",
    modelNumber: "AU-R410",
    catalogSku: "AUR-TROIS-YGWG-120",
    manufacturerPartNumber: null,
    weightG: 5.2,
    leadTimeDays: 5,
    attributes: [
      textAttribute("metal", "Metal", "950 platinum and 18k yellow gold"),
      textAttribute("gemstone", "Gemstone", "Natural diamond"),
      numberAttribute("carat-weight", "Total carat weight", 1.2, "ct"),
      textAttribute("diamond-cut", "Diamond cut", "Oval brilliant"),
      textAttribute("setting", "Setting", "Four-claw solitaire"),
      numberAttribute("band-width", "Band width", 2, "mm"),
      textAttribute("sizing", "Sizing", "Complimentary first resize"),
    ],
  },
];

function cloneProduct(product: CatalogueProductDetail): CatalogueProductDetail {
  return {
    ...product,
    metals: [...product.metals],
    gemstones: [...product.gemstones],
    attributes: product.attributes.map((attribute) => ({ ...attribute })),
  };
}

/** Static catalogue access for the Aurelle portfolio storefront. */
export async function getCatalogue(): Promise<CatalogueProduct[]> {
  return aurelleCatalogue.map(cloneProduct);
}

export async function getCatalogueProduct(
  slug: string,
): Promise<CatalogueProductDetail | null> {
  const product = aurelleCatalogue.find((item) => item.slug === slug);
  return product ? cloneProduct(product) : null;
}

export function getCatalogueProductImage(slug: string): string | null {
  return aurelleCatalogue.find((product) => product.slug === slug)?.image ?? null;
}
