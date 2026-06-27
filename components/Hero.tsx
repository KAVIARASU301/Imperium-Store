import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";

const facts = [
  { label: "Category", value: "Trading software" },
  { label: "Delivery", value: "Instant download" },
  { label: "Support", value: "Email & WhatsApp" },
  { label: "Refunds", value: "Per product terms" },
];

export default function Hero() {
  const terminal = getProductBySlug("imperium-option-trading-terminal");

  return (
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Imperium Trading Systems</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Trading software for people who want less noise.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
              Imperium Option Trading Terminal and Imperium Investor bring execution, risk
              controls, and portfolio context into one focused desktop workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-sm bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                Explore Products
              </Link>
              <Link href="/products/imperium-option-trading-terminal" className="rounded-sm border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:border-white/30 hover:bg-white/5">
                View the Terminal
              </Link>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03]">
            {terminal ? (
                <div className="relative aspect-[16/10] w-full border-b border-white/10">
                  <Image
                      src={terminal.image.src}
                      alt={terminal.image.alt}
                      fill
                      priority
                      className="object-cover"
                      sizes="(min-width: 1024px) 480px, 100vw"
                  />
                </div>
            ) : null}
            <dl className="grid grid-cols-2 gap-px bg-white/10">
              {facts.map((fact) => (
                  <div key={fact.label} className="bg-[#05070D] p-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{fact.value}</dd>
                  </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
  );
}