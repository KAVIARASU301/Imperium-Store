import { NextResponse } from "next/server";

type TickerConfig = {
  label: string;
  symbol: string;
  aliases: string[];
};

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        currency?: string;
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        previousClose?: number;
        regularMarketTime?: number;
        exchangeName?: string;
      };
    }>;
  };
};

const tickers: TickerConfig[] = [
  { label: "NIFTY", symbol: "^NSEI", aliases: ["^NSEI"] },
  { label: "BANKNIFTY", symbol: "^NSEBANK", aliases: ["^NSEBANK"] },
  { label: "SENSEX", symbol: "^BSESN", aliases: ["^BSESN"] },
  { label: "BANKEX", symbol: "BSE-BANK.BO", aliases: ["BSE-BANK.BO", "^BSEBANK", "^BSE-BANK"] },
  { label: "NIFTY IT", symbol: "^CNXIT", aliases: ["^CNXIT"] },
  { label: "RELIANCE", symbol: "RELIANCE.NS", aliases: ["RELIANCE.NS", "RELIANCE.BO"] },
  { label: "HDFCBANK", symbol: "HDFCBANK.NS", aliases: ["HDFCBANK.NS", "HDFCBANK.BO"] },
  { label: "ICICIBANK", symbol: "ICICIBANK.NS", aliases: ["ICICIBANK.NS", "ICICIBANK.BO"] },
  { label: "INFY", symbol: "INFY.NS", aliases: ["INFY.NS", "INFY.BO"] },
  { label: "TCS", symbol: "TCS.NS", aliases: ["TCS.NS", "TCS.BO"] },
  { label: "SBIN", symbol: "SBIN.NS", aliases: ["SBIN.NS", "SBIN.BO"] },
];

async function fetchYahooChart(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  const response = await fetch(url, {
    headers: { "User-Agent": "imperium-store/1.0" },
    next: { revalidate: 60 },
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as YahooChartResponse;
  const meta = payload.chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice;
  const previousClose = meta?.previousClose ?? meta?.chartPreviousClose;

  if (typeof price !== "number" || typeof previousClose !== "number") return null;

  const change = price - previousClose;
  const changePercent = previousClose === 0 ? 0 : (change / previousClose) * 100;

  return {
    price,
    change,
    changePercent,
    currency: meta?.currency ?? "INR",
    exchange: meta?.exchangeName ?? "Market",
    updatedAt: meta?.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
  };
}

async function fetchTicker(config: TickerConfig) {
  for (const symbol of config.aliases) {
    try {
      const quote = await fetchYahooChart(symbol);
      if (quote) return { ...config, symbol, ...quote, available: true };
    } catch {
      // Try the next free-source alias.
    }
  }

  return {
    label: config.label,
    symbol: config.symbol,
    available: false,
    price: null,
    change: null,
    changePercent: null,
    currency: "INR",
    exchange: "Market",
    updatedAt: null,
  };
}

export async function GET() {
  const items = await Promise.all(tickers.map(fetchTicker));
  return NextResponse.json({
    source: "Yahoo Finance public chart feed",
    delay: "Free market data may be delayed.",
    items,
  });
}
