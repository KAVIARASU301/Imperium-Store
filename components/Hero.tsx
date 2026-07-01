import Link from "next/link";
import DesktopHeroVideo from "@/components/DesktopHeroVideo";
import { formatCurrencySymbol, formatPriceAmount, getProductBySlug, getProductGstInclusiveText, isProductReady } from "@/lib/products";

const terminalHeroVideoSrc = "/product-resources/imperium-option-trading-terminal/imperium_option_trading_terminal.mp4";

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
                <div className="relative isolate min-h-[500px] w-full bg-main sm:min-h-[640px] lg:min-h-[700px]">
                  <DesktopHeroVideo src={terminalHeroVideoSrc} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,8,15,0.64)_0%,rgba(5,8,15,0.48)_26rem,rgba(5,8,15,0.12)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(0deg,rgba(5,8,15,0.9),transparent)]" />

                  <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-between p-4 text-center sm:min-h-[640px] sm:p-8 lg:min-h-[700px] lg:p-10">
                    <div className="flex flex-1 flex-col items-center justify-center">
                      <div className="inline-flex rounded-md border border-brand/45 bg-main/85 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-brand shadow-[0_12px_28px_rgba(0,0,0,0.28)] sm:px-4 sm:py-2 sm:text-xs">
                        {ready ? "Available now / Instant download" : "Coming soon"}
                      </div>
                      <h1 className="mt-4 max-w-[12ch] text-4xl font-black uppercase leading-[0.92] tracking-normal text-white sm:text-7xl lg:text-8xl">
                        Trade faster. Practice safer.
                      </h1>
                      <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-copy sm:mt-6 sm:text-lg sm:leading-7">
                        {terminal.promise}
                      </p>
                      <div className="mt-5 flex flex-wrap justify-center gap-2 pb-5 sm:mt-7 sm:gap-3 sm:pb-8">
                        <Link href="/products" className="btn-primary rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white sm:px-5 sm:py-3 sm:text-sm">
                          Explore Products
                        </Link>
                        <Link href="/products/imperium-option-trading-terminal" className="btn-ghost rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] backdrop-blur sm:px-5 sm:py-3 sm:text-sm">
                          View the Terminal
                        </Link>
                      </div>
                    </div>

                    <div className="grid w-full max-w-4xl gap-px overflow-hidden rounded-md border border-cyan-border bg-cyan-border/80 font-mono text-[10px] uppercase tracking-[0.1em] text-muted sm:grid-cols-3 sm:text-[11px] sm:tracking-[0.12em]">
                      <div className="bg-main/88 p-3 backdrop-blur sm:p-4">
                        <p>Primary system</p>
                        <p className="mt-2 font-sans text-sm font-bold normal-case tracking-normal text-white">{terminal.name}</p>
                      </div>
                      <div className="bg-main/88 p-3 backdrop-blur sm:p-4">
                        <p>{ready ? "One-time purchase" : "Status"}</p>
                        <p className="mt-2 text-lg text-gold-bright">{ready ? terminalPrice : "Coming soon"}</p>
                        {ready && gstInclusiveText ? <p className="mt-1 text-[10px] text-muted">{gstInclusiveText}</p> : null}
                      </div>
                      <div className="bg-main/88 p-3 backdrop-blur sm:p-4">
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
