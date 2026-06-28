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

export default function HeaderAccount() {
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
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false);
    setIsSigningOut(false);
  }

  if (!loaded) {
    return <span className="px-3 py-2 text-muted">Account</span>;
  }

  if (!accountLabel) {
    return (
      <Link
        href="/login"
        className="inline-flex min-h-10 items-center justify-center gap-2 border border-brand/70 bg-brand/10 px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:border-brand hover:bg-brand/20"
      >
        <Image src="/icons/login.svg" alt="" width={16} height={16} className="h-4 w-4" suppressHydrationWarning />
        <span>Login</span>
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 border border-cyan-border bg-section px-3 py-2 font-medium text-white transition hover:border-brand hover:bg-card"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <Image src="/icons/profile_avatar.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" suppressHydrationWarning />
        <span className="max-w-32 truncate sm:max-w-44">{accountLabel}</span>
        <span className={`text-[10px] transition ${isMenuOpen ? "rotate-180" : ""}`} aria-hidden="true">▾</span>
      </button>

      {isMenuOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden border border-cyan-border bg-section/95 py-2 text-sm text-white shadow-2xl shadow-black/40 backdrop-blur-xl" role="menu">
          <div className="border-b border-cyan-border px-4 py-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Signed in as</p>
            <p className="mt-1 truncate font-medium text-white">{accountLabel}</p>
            {user?.email ? <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p> : null}
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 transition hover:bg-card hover:text-white" role="menuitem" onClick={() => setIsMenuOpen(false)}>
            <Image src="/icons/portfolio.svg" alt="" width={16} height={16} className="h-4 w-4" suppressHydrationWarning />
            My purchases
          </Link>
          <Link href="/support" className="flex items-center gap-2 px-4 py-2.5 transition hover:bg-card hover:text-white" role="menuitem" onClick={() => setIsMenuOpen(false)}>
            <Image src="/icons/support/support.svg" alt="" width={16} height={16} className="h-4 w-4" suppressHydrationWarning />
            Support
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-rose-200 transition hover:bg-rose-950/40 hover:text-rose-100 disabled:cursor-wait disabled:opacity-60"
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
