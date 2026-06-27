"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
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

async function emailAlreadyExists(email: string) {
  const response = await fetch("/api/auth/email-exists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const payload = (await response.json()) as {
    exists?: boolean;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      payload.message ?? "Unable to verify whether this email is available.",
    );
  }

  return Boolean(payload.exists);
}

const existingAccountMessage =
  "An account already exists with this email. Use Login or Forgot password to recover that account and keep access to previous purchases. To create a separate account, use a different email address.";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = getAuthMode(searchParams.get("mode"));
  const next = safeRedirectPath(searchParams.get("next"));

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [status, setStatus] = useState<AuthStatus>({
    tone: "info",
    text: "Sign in to access purchases, downloads, invoices, and product updates.",
  });

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
        if (await emailAlreadyExists(cleanEmail)) {
          throw new Error(existingAccountMessage);
        }

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
          error instanceof Error
            ? error.message
            : "Unable to authenticate your account.",
      });
    } finally {
      setLoading(false);
    }
  }

  const showPasswordFields = mode !== "forgot";

  return (
    <main className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
      {confirmationEmail ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <section
            aria-modal="true"
            role="dialog"
            className="w-full max-w-lg border border-[#1b3055] bg-[#0c1525] p-6 shadow-2xl shadow-black/40 sm:p-8"
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[#0891b2]">
              Email confirmation required
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Check your inbox before logging in.
            </h2>
            <p className="mt-4 leading-7 text-[#c5d5ee]">
              We created the account for <span className="font-semibold text-white">{confirmationEmail}</span>. Open the confirmation email and verify your address. Login will work only after the email is confirmed.
            </p>
            <p className="mt-4 border border-[#1b3055] bg-[#111d35] px-4 py-3 text-sm leading-6 text-[#c5d5ee]">
              For now, the email sender may show as <span className="font-semibold text-white">Supabase Auth</span>. Search your inbox for that sender if you do not see an Imperium Store email.
            </p>
            <div className="mt-6 border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
              If you do not see the email, check spam, promotions, or updates folders before trying to create another account.
            </div>
            <button
              type="button"
              onClick={() => setConfirmationEmail("")}
              className="mt-6 w-full bg-[#1e52e8] px-4 py-3 font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#2b63ff]"
            >
              I understand, go to login
            </button>
          </section>
        </div>
      ) : null}
      <section className="flex flex-col justify-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#0891b2]">
          Secure customer access
        </p>
        <h1 className="mt-5 text-4xl font-extrabold tracking-normal text-[#c5d5ee] sm:text-5xl">
          Sign in to your Imperium account.
        </h1>
        <p className="mt-5 text-base leading-7 text-[#6882a8]">
          Access your purchases, downloads, invoices, and product updates from one
          secure account.
        </p>
        <div className="mt-8 grid gap-px border border-[#1b3055] bg-[#1b3055] text-sm text-[#c5d5ee] sm:grid-cols-3">
          {["Account access", "Download management", "Password recovery"].map((item) => (
            <div
              key={item}
              className="bg-[#0c1525] p-4"
            >
              <span className="text-[#0891b2]">✓</span>
              <p className="mt-2">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-[#1b3055] bg-[#0c1525]/95 p-6 shadow-2xl shadow-black/20 sm:p-8">
        <div className="flex border border-[#1b3055] bg-[#070c17] p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 px-4 py-2 ${mode === "signin" ? "bg-[#1e52e8] text-white" : "text-[#6882a8] hover:text-white"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 px-4 py-2 ${mode === "signup" ? "bg-[#1e52e8] text-white" : "text-[#6882a8] hover:text-white"}`}
          >
            Sign up
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#c5d5ee]">{title}</h2>
          {status.tone !== "error" ? (
            <p className={`mt-2 text-sm leading-6 ${status.tone === "success" ? "text-emerald-300" : "text-[#6882a8]"}`}>
              {status.text}
            </p>
          ) : null}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" ? (
            <label className="block text-sm font-medium text-[#c5d5ee]">
              Full name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 w-full border border-[#1b3055] bg-[#070c17] px-4 py-3 text-white outline-none focus:border-[#1e52e8]"
                placeholder="Your name"
                autoComplete="name"
                minLength={4}
                maxLength={20}
                required
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-[#c5d5ee]">
            Email address
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-[#1b3055] bg-[#070c17] px-4 py-3 text-white outline-none focus:border-[#1e52e8]"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          {showPasswordFields ? (
            <label className="block text-sm font-medium text-[#c5d5ee]">
              {mode === "reset" ? "New password" : "Password"}
              <div className="mt-2 flex border border-[#1b3055] bg-[#070c17] focus-within:border-[#1e52e8]">
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
                  className="px-4 text-sm font-semibold text-[#0891b2]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          ) : null}

          {mode === "signup" || mode === "reset" ? (
            <label className="block text-sm font-medium text-[#c5d5ee]">
              {mode === "reset" ? "Confirm new password" : "Confirm password"}
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full border border-[#1b3055] bg-[#070c17] px-4 py-3 text-white outline-none focus:border-[#1e52e8]"
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
            className="w-full bg-[#1e52e8] px-4 py-3 font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#2b63ff] disabled:cursor-not-allowed disabled:opacity-60"
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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[#6882a8]">
          {mode !== "forgot" && mode !== "reset" ? (
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              className="font-semibold text-[#0891b2] hover:text-[#c5d5ee]"
            >
              Forgot password?
            </button>
          ) : (
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-semibold text-[#0891b2] hover:text-[#c5d5ee]"
            >
              Back to login
            </button>
          )}
          <span>
            Account security and data handling are covered in our{" "}
            <Link
              href="/privacy-policy"
              className="text-[#0891b2] hover:text-[#c5d5ee]"
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
        <main className="mx-auto max-w-md px-6 py-24 text-[#6882a8]">
          Loading login...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
