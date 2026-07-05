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
      "Imperium Option Trading Terminal is desktop trading software for Indian options traders, with one-click multi-strike execution, strategy risk control, NSE/BSE F&O workflows, paper trading, and free TradingView-style charts.",
  openGraph: {
    title: "Imperium Option Trading Terminal | Imperium Store",
    description:
        "A desktop options execution terminal for Indian traders: one-click multi-strike entries and exits, strategy-level risk control, paper trading, NSE/BSE F&O workflows, and free professional charting.",
    url: "/",
    siteName: "Imperium Store",
    type: "website",
    images: [
      {
        url: "/product-resources/imperium-option-trading-terminal/imperium_option_trading_terminal.png",
        width: 2048,
        height: 1113,
        alt: "Imperium Option Trading Terminal desktop workspace with option chain, positions, P&L, charts, and order panels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imperium Option Trading Terminal | Imperium Store",
    description:
        "One-click multi-strike options execution, strategy risk control, paper trading, NSE/BSE F&O support, and free TradingView-style charts in one desktop terminal.",
    images: ["/product-resources/imperium-option-trading-terminal/imperium_option_trading_terminal.png"],
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
      <body className="min-h-full bg-main text-white">
      <header className="sticky top-0 z-40 border-b border-cyan-border bg-main/88 backdrop-blur-xl">
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
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block">Trading tools & learning</span>
              </span>
          </Link>
          <Suspense fallback={null}>
            <HeaderNav />
          </Suspense>
        </nav>
      </header>
      {children}
      <footer className="mt-16 border-t border-cyan-border bg-section/70 px-6 py-10 text-sm text-muted">
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="font-semibold text-white">Imperium Store</p>
            <p className="mt-2 max-w-xl leading-6">
              Digital trading tools, account delivery, receipts, and support for Imperium customers. Educational tools only.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em]">© 2026 Imperium Store</p>
          </div>
          <div className="grid min-w-[280px] gap-px overflow-hidden rounded-md border border-cyan-border bg-cyan-border text-xs font-semibold uppercase tracking-[0.08em] text-white sm:grid-cols-2">
            <Link href="/products" className="bg-main/70 px-4 py-3 hover:bg-card-hover">Products</Link>
            <Link href="/dashboard" className="bg-main/70 px-4 py-3 hover:bg-card-hover">My Purchases</Link>
            <Link href="/support" className="bg-main/70 px-4 py-3 hover:bg-card-hover">Support</Link>
            <Link href="/contact" className="bg-main/70 px-4 py-3 hover:bg-card-hover">Contact</Link>
            <Link href="/disclaimer" className="bg-main/70 px-4 py-3 hover:bg-card-hover">Disclaimer</Link>
            <Link href="/refund-policy" className="bg-main/70 px-4 py-3 hover:bg-card-hover">Refund Policy</Link>
            <Link href="/terms" className="bg-main/70 px-4 py-3 hover:bg-card-hover">Terms</Link>
            <Link href="/privacy-policy" className="bg-main/70 px-4 py-3 hover:bg-card-hover">Privacy</Link>
          </div>
        </div>
      </footer>
      </body>
      </html>
  );
}