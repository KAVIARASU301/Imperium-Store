import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";


export const metadata: Metadata = {
  title: "Imperium Store | Trading tools and education",
  description: "Premium trading apps, templates, and structured options trading education for practice, execution, and review.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#05070D] text-slate-100">
        <header className="border-b border-slate-900/90 bg-[#05070D]/90">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-mono text-sm font-semibold uppercase tracking-[0.24em] text-white">Imperium</Link>
            <div className="flex items-center gap-5 text-sm text-slate-400"><Link href="/products" className="hover:text-cyan-300">Products</Link><Link href="/dashboard" className="hover:text-cyan-300">My Purchases</Link><Link href="/login" className="hover:text-cyan-300">Login</Link></div>
          </nav>
        </header>
        {children}
        <footer className="mt-16 border-t border-slate-900 px-6 py-8 text-sm text-slate-500"><div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between"><p>© 2026 Imperium Store. Educational tools only.</p><div className="flex flex-wrap gap-4"><Link href="/disclaimer">Disclaimer</Link><Link href="/refund-policy">Refund Policy</Link><Link href="/terms">Terms</Link><Link href="/privacy-policy">Privacy</Link><Link href="/contact">Contact</Link><Link href="/support">Support</Link></div></div></footer>
      </body>
    </html>
  );
}
