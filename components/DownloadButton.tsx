"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DownloadButtonProps = {
  fileId: string;
  label?: string;
  className?: string;
  wrapperClassName?: string;
};

type DownloadState = "idle" | "loading" | "started" | "failed";

export default function DownloadButton({
  fileId,
  label = "Download",
  className = "",
  wrapperClassName = "",
}: DownloadButtonProps) {
  const [state, setState] = useState<DownloadState>("idle");
  const startedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (startedTimeout.current) clearTimeout(startedTimeout.current);
    };
  }, []);

  async function handleDownload() {
    if (state === "loading") return;
    if (startedTimeout.current) clearTimeout(startedTimeout.current);
    setState("loading");
    try {
      const { data } = await getSupabaseBrowserClient().auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch(`/api/downloads/${fileId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error("Download failed");

      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const payload = await res.json();
        if (typeof payload.url !== "string") throw new Error("Download failed");
        triggerBrowserDownload(payload.url);
      } else {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        triggerBrowserDownload(url, getDownloadFileName(res.headers.get("content-disposition")));
        URL.revokeObjectURL(url);
      }
      setState("started");
      startedTimeout.current = setTimeout(() => setState("idle"), 8000);
    } catch {
      setState("failed");
    }
  }

  const isLoading = state === "loading";

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
            Starting
          </>
        ) : (
          <>
            <Image src="/icons/download.svg" alt="" width={16} height={16} className="h-4 w-4" />
            {label}
          </>
        )}
      </button>
      {isLoading ? <p className="mt-2 text-xs text-brand" role="status">Preparing your download...</p> : null}
      {state === "started" ? (
        <p className="mt-2 text-xs text-success" role="status">
          Your download has started. Check your browser&apos;s downloads.
        </p>
      ) : null}
      {state === "failed" ? (
        <div className="mt-3 rounded-md border border-error/35 bg-error/10 p-3 text-left" role="alert">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-error">Download did not start</p>
          <p className="mt-2 text-xs leading-5 text-muted">Please try again. If it keeps failing, contact support and we will sort it out.</p>
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

function triggerBrowserDownload(url: string, fileName?: string) {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  if (fileName) link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function getDownloadFileName(contentDisposition: string | null) {
  const match = contentDisposition?.match(/filename="([^"]+)"/);
  return match?.[1] ?? "imperium-download.zip";
}
