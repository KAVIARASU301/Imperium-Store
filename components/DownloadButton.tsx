"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type DownloadButtonProps = {
  fileId: string;
  label?: string;
  className?: string;
  wrapperClassName?: string;
};

export default function DownloadButton({
  fileId,
  label = "Download",
  className = "",
  wrapperClassName = "",
}: DownloadButtonProps) {
  const [downloadFailed, setDownloadFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    if (isLoading) return;
    setIsLoading(true);
    setDownloadFailed(false);
    try {
      const { data } = await getSupabaseBrowserClient().auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch(`/api/downloads/${fileId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || typeof payload.url !== "string") throw new Error("Download failed");
      window.location.href = payload.url;
    } catch {
      setDownloadFailed(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={wrapperClassName || "sm:text-right"}>
      <button
        type="button"
        onClick={handleDownload}
        disabled={isLoading}
        aria-busy={isLoading}
        className={[
          "inline-flex min-h-11 min-w-40 cursor-pointer items-center justify-center gap-2 btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/20 transition duration-150 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-section disabled:cursor-wait disabled:border-cyan-border disabled:bg-none disabled:bg-card disabled:text-muted disabled:shadow-none",
          className,
        ].join(" ")}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin border-2 border-muted border-t-white" aria-hidden="true" />
            Preparing
          </>
        ) : (
          <>
            <Image src="/icons/download/download-16.png" alt="" width={16} height={16} className="h-4 w-4" />
            {label}
          </>
        )}
      </button>
      {isLoading ? <p className="mt-2 text-xs text-brand">Preparing download...</p> : null}
      {downloadFailed ? (
        <div className="mt-3 rounded-md border border-error/35 bg-error/10 p-3 text-left" role="alert">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-error">Download failed</p>
          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isLoading}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-error/35 bg-main/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-error disabled:cursor-wait disabled:text-muted"
            >
              Try again
            </button>
            <Link
              href="/support"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-cyan-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-brand"
            >
              Contact support
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
