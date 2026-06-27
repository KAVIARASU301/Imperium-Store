import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { getProductBySlug } from "@/lib/products";

const TICKER_ITEMS = [
  { symbol: "SPY",  price: "543.21",    change: "+1.24%" },
  { symbol: "QQQ",  price: "468.90",    change: "+0.87%" },
  { symbol: "AAPL", price: "214.35",    change: "+2.10%" },
  { symbol: "NVDA", price: "138.76",    change: "+3.45%" },
  { symbol: "MSFT", price: "441.22",    change: "-0.32%" },
  { symbol: "TSLA", price: "248.18",    change: "+4.87%" },
  { symbol: "VIX",  price: "14.23",     change: "-5.21%" },
  { symbol: "ES1!", price: "5,521.50",  change: "+0.62%" },
  { symbol: "NQ1!", price: "19,834.25", change: "+0.95%" },
  { symbol: "GLD",  price: "227.48",    change: "+0.18%" },
];

export default function Hero() {
  const terminal = getProductBySlug("imperium-option-trading-terminal");

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap');

        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 36s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }

        .hero-dot-grid {
          background-image: radial-gradient(circle, rgba(200,169,110,0.18) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .gold-text {
          background: linear-gradient(120deg, #b8924a 0%, #e8d5a3 38%, #c8a96e 62%, #8c6930 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-shine {
          position: relative;
          overflow: hidden;
        }
        .card-shine::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(200,169,110,0.07) 0%, transparent 60%);
          pointer-events: none;
        }
      `}</style>

        <section className="relative overflow-hidden bg-[#05080f]">

          {/* ── Dot-grid atmosphere ── */}
          <div className="hero-dot-grid absolute inset-0 opacity-[0.35]" />

          {/* ── Radial glows ── */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_65%_-5%,rgba(200,169,110,0.09),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_-5%_70%,rgba(10,20,55,0.7),transparent)]" />

          {/* ════════════════════════════════════════
            TICKER STRIP
        ════════════════════════════════════════ */}
          <div className="relative z-10 border-b border-[#c8a96e]/10 bg-[#05080f]/90 backdrop-blur-sm">
            <div className="flex items-stretch overflow-hidden">

              {/* "LIVE" pill */}
              <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-[#c8a96e]/15 bg-[#c8a96e]/[0.07] px-4 py-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#22d3a2]" />
                <span className="text-[9px] font-black uppercase tracking-[0.28em] text-[#c8a96e]">Live</span>
              </div>

              {/* Scrolling items — doubled for seamless loop */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="ticker-track">
                  {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                      <TickerItem key={i} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════
            HERO BODY
        ════════════════════════════════════════ */}
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:py-24 xl:py-28">

            {/* ── LEFT: copy ── */}
            <div>

              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="h-px w-7 bg-[#c8a96e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c8a96e]">
                Imperium Trading Systems
              </span>
              </div>

              {/* Headline */}
              <h1
                  className="mt-5 text-[2.7rem] font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.5rem]"
                  style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" }}
              >
                <span className="block text-[#f5f0e8]">Professional</span>
                <span className="gold-text block">options execution.</span>
                <span className="block text-[#f5f0e8]">
                Refined.
              </span>
              </h1>

              {/* Body */}
              <p className="mt-6 max-w-[30rem] text-base leading-[1.75] text-[#7a8ba6] sm:text-lg">
                Imperium brings institutional-grade execution, live risk controls, portfolio context, and post-trade review into a pair of premium desktop apps — built for traders who accept no compromises.
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                    href="/products/imperium-option-trading-terminal"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#c8a96e] px-7 py-3.5 text-sm font-bold text-[#05080f] shadow-lg shadow-[#c8a96e]/20 transition-all duration-200 hover:bg-[#d9bc82] hover:shadow-[#c8a96e]/35"
                >
                  Explore the Terminal
                  <svg
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                    href="#products"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-[#c8a96e] transition-all duration-200 hover:border-[#c8a96e]/25 hover:bg-[#c8a96e]/[0.06]"
                >
                  View All Products
                </Link>
              </div>

              {/* ── Metrics row ── */}
              <div className="mt-12 border-t border-white/[0.05] pt-8">
                <p className="mb-4 text-[9px] font-black uppercase tracking-[0.28em] text-[#4a5a72]">
                  Built for the serious trader
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <HeroMetric value="2"     label="Flagship apps"  sub="Options + Portfolio" />
                  <HeroMetric value="IN·US" label="Market access"  sub="Multi-exchange" />
                  <HeroMetric value="v1.0"  label="Current build"  sub="Production ready" />
                </div>
              </div>

              {/* ── Trust badges ── */}
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                <TrustBadge icon="⚡" label="Sub-ms execution" />
                <TrustBadge icon="🛡" label="Risk-first design" />
                <TrustBadge icon="🖥" label="Native desktop app" />
              </div>
            </div>

            {/* ── RIGHT: product screenshot ── */}
            {terminal ? (
                <div className="relative mx-auto w-full max-w-[720px] lg:mr-0">
                  {/* Glow halo */}
                  <div className="absolute -inset-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.08),transparent_70%)]" />
                  {/* Top-edge gold accent line */}
                  <div className="absolute -top-px left-1/4 right-1/4 h-px rounded-full bg-gradient-to-r from-transparent via-[#c8a96e]/60 to-transparent" />
                  <div className="relative overflow-hidden rounded-2xl border border-[#c8a96e]/10 shadow-2xl shadow-black/60">
                    <ProductImage product={terminal} priority />
                  </div>
                </div>
            ) : null}
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a96e]/20 to-transparent" />
        </section>
      </>
  );
}

/* ─────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────── */

function TickerItem({
                      symbol,
                      price,
                      change,
                    }: {
  symbol: string;
  price: string;
  change: string;
}) {
  const up = change.startsWith("+");
  return (
      <div className="flex items-center gap-2.5 border-r border-white/[0.04] px-5 py-2.5">
        <span className="text-[11px] font-bold text-[#e8e0d0]">{symbol}</span>
        <span className="text-[11px] text-[#5a6a82]">{price}</span>
        <span
            className={`text-[11px] font-semibold ${
                up ? "text-[#22d3a2]" : "text-[#f87171]"
            }`}
        >
        {change}
      </span>
      </div>
  );
}

function HeroMetric({
                      value,
                      label,
                      sub,
                    }: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
      <div className="card-shine rounded-2xl border border-[#c8a96e]/12 bg-[#c8a96e]/[0.04] p-4 shadow-lg shadow-black/30">
        <p
            className="text-xl font-bold text-[#c8a96e]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {value}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-[#c8d0e0]">{label}</p>
        {sub && <p className="mt-0.5 text-[9px] font-medium text-[#4a5a72]">{sub}</p>}
      </div>
  );
}

function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{icon}</span>
        <span className="text-[11px] font-semibold text-[#4a5a72]">{label}</span>
      </div>
  );
}