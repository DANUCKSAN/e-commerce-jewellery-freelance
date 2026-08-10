import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Gift,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import {
  PaymentPreviewButton,
  PromoCodePreview,
} from "@/components/CheckoutPreviewActions";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Aurelle fine-jewellery order with insured delivery and considered gift presentation.",
};

const summaryItems = [
  {
    name: "Maison Gold Signet Ring",
    detail: "18k yellow gold · Size M",
    price: "A$2,650",
    image: "/images/aurelle/gold-signet.webp",
  },
  {
    name: "Céleste Platinum Diamond Pendant",
    detail: "950 platinum · 0.35 ct diamond",
    price: "A$3,950",
    image: "/images/aurelle/platinum-pendant.webp",
  },
] as const;

const fieldClassName =
  "min-h-13 w-full rounded-xl border border-[#171411]/14 bg-white px-4 text-body text-[#171411] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#171411]/32 hover:border-[#5B2333]/30 focus:border-[#5B2333] focus:ring-4 focus:ring-[#5B2333]/8";

const labelClassName =
  "mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#171411]/65";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#F8F4EE] text-[#171411]">
      <section className="border-b border-[#171411]/8 bg-[#171411] px-4 py-9 text-[#F8F4EE] sm:px-6 lg:px-8 lg:py-11">
        <div className="mx-auto max-w-[88rem]">
          <Link
            href="/products"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full text-footnote font-medium uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-[#C2A36B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2A36B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171411]"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
              strokeWidth={1.7}
            />
            Continue shopping
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.65fr)] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-footnote font-semibold uppercase tracking-[0.22em] text-[#C2A36B]">
                <span aria-hidden="true" className="h-px w-8 bg-[#C2A36B]/65" />
                Secure checkout
              </p>
              <h1 className="mt-4 max-w-[11ch] font-serif text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.92] tracking-[-0.05em]">
                Complete your details.
              </h1>
            </div>

            <ol
              aria-label="Checkout progress"
              className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center"
            >
              <li className="flex flex-col items-center gap-2 text-center text-[#C2A36B]">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#C2A36B] text-[#171411]">
                  <Check aria-hidden="true" className="size-4" strokeWidth={2} />
                </span>
                <span className="text-[0.63rem] font-semibold uppercase tracking-[0.15em]">
                  Bag
                </span>
              </li>
              <li aria-hidden="true" role="presentation" className="-mt-5 h-px w-8 bg-[#C2A36B]/55 sm:w-14" />
              <li aria-current="step" className="flex flex-col items-center gap-2 text-center text-white">
                <span className="flex size-9 items-center justify-center rounded-full border border-[#C2A36B] bg-[#C2A36B]/12 text-[#C2A36B]">
                  <span className="text-caption font-semibold">2</span>
                </span>
                <span className="text-[0.63rem] font-semibold uppercase tracking-[0.15em]">
                  Delivery
                </span>
              </li>
              <li aria-hidden="true" role="presentation" className="-mt-5 h-px w-8 bg-white/15 sm:w-14" />
              <li className="flex flex-col items-center gap-2 text-center text-white/35">
                <span className="flex size-9 items-center justify-center rounded-full border border-white/18">
                  <span className="text-caption font-semibold">3</span>
                </span>
                <span className="text-[0.63rem] font-semibold uppercase tracking-[0.15em]">
                  Payment
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[88rem] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.72fr)] lg:gap-12 lg:px-8 lg:py-18 xl:gap-20">
        <section
          aria-labelledby="delivery-heading"
          className=""
        >
          <form className="grid gap-7">
            <section className="rounded-[1.5rem] border border-[#171411]/9 bg-white/68 p-5 shadow-[0_18px_60px_rgba(63,38,28,0.045)] sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-footnote font-semibold uppercase tracking-[0.18em] text-[#5B2333]">
                    01 · Contact
                  </p>
                  <h2
                    id="delivery-heading"
                    className="mt-2 font-serif text-[clamp(1.75rem,4vw,2.35rem)] leading-tight tracking-[-0.035em]"
                  >
                    Where should we send your order?
                  </h2>
                </div>
                <span className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-[#5B2333]/7 text-[#5B2333] sm:flex">
                  <PackageCheck aria-hidden="true" className="size-5" strokeWidth={1.6} />
                </span>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-email" className={labelClassName}>
                    Email address
                  </label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className={fieldClassName}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-first-name" className={labelClassName}>
                    First name
                  </label>
                  <input
                    id="checkout-first-name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    required
                    className={fieldClassName}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-last-name" className={labelClassName}>
                    Last name
                  </label>
                  <input
                    id="checkout-last-name"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    required
                    className={fieldClassName}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-phone" className={labelClassName}>
                    Mobile number
                  </label>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="04XX XXX XXX"
                    required
                    className={fieldClassName}
                  />
                </div>
              </div>

              <div className="my-8 h-px bg-[#171411]/8" />

              <div>
                <p className="text-footnote font-semibold uppercase tracking-[0.18em] text-[#5B2333]">
                  02 · Delivery address
                </p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-country" className={labelClassName}>
                      Country / region
                    </label>
                    <select
                      id="checkout-country"
                      name="country"
                      autoComplete="country-name"
                      defaultValue="Australia"
                      className={fieldClassName}
                    >
                      <option>Australia</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-address" className={labelClassName}>
                      Street address
                    </label>
                    <input
                      id="checkout-address"
                      name="address"
                      type="text"
                      autoComplete="address-line1"
                      placeholder="Street number and name"
                      required
                      className={fieldClassName}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-address-two" className={labelClassName}>
                      Apartment, suite, etc. <span className="normal-case tracking-normal text-[#171411]/35">(optional)</span>
                    </label>
                    <input
                      id="checkout-address-two"
                      name="addressLineTwo"
                      type="text"
                      autoComplete="address-line2"
                      placeholder="Apartment or unit"
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-suburb" className={labelClassName}>
                      Suburb
                    </label>
                    <input
                      id="checkout-suburb"
                      name="suburb"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Suburb"
                      required
                      className={fieldClassName}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-state" className={labelClassName}>
                        State
                      </label>
                      <select
                        id="checkout-state"
                        name="state"
                        autoComplete="address-level1"
                        defaultValue="NSW"
                        className={fieldClassName}
                      >
                        <option>NSW</option>
                        <option>VIC</option>
                        <option>QLD</option>
                        <option>WA</option>
                        <option>SA</option>
                        <option>TAS</option>
                        <option>ACT</option>
                        <option>NT</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="checkout-postcode" className={labelClassName}>
                        Postcode
                      </label>
                      <input
                        id="checkout-postcode"
                        name="postcode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        pattern="[0-9]{4}"
                        placeholder="2000"
                        required
                        className={fieldClassName}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-center gap-3 text-caption text-[#171411]/62">
                <input
                  type="checkbox"
                  name="useAsBillingAddress"
                  defaultChecked
                  className="size-4.5 rounded border-[#171411]/25 accent-[#5B2333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333] focus-visible:ring-offset-2"
                />
                Use this address for billing
              </label>
            </section>

            <section className="rounded-[1.5rem] border border-[#171411]/9 bg-white/68 p-5 shadow-[0_18px_60px_rgba(63,38,28,0.045)] sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-footnote font-semibold uppercase tracking-[0.18em] text-[#5B2333]">
                    03 · Delivery
                  </p>
                  <h2 className="mt-2 font-serif text-[clamp(1.75rem,4vw,2.35rem)] leading-tight tracking-[-0.035em]">
                    Choose your service
                  </h2>
                </div>
                <span className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-[#5B2333]/7 text-[#5B2333] sm:flex">
                  <Truck aria-hidden="true" className="size-5" strokeWidth={1.6} />
                </span>
              </div>

              <fieldset className="mt-7 grid gap-3">
                <legend className="sr-only">Delivery service</legend>
                <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-[#5B2333]/45 bg-[#5B2333]/4 p-4 transition-colors hover:bg-[#5B2333]/6">
                  <input
                    type="radio"
                    name="deliveryService"
                    value="insured-standard"
                    defaultChecked
                    className="mt-1 size-4 accent-[#5B2333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333] focus-visible:ring-offset-2"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-4 text-caption font-semibold text-[#171411]">
                      <span>Complimentary insured delivery</span>
                      <span>Free</span>
                    </span>
                    <span className="mt-1 block text-footnote leading-5 text-[#171411]/48">
                      2–4 business days · Signature required
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-[#171411]/10 bg-white p-4 transition-colors hover:border-[#5B2333]/28">
                  <input
                    type="radio"
                    name="deliveryService"
                    value="priority"
                    className="mt-1 size-4 accent-[#5B2333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333] focus-visible:ring-offset-2"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-4 text-caption font-semibold text-[#171411]">
                      <span>Priority insured delivery</span>
                      <span>A$24</span>
                    </span>
                    <span className="mt-1 block text-footnote leading-5 text-[#171411]/48">
                      Next business day for metro addresses
                    </span>
                  </span>
                </label>
              </fieldset>
            </section>

            <section className="overflow-hidden rounded-[1.5rem] border border-[#C2A36B]/35 bg-[#171411] text-[#F8F4EE] shadow-[0_22px_65px_rgba(23,20,17,0.13)]">
              <div className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:p-8">
                <span className="flex size-11 items-center justify-center rounded-full border border-[#C2A36B]/35 bg-[#C2A36B]/10 text-[#C2A36B]">
                  <Gift aria-hidden="true" className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-footnote font-semibold uppercase tracking-[0.18em] text-[#C2A36B]">
                    The finishing touch
                  </p>
                  <h2 className="mt-2 font-serif text-2xl tracking-[-0.025em]">
                    Is this a gift?
                  </h2>
                  <p className="mt-2 text-caption leading-6 text-white/52">
                    Every Aurelle order arrives in our signature box. Add a
                    handwritten message at no extra charge.
                  </p>
                  <label className="mt-5 flex cursor-pointer items-start gap-3 text-caption text-white/75">
                    <input
                      type="checkbox"
                      name="giftMessageIncluded"
                      className="mt-0.5 size-4.5 rounded border-white/30 accent-[#C2A36B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2A36B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171411]"
                    />
                    Add a handwritten gift message
                  </label>
                  <label htmlFor="gift-message" className="sr-only">
                    Gift message
                  </label>
                  <textarea
                    id="gift-message"
                    name="giftMessage"
                    rows={3}
                    maxLength={180}
                    placeholder="Write a short note for someone special…"
                    className="mt-4 w-full resize-y rounded-xl border border-white/14 bg-white/6 px-4 py-3 text-caption leading-6 text-white outline-none transition-colors placeholder:text-white/28 hover:border-[#C2A36B]/30 focus:border-[#C2A36B] focus:ring-4 focus:ring-[#C2A36B]/10"
                  />
                </div>
              </div>
            </section>

            <PaymentPreviewButton />
          </form>
        </section>

        <aside
          aria-labelledby="order-summary-heading"
          className=""
        >
          <div className="overflow-hidden rounded-[1.5rem] border border-[#171411]/10 bg-white/72 shadow-[0_24px_70px_rgba(63,38,28,0.065)] lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-4 border-b border-[#171411]/8 px-5 py-5 sm:px-6">
              <div>
                <p className="text-footnote font-semibold uppercase tracking-[0.16em] text-[#5B2333]">
                  Sample selection
                </p>
                <h2
                  id="order-summary-heading"
                  className="mt-1 font-serif text-2xl tracking-[-0.03em]"
                >
                  Portfolio order summary
                </h2>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full bg-[#5B2333]/7 text-[#5B2333]">
                <ShoppingBag aria-hidden="true" className="size-[1.05rem]" strokeWidth={1.7} />
              </span>
            </div>

            <ul className="divide-y divide-[#171411]/7 px-5 sm:px-6">
              {summaryItems.map((item) => (
                <li key={item.name} className="flex gap-4 py-5">
                  <div className="relative size-22 shrink-0 overflow-hidden rounded-xl bg-[#F1EAE0] sm:size-24">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none"
                    />
                    <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-[#171411] text-[0.62rem] font-semibold text-white">
                      1
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <h3 className="font-serif text-base leading-5 text-[#171411]">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-footnote leading-5 text-[#171411]/45">
                      {item.detail}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-[0.65rem] uppercase tracking-[0.12em] text-[#171411]/38">
                        Qty 1
                      </span>
                      <span className="text-caption font-semibold">{item.price}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-y border-[#171411]/8 bg-[#F8F4EE]/65 px-5 py-5 sm:px-6">
              <PromoCodePreview />
            </div>

            <dl className="grid gap-3 px-5 py-5 text-caption sm:px-6">
              <div className="flex items-center justify-between gap-4 text-[#171411]/58">
                <dt>Subtotal</dt>
                <dd className="font-medium text-[#171411]">A$6,600</dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-[#171411]/58">
                <dt>Insured delivery</dt>
                <dd className="font-medium text-[#5B2333]">Complimentary</dd>
              </div>
              <div className="mt-2 flex items-end justify-between gap-4 border-t border-[#171411]/10 pt-5">
                <dt>
                  <span className="block font-serif text-xl text-[#171411]">Total</span>
                  <span className="mt-1 block text-footnote text-[#171411]/38">
                    GST included
                  </span>
                </dt>
                <dd className="font-serif text-2xl tracking-[-0.02em]">A$6,600</dd>
              </div>
            </dl>

            <div className="grid gap-3 border-t border-[#171411]/8 px-5 py-5 text-footnote leading-5 text-[#171411]/48 sm:px-6">
              <p className="flex items-start gap-2.5">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[#C2A36B]"
                  strokeWidth={1.7}
                />
                Fully insured and discreetly packaged from salon to door.
              </p>
              <p className="flex items-start gap-2.5">
                <LockKeyhole
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[#C2A36B]"
                  strokeWidth={1.7}
                />
                Secure checkout. Your personal details remain protected.
              </p>
              <p className="flex items-start gap-2.5">
                <Sparkles
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[#C2A36B]"
                  strokeWidth={1.7}
                />
                Signature Aurelle presentation is included with every order.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
