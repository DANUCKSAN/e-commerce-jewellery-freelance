import type { Metadata, Viewport } from "next";
import {
  ArrowLeft,
  Check,
  Diamond,
  Gem,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { getSiteUrl } from "@/lib/site-url";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Account | Aurelle",
    template: "%s | Aurelle",
  },
  description:
    "Sign in or create an Aurelle account to save treasured pieces and enjoy a more personal fine-jewellery experience.",
};

export const viewport: Viewport = {
  themeColor: "#171411",
};

const collectionJourney = [
  { label: "Discover", icon: Sparkles },
  { label: "Select", icon: Diamond },
  { label: "Treasure", icon: Gem },
] as const;

const accountBenefits = [
  "Save the pieces that speak to you",
  "Return to your collection and appointments at any time",
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2A36B] focus-visible:ring-offset-2";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#F8F4EE] antialiased">
      <body className="min-h-full overflow-x-clip bg-[#F8F4EE] font-jost text-[#171411]">
        <div className="min-h-dvh lg:grid lg:grid-cols-[minmax(26rem,0.92fr)_minmax(32rem,1.08fr)]">
          <aside className="relative hidden min-h-dvh overflow-hidden bg-[#171411] px-10 py-10 text-[#F8F4EE] lg:flex lg:flex-col xl:px-14 xl:py-12">
            <div
              aria-hidden="true"
              className="absolute -right-60 top-[5%] size-[38rem] rounded-full border border-[#C2A36B]/14"
            />
            <div
              aria-hidden="true"
              className="absolute -right-36 top-[16%] size-[24rem] rounded-full border border-[#C2A36B]/25"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-52 -left-32 size-[34rem] rounded-full bg-[#5B2333]/50 blur-[110px]"
            />
            <Diamond
              aria-hidden="true"
              className="absolute right-[11%] top-[22%] size-24 rotate-12 text-[#C2A36B]/8"
              strokeWidth={0.7}
            />

            <Link
              href="/"
              aria-label="Aurelle home"
              className={`relative z-10 flex w-fit items-center gap-3 rounded-lg ring-offset-[#171411] ${focusRing}`}
            >
              <span className="flex size-11 rotate-45 items-center justify-center border border-[#C2A36B]/70 bg-[#C2A36B]/8 text-[#C2A36B]">
                <Diamond
                  aria-hidden="true"
                  className="size-[1.15rem] -rotate-45"
                  strokeWidth={1.45}
                />
              </span>
              <span className="leading-none">
                <span className="block text-[1.05rem] font-semibold tracking-[0.24em]">
                  AURELLE
                </span>
                <span className="mt-1.5 block text-[0.58rem] uppercase tracking-[0.28em] text-[#C2A36B]/75">
                  Fine jewellery · Sydney
                </span>
              </span>
            </Link>

            <div className="relative z-10 my-auto max-w-2xl py-14">
              <p className="flex items-center gap-3 text-footnote font-medium uppercase tracking-[0.26em] text-[#C2A36B]">
                <span aria-hidden="true" className="h-px w-8 bg-[#C2A36B]/70" />
                The Aurelle private salon
              </p>
              <p className="mt-7 max-w-[10ch] font-serif text-[clamp(3.5rem,5.4vw,6.25rem)] leading-[0.88] tracking-[-0.055em]">
                Made to mark a lifetime.
              </p>
              <p className="mt-7 max-w-xl text-body leading-7 text-[#F8F4EE]/58 xl:text-lead">
                Keep every considered piece, private appointment and meaningful
                moment together in one beautifully personal place.
              </p>

              <div className="mt-10 border-y border-white/10 py-6">
                <ol
                  aria-label="Your Aurelle collection journey"
                  className="grid grid-cols-3"
                >
                  {collectionJourney.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <li key={step.label} className="relative flex flex-col items-center">
                        {index > 0 ? (
                          <span
                            aria-hidden="true"
                            className="absolute right-1/2 top-5 h-px w-full bg-gradient-to-r from-[#C2A36B]/65 to-white/10"
                          />
                        ) : null}
                        <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-[#C2A36B]/25 bg-[#201B18] text-[#C2A36B] shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
                          <Icon
                            aria-hidden="true"
                            className="size-[1rem]"
                            strokeWidth={1.55}
                          />
                        </span>
                        <span className="mt-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/55">
                          {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <ul className="mt-7 grid gap-3 text-caption text-white/60">
                {accountBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[#C2A36B]"
                      strokeWidth={1.8}
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative z-10 flex items-center gap-2 text-footnote text-white/38">
              <ShieldCheck
                aria-hidden="true"
                className="size-3.5 text-[#C2A36B]/65"
                strokeWidth={1.6}
              />
              Private by design. Protected with care.
            </p>
          </aside>

          <main
            id="main-content"
            className="relative flex min-h-dvh flex-col overflow-hidden bg-[#F8F4EE]"
          >
            <div
              aria-hidden="true"
              className="absolute -right-28 -top-36 size-96 rounded-full bg-white/75 blur-3xl"
            />
            <header className="relative z-10 mx-auto flex w-full max-w-[38rem] items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6 lg:max-w-none lg:justify-end lg:px-10 lg:pt-8 xl:px-14">
              <Link
                href="/"
                aria-label="Aurelle home"
                className={`flex items-center gap-3 rounded-lg ring-offset-[#F8F4EE] lg:hidden ${focusRing}`}
              >
                <span className="flex size-9 rotate-45 items-center justify-center border border-[#5B2333]/35 bg-white/60 text-[#5B2333]">
                  <Diamond
                    aria-hidden="true"
                    className="size-4 -rotate-45"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="text-[0.9rem] font-semibold tracking-[0.22em]">
                  AURELLE
                </span>
              </Link>

              <Link
                href="/"
                className={`group inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-caption text-[#171411]/60 transition-colors duration-300 hover:text-[#5B2333] ring-offset-[#F8F4EE] ${focusRing}`}
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
                  strokeWidth={1.7}
                />
                Back to the collection
              </Link>
            </header>

            <div className="relative z-[1] flex flex-1 items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-14">
              <div className="mx-auto w-full max-w-[31rem]">{children}</div>
            </div>

            <p className="relative z-[1] px-4 pb-5 text-center text-footnote tracking-[0.04em] text-[#171411]/45 sm:pb-7 lg:px-10">
              Secure access to your Aurelle private collection.
            </p>
          </main>
        </div>
      </body>
    </html>
  );
}
