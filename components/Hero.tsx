import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { getProductBySlug } from "@/lib/products";

export default function Hero() {
  const terminal = getProductBySlug("imperium-option-trading-terminal");

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,.74),rgba(5,7,13,0)_72%)]">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-20">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-cyan-100 shadow-lg shadow-black/10">
            Desktop trading software for serious workflows
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.45rem]">
            <span className="block">Trade from a sharper</span>
            <span className="block">Imperium workstation.</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Imperium brings execution, investing, portfolio context, risk controls, and review into premium desktop apps that feel organized from the first login.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products/imperium-option-trading-terminal" className="rounded-full bg-white px-6 py-3 text-center font-semibold text-slate-950 shadow-xl shadow-black/20 hover:bg-slate-100">Explore Terminal</Link>
            <Link href="#products" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-center font-semibold text-white hover:border-white/25 hover:bg-white/10">View Products</Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <HeroMetric value="2" label="Flagship apps" />
            <HeroMetric value="IN + US" label="Market coverage" />
            <HeroMetric value="1.0" label="Current release" />
          </div>
        </div>
        {terminal ? (
          <div className="mx-auto w-full max-w-[680px] lg:mr-0">
            <ProductImage product={terminal} priority />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-lg shadow-black/10">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  );
}
