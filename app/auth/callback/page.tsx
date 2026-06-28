"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function safeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//"))
    return "/dashboard";
  return value;
}

function getLoginUrl(next: string, message: string) {
  const params = new URLSearchParams({ next, oauth_error: message });
  return `/login?${params.toString()}`;
}

function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const next = useMemo(
    () => safeRedirectPath(new URLSearchParams(search).get("next")),
    [search],
  );
  const [message, setMessage] = useState("Finalizing Google sign-in...");

  useEffect(() => {
    let cancelled = false;

    async function finishGoogleSignIn() {
      const params = new URLSearchParams(search);
      const providerError =
        params.get("error_description") ?? params.get("error");

      if (providerError) {
        router.replace(getLoginUrl(next, providerError.slice(0, 240)));
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const code = params.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data } = await supabase.auth.getSession();
        if (!data.session)
          throw new Error("Google sign-in did not create a session. Try again.");

        window.dispatchEvent(new Event("imperium-auth-change"));
        router.replace(next);
      } catch (error) {
        if (cancelled) return;
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to finish Google sign-in.";
        setMessage(errorMessage);
        router.replace(getLoginUrl(next, errorMessage.slice(0, 240)));
      }
    }

    void finishGoogleSignIn();

    return () => {
      cancelled = true;
    };
  }, [next, router, search]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-6 py-24">
      <section className="w-full border border-cyan-border bg-section/95 p-6 text-center shadow-2xl shadow-black/20 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-brand">
          Google access
        </p>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Completing sign-in
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">{message}</p>
      </section>
    </main>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-6 py-24 text-muted">
          Completing sign-in...
        </main>
      }
    >
      <OAuthCallback />
    </Suspense>
  );
}
