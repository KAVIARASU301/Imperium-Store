import type { Product, ProductFile, ProductStatus } from "@/types/product";

export const productFiles: ProductFile[] = [
  {
    id: "imperium-option-trading-terminal-win-v1",
    product_slug: "imperium-option-trading-terminal",
    file_name: "imperium.zip",
    file_path: "imperium-option-trading-terminal/windows/imperium.zip",
    release_repository: "KAVIARASU301/Imperium-Releases",
    version: "1.0.0",
    platform: "windows",
    is_active: true,
  },
  {
    id: "imperium-option-trading-terminal-linux-v1",
    product_slug: "imperium-option-trading-terminal",
    file_name: "imperium.zip",
    file_path: "imperium-option-trading-terminal/linux/imperium.zip",
    release_repository: "KAVIARASU301/Imperium-Releases",
    version: "1.0.0",
    platform: "linux",
    is_active: true,
  },
  {
    id: "imperium-investor-win-v1",
    product_slug: "imperium-investor",
    file_name: "imperium_investor.zip",
    file_path: "imperium-investor/windows/imperium_investor.zip",
    release_repository: "KAVIARASU301/Imperium-Investor-Releases",
    version: "1.0.0",
    platform: "windows",
    is_active: true,
  },
  {
    id: "imperium-investor-linux-v1",
    product_slug: "imperium-investor",
    file_name: "imperium_investor.zip",
    file_path: "imperium-investor/linux/imperium_investor.zip",
    release_repository: "KAVIARASU301/Imperium-Investor-Releases",
    version: "1.0.0",
    platform: "linux",
    is_active: true,
  },
];

