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
    "Imperium Option Trading Terminal: one-click multi-strike execution, strategy-level risk control, trade copier for sub-accounts, and free TradingView-style charts. Works with 7 Indian brokers across NSE and BSE F&O.";
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
    { title: "7 Indian brokers", text: "Zerodha, Upstox, Angel One, Dhan, Fyers, Groww, and Alice Blue in one terminal." },
    { title: "One-click multi-strike", text: "Enter and exit multiple strikes in a single click, straight from the option chain." },
    { title: "Strategy-level risk", text: "Stoploss and target at the portfolio, strategy, and position level." },
    { title: "Free pro charting", text: "TradingView-style charts with tick data. No separate subscription." },
    { title: "Trade copier", text: "Mirror orders across your sub-accounts automatically as you trade." },
    { title: "Practice first", text: "Paper trading and market replay before using live capital." },
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
                    <h2 className="section-title">Built for serious options traders</h2>
                </div>
                <dl className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                    {principles.map((item) => (
                        <div key={item.title} className="interactive-panel group p-5">
                            <span className="block h-px w-10 bg-gold/50 transition group-hover:w-14 group-hover:bg-gold-bright" />
                            <dt className="mt-4 text-sm font-semibold text-white">{item.title}</dt>
                            <dd className="mt-1.5 text-sm leading-6 text-muted">{item.text}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="page-container page-section">
                <div className="surface-panel flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 md:p-8">
                    <div>
                        <h2 className="text-xl font-bold text-white sm:text-2xl">Ready when you are.</h2>
                        <p className="mt-1.5 text-sm leading-6 text-muted">One-time purchase. Instant download from your dashboard.</p>
                    </div>
                    <Link href={terminalProductPath} className="btn-primary inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                        Get the Terminal
                    </Link>
                </div>
            </section>
        </main>
    );
}
