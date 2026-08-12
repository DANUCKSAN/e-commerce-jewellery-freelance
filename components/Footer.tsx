"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import BrandMark from "./BrandMark";

export interface FooterProps {
  newsletter?: false | Record<string, unknown>;
  className?: string;
}

const groups = [
  {
    title: "Shop",
    links: [
      ["Diamond", "/products?category=diamond"],
      ["Gold", "/products?category=gold"],
      ["Silver", "/products?category=silver"],
      ["Platinum", "/products?category=platinum"],
    ],
  },
  {
    title: "Services",
    links: [
      ["Private consultation", "/#consultation"],
      ["Ring size guide", "/products"],
      ["Delivery & returns", "/checkout"],
      ["Lifetime care", "/#craft"],
    ],
  },
  {
    title: "The house",
    links: [
      ["Our craft", "/#craft"],
      ["Materials", "/#materials"],
      ["Our philosophy", "/#philosophy"],
      ["Contact", "mailto:concierge@aurelle.com.au"],
    ],
  },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900";

export default function Footer({ newsletter, className = "" }: FooterProps) {
  const year = new Date().getFullYear();
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitted">(
    "idle",
  );
  const showNewsletter = newsletter !== false;

  return (
    <footer
      id="contact"
      className={`relative overflow-hidden bg-dark-900 text-light-100 ${className}`}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px aurelle-rule" />
      <div aria-hidden="true" className="absolute -right-40 -top-40 size-[32rem] rounded-full border border-white/[0.055]" />
      <div aria-hidden="true" className="absolute -right-20 -top-20 size-[20rem] rounded-full border border-champagne/15" />

      <div className="relative mx-auto max-w-[94rem] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        {showNewsletter ? (
          <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[minmax(18rem,1.1fr)_minmax(28rem,.9fr)] lg:items-end lg:gap-20 lg:pb-16">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.23em] text-champagne">
                The private list
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,5vw,5.3rem)] font-medium leading-[0.9] tracking-[-0.045em]">
                Notes from the atelier, sent occasionally.
              </h2>
            </div>

            <div>
              <p className="max-w-xl text-sm leading-6 text-white/58">
                Early access to new collections, private appointments and stories
                of the hands behind each piece.
              </p>
              <form
                className="mt-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  setNewsletterStatus("submitted");
                }}
              >
                <div className="flex border-b border-white/35 pb-2 focus-within:border-champagne">
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Email address</span>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email address"
                      className="min-h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/42"
                    />
                  </label>
                  <button
                    type="submit"
                    className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-champagne hover:bg-champagne hover:text-dark-900 ${focusRing}`}
                    aria-label="Join the private list"
                  >
                    <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
                  </button>
                </div>
                <p className="mt-3 min-h-5 text-xs text-white/58" role="status" aria-live="polite">
                  {newsletterStatus === "submitted"
                    ? "Thank you — newsletter delivery will be connected in the backend phase."
                    : "Frontend preview · no email is stored."}
                </p>
              </form>
            </div>
          </div>
        ) : null}

        <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_.6fr_.6fr_.6fr] lg:gap-10 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandMark light />
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/52">
              Modern heirlooms shaped by light, crafted in precious metals and
              designed to be lived in.
            </p>
            <a
              href="mailto:concierge@aurelle.com.au"
              className={`mt-6 inline-flex items-center gap-2 rounded-md text-sm text-white/75 transition-colors hover:text-champagne ${focusRing}`}
            >
              <Mail aria-hidden="true" className="size-4" strokeWidth={1.5} />
              concierge@aurelle.com.au
            </a>
          </div>

          {groups.map((group) => (
            <nav key={group.title} aria-label={`${group.title} links`}>
              <h2 className="text-[0.66rem] font-semibold uppercase tracking-[0.19em] text-champagne">
                {group.title}
              </h2>
              <ul className="mt-5 grid gap-3.5">
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`inline-flex rounded-md text-sm text-white/58 transition-colors hover:text-white ${focusRing}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-6 text-[0.7rem] uppercase tracking-[0.1em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Aurelle Fine Jewellery. Portfolio concept.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className={`rounded-sm hover:text-white ${focusRing}`}>
              Privacy
            </Link>
            <Link href="/terms" className={`rounded-sm hover:text-white ${focusRing}`}>
              Terms
            </Link>
            <a href="https://www.instagram.com/" rel="noreferrer" target="_blank" className={`rounded-sm hover:text-white ${focusRing}`}>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
