import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import TickerBoard from "@/components/TickerBoard";
import { getActiveProducts } from "@/lib/products";
import Link from "next/link";

const principles = [
    { title: "Built for execution", text: "Strike ladders, quick orders, and live risk controls designed around active sessions." },
    { title: "Practice first", text: "Paper trading and replay tools let you test a process before using live capital." },
    { title: "One workspace", text: "Indian and U.S. markets, charts, and portfolio review in a single desktop app." },
    { title: "Fast entries and exits", text: "Quick trading mode and hotkeys help options traders, especially option buyers, act faster." },
    { title: "Strategy builder", text: "Preloaded options strategies and grouped positions keep multi-leg trades easier to manage." },
    { title: "Focused terminal", text: "Zero outside noise: trading tools, charts, orders, and review stay inside one workflow." },
    { title: "Trading journal", text: "Input journal notes, review trades, and keep decision context close to order history." },
    { title: "Market replay", text: "Practice repeatedly with market replay using any compatible CSV file." },
    { title: "Charting included", text: "Built-in TradingView-style charts with tick-data support can reduce the need for a separate chart subscription." },
    { title: "Static IP support", text: "Relay server support helps users who need a static-IP-friendly broker connection setup." },
];

export default function HomePage() {
    return (
        <main>
            <TickerBoard />
            <Hero />

            <section className="mx-auto max-w-[1200px] px-6 py-12" id="products">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#1b3055] pb-4">
                    <div>
                        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Products</p>
                        <h2 className="mt-2 text-xl font-bold text-[#c5d5ee] sm:text-2xl">Trading Workstations</h2>
                    </div>
                    <Link href="/products" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#c5d5ee] hover:text-white">
                        View all products
                    </Link>
                </div>
                <div className="grid gap-4">
                    {getActiveProducts().map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            </section>

            <section className="border-y border-[#1b3055] bg-[#0c1525]/80">
                <div className="mx-auto max-w-[1200px] px-6 py-10">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Why Imperium</p>
                    <dl className="mt-4 grid gap-px border border-[#1b3055] bg-[#1b3055] md:grid-cols-2">
                        {principles.map((item) => (
                            <div key={item.title} className="bg-[#0c1525] p-4">
                                <dt className="text-sm font-semibold text-[#c5d5ee]">{item.title}</dt>
                                <dd className="mt-1 text-sm leading-6 text-[#6882a8]">{item.text}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-6 py-12">
                <div className="border border-[#1b3055] bg-[#0c1525] p-6 text-center">
                <h2 className="text-xl font-bold text-[#c5d5ee] sm:text-2xl">Choose your Imperium workstation.</h2>
                <p className="mt-2 text-sm text-[#6882a8]">One product, one clean checkout, lifetime access to current downloads.</p>
                <Link href="/products" className="mt-5 inline-block bg-[#1e52e8] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#2b63ff]">
                    Explore Products
                </Link>
                </div>
            </section>
        </main>
    );
}
