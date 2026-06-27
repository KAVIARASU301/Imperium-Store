import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import TickerBoard from "@/components/TickerBoard";
import { getActiveProducts } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";

const reasons = [
  "Built for active options traders, investors, and swing traders",
  "Broker-connected workstation workflows",
  "Tools designed around execution, risk, and review",
  "No noisy claims or profit guarantees",
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TickerBoard />
      <section className="mx-auto max-w-6xl px-6 py-16" id="products">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Product workstations</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Two focused Imperium platforms</h2>
            <p className="mt-3 max-w-2xl text-slate-400">Real product screens, purpose-built workflows, and a polished desktop-first experience for traders who want a cleaner command center.</p>
          </div>
          <Link href="/products" className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 sm:block">Explore all →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">{getActiveProducts().map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Imperium Investor</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Manage Indian and American stock portfolios in one investment terminal.</h2>
            <p className="mt-4 leading-7 text-slate-400">
              Imperium Investor brings Indian stocks through Zerodha workflows and American stocks through IBKR workflows into one workstation. Track holdings, watchlists, charts, alerts, portfolio context, and swing-trade plans without rebuilding your process across separate broker apps and browser tabs.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <MarketBadge icon="/icons/india.svg" title="Indian portfolio mode" text="Zerodha-focused watchlists, charts, positions, and portfolio review." />
              <MarketBadge icon="/icons/usa.svg" title="American portfolio mode" text="IBKR-focused U.S. stock discovery, chart validation, alerts, and portfolio context." />
            </div>
            <Link href="/products/imperium-investor" className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 hover:bg-slate-100">
              Explore Imperium Investor
            </Link>
          </div>
          <div className="grid gap-4">
            <Snapshot src="/product-resources/imperium-investor/imperium_investor_usa_mode.png" alt="Imperium Investor American market workspace" label="American market workspace" />
            <Snapshot src="/product-resources/imperium-investor/imperium_investor_indian_mode.png" alt="Imperium Investor Indian market workspace" label="Indian market workspace" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/20 backdrop-blur md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Why Imperium</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Designed to make your trading process feel organized.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">{reasons.map((reason) => <div key={reason} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-slate-300 shadow-lg shadow-black/10">{reason}</div>)}</div>
        </div>
      </section>
      <section className="px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-200">Ready when you are</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold text-white md:text-4xl">Choose your Imperium workstation.</h2>
        <p className="mt-3 text-slate-400">Build a more organized trading process.</p>
        <Link href="/products" className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-slate-950 shadow-xl shadow-black/20 hover:bg-slate-100">Explore Products</Link>
      </section>
    </main>
  );
}

function MarketBadge({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-lg shadow-black/10">
      <div className="flex items-center gap-3">
        <Image src={icon} alt="" width={24} height={24} />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function Snapshot({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-2 shadow-xl shadow-black/20">
      <Image src={src} alt={alt} width={1364} height={767} className="h-auto w-full border border-white/10 object-cover" sizes="(min-width: 1024px) 640px, 100vw" />
      <figcaption className="px-2 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</figcaption>
    </figure>
  );
}
