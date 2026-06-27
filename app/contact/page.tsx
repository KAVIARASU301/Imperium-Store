import Image from "next/image";
import { getSupportWhatsapp } from "@/lib/support";

export default function Page() {
  const whatsapp = getSupportWhatsapp();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <section className="border border-cyan-border bg-section p-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">Contact channel</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Contact</h1>
        <p className="mt-6 leading-8 text-muted">
          Support is currently handled through WhatsApp chat only. For purchase, access, or product questions, send your registered
          account email and order reference so we can assist you faster.
        </p>
        {whatsapp ? (
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-3 btn-primary px-5 py-3 text-lg font-bold text-white "
          >
            <Image src="/icons/whatsapp.svg" alt="" width={20} height={20} className="h-5 w-5" />
            {whatsapp.label}
          </a>
        ) : (
          <p className="mt-6 text-sm text-amber-200">WhatsApp support is not configured.</p>
        )}
        {whatsapp ? <p className="mt-3 text-sm text-muted">Tap the number to start a WhatsApp support chat.</p> : null}
      </section>
    </main>
  );
}
