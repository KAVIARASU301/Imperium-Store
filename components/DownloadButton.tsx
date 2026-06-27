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
        className="inline-flex min-w-32 items-center justify-center gap-2 bg-[#1e52e8] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/20 transition duration-150 hover:bg-[#2b63ff] focus:outline-none focus:ring-2 focus:ring-[#1e52e8] focus:ring-offset-2 focus:ring-offset-[#0c1525] disabled:cursor-wait disabled:bg-[#1b3055] disabled:text-[#6882a8] disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin border-2 border-[#6882a8] border-t-white" aria-hidden="true" />
            Preparing
          </>
        ) : (
          <>
            <Image src="/icons/download/download-16.png" alt="" width={16} height={16} className="h-4 w-4" />
            {label}
          </>
        )}
      </button>
      {isLoading ? <p className="mt-2 text-xs text-[#0891b2]">Preparing download...</p> : null}
      {message ? <p className="mt-2 text-sm text-amber-200">{message}</p> : null}
    </div>
  );
}
