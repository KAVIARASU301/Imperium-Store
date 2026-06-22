"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
    });

    window.addEventListener("imperium-auth-change", syncUser);

    return () => {
      mounted = false;
      window.removeEventListener("imperium-auth-change", syncUser);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const accountLabel = useMemo(() => getAccountLabel(user), [user]);

  if (!loaded) {
    return <span className="text-slate-600">Account</span>;
  }

  if (!accountLabel) {
    return <Link href="/login" className="hover:text-cyan-300">Login</Link>;
  }

  return (
    <Link
      href="/dashboard"
      className="rounded-full border border-cyan-300/30 px-3 py-1.5 font-medium text-cyan-200 transition hover:border-cyan-200 hover:text-white"
      title="View account and purchases"
    >
      {accountLabel}
    </Link>
  );
}
