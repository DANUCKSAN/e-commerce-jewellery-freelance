"use client";

import {
  ChevronDown,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  getAuthErrorMessage,
  getCurrentUser,
  getFirstName,
  getUserInitials,
  signOut,
  type AuthUser,
} from "@/lib/appwrite/auth.service";

import BrandMark from "./BrandMark";

const links = [
  { label: "New arrivals", href: "/products" },
  { label: "Diamonds", href: "/products?category=diamond" },
  { label: "Gold", href: "/products?category=gold" },
  { label: "Silver", href: "/products?category=silver" },
  { label: "Platinum", href: "/products?category=platinum" },
  { label: "Our craft", href: "/#craft" },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-light-100";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const menuId = useId();
  const accountMenuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
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

  useEffect(() => {
    let active = true;
    const loadingFallback = window.setTimeout(() => {
      if (active) setIsLoadingUser(false);
    }, 3_000);

    getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        window.clearTimeout(loadingFallback);
        if (active) setIsLoadingUser(false);
      });

    return () => {
      active = false;
      window.clearTimeout(loadingFallback);
    };
  }, []);

  useEffect(() => {
    if (!isAccountOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !accountMenuRef.current?.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
        accountButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isAccountOpen]);

  const displayName = user?.name.trim() || user?.email || "Aurelle account";
  const firstName = user ? getFirstName(user.name, user.email) : "";
  const initials = user ? getUserInitials(user.name, user.email) : "";

  async function handleSignOut() {
    if (isSigningOut) return;

    setAccountError(null);
    setIsSigningOut(true);

    try {
      await signOut();
      setUser(null);
      setIsAccountOpen(false);
      setIsOpen(false);
    } catch (error) {
      setAccountError(getAuthErrorMessage(error, "sign-out"));
    } finally {
      setIsSigningOut(false);
    }
  }

  function renderAvatar() {
    if (!user) return null;

    return (
      <Avatar className="size-10 shrink-0 bg-oxblood text-white">
        <AvatarFallback className="bg-oxblood font-semibold text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-dark-900/10 bg-light-100/92 text-dark-900 shadow-[0_8px_30px_rgba(23,20,17,.04)] backdrop-blur-xl">
      <div className="bg-dark-900 px-4 py-2 text-center text-[0.63rem] font-semibold uppercase tracking-[0.18em] text-light-100 sm:text-[0.68rem]">
        Complimentary insured delivery and returns across Australia
      </div>

      <nav
        aria-label="Primary navigation"
        className="mx-auto flex min-h-[4.75rem] w-full max-w-[100rem] items-center gap-4 px-4 sm:px-6 lg:px-8"
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

        <div className="flex flex-1 items-center justify-end gap-1">
          <Link
            href="/checkout"
            aria-label="Checkout preview"
            className={`hidden size-10 items-center justify-center rounded-full text-dark-900 transition-colors hover:bg-light-200 sm:inline-flex ${focusRing}`}
          >
            <ShoppingBag
              aria-hidden="true"
              className="size-[1.08rem]"
              strokeWidth={1.5}
            />
          </Link>

          {isLoadingUser ? (
            <span
              aria-label="Loading account"
              className="hidden size-10 animate-pulse rounded-full bg-light-300 sm:block"
            />
          ) : user ? (
            <div ref={accountMenuRef} className="relative hidden sm:block">
              <button
                ref={accountButtonRef}
                type="button"
                aria-controls={accountMenuId}
                aria-expanded={isAccountOpen}
                aria-label={`Open account menu for ${displayName}`}
                onClick={() => {
                  setAccountError(null);
                  setIsAccountOpen((open) => !open);
                }}
                className={`flex min-h-11 items-center gap-2 rounded-full pl-0.5 pr-2 text-sm font-semibold transition-colors hover:bg-light-200 ${focusRing}`}
              >
                {renderAvatar()}
                <span className="hidden max-w-28 truncate xl:block">
                  {firstName}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 transition-transform ${isAccountOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isAccountOpen ? (
                <div
                  id={accountMenuId}
                  className="absolute right-0 top-[calc(100%+0.75rem)] w-72 overflow-hidden rounded-xl border border-dark-900/10 bg-light-100 shadow-[0_24px_55px_rgba(23,20,17,.16)]"
                >
                  <div className="border-b border-dark-900/10 px-4 py-4">
                    <p className="truncate font-display text-lg font-semibold">
                      {displayName}
                    </p>
                    <p className="mt-1 truncate text-xs text-dark-700">
                      {user.email}
                    </p>
                  </div>
                  {accountError ? (
                    <p
                      role="alert"
                      className="px-4 pt-3 text-xs leading-5 text-red-700"
                    >
                      {accountError}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    disabled={isSigningOut}
                    onClick={handleSignOut}
                    className="flex min-h-12 w-full items-center gap-2.5 px-4 text-left text-sm font-semibold transition-colors hover:bg-light-200 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-oxblood"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    {isSigningOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/sign-in"
              aria-label="Sign in"
              className={`hidden size-10 items-center justify-center rounded-full text-dark-900 transition-colors hover:bg-light-200 sm:inline-flex ${focusRing}`}
            >
              <UserRound
                aria-hidden="true"
                className="size-[1.08rem]"
                strokeWidth={1.5}
              />
            </Link>
          )}

          <button
            ref={menuButtonRef}
            type="button"
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsOpen((open) => !open)}
            className={`ml-2 inline-flex size-11 items-center justify-center rounded-full bg-dark-900 text-light-100 transition-transform active:scale-95 lg:hidden ${focusRing}`}
          >
            {isOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
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
          <nav
            aria-label="Mobile navigation"
            className="max-h-[calc(100dvh-7.25rem)] overflow-y-auto px-4 py-5 sm:px-6"
          >
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

            <div className="mt-5 border-t border-dark-900/10 pt-5">
              {isLoadingUser ? (
                <div className="h-20 animate-pulse rounded-xl bg-light-200" />
              ) : user ? (
                <div className="rounded-xl bg-light-200 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {renderAvatar()}
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-semibold">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-dark-700">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {accountError ? (
                    <p
                      role="alert"
                      className="mt-3 text-xs leading-5 text-red-700"
                    >
                      {accountError}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    disabled={isSigningOut}
                    onClick={handleSignOut}
                    className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-dark-900/15 text-xs font-bold disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    {isSigningOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-16 items-center justify-center gap-2 rounded-xl bg-dark-900 px-3 text-xs font-bold text-white ${focusRing}`}
                  >
                    <UserRound aria-hidden="true" className="size-4" />
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-16 items-center justify-center rounded-xl border border-dark-900/15 px-3 text-center text-xs font-bold ${focusRing}`}
                  >
                    Create account
                  </Link>
                </div>
              )}

              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className={`mt-2 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-light-200 text-xs font-bold ${focusRing}`}
              >
                <ShoppingBag aria-hidden="true" className="size-4" />
                Checkout preview
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
