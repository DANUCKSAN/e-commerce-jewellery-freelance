"use client";

import { Check, CreditCard } from "lucide-react";
import { useState } from "react";

const inputClassName =
  "min-h-13 min-w-0 flex-1 rounded-xl border border-[#171411]/14 bg-white px-4 text-body text-[#171411] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#171411]/32 hover:border-[#5B2333]/30 focus:border-[#5B2333] focus:ring-4 focus:ring-[#5B2333]/8";

export function PaymentPreviewButton() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-describedby="checkout-demo-note"
        onClick={() => setAcknowledged(true)}
        className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#5B2333] px-6 text-body-medium text-white shadow-[0_16px_34px_rgba(91,35,51,0.2)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#171411] hover:shadow-[0_20px_42px_rgba(23,20,17,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F4EE] active:translate-y-0 motion-reduce:transition-none"
      >
        {acknowledged ? "Frontend preview complete" : "Continue to payment"}
        {acknowledged ? (
          <Check aria-hidden="true" className="size-[1.05rem]" strokeWidth={1.8} />
        ) : (
          <CreditCard
            aria-hidden="true"
            className="size-[1.05rem] transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
            strokeWidth={1.7}
          />
        )}
      </button>
      <p
        id="checkout-demo-note"
        className="mt-3 text-center text-footnote leading-5 text-[#171411]/52"
        role="status"
        aria-live="polite"
      >
        {acknowledged
          ? "Payment processing is intentionally reserved for the backend phase."
          : "Portfolio preview — no payment or personal details are submitted."}
      </p>
    </div>
  );
}

export function PromoCodePreview() {
  const [message, setMessage] = useState("Frontend preview · no promotion is applied.");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("Code captured for the preview. Promotion rules arrive with the backend.");
      }}
    >
      <label
        htmlFor="promo-code"
        className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#171411]/65"
      >
        Complimentary code
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          name="promoCode"
          type="text"
          autoComplete="off"
          required
          placeholder="Enter code"
          className={inputClassName}
        />
        <button
          type="submit"
          className="min-h-13 rounded-xl border border-[#171411]/18 bg-white px-4 text-caption font-semibold transition-colors hover:border-[#5B2333]/35 hover:text-[#5B2333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333] focus-visible:ring-offset-2"
        >
          Apply
        </button>
      </div>
      <p className="mt-2 text-footnote leading-5 text-[#171411]/52" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
