"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Use email and password to sign in or create an account.");

  async function submit(mode: "signin" | "signup") {
    try {
      const supabase = getSupabaseBrowserClient();
      const result = mode === "signin" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
      setMessage(result.error ? result.error.message : mode === "signin" ? "Signed in. You can open My Purchases." : "Account created. Check your email if confirmation is enabled.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Auth is not configured."); }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-semibold text-white">Login</h1>
      <p className="mt-3 text-sm leading-6 text-slate-400">{message}</p>
      <div className="mt-8 space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-800 bg-[#0B1020] px-4 py-3 text-white" placeholder="Email" type="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-800 bg-[#0B1020] px-4 py-3 text-white" placeholder="Password" type="password" />
        <div className="grid grid-cols-2 gap-3"><button onClick={() => submit("signin")} className="bg-cyan-300 px-4 py-3 font-semibold text-black">Login</button><button onClick={() => submit("signup")} className="border border-slate-700 px-4 py-3 font-semibold text-white">Sign up</button></div>
      </div>
    </main>
  );
}
