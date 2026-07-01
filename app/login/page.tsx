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
  "An account already exists with this email. Use Login or Forgot password to recover that account and keep access to previous purchases. To create a separate account, use a different email address.";
const signupFailureMessage =
  "Unable to create this account. If you already have an Imperium account, use Login or Forgot password to recover access.";

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
      : {
          tone: "info",
          text: "Sign in to access purchases, downloads, invoices, and product updates.",
        },
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
          ? "Enter your email and we will send a secure password reset link."
          : nextMode === "reset"
            ? "Use the password reset link from your email, then save a stronger password."
            : "Sign in to access purchases, downloads, invoices, and product updates.",
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
          text: "Password reset email sent. Check your inbox and follow the secure link.",
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
          text: `Account created for ${cleanEmail}. You must confirm the email before logging in. For now, the confirmation email may appear from "Supabase Auth".`,
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
    <main className="page-container grid gap-10 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
      {confirmationEmail ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <section
            aria-modal="true"
            role="dialog"
            className="w-full max-w-lg border border-cyan-border bg-section p-6 shadow-2xl shadow-black/40 sm:p-8"
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              Email confirmation required
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Check your inbox before logging in.
            </h2>
            <p className="mt-4 leading-7 text-white">
              We created the account for <span className="font-semibold text-white">{confirmationEmail}</span>. Open the confirmation email and verify your address. Login will work only after the email is confirmed.
            </p>
            <p className="mt-4 border border-cyan-border bg-card px-4 py-3 text-sm leading-6 text-white">
              For now, the email sender may show as <span className="font-semibold text-white">Supabase Auth</span>. Search your inbox for that sender if you do not see an Imperium Store email.
            </p>
            <div className="mt-6 border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
              If you do not see the email, check spam, promotions, or updates folders before trying to create another account.
            </div>
            <button
              type="button"
              onClick={() => setConfirmationEmail("")}
              className="mt-6 w-full btn-primary px-4 py-3 font-semibold uppercase tracking-[0.08em] text-white "
            >
              I understand, go to login
            </button>
          </section>
        </div>
      ) : null}
      <section className="flex flex-col self-start">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-brand">
          Secure customer access
        </p>
        <h1 className="mt-5 text-4xl font-extrabold tracking-normal text-white sm:text-5xl">
          Sign in to your Imperium account.
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">
          Access your purchases, downloads, invoices, and product updates from one
          secure account.
        </p>
      </section>

      <section className="surface-panel p-6 sm:p-8">
        <div className="flex border border-cyan-border bg-main p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 px-4 py-2 ${mode === "signin" ? "btn-primary text-white" : "text-muted hover:text-white"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 px-4 py-2 ${mode === "signup" ? "btn-primary text-white" : "text-muted hover:text-white"}`}
          >
            Sign up
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {status.tone !== "error" ? (
            <p className={`mt-2 text-sm leading-6 ${status.tone === "success" ? "text-emerald-300" : "text-muted"}`}>
              {status.text}
            </p>
          ) : null}
        </div>

        {showGoogleAuth ? (
          <div className="mt-6 space-y-4">
            <button
              type="button"
              disabled={loading}
              onClick={signInWithGoogle}
              className="flex min-h-12 w-full items-center justify-center gap-3 border border-cyan-border bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950 shadow-lg shadow-black/20 hover:border-white hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
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
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              <span className="h-px flex-1 bg-cyan-border" />
              <span>Email access</span>
              <span className="h-px flex-1 bg-cyan-border" />
            </div>
          </div>
        ) : null}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" ? (
            <label className="block text-sm font-medium text-white">
              Full name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 w-full border border-cyan-border bg-main px-4 py-3 text-white outline-none focus:border-brand"
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
              className="mt-2 w-full border border-cyan-border bg-main px-4 py-3 text-white outline-none focus:border-brand"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          {showPasswordFields ? (
            <label className="block text-sm font-medium text-white">
              {mode === "reset" ? "New password" : "Password"}
              <div className="mt-2 flex border border-cyan-border bg-main focus-within:border-brand">
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
                className="mt-2 w-full border border-cyan-border bg-main px-4 py-3 text-white outline-none focus:border-brand"
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
            className="w-full btn-primary px-4 py-3 font-semibold uppercase tracking-[0.08em] text-white  disabled:cursor-not-allowed disabled:opacity-60"
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
            <p className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold leading-6 text-red-100">
              {status.text}
            </p>
          ) : null}
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          {mode !== "forgot" && mode !== "reset" ? (
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              className="font-semibold text-brand hover:text-white"
            >
              Forgot password?
            </button>
          ) : (
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-semibold text-brand hover:text-white"
            >
              Back to login
            </button>
          )}
          <span>
            Account security and data handling are covered in our{" "}
            <Link
              href="/privacy-policy"
              className="text-brand hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </div>
      </section>
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
