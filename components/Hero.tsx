import Link from "next/link";
import { formatCurrencySymbol, formatPriceAmount, getProductBySlug, getProductGstInclusiveText, isProductReady } from "@/lib/products";

export default function Hero() {
  const terminal = getProductBySlug("imperium-option-trading-terminal");
  const ready = terminal ? isProductReady(terminal) : false;
  const gstInclusiveText = terminal ? getProductGstInclusiveText(terminal) : null;
  const terminalPrice = terminal ? (
    <>
      <span className="mr-1 align-baseline font-semibold">
        {formatCurrencySymbol(terminal.currency)}
      </span>
      <span className="font-sans font-bold tracking-normal tabular-nums">
        {formatPriceAmount(terminal.price)}
      </span>
    </>
  ) : null;

  return (
      <section className="border-b border-cyan-border">
        <div className="mx-auto max-w-[1400px] px-0 pb-6 pt-1 sm:px-6 lg:pb-12 lg:pt-3">
          <div className="overflow-hidden border border-cyan-border bg-section shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:rounded-md">
            {terminal ? (
                <>
                  <div className="relative isolate">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_70%_at_center,rgba(47,111,166,0.14),transparent_70%)]" />
                    <div className="flex flex-col items-center px-4 py-12 text-center sm:px-8 sm:py-14 lg:py-16">
                      <div className="inline-flex rounded-md border border-brand/45 bg-main/85 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-brand sm:px-4 sm:py-2 sm:text-xs">
                        {ready ? "Available now / Instant download" : "Coming soon"}
                      </div>
                      <h1 className="mt-5 max-w-[14ch] text-4xl font-black uppercase leading-[0.95] tracking-normal text-white sm:mt-6 sm:text-6xl lg:text-7xl">
                        Trade faster. Practice safer.
                      </h1>
                      <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-copy sm:mt-6 sm:text-lg sm:leading-7">
                        {terminal.promise}
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3">
                        <Link href="/products/imperium-option-trading-terminal" className="btn-primary rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white sm:px-5 sm:py-3 sm:text-sm">
                          Get the Terminal
                        </Link>
                        <Link href="/products" className="btn-ghost rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] sm:px-5 sm:py-3 sm:text-sm">
                          All Products
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-px border-t border-cyan-border bg-cyan-border/80 font-mono text-[10px] uppercase tracking-[0.1em] text-muted sm:grid-cols-3 sm:text-[11px] sm:tracking-[0.12em]">
                    <div className="bg-main p-3 sm:p-4">
                      <p>Primary system</p>
                      <p className="mt-2 font-sans text-sm font-bold normal-case tracking-normal text-white">{terminal.name}</p>
                    </div>
                    <div className="bg-main p-3 sm:p-4">
                      <p>{ready ? "One-time purchase" : "Status"}</p>
                      <p className="mt-2 text-lg text-gold-bright">{ready ? terminalPrice : "Coming soon"}</p>
                      {ready && gstInclusiveText ? <p className="mt-1 text-[10px] text-muted">{gstInclusiveText}</p> : null}
                    </div>
                    <div className="bg-main p-3 sm:p-4">
                      <p>Broker support</p>
                      <p className="mt-2 font-sans text-sm font-bold normal-case tracking-normal text-white">7 Indian brokers</p>
                    </div>
                  </div>
                </>
            ) : null}
          </div>
        </div>
      </section>
  );
}
