"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type AccountUser = {
  email?: string;
  user_metadata?: {
    full_name?: unknown;
    name?: unknown;
  };
};

function getAccountLabel(user: AccountUser | null) {
  if (!user) return null;

  const metadataName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  if (typeof metadataName === "string" && metadataName.trim()) return metadataName.trim();

  const emailName = user.email?.split("@")[0];
  if (emailName) return emailName;

  return "Account";
}

export default function HeaderAccount({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();

    async function syncUser() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoaded(true);
    }

    void syncUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoaded(true);
      setIsMenuOpen(false);
    });

    window.addEventListener("imperium-auth-change", syncUser);

    return () => {
      mounted = false;
      window.removeEventListener("imperium-auth-change", syncUser);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const accountLabel = useMemo(() => getAccountLabel(user), [user]);

  async function handleLogout() {
    setIsSigningOut(true);
    setUser(null);
    setIsMenuOpen(false);

    const supabase = getSupabaseBrowserClient();
    try {
      await supabase.auth.signOut({ scope: "local" });
    } finally {
      setIsSigningOut(false);
    }
  }

  if (!loaded) {
    if (compact) {
      return (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-cyan-border bg-section opacity-60">
          <Image src="/icons/profile_avatar.svg" alt="" width={20} height={20} className="h-5 w-5" suppressHydrationWarning />
        </span>
      );
    }
    return <span className="inline-flex min-h-11 items-center px-3 py-2 text-muted">Account</span>;
  }

  if (!accountLabel) {
    if (compact) {
      return (
        <Link
          href="/login"
          aria-label="Log in"
          className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-brand/70 bg-brand/10 text-white transition hover:border-brand hover:bg-brand/20"
        >
          <Image src="/icons/profile_avatar.svg" alt="" width={20} height={20} className="h-5 w-5" suppressHydrationWarning />
        </Link>
      );
    }
    return (
        <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-brand/70 bg-brand/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:border-brand hover:bg-brand/20"
        >
          <Image src="/icons/login.svg" alt="" width={16} height={16} className="h-4 w-4" suppressHydrationWarning />
          <span>Login</span>
        </Link>
    );
  }

  return (
      <div ref={menuRef} className="relative">
        {compact ? (
          <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-cyan-border bg-section text-white transition hover:border-brand hover:bg-card"
              aria-label="Open account menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Image src="/icons/profile_avatar.svg" alt="" width={20} height={20} className="h-5 w-5" suppressHydrationWarning />
          </button>
        ) : (
          <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-cyan-border bg-section px-3 py-2.5 font-medium text-white transition hover:border-brand hover:bg-card"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Image src="/icons/profile_avatar.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" suppressHydrationWarning />
            <span className="max-w-32 truncate sm:max-w-44">{accountLabel}</span>
            <Image
                src="/icons/dropdown-arrow.svg"
                alt=""
                width={14}
                height={14}
                className={`h-3.5 w-3.5 transition ${isMenuOpen ? "rotate-180" : ""}`}
                suppressHydrationWarning
            />
          </button>
        )}

        {isMenuOpen ? (
            <div
                className={`${compact ? "fixed left-3 right-3 top-14 sm:top-[69px]" : "absolute right-0 mt-3 w-72"} z-50 overflow-hidden rounded-md border border-cyan-border bg-section/95 p-2 text-sm text-white shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-xl`}
                role="menu"
            >
              <div className="mb-2 rounded-md border border-cyan-border bg-[linear-gradient(180deg,rgba(19,40,68,0.82),rgba(16,29,47,0.72))] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
                <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-main/70">
                <Image src="/icons/profile_avatar.svg" alt="" width={22} height={22} className="h-[22px] w-[22px]" suppressHydrationWarning />
              </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{accountLabel}</p>
                    {user?.email ? <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p> : null}
                  </div>
                </div>
              </div>
              <Link href="/dashboard" className="flex min-h-11 items-center gap-3 rounded-md px-3 py-3 text-muted transition hover:bg-card-hover hover:text-white" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                <Image src="/icons/portfolio.svg" alt="" width={16} height={16} className="h-4 w-4" suppressHydrationWarning />
                My purchases
              </Link>
              <Link href="/dashboard#terminal-password" className="flex min-h-11 items-center gap-3 rounded-md px-3 py-3 text-muted transition hover:bg-card-hover hover:text-white" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                <Image src="/icons/settings_gear.svg" alt="" width={16} height={16} className="h-4 w-4" suppressHydrationWarning />
                Terminal password
              </Link>
              <Link href="/support" className="flex min-h-11 items-center gap-3 rounded-md px-3 py-3 text-muted transition hover:bg-card-hover hover:text-white" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                <Image src="/icons/support/support.svg" alt="" width={16} height={16} className="h-4 w-4" suppressHydrationWarning />
                Support
              </Link>
              <button
                  type="button"
                  className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-md border-t border-cyan-border px-3 py-3 text-left text-rose-200 transition hover:bg-rose-950/40 hover:text-rose-100 disabled:cursor-wait disabled:opacity-60"
                  role="menuitem"
                  disabled={isSigningOut}
                  onClick={handleLogout}
              >
                <Image src="/icons/logout.svg" alt="" width={16} height={16} className="h-4 w-4" suppressHydrationWarning />
                {isSigningOut ? "Signing out..." : "Logout"}
              </button>
            </div>
        ) : null}
      </div>
  );
}
