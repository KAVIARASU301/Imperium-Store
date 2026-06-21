import type { Product, ProductFile } from "@/types/product";

export const productFiles: ProductFile[] = [
  {
    id: "imperium-option-trading-terminal-win-v1",
    product_slug: "imperium-option-trading-terminal",
    file_name: "Imperium Option Trading Terminal Windows Installer.zip",
    file_path: "apps/imperium-option-trading-terminal/windows/latest.zip",
    version: "1.0.0",
    platform: "windows",
    is_active: true,
  },
  {
    id: "imperium-investor-win-v1",
    product_slug: "imperium-investor",
    file_name: "Imperium Investor Windows Installer.zip",
    file_path: "apps/imperium-investor/windows/latest.zip",
    version: "1.0.0",
    platform: "windows",
    is_active: true,
  },
];

export const products: Product[] = [
  {
    slug: "imperium-option-trading-terminal",
    name: "Imperium Option Trading Terminal",
    type: "app",
    short_description:
      "A high-speed desktop terminal for serious Indian options traders who need live execution, paper trading, market context, and risk controls in one focused workspace.",
    description:
      "Imperium Option Trading Terminal is a Python and PySide6 desktop application for Indian-market options trading. It connects with Zerodha Kite Connect for live market data and order placement, while also offering paper trading for simulation and practice. The terminal brings strike-ladder navigation, quick order controls, real-time positions, P&L tracking, CVD views, CPR scanning, watchlists, trade logs, and session review into one desktop-first trading workflow.",
    promise:
      "Trade faster, monitor smarter, practice safer, and manage risk with a desktop terminal built for active Indian options workflows.",
    price: 0,
    currency: "INR",
    is_active: true,
    audience: [
      "Active intraday options traders",
      "Options scalpers who need fast entries and exits",
      "Traders using Zerodha Kite Connect",
      "Traders who monitor multiple strikes and symbols",
      "Traders who want paper trading before using live capital",
      "Semi-systematic traders using CPR, CVD, watchlists, and structured execution tools",
    ],
    problems: [
      "Too many broker tabs, spreadsheets, charting tools, and review windows",
      "Slow option strike navigation during fast markets",
      "Fear of practicing new strategies with real money",
      "Poor visibility into current exposure and session P&L",
      "Unstructured post-market preparation for the next trading day",
      "Emotional or accidental trading without validation, confirmations, or kill-switch discipline",
      "Difficult review after the session because orders, journal notes, and performance context are disconnected",
    ],
    includes: [
      "Live trading and paper trading modes from the login workflow",
      "Zerodha Kite Connect authentication, market data, margins, positions, and order execution workflows",
      "Strike ladder interface for faster option-chain navigation around the underlying spot price",
      "Quick buy, sell, and exit controls for active intraday execution",
      "Real-time positions and P&L tracking",
      "CVD and price-CVD views for market-context analysis",
      "Market monitor, watchlists, CPR stock scanner, auto-trader strategy foundation, and advanced execution concepts",
      "Risk-aware validation, order-placement locks, kill-switch behavior, order history, pending orders, trade logging, journals, and session summaries",
    ],
    outcomes: [
      "Reduce clicks and window switching during active options sessions",
      "Navigate relevant strikes faster with an action-oriented strike ladder",
      "Practice execution and strategy behavior in paper mode before using live capital",
      "Make decisions with clearer exposure, P&L, market monitor, CVD, CPR, and watchlist context",
      "Build a ranked post-market preparation routine for the next session",
      "Improve discipline with order validation, confirmation workflows, and kill-switch protection",
      "Review trades, journals, session summaries, and performance data from a more organized workflow",
    ],
    faq: [
      {
        question: "Does Imperium Option Trading Terminal guarantee profits?",
        answer:
          "No. It is a trading terminal and workflow tool. Options trading is high risk, and users remain responsible for their own decisions, broker credentials, risk limits, and compliance.",
      },
      {
        question: "Can I practice without using live capital?",
        answer:
          "Yes. The terminal includes a paper trading mode so users can learn the platform, test strategy behavior, and build confidence before switching to live trading.",
      },
      {
        question: "Which broker workflow is this terminal built around?",
        answer:
          "The product details specify Zerodha Kite Connect integration for authentication, market data, positions, margins, and order execution workflows.",
      },
    ],
    files: productFiles.filter((file) => file.product_slug === "imperium-option-trading-terminal"),
  },
  {
    slug: "imperium-investor",
    name: "Imperium Investor",
    type: "app",
    short_description:
      "A professional swing trading workstation for scanners, watchlists, advanced charting, broker-connected execution, stop-loss management, alerts, news, and performance review.",
    description:
      "Imperium Investor is a desktop swing trading app that helps active traders move from idea discovery to chart validation to disciplined execution. It combines scanner-driven discovery, tabbed watchlists, professional charting, broker-aware order workflows, live positions, stop-loss management, alerts, news, portfolio intelligence, and performance review into one command center for traders who hold positions from days to weeks.",
    promise:
      "Find the setup, read the chart, manage the trade, and review performance from one focused swing trading workstation.",
    price: 0,
    currency: "INR",
    is_active: true,
    audience: [
      "Swing traders who hold positions from days to weeks",
      "Active stock traders who need real-time and historical market data",
      "Multi-market traders using Indian and U.S. broker-specific workflows",
      "Process-driven traders who want structured stop-loss, order history, P&L, and portfolio review tools",
      "Traders upgrading from spreadsheets, charting sites, broker windows, and disconnected browser tabs",
    ],
    problems: [
      "Market discovery, chart analysis, order entry, risk tracking, and review are spread across disconnected tools",
      "Broker platforms are often built for general execution rather than a complete swing trading process",
      "Charting websites can leave traders manually transferring symbols, orders, alerts, and trade notes elsewhere",
      "Risk management is often handled after entry instead of being connected to positions, stops, and alerts",
      "Performance review is difficult when broker statements, notes, P&L, and portfolio context are scattered",
    ],
    includes: [
      "Scanner tables, native scanner dialogs, Finviz-style workflows, and tabbed watchlists for discovery",
      "Multi-timeframe charting from intraday to monthly with candlestick, OHLC bar, line, and Heikin-Ashi modes",
      "Drawing tools including trend lines, horizontal levels, rays, rectangles, Fibonacci tools, arrows, and notes",
      "Broker-aware order dialogs, pending orders, order history, order status updates, cancellation/modification paths, and execution tracking",
      "Stop-loss setup, updates, cancellation, triggered-state handling, position synchronization, local P&L, and alert management",
      "Portfolio intelligence, performance reporting, P&L history, account views, trade logging, news, status indicators, reconnect overlays, sounds, and workspace productivity tools",
    ],
    outcomes: [
      "Turn broad-market scanner results into actionable watchlist candidates",
      "Validate swing setups with cleaner charts, drawing tools, multiple timeframes, and persistent chart workspaces",
      "Place and manage orders from the same workstation where the setup is analyzed",
      "Keep stop-losses, positions, alerts, pending orders, and P&L closer to the active decision workflow",
      "Review portfolio performance, P&L history, order history, and trade logs to improve process quality over time",
      "Build a dedicated command-center layout using floating windows, chart docks, search, shortcuts, sector views, and settings",
    ],
    faq: [
      {
        question: "Is Imperium Investor only for advanced traders?",
        answer:
          "No. Beginners can use watchlists, charts, alerts, and order tools to build discipline, while advanced traders can benefit from scanner workflows, broker-aware execution, floating workspaces, and performance review.",
      },
      {
        question: "Why is it focused on swing trading?",
        answer:
          "Swing trading requires finding candidates, validating charts across timeframes, planning entries, managing stop-losses, monitoring positions, and reviewing results. Imperium Investor is organized around that full cycle.",
      },
      {
        question: "Does it replace my broker platform?",
        answer:
          "It is positioned as a broker-connected workstation that layers scanner, charting, watchlist, alert, risk, and review workflows around broker-specific execution capabilities.",
      },
    ],
    files: productFiles.filter((file) => file.product_slug === "imperium-investor"),
  },
];

export function getActiveProducts() { return products.filter((product) => product.is_active); }
export function getProductBySlug(slug: string) { return products.find((product) => product.slug === slug && product.is_active); }
export function getProductFileById(fileId: string) { return productFiles.find((file) => file.id === fileId && file.is_active); }
export function formatPrice(price: number, currency = "INR") { return price === 0 ? "Contact Sales" : new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(price); }
