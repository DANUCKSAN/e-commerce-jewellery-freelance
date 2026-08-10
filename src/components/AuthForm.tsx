"use client";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

import SocialProviders from "@/components/SocialProviders";

export interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  callbackURL?: string;
}

const content = {
  "sign-in": {
    eyebrow: "Welcome back",
    title: "Return to your collection",
    description:
      "Sign in to revisit saved pieces, private appointments and the stories behind every choice.",
    submitLabel: "Sign in",
    switchPrompt: "New to Aurelle?",
    switchLabel: "Create an account",
    switchHref: "/sign-up",
  },
  "sign-up": {
    eyebrow: "The private salon",
    title: "Begin your collection",
    description:
      "Create your account to save meaningful pieces and enjoy a more personal Aurelle experience.",
    submitLabel: "Create account",
    switchPrompt: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/sign-in",
  },
} as const;

const inputClassName =
  "min-h-14 w-full rounded-xl border border-[#171411]/14 bg-white/75 py-3 pl-11 pr-4 text-body text-[#171411] shadow-[0_5px_20px_rgba(23,20,17,0.035)] outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-[#171411]/35 hover:border-[#5B2333]/35 focus:border-[#5B2333] focus:bg-white focus:ring-4 focus:ring-[#5B2333]/8";

const labelClassName =
  "mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#171411]/75";

