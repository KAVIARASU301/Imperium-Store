"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useState } from "react";

export default function DownloadButton({ fileId }: { fileId: string }) {
  const [message, setMessage] = useState("");
  async function handleDownload() {
    try {
      const { data } = await getSupabaseBrowserClient().auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch(`/api/downloads/${fileId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message ?? "Download failed");
      window.location.href = payload.url;
    } catch (error) { setMessage(error instanceof Error ? error.message : "Download failed"); }
  }
  return <div><button onClick={handleDownload} className="bg-cyan-300 px-5 py-3 font-semibold text-black">Download</button>{message ? <p className="mt-2 text-sm text-amber-200">{message}</p> : null}</div>;
}
