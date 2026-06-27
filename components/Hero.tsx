import Image from "next/image";
import Link from "next/link";
import { formatCurrencySymbol, formatPriceAmount, getProductBySlug } from "@/lib/products";

export default function Hero() {
  const terminal = getProductBySlug("imperium-option-trading-terminal");
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
        <div className="mx-auto max-w-[1400px] px-0 pb-8 pt-1 sm:px-6 lg:pb-12 lg:pt-2">
          <div className="overflow-hidden border border-cyan-border bg-section shadow-[0_0_48px_rgba(0,207,255,0.18)]">
            {terminal ? (
                <div className="relative isolate min-h-[560px] w-full bg-main sm:min-h-[640px] lg:min-h-[700px]">
                  <Image
                      src={terminal.image.src}
                      alt={terminal.image.alt}
                      width={terminal.image.width}
                      height={terminal.image.height}
                      priority
                      className="absolute inset-0 h-full w-full object-contain opacity-80"
                      sizes="(min-width: 1536px) 1400px, 100vw"
                      suppressHydrationWarning
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,7,17,0.72)_0%,rgba(1,7,17,0.5)_26rem,rgba(1,7,17,0.08)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(0deg,rgba(1,7,17,0.88),transparent)]" />

                  <div className="relative z-10 flex min-h-[560px] flex-col items-center justify-between p-5 text-center sm:min-h-[640px] sm:p-8 lg:min-h-[700px] lg:p-10">
                    <div className="flex flex-1 flex-col items-center justify-center">
                      <div className="inline-flex border border-brand/60 bg-main/80 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand shadow-[0_0_22px_rgba(0,207,255,0.24)] sm:text-xs">
                        Available now / Instant download
                      </div>
                      <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">Imperium Trading Systems / India</p>
                      <h1 className="mt-4 max-w-[12ch] text-5xl font-black uppercase leading-[0.88] tracking-normal text-white sm:text-7xl lg:text-8xl">
                        Trade faster. Practice safer.
                      </h1>
                      <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-copy sm:text-lg">
                        One focused desktop terminal for option-chain execution, paper trading, live positions, risk controls, and session review.
                      </p>
                      <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <Link href="/products" className="btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                          Explore Products
                        </Link>
                        <Link href="/products/imperium-option-trading-terminal" className="border border-cyan-border bg-main/80 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white backdrop-blur hover:border-brand hover:bg-card">
                          View the Terminal
                        </Link>
                      </div>
                    </div>

                    <div className="grid w-full max-w-4xl gap-px bg-cyan-border/80 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:grid-cols-3">
                      <div className="bg-main/88 p-4 backdrop-blur">
                        <p>Primary system</p>
                        <p className="mt-2 font-sans text-sm font-bold normal-case tracking-normal text-white">{terminal.name}</p>
                      </div>
                      <div className="bg-main/88 p-4 backdrop-blur">
                        <p>One-time access</p>
                        <p className="mt-2 text-lg text-brand">{terminalPrice}</p>
                      </div>
                      <div className="bg-main/88 p-4 backdrop-blur">
                        <p>Support</p>
                        <p className="mt-2 font-sans text-sm font-bold normal-case tracking-normal text-white">Email & WhatsApp</p>
                      </div>
                    </div>
                  </div>
                </div>
            ) : null}
          </div>
        </div>
      </section>
  );
}
