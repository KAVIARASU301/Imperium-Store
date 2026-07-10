import Image from "next/image";
import { getSupportWhatsapp, SUPPORT_EMAIL } from "@/lib/support";

export default function Page() {
  const whatsapp = getSupportWhatsapp();

  return (
    <main className="page-container max-w-3xl py-14">
      <section className="policy-card">
        <p className="section-kicker">Customer desk</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Support</h1>
        <p className="mt-5 leading-8 text-muted">
          For purchase, access, download, or product support, contact us through WhatsApp chat or email. Share your registered account
          email and Razorpay order ID so we can verify your purchase and help with recovery or access issues.
        </p>
        <div className="mt-6 grid gap-3 border-y border-cyan-border py-5 text-sm sm:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Purchase</p>
            <p className="mt-1 font-semibold text-white">Order lookup</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Account</p>
            <p className="mt-1 font-semibold text-white">Access recovery</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Downloads</p>
            <p className="mt-1 font-semibold text-white">Build access</p>
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
