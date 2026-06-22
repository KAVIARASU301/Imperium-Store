"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function safeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function completeSignIn() {
      const next = safeRedirectPath(searchParams.get("next"));
      const code = searchParams.get("code");
      const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

      if (oauthError) {
        if (mounted) setErrorMessage(oauthError);
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (!data.session) throw new Error("No sign-in session was returned by the provider.");
        }

        router.replace(next);
      } catch (error) {
        if (mounted) setErrorMessage(error instanceof Error ? error.message : "Unable to complete social sign-in.");
      }
    }

    void completeSignIn();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-red-300">Authentication failed</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">We could not complete your sign-in.</h1>
        <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">{errorMessage}</p>
        <Link href="/login" className="mt-6 inline-flex rounded-2xl bg-cyan-300 px-5 py-3 font-semibold text-black hover:bg-cyan-200">
          Back to login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center text-slate-400">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Completing secure sign-in</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">Connecting your store account...</h1>
      <p className="mt-4">Please wait while we verify the provider response and open your dashboard.</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-6 py-24 text-slate-400">Completing secure sign-in...</main>}>
      <AuthCallback />
    </Suspense>
  );
}
