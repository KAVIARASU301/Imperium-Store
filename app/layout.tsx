import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import HeaderAccount from "@/components/HeaderAccount";
import "./globals.css";


export const metadata: Metadata = {
  title: "Imperium Store | Trading tools and education",
  description: "Premium trading apps, templates, and structured options trading education for practice, execution, and review.",
};

const darkReaderHydrationCleanup = `
(function () {
  function cleanDarkReaderAttributes(root) {
    var nodes = root.querySelectorAll ? root.querySelectorAll('[data-darkreader-inline-color], [data-darkreader-inline-bgcolor], [data-darkreader-inline-border], [style*="--darkreader-inline"]') : [];
    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      node.removeAttribute('data-darkreader-inline-color');
      node.removeAttribute('data-darkreader-inline-bgcolor');
      node.removeAttribute('data-darkreader-inline-border');
      if (node.style) {
        node.style.removeProperty('--darkreader-inline-color');
        node.style.removeProperty('--darkreader-inline-bgcolor');
        node.style.removeProperty('--darkreader-inline-border');
      }
    }
  }

  cleanDarkReaderAttributes(document);

  var observer = new MutationObserver(function () {
    cleanDarkReaderAttributes(document);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  window.addEventListener('DOMContentLoaded', function () {
    cleanDarkReaderAttributes(document);
    window.setTimeout(function () {
      observer.disconnect();
    }, 1000);
  });
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#05070D] text-slate-100">
        <Script
          id="darkreader-hydration-cleanup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: darkReaderHydrationCleanup }}
        />
        <header className="border-b border-slate-900/90 bg-[#05070D]/90">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-mono text-sm font-semibold uppercase tracking-[0.24em] text-white">Imperium</Link>
            <div className="flex items-center gap-5 text-sm text-slate-400"><Link href="/products" className="hover:text-cyan-300">Products</Link><Link href="/dashboard" className="hover:text-cyan-300">My Purchases</Link><HeaderAccount /></div>
          </nav>
        </header>
        {children}
        <footer className="mt-16 border-t border-slate-900 px-6 py-8 text-sm text-slate-500"><div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between"><p>© 2026 Imperium Store. Educational tools only.</p><div className="flex flex-wrap gap-4"><Link href="/disclaimer">Disclaimer</Link><Link href="/refund-policy">Refund Policy</Link><Link href="/terms">Terms</Link><Link href="/privacy-policy">Privacy</Link><Link href="/contact">Contact</Link><Link href="/support">Support</Link></div></div></footer>
      </body>
    </html>
  );
}
