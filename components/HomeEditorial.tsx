import {
  ArrowRight,
  CalendarDays,
  Gem,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import diamondImage from "../public/images/aurelle/diamond-solitaire.webp";
import goldImage from "../public/images/aurelle/gold-signet.webp";
import necklaceImage from "../public/images/aurelle/gold-necklace.webp";
import platinumImage from "../public/images/aurelle/platinum-pendant.webp";
import silverImage from "../public/images/aurelle/silver-cuff.webp";
import Reveal from "./Reveal";

const materials: Array<{
  name: string;
  copy: string;
  href: string;
  image: StaticImageData;
  className: string;
}> = [
  {
    name: "Diamond",
    copy: "Brilliance, precisely cut.",
    href: "/products?category=diamond",
    image: diamondImage,
    className: "sm:col-span-2 lg:col-span-1 lg:row-span-2",
  },
  {
    name: "Gold",
    copy: "Warmth that deepens with time.",
    href: "/products?category=gold",
    image: goldImage,
    className: "",
  },
  {
    name: "Silver",
    copy: "Sculptural, luminous, effortless.",
    href: "/products?category=silver",
    image: silverImage,
    className: "",
  },
  {
    name: "Platinum",
    copy: "Rare strength. Enduring beauty.",
    href: "/products?category=platinum",
    image: platinumImage,
    className: "sm:col-span-2 lg:col-span-2",
  },
];

const services = [
  {
    icon: Gem,
    title: "Considered materials",
    copy: "Recycled precious metals and independently certified stones.",
  },
  {
    icon: PackageCheck,
    title: "Insured delivery",
    copy: "Complimentary, discreet and fully tracked across Australia.",
  },
  {
    icon: RefreshCcw,
    title: "30-day returns",
    copy: "Time to live with your piece and know it feels right.",
  },
  {
    icon: ShieldCheck,
    title: "Lifetime care",
    copy: "Annual checks and considered aftercare for every Aurelle piece.",
  },
] as const;

export default function HomeEditorial({ featured }: { featured?: ReactNode }) {
  return (
    <>
      <section id="philosophy" className="overflow-hidden bg-dark-900 px-4 py-18 text-light-100 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <Reveal className="mx-auto grid max-w-[94rem] gap-9 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:gap-20">
          <div className="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-champagne">
            <span className="size-1.5 rounded-full bg-champagne" />
            The Aurelle philosophy
          </div>
          <div>
            <h2 className="max-w-[16ch] font-display text-[clamp(2.8rem,6vw,6.6rem)] font-medium leading-[0.9] tracking-[-0.045em] text-balance">
              Jewellery should feel inevitable — as though it has always been yours.
            </h2>
            <div className="mt-8 grid max-w-4xl gap-5 border-t border-white/12 pt-7 text-sm leading-7 text-white/55 sm:grid-cols-2 sm:gap-10">
              <p>
                Our pieces begin with proportion, light and the quiet confidence
                of precious materials left to speak for themselves.
              </p>
              <p>
                Designed in Sydney and finished by specialist makers, every piece
                is shaped to gather a life of its own.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="materials" aria-labelledby="materials-heading" className="bg-light-200 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[94rem]">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-oxblood">
                Find your element
              </p>
              <h2 id="materials-heading" className="mt-3 font-display text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.88] tracking-[-0.05em]">
                Shop by material.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-dark-700">
              Four enduring materials, each with its own character. Choose the one
              that feels most like you.
            </p>
          </Reveal>

          <div className="mt-9 grid auto-rows-[19rem] gap-3 sm:grid-cols-2 sm:auto-rows-[22rem] lg:grid-cols-3 lg:auto-rows-[20rem] xl:auto-rows-[24rem]">
            {materials.map((material, index) => (
              <Reveal key={material.name} delay={index * 70} className={`h-full ${material.className}`}>
                <Link
                  href={material.href}
                  className="group relative block h-full overflow-hidden bg-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-4"
                >
                  <Image
                    src={material.image}
                    alt={`${material.name} jewellery by Aurelle`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/72 via-dark-900/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-7">
                    <div>
                      <h3 className="font-display text-[2.25rem] font-medium leading-none">
                        {material.name}
                      </h3>
                      <p className="mt-2 text-xs text-white/70">{material.copy}</p>
                    </div>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 backdrop-blur transition-[background-color,color,transform] duration-300 group-hover:-rotate-45 group-hover:bg-white group-hover:text-dark-900">
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featured}

      <section id="craft" aria-labelledby="craft-heading" className="overflow-hidden bg-light-100 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[94rem] gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-20">
          <Reveal className="relative min-h-[32rem] overflow-hidden bg-stone sm:min-h-[42rem] lg:min-h-[48rem]">
            <Image
              src={necklaceImage}
              alt="Aurelle gold pendant arranged on travertine and silk"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-1000 hover:scale-[1.025] motion-reduce:transition-none"
            />
            <div className="absolute left-5 top-5 flex size-20 items-center justify-center rounded-full border border-dark-900/15 bg-light-100/75 backdrop-blur sm:left-8 sm:top-8 sm:size-24">
              <Sparkles aria-hidden="true" className="size-5 text-oxblood" strokeWidth={1.25} />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-oxblood">
              Made slowly
            </p>
            <h2 id="craft-heading" className="mt-4 max-w-[10ch] font-display text-[clamp(3.3rem,6vw,6.8rem)] font-medium leading-[0.82] tracking-[-0.055em]">
              Worn endlessly.
            </h2>
            <p className="mt-7 max-w-xl text-[1.05rem] leading-8 text-dark-700">
              From the first wax model to the final hand polish, our makers chase
              balance rather than excess. Every setting is considered from every
              angle; every edge is softened for the life it will share with you.
            </p>

            <ol className="mt-9 border-y border-dark-900/12">
              {[
                ["01", "Sketched with intention", "Every line earns its place."],
                ["02", "Formed by specialist hands", "Small-batch making, never anonymous."],
                ["03", "Finished for a lifetime", "Polished, inspected and ready to gather history."],
              ].map(([number, title, copy]) => (
                <li key={number} className="grid grid-cols-[2.3rem_1fr] gap-4 border-b border-dark-900/12 py-5 last:border-0 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
                  <span className="text-[0.62rem] font-bold text-champagne">{number}</span>
                  <strong className="font-display text-[1.45rem] font-semibold">{title}</strong>
                  <span className="col-start-2 text-xs text-dark-700 sm:col-start-auto">{copy}</span>
                </li>
              ))}
            </ol>

            <Link href="/products" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-oxblood px-6 text-xs font-bold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2">
              Explore the collection
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-label="Aurelle services" className="border-y border-dark-900/10 bg-light-200">
        <div className="mx-auto grid max-w-[100rem] sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 60} className="h-full">
              <div className="flex h-full gap-4 border-b border-dark-900/10 px-5 py-8 sm:border-r sm:px-7 lg:min-h-48 lg:flex-col lg:justify-between lg:border-b-0 lg:px-8 lg:py-9">
                <Icon aria-hidden="true" className="size-5 shrink-0 text-oxblood" strokeWidth={1.4} />
                <div>
                  <h2 className="font-display text-[1.45rem] font-semibold">{title}</h2>
                  <p className="mt-2 text-xs leading-5 text-dark-700">{copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="consultation" aria-labelledby="consultation-heading" className="bg-oxblood px-4 py-18 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <Reveal className="mx-auto grid max-w-[94rem] gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-20">
          <div>
            <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-champagne">
              <CalendarDays aria-hidden="true" className="size-4" />
              Private appointments
            </p>
            <h2 id="consultation-heading" className="mt-5 max-w-[13ch] font-display text-[clamp(3rem,6.2vw,6.6rem)] font-medium leading-[0.86] tracking-[-0.05em]">
              A quieter way to find the one.
            </h2>
          </div>
          <div>
            <p className="max-w-xl text-sm leading-7 text-white/65">
              Meet one-to-one with an Aurelle specialist online or in our Sydney
              studio. Explore stones, proportions and precious metals at your pace.
            </p>
            <a href="mailto:concierge@aurelle.com.au?subject=Private%20appointment" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-light-100 px-6 text-xs font-bold text-dark-900 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-oxblood">
              Request an appointment
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
