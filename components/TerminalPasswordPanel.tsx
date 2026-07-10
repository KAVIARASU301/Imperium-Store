"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type PasswordStatus = {
  tone: "info" | "success" | "error";
  text: string;
};

type CooldownResponse = {
  canUpdate?: boolean;
  cooldownSeconds?: number;
  lastUpdatedAt?: string | null;
  nextAllowedAt?: string | null;
  message?: string;
};

function getRemainingMs(nextAllowedAt: string | null, now: number) {
  if (!nextAllowedAt) return 0;
  return Math.max(0, new Date(nextAllowedAt).getTime() - now);
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds} sec`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
}

export default function TerminalPasswordPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldownLoading, setCooldownLoading] = useState(true);
  const [nextAllowedAt, setNextAllowedAt] = useState<string | null>(null);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [status, setStatus] = useState<PasswordStatus>({
    tone: "info",
    text: "Create or update the password used to authenticate this account inside the Imperium terminal.",
  });

  useEffect(() => {
    let active = true;

    async function loadPanelState() {
      setCooldownLoading(true);

      try {
        const { data } = await getSupabaseBrowserClient().auth.getSession();
        if (!active) return;
        const token = data.session?.access_token;
        setEmail(data.session?.user.email ?? "");
        if (!token) throw new Error("Sign in again before setting a terminal password.");

        const response = await fetch("/api/auth/terminal-password", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = (await response.json().catch(() => ({}))) as CooldownResponse;
        if (!active) return;
        if (!response.ok) {
          setApiUnavailable(true);
          throw new Error(payload.message ?? "Unable to load terminal password cooldown.");
        }

        setApiUnavailable(false);
        setNextAllowedAt(payload.nextAllowedAt ?? null);
      } catch (error) {
        if (!active) return;
        setStatus({
          tone: "error",
          text:
            error instanceof Error
              ? error.message
              : "Unable to load terminal password cooldown.",
        });
      } finally {
        if (active) setCooldownLoading(false);
      }
    }

    void loadPanelState();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!nextAllowedAt) return;

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [nextAllowedAt]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (!password.trim()) throw new Error("Enter a terminal password.");
      if (password.length < 8)
        throw new Error("Use at least 8 characters for the terminal password.");
      if (!confirmPassword) throw new Error("Confirm the terminal password.");
      if (password !== confirmPassword)
        throw new Error("Terminal passwords do not match.");

      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sign in again before setting a terminal password.");

      const response = await fetch("/api/auth/terminal-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json().catch(() => ({}))) as CooldownResponse;
      if (response.status === 429) {
        setNextAllowedAt(payload.nextAllowedAt ?? null);
        setStatus({
          tone: "info",
          text:
            payload.message ??
            "Terminal password was updated recently. Try again after the cooldown.",
        });
        return;
      }
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to save the terminal password.");
      }

      setPassword("");
      setConfirmPassword("");
      setNextAllowedAt(payload.nextAllowedAt ?? null);
      setApiUnavailable(false);
      setNow(Date.now());
      setStatus({
        tone: "success",
        text: "Terminal password saved. Use your store email and this password when Imperium asks for account authentication.",
      });
    } catch (error) {
      setStatus({
        tone: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to save the terminal password.",
      });
    } finally {
      setLoading(false);
    }
  }

  const remainingMs = getRemainingMs(nextAllowedAt, now);
  const isCoolingDown = remainingMs > 0;
  const displayStatus = isCoolingDown
    ? {
        tone: "info" as const,
        text: `You can update the terminal password again in ${formatRemaining(remainingMs)}.`,
      }
    : status;
  const submitDisabled = loading || cooldownLoading || isCoolingDown || apiUnavailable;

  return (
    <section id="terminal-password" className="scroll-mt-28 rounded-md border border-gold/35 bg-[linear-gradient(180deg,rgba(54,43,20,0.34),rgba(11,22,38,0.96))] p-5 shadow-[0_20px_58px_rgba(0,0,0,0.30)]">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] lg:items-start">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright">
            Terminal account access
          </p>
          <h2 className="mt-3 text-xl font-bold text-white">
            Create or update your Imperium terminal password.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Google login works for the store, but the desktop terminal signs in with your email and a password. Set that password here for your Imperium Store account before opening the terminal.
          </p>
          <div className="mt-4 rounded-md border border-cyan-border bg-main/55 p-4 text-sm leading-6 text-white">
            <p className="font-semibold">Terminal login email</p>
            <p className="mt-1 break-all text-muted">{email || "Signed-in store email"}</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-md border border-cyan-border bg-main/65 p-4">
          <label className="block text-sm font-medium text-white">
            Terminal password
            <div className="mt-2 flex border border-cyan-border bg-section focus-within:border-brand">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white outline-none"
                placeholder="At least 8 characters"
                type={showPassword ? "text" : "password"}
                minLength={8}
                autoComplete="new-password"
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

          <label className="mt-4 block text-sm font-medium text-white">
            Confirm terminal password
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full border border-cyan-border bg-section px-4 py-3 text-white outline-none focus:border-brand"
              placeholder="Repeat password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </label>

          <button
            disabled={submitDisabled}
            className="mt-4 w-full btn-primary px-4 py-3 font-semibold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : cooldownLoading
                ? "Checking cooldown..."
                : isCoolingDown
                  ? `Available in ${formatRemaining(remainingMs)}`
                  : "Save terminal password"}
          </button>

          <p
            className={`mt-4 rounded-md border px-4 py-3 text-sm leading-6 ${
              displayStatus.tone === "success"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                : displayStatus.tone === "error"
                  ? "border-red-500/30 bg-red-500/10 font-semibold text-red-100"
                  : "border-cyan-border bg-card/60 text-muted"
            }`}
          >
            {displayStatus.text}
          </p>
        </form>
      </div>
    </section>
  );
}
