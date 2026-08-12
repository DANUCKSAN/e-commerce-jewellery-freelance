"use client";

import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import BrandMark from "./BrandMark";

const links = [
  { label: "New arrivals", href: "/products" },
  { label: "Diamonds", href: "/products?category=diamond" },
  { label: "Gold", href: "/products?category=gold" },
  { label: "Silver", href: "/products?category=silver" },
  { label: "Platinum", href: "/products?category=platinum" },
  { label: "Our craft", href: "/#craft" },
] as const;

const iconLinks = [
  { label: "Your account", href: "/sign-in", icon: UserRound },
  { label: "Sample checkout", href: "/checkout", icon: ShoppingBag },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-light-100";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const close = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-dark-900/10 bg-light-100/92 text-dark-900 shadow-[0_8px_30px_rgba(23,20,17,.04)] backdrop-blur-xl">
      <div className="bg-dark-900 px-4 py-2 text-center text-[0.63rem] font-semibold uppercase tracking-[0.18em] text-light-100 sm:text-[0.68rem]">
        Complimentary insured delivery and returns across Australia
      </div>

      <nav
        aria-label="Primary navigation"
        className="mx-auto flex min-h-[4.75rem] max-w-[100rem] items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-1 items-center lg:flex-none">
          <BrandMark />
        </div>

        <ul className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {links.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`relative inline-flex min-h-11 items-center px-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-dark-700 transition-colors duration-300 after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-oxblood after:transition-transform after:duration-300 hover:text-dark-900 hover:after:scale-x-100 ${focusRing}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-1 items-center justify-end gap-0.5">
          {iconLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className={`relative hidden size-10 items-center justify-center rounded-full text-dark-900 transition-colors duration-300 hover:bg-light-200 sm:inline-flex ${focusRing}`}
            >
              <Icon aria-hidden="true" className="size-[1.08rem]" strokeWidth={1.5} />
            </Link>
          ))}

          <button
            ref={buttonRef}
            type="button"
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((open) => !open)}
            className={`inline-flex size-11 items-center justify-center rounded-full bg-dark-900 text-light-100 transition-transform active:scale-95 lg:hidden ${focusRing}`}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div
        id={menuId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute inset-x-0 top-full grid border-t bg-light-100 shadow-[0_30px_60px_rgba(23,20,17,.12)] transition-[grid-template-rows,opacity] duration-500 ease-out lg:hidden ${
          isOpen
            ? "grid-rows-[1fr] border-light-300 opacity-100"
            : "pointer-events-none grid-rows-[0fr] border-transparent opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav aria-label="Mobile navigation" className="max-h-[calc(100dvh-7.25rem)] overflow-y-auto px-4 py-5 sm:px-6">
            <ul className="divide-y divide-light-300">
              {links.map((item, index) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex min-h-14 items-center justify-between rounded-md font-display text-[1.65rem] text-dark-900 ${focusRing}`}
                  >
                    <span>{item.label}</span>
                    <span className="font-sans text-[0.62rem] font-semibold tracking-[0.15em] text-dark-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {iconLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl bg-light-200 text-[0.62rem] font-semibold uppercase tracking-[0.1em] ${focusRing}`}
                >
                  <Icon aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.5} />
                  {label === "Your account" ? "Account" : "Checkout preview"}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
