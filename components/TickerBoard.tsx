"use client";

import { useEffect, useMemo, useState } from "react";

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

const fallbackTickers: MarketTicker[] = ["NIFTY", "BANKNIFTY", "SENSEX", "BANKEX"].map((label) => ({
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

function formatTime(value: string | null) {
  if (!value) return "Delayed feed";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export default function TickerBoard() {
  const [tickers, setTickers] = useState<MarketTicker[]>(fallbackTickers);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;

    async function loadTickers() {
      try {
        const response = await fetch("/api/market/tickers", { cache: "no-store" });
        const payload = (await response.json()) as TickerResponse;
        if (!active) return;
        if (!response.ok || !Array.isArray(payload.items)) throw new Error("Unable to load market data");
        setTickers(payload.items);
        setState("ready");
      } catch {
        if (active) setState("error");
      }
    }

    loadTickers();
    const interval = window.setInterval(loadTickers, 60000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const marqueeItems = useMemo(() => [...tickers, ...tickers], [tickers]);
  const latestUpdate = tickers.find((ticker) => ticker.updatedAt)?.updatedAt ?? null;

  return (
    <section className="border-y border-white/10 bg-white/[0.03]">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-200">
              Market pulse
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">Popular Indian index watchlist</h2>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {state === "loading" ? "Loading quotes" : state === "error" ? "Free feed unavailable" : `Updated ${formatTime(latestUpdate)}`}
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-xl shadow-black/20">
          <div className="ticker-track flex w-max gap-3 px-3 py-3">
            {marqueeItems.map((ticker, index) => {
              const isPositive = typeof ticker.change === "number" && ticker.change >= 0;
              return (
                <article
                  key={`${ticker.label}-${ticker.symbol}-${index}`}
                  className="min-w-64 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-lg shadow-black/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{ticker.symbol}</p>
                      <h3 className="mt-1 text-lg font-semibold text-white">{ticker.label}</h3>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ticker.available ? "bg-emerald-400/10 text-emerald-200" : "bg-slate-800 text-slate-400"}`}>
                      {ticker.available ? ticker.exchange : "Waiting"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <p className="font-mono text-2xl font-semibold text-white">{formatNumber(ticker.price)}</p>
                    <p className={`font-mono text-sm font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                      {ticker.available ? `${isPositive ? "+" : ""}${formatNumber(ticker.change)} (${isPositive ? "+" : ""}${formatNumber(ticker.changePercent)}%)` : "No quote"}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
