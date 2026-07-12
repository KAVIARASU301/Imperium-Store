import Link from "next/link";
import Image from "next/image";
import { formatCurrencySymbol, formatPriceAmount, getProductBySlug, getProductGstInclusiveText, isProductReady } from "@/lib/products";

const brokerIcons = [
  { src: "/icons/supported_broker_icons/zerodha/zerodha_kite.png", alt: "Zerodha" },
  { src: "/icons/supported_broker_icons/upstox/upstox.png", alt: "Upstox" },
  { src: "/icons/supported_broker_icons/angelone/angelone.png", alt: "Angel One" },
  { src: "/icons/supported_broker_icons/dhan/dhan.png", alt: "Dhan" },
  { src: "/icons/supported_broker_icons/fyers/fyers.png", alt: "Fyers" },
  { src: "/icons/supported_broker_icons/groww/groww.png", alt: "Groww" },
  { src: "/icons/supported_broker_icons/alice_blue/aliceblue.png", alt: "Alice Blue" },
];

const osIcons = [
  { src: "/icons/windows.svg", label: "Windows" },
  { src: "/icons/linux-mint.svg", label: "Linux (Linux Mint)" },
];

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

                      <div className="mt-9 flex flex-col items-center gap-3 sm:mt-11">
                        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-muted sm:text-[10px]">Supported brokers</p>
                        <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                          {brokerIcons.map((broker) => (
                            <li
                              key={broker.src}
                              className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-border bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:h-10 sm:w-10"
                            >
                              <Image src={broker.src} alt={broker.alt} width={30} height={30} className="h-full w-full object-contain" sizes="40px" />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:mt-7">
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-muted sm:text-[10px]">Runs on</span>
                        {osIcons.map((os) => (
                          <span key={os.label} className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-border bg-white p-1">
                              <Image src={os.src} alt="" width={18} height={18} className="h-full w-full object-contain" sizes="28px" />
                            </span>
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-copy">{os.label}</span>
                          </span>
                        ))}
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
