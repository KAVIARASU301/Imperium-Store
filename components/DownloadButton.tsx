"use client";

export default function DownloadButton({ fileId }: { fileId: string }) {
  async function handleDownload() {
    const res = await fetch(`/api/downloads/${fileId}`);
    const data = await res.json();
    // TODO: redirect to data.url once the route returns a signed URL
    console.log(data);
  }

  return (
    <button
      onClick={handleDownload}
      className="bg-cyan-400 text-black px-5 py-3 font-semibold rounded-sm"
    >
      Download
    </button>
  );
}