export const products: Product[] = [
  {
    slug: "imperium-option-trading-terminal",
    name: "Imperium Option Trading Terminal",
    type: "app",
    icon: {
      src: "/product-resources/imperium-option-trading-terminal/icons/imperium_icon_64x64.png",
      alt: "Imperium Option Trading Terminal icon",
      width: 64,
      height: 64,
    },
    short_description:
      "A high-speed desktop terminal for serious Indian options traders who need live execution, paper trading, market context, and risk controls in one focused workspace.",
    image: {
      src: "/product-resources/imperium-option-trading-terminal/imperium_option_trading_terminal.png",
      alt: "Imperium Option Trading Terminal desktop workspace with option chain, watchlists, P&L, and order panels",
      width: 2048,
      height: 1113,
    },
    description:
      "Imperium Option Trading Terminal is a Python and PySide6 desktop application for Indian-market options trading. It connects with Zerodha Kite Connect for live market data and order placement, while also offering paper trading for simulation and practice. The terminal brings strike-ladder navigation, quick order controls, real-time positions, P&L tracking, CVD views, CPR scanning, watchlists, trade logs, and session review into one desktop-first trading workflow.",
    promise:
      "Trade faster, monitor smarter, practice safer, and manage risk with a desktop terminal built for active Indian options workflows.",
    badges: ["Indian options", "Zerodha workflow", "Paper trading"],
    highlights: [
      {
        icon: "/icons/options.svg",
        title: "Options execution",
        text: "Strike ladder, option chain, quick orders, pending orders, and order history for active Indian options sessions.",
      },
      {
        icon: "/icons/bar_chart.svg",
        title: "Market context",
        text: "Price-CVD views, market monitor, CPR scanner, watchlists, and chart workspaces stay close to execution.",
      },
      {
        icon: "/icons/shield-check.svg",
        title: "Risk discipline",
        text: "Paper mode, validations, confirmations, kill-switch behavior, journals, and performance review support safer practice.",
      },
    ],
    gallery: [
      {
        src: "/product-resources/imperium-option-trading-terminal/imperium_option_trading_terminal.png",
        alt: "Imperium Option Trading Terminal main workspace",
        title: "Execution workspace",
        caption: "A desktop-first workspace for option chain navigation, orders, positions, and market context.",
        width: 2048,
        height: 1113,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/price_cvd_multi_monitor.png",
        alt: "Imperium Price CVD multi monitor screen",
        title: "Price-CVD monitor",
        caption: "Track price and cumulative volume delta context across the active instruments you care about.",
        width: 1365,
        height: 767,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/cpr_stock_scanner.png",
        alt: "Imperium CPR stock scanner",
        title: "CPR scanner",
        caption: "Prepare ranked market ideas and keep stock context near the trading workflow.",
        width: 979,
        height: 559,
      },
    ],
    price: 6999,
    currency: "INR",
    is_active: true,
    audience: [
      "Active intraday options traders",
      "Options scalpers who need fast entries and exits",
      "Traders using Zerodha Demat Account",
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
    icon: {
      src: "/product-resources/imperium-investor/icons/icon_64x64.png",
      alt: "Imperium Investor icon",
      width: 64,
      height: 64,
    },
    short_description:
      "A professional investment terminal for managing Indian and American stock portfolios in one place, with Zerodha and IBKR broker workflows, charting, alerts, and review tools.",
    image: {
      src: "/product-resources/imperium-investor/Imperium_investor.png",
      alt: "Imperium Investor desktop investment terminal with portfolio, charts, watchlists, and broker workflow panels",
      width: 1672,
      height: 941,
    },
    description:
      "Imperium Investor is a desktop investment terminal for investors and active market participants who manage Indian and American stock exposure from one workstation. It brings Zerodha-focused Indian market workflows and IBKR-focused U.S. market workflows together with portfolio views, watchlists, scanner-driven discovery, professional charting, broker-aware order tools, live positions, stop-loss management, alerts, news, P&L history, and performance review. Long-term investors can monitor holdings and portfolio context, while swing traders can move from idea discovery to chart validation to disciplined execution without splitting their process across disconnected tools.",
    promise:
      "Manage Indian and American stock portfolios from one focused investment terminal.",
    badges: ["India + U.S. stocks", "Zerodha + IBKR", "Portfolio + swing"],
    highlights: [
      {
        icon: "/icons/usa.svg",
        title: "U.S. investing with IBKR",
        text: "Track American stock ideas, charts, watchlists, positions, and portfolio review through an IBKR-aware workflow.",
      },
      {
        icon: "/icons/india.svg",
        title: "Indian investing with Zerodha",
        text: "Manage Indian-market watchlists, charts, broker workflows, positions, and review tools in the same terminal.",
      },
      {
        icon: "/icons/portfolio.svg",
        title: "One portfolio workspace",
        text: "Use one workspace for holdings, watchlists, scanners, multi-timeframe charts, alerts, risk controls, and performance review.",
      },
    ],
    gallery: [
      {
        src: "/product-resources/imperium-investor/imperium_investor_usa_mode.png",
        alt: "Imperium Investor American market mode desktop workspace",
        title: "U.S. market workspace",
        caption: "Review American stock opportunities, charts, watchlists, and portfolio context in an IBKR-focused workspace.",
        width: 1364,
        height: 767,
      },
      {
        src: "/product-resources/imperium-investor/imperium_investor_indian_mode.png",
        alt: "Imperium Investor Indian market mode desktop workspace",
        title: "Indian market workspace",
        caption: "Switch into Indian-market portfolio monitoring and trade planning without leaving the same charting, watchlist, and review environment.",
        width: 1364,
        height: 767,
      },
      {
        src: "/product-resources/imperium-investor/Imperium_investor.png",
        alt: "Imperium Investor desktop investment terminal overview",
        title: "Investment workspace",
        caption: "Keep portfolio monitoring, scanner discovery, chart validation, broker workflows, alerts, and review context in one desktop workspace.",
        width: 1672,
        height: 941,
      },
    ],
    price: 19999,
    currency: "INR",
    is_active: true,
    audience: [
      "Investors managing both Indian and American stock exposure",
      "Indian investors who use Zerodha and want a dedicated workflow for U.S. investing through IBKR",
      "Portfolio-focused users who want holdings, watchlists, alerts, P&L, and review context in one workstation",
      "Swing traders who hold positions from days to weeks and want disciplined chart, order, and stop workflows",
      "Multi-market users who need Indian and U.S. broker-specific workflows",
      "Process-driven investors and traders who want structured order history, risk tracking, P&L, and portfolio review tools",
      "Traders upgrading from spreadsheets, charting sites, broker windows, and disconnected browser tabs",
    ],
    problems: [
      "Indian and American stock portfolios are often monitored in separate broker apps, spreadsheets, charting sites, and browser tabs",
      "Zerodha and IBKR workflows can feel disconnected when investors want one clean view of watchlists, positions, charts, and review",
      "Market discovery, chart analysis, order entry, risk tracking, and portfolio review are spread across disconnected tools",
      "Broker platforms are often built for general execution rather than a complete investment and swing-trading process",
      "Charting websites can leave traders manually transferring symbols, orders, alerts, and trade notes elsewhere",
      "Risk management is often handled after entry instead of being connected to positions, stops, alerts, and portfolio context",
      "Performance review is difficult when broker statements, notes, P&L, and portfolio context are scattered",
    ],
    includes: [
      "Indian and American stock market modes inside one desktop investment workstation",
      "Zerodha-oriented workflows for Indian stocks and IBKR-oriented workflows for American stocks",
      "Portfolio views, positions, account context, P&L history, order history, and performance review",
      "U.S. stock investing workflows for discovery, chart validation, watchlists, alerts, and portfolio review",
      "Scanner tables, native scanner dialogs, Finviz-style workflows, and tabbed watchlists for idea discovery",
      "Multi-timeframe charting from intraday to monthly with candlestick, OHLC bar, line, and Heikin-Ashi modes",
      "Drawing tools including trend lines, horizontal levels, rays, rectangles, Fibonacci tools, arrows, and notes",
      "Broker-aware order dialogs, pending orders, order history, order status updates, cancellation/modification paths, and execution tracking",
      "Stop-loss setup, updates, cancellation, triggered-state handling, position synchronization, local P&L, and alert management",
      "Portfolio insights, performance reporting, P&L history, account views, trade logging, news, status indicators, reconnect overlays, sounds, and workspace productivity tools",
    ],
    outcomes: [
      "Monitor Indian and American stock portfolios from a single desktop workflow",
      "Move between Zerodha-style Indian workflows and IBKR-style U.S. workflows without rebuilding your process",
      "Turn broad-market scanner results into actionable watchlist and portfolio candidates",
      "Validate investments or swing setups with cleaner charts, drawing tools, multiple timeframes, and persistent chart workspaces",
      "Place and manage orders from the same workstation where the stock is analyzed",
      "Keep stop-losses, positions, alerts, pending orders, and P&L close to the portfolio decision workflow",
      "Review portfolio performance, P&L history, order history, and trade logs to improve process quality over time",
      "Build a dedicated workspace layout using floating windows, chart docks, search, shortcuts, sector views, and settings",
    ],
    faq: [
      {
        question: "Is Imperium Investor only for advanced traders?",
        answer:
          "No. Investors can use watchlists, charts, alerts, portfolio views, and review tools to stay organized, while active swing traders can use scanner workflows, broker-aware execution, floating workspaces, and stop-loss management.",
      },
      {
        question: "Is it only for swing trading?",
        answer:
          "No. Imperium Investor is positioned as an investment terminal first: a place to manage Indian and American stock portfolios, watchlists, charts, alerts, and review. Swing trading is one strong workflow inside it because the same tools help users find candidates, validate charts, plan entries, manage stops, monitor positions, and review outcomes.",
      },
      {
        question: "Which brokers is it built around?",
        answer:
          "The product is presented around Zerodha workflows for Indian markets and IBKR workflows for American markets, so investors can manage both sides of their stock portfolio from one desktop workstation.",
      },
    ],
    files: productFiles.filter((file) => file.product_slug === "imperium-investor"),
  },
];

const READY_STATUS: ProductStatus = "ready";
const NOT_READY_STATUS: ProductStatus = "not_ready";

export function getProductStatusEnvKey(product: Pick<Product, "slug">) {
  const key = product.slug.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `PRODUCT_STATUS_${key}`;
}

export function getConfiguredProductStatus(product: Pick<Product, "slug">): ProductStatus {
  const status = process.env[getProductStatusEnvKey(product)]?.trim().toLowerCase();
  return status === READY_STATUS ? READY_STATUS : NOT_READY_STATUS;
}

export function withProductStatus<T extends Product>(product: T): T & { status: ProductStatus } {
  return { ...product, status: getConfiguredProductStatus(product) };
}

export function isProductReady(product: Pick<Product, "status">) {
  return product.status === READY_STATUS;
}

export function getActiveProducts() { return products.filter((product) => product.is_active).map(withProductStatus); }
export function getProductBySlug(slug: string) {
  const product = products.find((product) => product.slug === slug && product.is_active);
  return product ? withProductStatus(product) : undefined;
}
export function getProductFileById(fileId: string) { return productFiles.find((file) => file.id === fileId && file.is_active); }
export function formatCurrencySymbol(currency = "INR") {
  if (currency === "INR") return "₹";

  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency
  );
}

export function formatPriceAmount(price: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);
}

export function formatPrice(price: number, currency = "INR") {
  return `${formatCurrencySymbol(currency)}${formatPriceAmount(price)}`;
}

export function getProductGstRate(product: Pick<Product, "type">) {
  if (product.type === "app") return 18;
  if (product.type === "course") return 18;
  if (product.type === "template") return 18;
  return 18;
}

export function getProductGstInclusiveText(product: Pick<Product, "type">) {
  return `Inclusive of ${getProductGstRate(product)}% GST`;
}

export function getProductsGstInclusiveText(productList: Array<Pick<Product, "type">>) {
  const rates = Array.from(new Set(productList.map((product) => getProductGstRate(product))));
  if (rates.length === 1) return `Inclusive of ${rates[0]}% GST`;
  return "Inclusive of applicable GST";
}
