import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { getProductBySlug } from "@/lib/products";

export default function Hero() {
  const terminal = getProductBySlug("imperium-option-trading-terminal");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,.18),transparent_28rem),radial-gradient(circle_at_80%_12%,rgba(56,189,248,.10),transparent_24rem)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[.95fr_1.05fr] md:py-28">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-cyan-300">Option trading terminal</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Trade from a sharper Imperium command center.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Put the Imperium Option Trading Terminal front and center with live execution workflows, paper trading, risk controls, watchlists, and session review in one desktop workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products/imperium-option-trading-terminal" className="rounded-full bg-cyan-300 px-6 py-3 text-center font-semibold text-black hover:bg-cyan-200">Explore Terminal</Link>
            <Link href="#products" className="rounded-full border border-slate-700 px-6 py-3 text-center font-semibold text-white hover:border-cyan-300 hover:bg-white/5">View Products</Link>
          </div>
        </div>
        {terminal ? <ProductImage product={terminal} priority className="rotate-1" /> : null}
      </div>
    </section>
  );
}
