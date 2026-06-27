import Image from "next/image";
import { getSupportWhatsapp } from "@/lib/support";

export default function Page() {
  const whatsapp = getSupportWhatsapp();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <section className="border border-[#1b3055] bg-[#0c1525] p-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Contact channel</p>
        <h1 className="mt-3 text-4xl font-bold text-[#c5d5ee]">Contact</h1>
        <p className="mt-6 leading-8 text-[#6882a8]">
          Support is currently handled through WhatsApp chat only. For purchase, access, or product questions, send your registered
          account email and order reference so we can assist you faster.
        </p>
        {whatsapp ? (
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-3 bg-[#1e52e8] px-5 py-3 text-lg font-bold text-white hover:bg-[#2b63ff]"
          >
            <Image src="/icons/whatsapp.svg" alt="" width={20} height={20} className="h-5 w-5" />
            {whatsapp.label}
          </a>
        ) : (
          <p className="mt-6 text-sm text-amber-200">WhatsApp support is not configured.</p>
        )}
        {whatsapp ? <p className="mt-3 text-sm text-[#6882a8]">Tap the number to start a WhatsApp support chat.</p> : null}
      </section>
    </main>
  );
}