export default function AuthForm({ mode, callbackURL = "/" }: AuthFormProps) {
  const ids = {
    heading: useId(),
    name: useId(),
    email: useId(),
    password: useId(),
    passwordHint: useId(),
    terms: useId(),
    previewStatus: useId(),
  };
  const [showPassword, setShowPassword] = useState(false);
  const [previewSubmitted, setPreviewSubmitted] = useState(false);
  const isSignUp = mode === "sign-up";
  const copy = content[mode];
  const switchHref = `${copy.switchHref}?callbackURL=${encodeURIComponent(callbackURL)}`;

  return (
    <section
      aria-labelledby={ids.heading}
      className="rounded-[1.75rem] border border-[#171411]/8 bg-white/48 p-5 shadow-[0_28px_80px_rgba(63,38,28,0.07)] backdrop-blur-sm sm:p-8"
    >
      <div>
        <p className="flex items-center gap-3 text-footnote font-semibold uppercase tracking-[0.22em] text-[#5B2333]">
          <span aria-hidden="true" className="h-px w-7 bg-[#C2A36B]" />
          {copy.eyebrow}
        </p>
        <h1
          id={ids.heading}
          className="mt-4 max-w-[12ch] font-serif text-[clamp(2.35rem,7vw,3.35rem)] leading-[0.96] tracking-[-0.05em] text-[#171411]"
        >
          {copy.title}
        </h1>
        <p className="mt-4 max-w-md text-body leading-7 text-[#171411]/58">
          {copy.description}
        </p>
      </div>

      <div className="mt-7">
        <SocialProviders mode={mode} />
      </div>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-[#171411]/10" />
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#171411]/38">
          or use email
        </span>
        <span className="h-px flex-1 bg-[#171411]/10" />
      </div>

      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          setPreviewSubmitted(true);
        }}
      >
        <input type="hidden" name="callbackURL" value={callbackURL} />

        {previewSubmitted ? (
          <div
            id={ids.previewStatus}
            role="status"
            aria-live="polite"
            className="rounded-xl border border-[#5B2333]/18 bg-[#5B2333]/6 px-4 py-3 text-caption leading-6 text-[#5B2333]"
          >
            Account details were validated in this frontend preview and were not
            submitted. Authentication will be connected in the backend phase.
          </div>
        ) : null}

        {isSignUp ? (
          <div>
            <label htmlFor={ids.name} className={labelClassName}>
              Full name
            </label>
            <div className="relative">
              <UserRound
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-[#5B2333]/65"
                strokeWidth={1.65}
              />
              <input
                id={ids.name}
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                required
                maxLength={100}
                className={inputClassName}
              />
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor={ids.email} className={labelClassName}>
            Email address
          </label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-[#5B2333]/65"
              strokeWidth={1.65}
            />
            <input
              id={ids.email}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor={ids.password} className={labelClassName}>
            Password
          </label>
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-[#5B2333]/65"
              strokeWidth={1.65}
            />
            <input
              id={ids.password}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder={isSignUp ? "At least 8 characters" : "Enter your password"}
              minLength={8}
              maxLength={128}
              required
              aria-describedby={isSignUp ? ids.passwordHint : undefined}
              className={`${inputClassName} pr-12`}
            />
            <button
              type="button"
              aria-controls={ids.password}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-2 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#171411]/55 transition-colors duration-300 hover:bg-[#5B2333]/7 hover:text-[#5B2333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333]"
            >
              {showPassword ? (
                <EyeOff
                  aria-hidden="true"
                  className="size-[1.1rem]"
                  strokeWidth={1.7}
                />
              ) : (
                <Eye
                  aria-hidden="true"
                  className="size-[1.1rem]"
                  strokeWidth={1.7}
                />
              )}
            </button>
          </div>
          {isSignUp ? (
            <p id={ids.passwordHint} className="mt-2 text-footnote text-[#171411]/48">
              Use 8 or more characters for a stronger password.
            </p>
          ) : null}
        </div>

        {isSignUp ? (
          <div>
            <label
              htmlFor={ids.terms}
              className="flex cursor-pointer items-start gap-3 text-footnote leading-5 text-[#171411]/58"
            >
              <input
                id={ids.terms}
                name="terms"
                type="checkbox"
                required
                className="mt-0.5 size-4.5 shrink-0 rounded border-[#171411]/25 accent-[#5B2333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333] focus-visible:ring-offset-2"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-[#171411] underline decoration-[#C2A36B] underline-offset-4 transition-colors hover:text-[#5B2333]"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-[#171411] underline decoration-[#C2A36B] underline-offset-4 transition-colors hover:text-[#5B2333]"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <span className="text-footnote text-[#171411]/48">
              Frontend account preview
            </span>
            <button
              type="button"
              disabled
              title="Password recovery will be available soon."
              className="min-h-10 cursor-not-allowed rounded-lg px-1 text-footnote font-medium text-[#171411]/38"
            >
              Forgot password? (soon)
            </button>
          </div>
        )}

        <button
          type="submit"
          aria-describedby={previewSubmitted ? ids.previewStatus : undefined}
          className="group mt-1 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#5B2333] px-5 text-body-medium text-white shadow-[0_15px_32px_rgba(91,35,51,0.2)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#171411] hover:shadow-[0_18px_38px_rgba(23,20,17,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F4EE] active:translate-y-0 disabled:cursor-wait disabled:opacity-65 motion-reduce:transition-none"
        >
          {previewSubmitted ? "Frontend preview complete" : copy.submitLabel}
          {previewSubmitted ? (
            <Check aria-hidden="true" className="size-[1.05rem]" strokeWidth={1.8} />
          ) : (
            <ArrowRight
              aria-hidden="true"
              className="size-[1.05rem] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              strokeWidth={1.7}
            />
          )}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-caption text-[#171411]/55">
        <span>{copy.switchPrompt}</span>
        <Link
          href={switchHref}
          className="rounded-md font-semibold text-[#5B2333] underline decoration-[#C2A36B]/80 underline-offset-4 transition-colors hover:text-[#171411] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333] focus-visible:ring-offset-2"
        >
          {copy.switchLabel}
        </Link>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-footnote text-[#171411]/42">
        <ShieldCheck
          aria-hidden="true"
          className="size-4 text-[#C2A36B]"
          strokeWidth={1.7}
        />
        No account data is stored in this frontend preview.
      </p>
    </section>
  );
}
