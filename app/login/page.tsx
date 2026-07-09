"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, type FormEvent, useMemo, useState } from "react";

type AuthMode = "signin" | "signup" | "forgot" | "reset";

type AuthStatus = {
  tone: "info" | "success" | "error";
  text: string;
};

function getRedirectUrl(path: string) {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

function getAuthMode(value: string | null): AuthMode {
  if (value === "signup" || value === "forgot" || value === "reset")
    return value;
  return "signin";
}

function safeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//"))
    return "/dashboard";
  return value;
}

function getOAuthError(value: string | null) {
  if (!value) return null;
  return value.slice(0, 240);
}

const existingAccountMessage =
  "An account already exists with this email. Use Login or Forgot password to recover it. To create a separate account, use a different email.";
const signupFailureMessage =
  "Unable to create this account. If you already have an Imperium account, use Login or Forgot password.";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = getAuthMode(searchParams.get("mode"));
  const next = safeRedirectPath(searchParams.get("next"));
  const oauthError = getOAuthError(
    searchParams.get("oauth_error") ?? searchParams.get("error_description"),
  );

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [status, setStatus] = useState<AuthStatus>(() =>
    oauthError
      ? { tone: "error", text: oauthError }
      : { tone: "info", text: "" },
  );

  const title = useMemo(() => {
    if (mode === "signup") return "Create your account";
    if (mode === "forgot") return "Reset your password";
    if (mode === "reset") return "Choose a new password";
    return "Welcome back";
  }, [mode]);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPassword("");
    setConfirmPassword("");
    setStatus({
      tone: "info",
      text:
        nextMode === "forgot"
          ? "Enter your email and we will send a reset link."
          : nextMode === "reset"
            ? "Set a new password for your account."
            : "",
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) throw new Error("Enter your email address.");

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo: getRedirectUrl("/login?mode=reset"),
          },
        );
        if (error) throw error;
        setStatus({
          tone: "success",
          text: "Reset email sent. Check your inbox and follow the link.",
        });
        return;
      }

      if (mode === "reset") {
        if (!password) throw new Error("Enter your new password.");
        if (password.length < 8)
          throw new Error("Use at least 8 characters for your new password.");
        if (!confirmPassword) throw new Error("Confirm your new password.");
        if (password !== confirmPassword)
          throw new Error("Passwords do not match.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setStatus({
          tone: "success",
          text: "Password updated. Redirecting...",
        });
        router.push(next);
        return;
      }

      if (mode === "signup") {
        const cleanName = fullName.trim();
        if (!cleanName) throw new Error("Enter your full name.");
        if (cleanName.length < 4)
          throw new Error("Full name must be at least 4 characters.");
        if (cleanName.length > 20)
          throw new Error("Full name must be 20 characters or fewer.");
        if (!password) throw new Error("Enter your password.");
        if (password.length < 8)
          throw new Error("Use at least 8 characters for your password.");
        if (!confirmPassword) throw new Error("Confirm your password.");
        if (password !== confirmPassword)
          throw new Error("Passwords do not match.");
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanName },
            emailRedirectTo: getRedirectUrl(next),
          },
        });
        if (error) throw error;
        const identities =
          data.user && "identities" in data.user ? data.user.identities : null;
        if (Array.isArray(identities) && identities.length === 0) {
          throw new Error(existingAccountMessage);
        }
        await supabase.auth.signOut();
        setEmail(cleanEmail);
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setMode("signin");
        setConfirmationEmail(cleanEmail);
        setStatus({
          tone: "success",
          text: `Account created for ${cleanEmail}. Confirm the email before logging in.`,
        });
        return;
      }

      if (!password) throw new Error("Enter your password.");
      if (password.length < 8)
        throw new Error("Use at least 8 characters for your password.");

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) throw error;
      setStatus({ tone: "success", text: "Signed in. Redirecting..." });
      router.push(next);
    } catch (error) {
      setStatus({
        tone: "error",
        text:
          mode === "signup"
            ? signupFailureMessage
            : error instanceof Error
            ? error.message
            : "Unable to authenticate your account.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setLoading(true);
    setStatus({ tone: "info", text: "Opening Google sign-in..." });
    router.prefetch(next);

    try {
      const supabase = getSupabaseBrowserClient();
      const callbackPath = `/auth/callback?next=${encodeURIComponent(next)}`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(callbackPath),
        },
      });

      if (error) throw error;

      if (!data.url) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          router.push(next);
          return;
        }

        throw new Error("Google sign-in did not return a redirect URL.");
      }
    } catch (error) {
      setLoading(false);
      setStatus({
        tone: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to start Google sign-in.",
      });
    }
  }

  const showPasswordFields = mode !== "forgot";
  const showGoogleAuth = mode === "signin" || mode === "signup";

  return (
    <main className="mx-auto w-full max-w-[440px] px-4 py-12 sm:py-16">
      {confirmationEmail ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <section
            aria-modal="true"
            role="dialog"
            className="w-full max-w-md rounded-md border border-cyan-border bg-section p-6 shadow-2xl shadow-black/40 sm:p-8"
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              Confirm your email
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Check your inbox to activate your account.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              We sent a confirmation link to{" "}
              <span className="font-semibold text-white">{confirmationEmail}</span>.
              Login works only after the email is confirmed. The sender may appear
              as <span className="font-semibold text-white">Supabase Auth</span> —
              check spam or promotions if you do not see it.
            </p>
            <button
              type="button"
              onClick={() => setConfirmationEmail("")}
              className="btn-primary mt-6 w-full rounded-md px-4 py-3 font-semibold uppercase tracking-[0.08em] text-white"
            >
              Go to login
            </button>
          </section>
        </div>
      ) : null}

      <section className="surface-panel p-6 sm:p-8">
        <h1 className="text-center text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1.5 text-center text-sm text-muted">
          {mode === "signin" || mode === "signup"
            ? "Access your purchases and downloads."
            : status.tone !== "error"
              ? status.text
              : ""}
        </p>

        {showGoogleAuth ? (
          <div className="mt-6 space-y-4">
            <button
              type="button"
              disabled={loading}
              onClick={signInWithGoogle}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-cyan-border bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Image
                src="/icons/google.svg"
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
                suppressHydrationWarning
              />
              {loading ? "Please wait..." : "Continue with Google"}
            </button>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              <span className="h-px flex-1 bg-cyan-border" />
              <span>or use email</span>
              <span className="h-px flex-1 bg-cyan-border" />
            </div>
          </div>
        ) : null}

        {(mode === "signin" || mode === "signup") && status.tone === "success" ? (
          <p className="mt-4 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm leading-6 text-emerald-200">
            {status.text}
          </p>
        ) : null}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" ? (
            <label className="block text-sm font-medium text-white">
              Full name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 w-full rounded-md border border-cyan-border bg-main px-4 py-3 text-white outline-none focus:border-brand"
                placeholder="Your name"
                autoComplete="name"
                minLength={4}
                maxLength={20}
                required
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-white">
            Email address
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-cyan-border bg-main px-4 py-3 text-white outline-none focus:border-brand"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          {showPasswordFields ? (
            <label className="block text-sm font-medium text-white">
              {mode === "reset" ? "New password" : "Password"}
              <div className="mt-2 flex rounded-md border border-cyan-border bg-main focus-within:border-brand">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white outline-none"
                  placeholder="At least 8 characters"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="px-4 text-sm font-semibold text-brand"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          ) : null}

          {mode === "signup" || mode === "reset" ? (
            <label className="block text-sm font-medium text-white">
              {mode === "reset" ? "Confirm new password" : "Confirm password"}
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-md border border-cyan-border bg-main px-4 py-3 text-white outline-none focus:border-brand"
                placeholder="Repeat password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>
          ) : null}

          <button
            disabled={loading}
            className="btn-primary w-full rounded-md px-4 py-3 font-semibold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : mode === "forgot"
                  ? "Send reset link"
                  : mode === "reset"
                    ? "Save new password"
                    : "Login"}
          </button>

          {status.tone === "error" ? (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
              {status.text}
            </p>
          ) : null}
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          {mode === "signin" ? (
            <>
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="font-semibold text-brand hover:text-white"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-brand hover:text-white"
              >
                New here? Create account
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-semibold text-brand hover:text-white"
            >
              Back to login
            </button>
          )}
        </div>
      </section>

      <p className="mt-4 text-center text-xs text-muted">
        Your data is handled per our{" "}
        <Link href="/privacy-policy" className="text-brand hover:text-white">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-6 py-24 text-muted">
          Loading login...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
