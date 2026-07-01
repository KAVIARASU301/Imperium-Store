"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type MarketTicker = {
  label: string;
  symbol: string;
  available: boolean;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string;
  exchange: string;
  updatedAt: string | null;
};

type TickerResponse = {
  source: string;
  delay: string;
  items: MarketTicker[];
};

type TickerTrackStyle = CSSProperties & {
  "--ticker-duration": string;
};

const fallbackTickers: MarketTicker[] = ["NIFTY", "BANKNIFTY", "SENSEX", "RELIANCE", "HDFCBANK", "INFY"].map((label) => ({
  label,
  symbol: label,
  available: false,
  price: null,
  change: null,
  changePercent: null,
  currency: "INR",
  exchange: "Market",
  updatedAt: null,
}));

function formatNumber(value: number | null, digits = 2) {
  if (typeof value !== "number") return "--";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export default function TickerBoard() {
  const [tickers, setTickers] = useState<MarketTicker[]>(fallbackTickers);
  const [tickerDuration, setTickerDuration] = useState(68);
  const tickerSegmentRef = useRef<HTMLDivElement>(null);
  const marqueeItems = useMemo(() => tickers, [tickers]);

  useEffect(() => {
    let active = true;

    async function loadTickers() {
      try {
        const response = await fetch("/api/market/tickers", { cache: "no-store" });
        const payload = (await response.json()) as TickerResponse;
        if (!active) return;
        if (!response.ok || !Array.isArray(payload.items)) throw new Error("Unable to load market data");
        setTickers(payload.items);
      } catch {
        if (active) setTickers(fallbackTickers);
      }
    }

    loadTickers();
    const interval = window.setInterval(loadTickers, 60000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const segment = tickerSegmentRef.current;
    if (!segment) return;

    const syncTickerDuration = () => {
      const segmentWidth = segment.scrollWidth;
      const pixelsPerSecond = 12;
      setTickerDuration(Math.max(68, Math.round(segmentWidth / pixelsPerSecond)));
    };

    syncTickerDuration();
    const resizeObserver = new ResizeObserver(syncTickerDuration);
    resizeObserver.observe(segment);

    return () => resizeObserver.disconnect();
  }, [marqueeItems]);

  const tickerTrackStyle: TickerTrackStyle = {
    "--ticker-duration": `${tickerDuration}s`,
  };

  return (
    <section className="border-b border-cyan-border bg-section">
      <div className="flex h-9 items-center overflow-hidden sm:h-11">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track" style={tickerTrackStyle}>
            {[0, 1].map((segment) => (
              <div className="ticker-segment" key={segment} ref={segment === 0 ? tickerSegmentRef : null} aria-hidden={segment === 1}>
                {marqueeItems.map((ticker) => {
                  const isPositive = typeof ticker.change === "number" && ticker.change >= 0;
                  return (
                    <div
                      key={`${ticker.label}-${ticker.symbol}-${segment}`}
                      className="flex h-9 items-center gap-2 whitespace-nowrap font-mono text-[11px] sm:h-11 sm:text-xs"
                    >
                      <span className="font-semibold uppercase tracking-[0.08em] text-white">{ticker.label}</span>
                      <span className="text-muted">{formatNumber(ticker.price)}</span>
                      <span className={ticker.available ? isPositive ? "text-emerald-400" : "text-red-400" : "text-muted"}>
                        {ticker.available ? `${isPositive ? "+" : ""}${formatNumber(ticker.change)} (${isPositive ? "+" : ""}${formatNumber(ticker.changePercent)}%)` : "Loading"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
