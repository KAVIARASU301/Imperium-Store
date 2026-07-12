import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import HeaderNav from "@/components/HeaderNav";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const labelFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-label",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "Imperium Store",
  title: "Imperium Option Trading Terminal | Imperium Store",
  description:
      "Imperium Option Trading Terminal: one-click multi-strike execution, strategy-level risk control, trade copier, and free TradingView-style charts. Works with 7 Indian brokers across NSE and BSE F&O.",
  openGraph: {
    title: "Imperium Option Trading Terminal | Imperium Store",
    description:
        "One-click multi-strike execution, strategy-level risk control, trade copier, and free professional charting. Works with 7 Indian brokers across NSE and BSE F&O.",
    url: "/",
    siteName: "Imperium Store",
    type: "website",
    images: [
      {
        url: "/product-resources/imperium-option-trading-terminal/images/imperium_horizon_og.jpg",
        width: 1200,
        height: 653,
        alt: "Imperium Option Trading Terminal desktop workspace with option chain, positions, P&L, charts, and order panels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imperium Option Trading Terminal | Imperium Store",
    description:
        "One-click multi-strike execution, strategy risk control, trade copier, and free TradingView-style charts. Works with 7 Indian brokers.",
    images: ["/product-resources/imperium-option-trading-terminal/images/imperium_horizon_og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/imperium_store_icons/imperium_icon_32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/imperium_store_icons/imperium_icon_64x64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/icons/imperium_store_icons/imperium_icon_32x32.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en" className={`${labelFont.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/imperium_store_icons/imperium_icon_32x32.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/icons/imperium_store_icons/imperium_icon_64x64.png" />
      </head>
      {/* Base color lives on <html>; a body background would paint over the
          fixed body::before gradient layer (negative z-index). */}
      <body className="min-h-full text-white">
      <header className="sticky top-0 z-40 border-b border-cyan-border bg-section/95 md:bg-section/85 md:backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3.5">
          <Link
              href="/"
              aria-label="Go to Imperium Store home"
              className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-md pr-2 text-white transition hover:text-white md:min-h-0 md:flex-none md:pr-0"
          >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-cyan-border bg-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] sm:h-10 sm:w-10">
                <Image
                    src="/icons/imperium_store_icons/imperium_icon_32x32.png"
                    alt=""
                    width={28}
                    height={28}
                    className="h-6 w-6 sm:h-7 sm:w-7"
                    priority
                    suppressHydrationWarning
                />
              </span>
            <span>
                <span className="block text-sm font-extrabold uppercase tracking-[0.1em] sm:tracking-[0.12em]">Imperium Store</span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block">Trading software</span>
              </span>
          </Link>
          <Suspense fallback={null}>
            <HeaderNav />
          </Suspense>
        </nav>
      </header>
      {children}
      <footer className="mt-16 border-t border-cyan-border bg-section/70 px-6 py-6 text-sm text-muted">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white">Imperium Store</p>
            <p className="mt-1 text-xs leading-5">Official store for Imperium trading software. Educational tools only.</p>
          </div>
          <nav aria-label="Footer" className="flex max-w-md flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] md:justify-end">
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/dashboard" className="hover:text-white">My Purchases</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
            <Link href="/refund-policy" className="hover:text-white">Refund Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
          </nav>
        </div>
        <p className="mx-auto mt-4 max-w-[1200px] border-t border-soft-border pt-3 font-mono text-[10px] uppercase tracking-[0.14em]">© 2026 Imperium Store</p>
      </footer>
      </body>
      </html>
  );
}