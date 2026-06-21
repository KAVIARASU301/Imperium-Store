import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";
import Link from "next/link";

const reasons = ["Built for active options and swing traders", "Broker-connected workstation workflows", "Tools designed around execution, risk, and review", "No noisy claims or profit guarantees"];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-6xl px-6 py-16" id="products">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">Product workstations</p><h2 className="mt-3 text-3xl font-semibold text-white">Two focused Imperium platforms</h2></div>
          <Link href="/products" className="hidden text-sm font-semibold text-cyan-300 sm:block">Explore all →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">{getActiveProducts().map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="border border-slate-800 bg-[#0B1020] p-8 md:p-10">
          <h2 className="text-3xl font-semibold text-white">Why Imperium</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{reasons.map((reason) => <div key={reason} className="border border-slate-800 bg-black/20 p-4 text-slate-300">{reason}</div>)}</div>
        </div>
      </section>
      <section className="px-6 py-20 text-center"><h2 className="text-3xl font-semibold text-white">Choose your Imperium workstation.</h2><p className="mt-3 text-slate-400">Build a more organized trading process.</p><Link href="/products" className="mt-8 inline-block bg-cyan-300 px-6 py-3 font-semibold text-black">Explore Products</Link></section>
    </main>
  );
}
