import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";
import Link from "next/link";

const principles = [
    { title: "Built for execution", text: "Strike ladders, quick orders, and live risk controls designed around active sessions." },
    { title: "Practice first", text: "Paper trading and replay tools let you test a process before using live capital." },
    { title: "One workspace", text: "Indian and U.S. markets, charts, and portfolio review in a single desktop app." },
];

export default function HomePage() {
    return (
        <main>
            <Hero />

            <section className="mx-auto max-w-6xl px-6 py-12" id="products">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Products</p>
                        <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Two focused workstations</h2>
                    </div>
                    <Link href="/products" className="text-sm font-semibold text-slate-300 hover:text-white">
                        View all products →
                    </Link>
                </div>
                <div className="divide-y divide-white/10 border border-white/10">
                    {getActiveProducts().map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            </section>

            <section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Why Imperium</p>
                    <dl className="mt-4 divide-y divide-white/10 border-t border-white/10">
                        {principles.map((item) => (
                            <div key={item.title} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                                <dt className="text-sm font-semibold text-white">{item.title}</dt>
                                <dd className="text-sm leading-6 text-slate-400">{item.text}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="px-6 py-12 text-center">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">Choose your Imperium workstation.</h2>
                <p className="mt-2 text-sm text-slate-400">One product, one clean checkout, lifetime access to current downloads.</p>
                <Link href="/products" className="mt-5 inline-block rounded-sm bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                    Explore Products
                </Link>
            </section>
        </main>
    );
}