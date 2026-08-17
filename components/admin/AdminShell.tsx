"use client";

import {
  Activity,
  Boxes,
  Gem,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Store,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { adminFetch } from "@/lib/admin/client";
import type { AdminSession } from "@/lib/admin/contracts";
import { signOut } from "@/lib/appwrite/auth.service";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: PackageSearch },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/activity", label: "Activity", icon: Activity },
] as const;

export default function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "signed-out" | "forbidden" | "error">("loading");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    adminFetch<{ session: AdminSession }>("/api/admin/session")
      .then(({ session: value }) => {
        if (!active) return;
        setSession(value);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (!active) return;
        const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 401;
        setState(status === 403 ? "forbidden" : status === 401 ? "signed-out" : "error");
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    await signOut().catch(() => undefined);
    router.push("/sign-in?returnTo=%2Fadmin");
  }

  if (state === "loading") {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="text-center" role="status">
          <Gem className="mx-auto size-8 animate-pulse text-[#5b2333]" />
          <p className="mt-4 text-sm text-[#746c64]">Checking admin access…</p>
        </div>
      </main>
    );
  }

  if (state !== "ready" || !session) {
    const signedOut = state === "signed-out";
    const forbidden = state === "forbidden";
    return (
      <main className="grid min-h-screen place-items-center px-6 py-16">
        <section className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-8 text-center shadow-[0_24px_70px_rgba(23,20,17,.08)]">
          <Gem className="mx-auto size-9 text-[#5b2333]" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.2em] text-[#5b2333]">Aurelle administration</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">
            {signedOut ? "Sign in to continue" : forbidden ? "Admin access required" : "Administration unavailable"}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#746c64]">
            {signedOut
              ? "Use the Aurelle account that belongs to the store-admins team."
              : forbidden
                ? "Your account is signed in, but it is not an active member of the store administration team."
                : "We could not verify admin access. Check the Appwrite configuration and try again."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href={signedOut ? "/sign-in?returnTo=%2Fadmin" : "/"}
              className="inline-flex min-h-11 items-center rounded-full bg-[#171411] px-5 text-sm font-semibold text-white"
            >
              {signedOut ? "Sign in" : "Return to store"}
            </Link>
            {!signedOut ? (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-11 rounded-full border border-black/15 px-5 text-sm font-semibold"
              >
                Try again
              </button>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  if (!session.configured) {
    return (
      <main className="grid min-h-screen place-items-center px-6 py-16">
        <section className="w-full max-w-xl rounded-3xl border border-amber-900/20 bg-white p-8 shadow-[0_24px_70px_rgba(23,20,17,.08)]">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-amber-800">Setup required</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">Admin runtime key is missing</h1>
          <p className="mt-3 text-sm leading-6 text-[#746c64]">
            Your team membership is valid. Add a narrowly scoped <code className="rounded bg-black/5 px-1.5 py-0.5">APPWRITE_ADMIN_API_KEY</code> to the server environment, then restart the app. This value must never be exposed to the browser.
          </p>
          <Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-[#171411] px-5 text-sm font-semibold text-white">
            Return to store
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      {menuOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/35 lg:hidden"
        />
      ) : null}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[17rem] flex-col bg-[#171411] text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center gap-3" aria-label="Aurelle admin overview">
            <span className="grid size-9 place-items-center rounded-full border border-[#c2a36b]/60"><Gem className="size-4 text-[#c2a36b]" /></span>
            <span><span className="block font-display text-xl tracking-[.16em]">AURELLE</span><span className="block text-[.6rem] uppercase tracking-[.24em] text-white/55">Administration</span></span>
          </Link>
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid size-10 place-items-center lg:hidden"><X className="size-5" /></button>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? "bg-white text-[#171411]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                <item.icon className="size-4" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate px-2 text-sm font-semibold">{session.user.name || session.user.email}</p>
          <p className="mt-1 truncate px-2 text-xs text-white/50">{session.roles.join(" · ")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/" className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white/10 text-xs font-semibold hover:bg-white/15"><Store className="size-3.5" />Store</Link>
            <button type="button" onClick={handleSignOut} className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white/10 text-xs font-semibold hover:bg-white/15"><LogOut className="size-3.5" />Sign out</button>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-black/10 bg-[#f4f1ec]/90 px-4 backdrop-blur-lg sm:px-6 lg:hidden">
          <button type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center rounded-full border border-black/10 bg-white"><Menu className="size-5" /></button>
          <span className="font-display text-lg font-semibold">Aurelle Admin</span>
        </header>
        <main className="mx-auto w-full max-w-[100rem] p-4 sm:p-6 xl:p-10">{children}</main>
      </div>
    </div>
  );
}
