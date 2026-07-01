import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import TickerBoard from "@/components/TickerBoard";
import { getActiveProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

const homeTitle = "Imperium Option Trading Terminal | Imperium Store";
const homeDescription =
    "Download Imperium Option Trading Terminal, a desktop options execution terminal for Indian traders with one-click multi-strike entries and exits, strategy-level risk control, paper trading, NSE/BSE F&O workflows, and free TradingView-style charts.";
const terminalPreviewImage = "/product-resources/imperium-option-trading-terminal/imperium_option_trading_terminal.png";
const terminalProductPath = "/products/imperium-option-trading-terminal";

export const metadata: Metadata = {
    title: homeTitle,
    description: homeDescription,
    alternates: { canonical: "/" },
    openGraph: {
        title: homeTitle,
        description: homeDescription,
        url: "/",
        siteName: "Imperium Store",
        type: "website",
        images: [
            {
                url: terminalPreviewImage,
                width: 2048,
                height: 1113,
                alt: "Imperium Option Trading Terminal desktop workspace with option chain, positions, P&L, charts, and order panels",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: homeTitle,
        description: homeDescription,
        images: [terminalPreviewImage],
    },
};

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

export default async function HomePage() {
    await connection();
    const activeProducts = getActiveProducts();
    const siteUrl = getSiteUrl();
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                name: "Imperium Store",
                url: siteUrl,
                logo: `${siteUrl}/icons/imperium_store_icons/imperium_icon_64x64.png`,
            },
            {
                "@type": "SoftwareApplication",
                "@id": `${siteUrl}${terminalProductPath}#software`,
                name: "Imperium Option Trading Terminal",
                applicationCategory: "FinanceApplication",
                operatingSystem: "Windows, Linux",
                description: homeDescription,
                image: `${siteUrl}${terminalPreviewImage}`,
                url: `${siteUrl}${terminalProductPath}`,
                offers: {
                    "@type": "Offer",
                    price: "6999",
                    priceCurrency: "INR",
                    availability: "https://schema.org/InStock",
                    url: `${siteUrl}${terminalProductPath}`,
                },
                publisher: {
                    "@id": `${siteUrl}/#organization`,
                },
            },
        ],
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <TickerBoard />
            <Hero />

            <section className="page-container page-section" id="products">
                <div className="section-heading mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6 sm:gap-4">
                    <div>
                        <p className="section-kicker">Products</p>
                        <h2 className="section-title">Trading Workstations</h2>
                    </div>
                    <Link href="/products" className="btn-ghost rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em]">
                        View all products
                    </Link>
                </div>
                <div className="grid gap-3 sm:gap-4">
                    {activeProducts.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            </section>

            <section className="page-container page-section">
                <div className="section-heading mb-4 sm:mb-6">
                    <p className="section-kicker">Why Imperium</p>
                    <h2 className="section-title">Built for disciplined trading workflows</h2>
                </div>
                <dl className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                    {principles.map((item, index) => (
                        <div
                            key={item.title}
                            className="interactive-panel group p-4 sm:min-h-32 sm:p-5"
                        >
                            <div className="mb-3 flex items-center justify-between border-b border-cyan-border pb-2 sm:mb-4 sm:pb-3">
                                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-bright">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="h-px w-10 bg-gold/50 transition group-hover:w-14 group-hover:bg-gold-bright" />
                            </div>
                            <dt className="text-sm font-semibold text-white">{item.title}</dt>
                            <dd className="mt-2 text-sm leading-6 text-muted">{item.text}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="page-container page-section">
                <div className="surface-panel grid gap-4 p-5 sm:gap-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                    <div>
                        <p className="section-kicker">Ready to buy</p>
                        <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">Choose your Imperium workstation.</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">One clean checkout, account-based delivery, stored receipts, and current download access from your dashboard.</p>
                    </div>
                    <Link href="/products" className="btn-primary inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                        Explore Products
                    </Link>
                </div>
            </section>
        </main>
    );
}
