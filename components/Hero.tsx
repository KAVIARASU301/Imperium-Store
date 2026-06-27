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
      <section className="border-b border-[#1b3055]">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-8 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:py-12">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Imperium Trading Systems / India</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-normal text-[#c5d5ee] sm:text-5xl">
              Professional trading software for Indian market traders.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#6882a8]">
              Imperium Store gives serious traders focused desktop systems for options
              execution, stock investing, portfolio context, risk control, and review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="bg-[#1e52e8] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#2b63ff]">
                Explore Products
              </Link>
              <Link href="/products/imperium-option-trading-terminal" className="border border-[#1b3055] bg-[#0c1525] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#c5d5ee] hover:border-[#1e52e8] hover:bg-[#111d35]">
                View the Terminal
              </Link>
            </div>
            {terminal ? (
              <dl className="mt-8 grid gap-px bg-[#1b3055] font-mono text-xs sm:grid-cols-2">
                <div className="bg-[#0c1525] p-4">
                  <dt className="uppercase tracking-[0.16em] text-[#6882a8]">Primary system</dt>
                  <dd className="mt-2 font-semibold text-[#c5d5ee]">{terminal.name}</dd>
                </div>
                <div className="bg-[#0c1525] p-4">
                  <dt className="uppercase tracking-[0.16em] text-[#6882a8]">Starting price</dt>
                  <dd className="mt-2 text-[#0891b2]">
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

          <div className="border border-[#1b3055] bg-[#0c1525]">
            <div className="grid gap-px bg-[#1b3055] font-mono text-[10px] uppercase tracking-[0.16em] text-[#6882a8] sm:grid-cols-[1fr_auto]">
              <div className="bg-[#111d35] px-3 py-2 text-[#c5d5ee]">Product preview</div>
              <div className="bg-[#111d35] px-3 py-2">Status / available</div>
            </div>
            {terminal ? (
                <div className="relative w-full border-b border-[#1b3055] bg-[#070c17] p-2">
                  <Image
                      src={terminal.image.src}
                      alt={terminal.image.alt}
                      width={terminal.image.width}
                      height={terminal.image.height}
                      priority
                      className="h-auto w-full border border-[#1b3055] object-contain"
                      sizes="(min-width: 1024px) 480px, 100vw"
                  />
                </div>
            ) : null}
            <dl className="grid grid-cols-2 gap-px bg-[#1b3055]">
              {facts.map((fact) => (
                  <div key={fact.label} className="bg-[#0c1525] p-4">
                    <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6882a8]">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-[#c5d5ee]">{fact.value}</dd>
                  </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
  );
}
