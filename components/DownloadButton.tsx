"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";

export default function DownloadButton({ fileId, label = "Download" }: { fileId: string; label?: string }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    if (isLoading) return;
    setIsLoading(true);
    setMessage("");
    try {
      const { data } = await getSupabaseBrowserClient().auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch(`/api/downloads/${fileId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message ?? "Download failed");
      window.location.href = payload.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Download failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="sm:text-right">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isLoading}
        aria-busy={isLoading}
        className="inline-flex min-w-32 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition duration-150 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0B1020] disabled:cursor-wait disabled:bg-slate-700 disabled:text-slate-300 disabled:shadow-none disabled:hover:translate-y-0"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin border-2 border-slate-400 border-t-cyan-200" aria-hidden="true" />
            Preparing
          </>
        ) : (
          <>
            <Image src="/icons/download/download-16.png" alt="" width={16} height={16} className="h-4 w-4" />
            {label}
          </>
        )}
      </button>
      {isLoading ? <p className="mt-2 text-xs text-cyan-200">Preparing download...</p> : null}
      {message ? <p className="mt-2 text-sm text-amber-200">{message}</p> : null}
    </div>
  );
}
