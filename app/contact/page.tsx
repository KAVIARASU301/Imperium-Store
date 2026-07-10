import Image from "next/image";
import { getSupportWhatsapp, SUPPORT_EMAIL } from "@/lib/support";

export default function Page() {
  const whatsapp = getSupportWhatsapp();

  return (
    <main className="page-container max-w-3xl py-14">
      <section className="policy-card">
        <p className="section-kicker">Contact channel</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Contact</h1>
        <p className="mt-5 leading-8 text-muted">
          Reach us through WhatsApp chat or email. For purchase, access, or product questions, send your registered
          account email and order reference so we can assist you faster.
        </p>
        <div className="mt-6 grid gap-3 border-y border-cyan-border py-5 text-sm sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Best for</p>
            <p className="mt-1 font-semibold text-white">Orders, access, downloads</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Include</p>
            <p className="mt-1 font-semibold text-white">Account email and order ID</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {whatsapp ? (
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-md btn-primary px-5 py-3 text-lg font-bold text-white"
            >
              <Image src="/icons/whatsapp.svg" alt="" width={20} height={20} className="h-5 w-5" />
              {whatsapp.label}
            </a>
          ) : (
            <p className="text-sm text-amber-200">WhatsApp support is not configured.</p>
          )}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-3 rounded-md border border-cyan-border bg-card px-5 py-3 text-lg font-bold text-white hover:border-brand"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
        <p className="mt-3 text-sm text-muted">
          Tap the number to start a WhatsApp support chat, or write to us by email.
        </p>
      </section>
    </main>
  );
}
