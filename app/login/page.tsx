"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Provider } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, type FormEvent, useMemo, useState } from "react";

type AuthMode = "signin" | "signup" | "forgot" | "reset";

type AuthStatus = {
  tone: "info" | "success" | "error";
  text: string;
};

const oauthProviders: Array<{ provider: Provider; label: string; icon: string }> = [
  { provider: "google", label: "Continue with Google", icon: "G" },
  { provider: "github", label: "Continue with GitHub", icon: "◆" },
];

function getRedirectUrl(path: string) {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

function getAuthMode(value: string | null): AuthMode {
  if (value === "signup" || value === "forgot" || value === "reset") return value;
  return "signin";
}

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = getAuthMode(searchParams.get("mode"));
  const next = getSafeNextPath(searchParams.get("next"));
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AuthStatus>({
    tone: "info",
    text: "Sign in securely with Google, GitHub, or your email and password.",
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
            : "Sign in securely with Google, GitHub, or your email and password.",
    });
  }

  async function signInWithProvider(provider: Provider) {
    setLoading(true);
    setStatus({ tone: "info", text: "Redirecting to your secure sign-in provider..." });

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getRedirectUrl(next),
          queryParams: provider === "google" ? { prompt: "select_account" } : undefined,
        },
      });

      if (error) throw error;
    } catch (error) {
      setLoading(false);
      setStatus({ tone: "error", text: error instanceof Error ? error.message : "Social login is not configured yet." });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) throw new Error("Enter your email address.");

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: getRedirectUrl("/login?mode=reset"),
        });
        if (error) throw error;
        setStatus({ tone: "success", text: "Password reset email sent. Check your inbox and follow the secure link." });
        return;
      }

      if (mode === "reset") {
        if (password.length < 8) throw new Error("Use at least 8 characters for your new password.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setStatus({ tone: "success", text: "Password updated. Redirecting to your purchases..." });
        router.push(next);
        return;
      }

      if (password.length < 8) throw new Error("Use at least 8 characters for your password.");

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: getRedirectUrl(next),
          },
        });
        if (error) throw error;
        setStatus({ tone: "success", text: "Account created. Confirm your email if required, then sign in to continue." });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) throw error;
      setStatus({ tone: "success", text: "Signed in. Redirecting to your purchases..." });
      router.push(next);
    } catch (error) {
      setStatus({ tone: "error", text: error instanceof Error ? error.message : "Authentication is not configured yet." });
    } finally {
      setLoading(false);
    }
  }

  const showOAuth = mode === "signin" || mode === "signup";
  const showPasswordFields = mode !== "forgot";

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
      <section className="flex flex-col justify-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Secure customer access</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Production-grade login for your trading tools.</h1>
        <p className="mt-5 text-base leading-7 text-slate-400">
          Sign in with a trusted provider or use email and password. Password recovery, account confirmation, and reset flows are built on Supabase Auth.
        </p>
        <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
          {["Google and GitHub OAuth", "Email/password fallback", "Forgot and reset password"].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-800 bg-white/[0.03] p-4">
              <span className="text-cyan-300">✓</span>
              <p className="mt-2">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-[#0B1020]/90 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
        <div className="flex rounded-full border border-slate-800 bg-black/20 p-1 text-sm font-semibold">
          <button type="button" onClick={() => switchMode("signin")} className={`flex-1 rounded-full px-4 py-2 ${mode === "signin" ? "bg-cyan-300 text-black" : "text-slate-400 hover:text-white"}`}>Login</button>
          <button type="button" onClick={() => switchMode("signup")} className={`flex-1 rounded-full px-4 py-2 ${mode === "signup" ? "bg-cyan-300 text-black" : "text-slate-400 hover:text-white"}`}>Sign up</button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className={`mt-3 rounded-2xl border px-4 py-3 text-sm leading-6 ${status.tone === "error" ? "border-red-500/30 bg-red-500/10 text-red-200" : status.tone === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-slate-800 bg-black/20 text-slate-400"}`}>{status.text}</p>
        </div>

        {showOAuth ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {oauthProviders.map(({ provider, label, icon }) => (
              <button key={provider} type="button" disabled={loading} onClick={() => signInWithProvider(provider)} className="flex items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60">
                <span className="grid size-6 place-items-center rounded-full bg-slate-950 text-xs text-white">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {showOAuth ? <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-500"><span className="h-px flex-1 bg-slate-800" />or use email<span className="h-px flex-1 bg-slate-800" /></div> : null}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" ? (
            <label className="block text-sm font-medium text-slate-300">
              Full name
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-800 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Your name" autoComplete="name" />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-slate-300">
            Email address
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-800 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="you@example.com" type="email" autoComplete="email" required />
          </label>

          {showPasswordFields ? (
            <label className="block text-sm font-medium text-slate-300">
              {mode === "reset" ? "New password" : "Password"}
              <div className="mt-2 flex rounded-2xl border border-slate-800 bg-black/20 focus-within:border-cyan-300">
                <input value={password} onChange={(event) => setPassword(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white outline-none" placeholder="At least 8 characters" type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} required />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="px-4 text-sm font-semibold text-cyan-300">{showPassword ? "Hide" : "Show"}</button>
              </div>
            </label>
          ) : null}

          {mode === "reset" ? (
            <label className="block text-sm font-medium text-slate-300">
              Confirm new password
              <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-800 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Repeat password" type="password" autoComplete="new-password" required />
            </label>
          ) : null}

          <button disabled={loading} className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-semibold text-black hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : mode === "reset" ? "Save new password" : "Login securely"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          {mode !== "forgot" && mode !== "reset" ? <button type="button" onClick={() => switchMode("forgot")} className="font-semibold text-cyan-300 hover:text-cyan-200">Forgot password?</button> : <button type="button" onClick={() => switchMode("signin")} className="font-semibold text-cyan-300 hover:text-cyan-200">Back to login</button>}
          <span>Protected by <Link href="/privacy-policy" className="text-cyan-300 hover:text-cyan-200">privacy-first policies</Link>.</span>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-6 py-24 text-slate-400">Loading secure login...</main>}>
      <LoginForm />
    </Suspense>
  );
}
