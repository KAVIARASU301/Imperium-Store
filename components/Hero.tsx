import Image from "next/image";
import Link from "next/link";
import { formatCurrencySymbol, formatPriceAmount, getProductBySlug } from "@/lib/products";

const facts = [
  { label: "Category", value: "Trading software" },
  { label: "Delivery", value: "Instant download" },
  { label: "Support", value: "Email & WhatsApp" },
  { label: "Access", value: "One-time purchase" },
];

export default function Hero() {
  const terminal = getProductBySlug("imperium-option-trading-terminal");

  return (
      <section className="border-b border-cyan-border">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-8 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:py-12">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">Imperium Trading Systems / India</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-normal text-white sm:text-5xl">
              Professional trading software for Indian market traders.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              Imperium Store gives serious traders focused desktop systems for options
              execution, stock investing, portfolio context, risk control, and review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white ">
                Explore Products
              </Link>
              <Link href="/products/imperium-option-trading-terminal" className="border border-cyan-border bg-section px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand hover:bg-card">
                View the Terminal
              </Link>
            </div>
            {terminal ? (
              <dl className="mt-8 grid gap-px bg-cyan-border font-mono text-xs sm:grid-cols-2">
                <div className="bg-section p-4">
                  <dt className="uppercase tracking-[0.16em] text-muted">Primary system</dt>
                  <dd className="mt-2 font-semibold text-white">{terminal.name}</dd>
                </div>
                <div className="bg-section p-4">
                  <dt className="uppercase tracking-[0.16em] text-muted">Starting price</dt>
                  <dd className="mt-2 text-brand">
                    <span className="mr-1 align-baseline font-semibold">
                      {formatCurrencySymbol(terminal.currency)}
                    </span>
                    <span className="font-sans font-bold tracking-normal tabular-nums">
                      {formatPriceAmount(terminal.price)}
                    </span>
                  </dd>
                </div>
              </dl>
            ) : null}
          </div>

          <div className="border border-cyan-border bg-section">
            <div className="grid gap-px bg-cyan-border font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:grid-cols-[1fr_auto]">
              <div className="bg-card px-3 py-2 text-white">Product preview</div>
              <div className="bg-card px-3 py-2">Status / available</div>
            </div>
            {terminal ? (
                <div className="relative w-full border-b border-cyan-border bg-main p-2">
                  <Image
                      src={terminal.image.src}
                      alt={terminal.image.alt}
                      width={terminal.image.width}
                      height={terminal.image.height}
                      priority
                      className="h-auto w-full border border-cyan-border object-contain"
                      sizes="(min-width: 1024px) 480px, 100vw"
                  />
                </div>
            ) : null}
            <dl className="grid grid-cols-2 gap-px bg-cyan-border">
              {facts.map((fact) => (
                  <div key={fact.label} className="bg-section p-4">
                    <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{fact.value}</dd>
                  </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
  );
}
