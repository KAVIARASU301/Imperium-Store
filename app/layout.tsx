import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import HeaderNav from "@/components/HeaderNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imperium Store | Indian trading software",
  description: "Professional trading software for Indian market traders focused on options execution, stock investing, risk control, and review.",
  icons: {
    icon: [
      { url: "/icons/imperium_store_icons/imperium_icon_32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/imperium_store_icons/imperium_icon_64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/imperium_store_icons/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icons/imperium_store_icons/imperium_icon_32x32.png",
  },
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
      <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full bg-[#070c17] text-[#c5d5ee]">
      <Script
          id="darkreader-hydration-cleanup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: darkReaderHydrationCleanup }}
      />
      <header className="sticky top-0 z-40 border-b border-[#1b3055] bg-[#070c17]/92 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
          <Link href="/" className="inline-flex items-center gap-3 text-[#c5d5ee]">
              <span className="flex h-9 w-9 items-center justify-center border border-[#1b3055] bg-[#c5d5ee]">
                <Image src="/icons/imperium_store_icons/imperium_icon_32x32.png" alt="" width={28} height={28} className="h-7 w-7" priority />
              </span>
            <span className="text-base font-bold uppercase tracking-[0.08em]">Imperium Store</span>
          </Link>
          <HeaderNav />
        </nav>
      </header>
      {children}
      <footer className="mt-16 border-t border-[#1b3055] bg-[#0c1525]/70 px-6 py-8 text-sm text-[#6882a8]"><div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-center md:justify-between"><p>© 2026 Imperium Store. Educational tools only.</p><div className="flex flex-wrap gap-4"><Link href="/disclaimer">Disclaimer</Link><Link href="/refund-policy">Refund Policy</Link><Link href="/terms">Terms</Link><Link href="/privacy-policy">Privacy</Link><Link href="/contact">Contact</Link><Link href="/support">Support</Link></div></div></footer>
      </body>
      </html>
  );
}
