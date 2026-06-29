import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

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
      { url: "/icons/imperium_store_icons/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icons/imperium_store_icons/imperium_icon_32x32.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full bg-main text-white">
      <header className="sticky top-0 z-40 border-b border-cyan-border bg-section/92 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
          <Link href="/" className="inline-flex items-center gap-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center border border-cyan-border bg-white">
                <Image src="/icons/imperium_store_icons/imperium_icon_32x32.png" alt="" width={28} height={28} className="h-7 w-7" priority suppressHydrationWarning />
              </span>
            <span className="text-base font-bold uppercase tracking-[0.08em]">Imperium Store</span>
          </Link>
          <HeaderNav />
        </nav>
      </header>
      {children}
      <footer className="mt-16 border-t border-cyan-border bg-section/70 px-6 py-8 text-sm text-muted"><div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-center md:justify-between"><p>© 2026 Imperium Store. Educational tools only.</p><div className="flex flex-wrap gap-4"><Link href="/disclaimer">Disclaimer</Link><Link href="/refund-policy">Refund Policy</Link><Link href="/terms">Terms</Link><Link href="/privacy-policy">Privacy</Link><Link href="/contact">Contact</Link><Link href="/support">Support</Link></div></div></footer>
      </body>
      </html>
  );
}
