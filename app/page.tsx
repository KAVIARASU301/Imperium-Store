import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";
import Link from "next/link";

const reasons = [
  "Built for active options and swing traders",
  "Broker-connected workstation workflows",
  "Tools designed around execution, risk, and review",
  "No noisy claims or profit guarantees",
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-6xl px-6 py-16" id="products">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">Product workstations</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Two focused Imperium platforms</h2>
            <p className="mt-3 max-w-2xl text-slate-400">Real product screens, purpose-built workflows, and a polished desktop-first experience for traders who want a cleaner command center.</p>
          </div>
          <Link href="/products" className="hidden rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-300/10 sm:block">Explore all →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">{getActiveProducts().map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[linear-gradient(135deg,rgba(34,211,238,.12),rgba(11,16,32,.96)_42%,rgba(15,23,42,.95))] p-8 shadow-2xl shadow-black/20 md:p-10">
          <div className="max-w-2xl">
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">Why Imperium</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Designed to make your trading process feel organized.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">{reasons.map((reason) => <div key={reason} className="rounded-2xl border border-white/10 bg-black/20 p-5 text-slate-300 shadow-lg shadow-black/10">{reason}</div>)}</div>
        </div>
      </section>
      <section className="px-6 py-20 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">Ready when you are</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold text-white md:text-4xl">Choose your Imperium workstation.</h2>
        <p className="mt-3 text-slate-400">Build a more organized trading process.</p>
        <Link href="/products" className="mt-8 inline-block rounded-full bg-cyan-300 px-6 py-3 font-semibold text-black hover:bg-cyan-200">Explore Products</Link>
      </section>
    </main>
  );
}
