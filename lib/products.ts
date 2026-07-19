import type { Product, ProductFile, ProductStatus } from "@/types/product";
import type { CheckoutPlanId, PurchaseAccessType } from "@/types/pricing";

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
        "One-click multi-strike execution, strategy-level risk control, and free pro-grade charts. Works with 7 Indian brokers. Built for fast NSE and BSE options trading.",
    image: {
      src: "/product-resources/imperium-option-trading-terminal/images/imperium_broadcast.webp",
      alt: "Imperium Option Trading Terminal desktop workspace with option chain, watchlists, P&L, and order panels",
      width: 2000,
      height: 1088,
    },
    description:
        "Imperium is a desktop terminal built for active Indian options traders. Enter and exit multiple strikes in one click, run option-selling strategies with stoploss and target control at the portfolio, strategy, and position level, and chart with tick data — no separate charting subscription. Connect through Zerodha, Upstox, Angel One, Dhan, Fyers, Groww, or Alice Blue, mirror orders to sub-accounts with the built-in trade copier, and practice everything in paper trading before using live capital.",
    promise:
        "One-click multi-strike execution, strategy-level risk control, and pro charting — built for Indian options traders.",
    badges: ["₹199 first month", "7 Indian brokers", "Multi-strike execution", "Trade copier", "Free charting", "Paper trading", "NSE + BSE F&O"],
    highlights: [
      {
        icon: "/icons/options.svg",
        title: "One-click multi-strike execution",
        text: "Enter and exit multiple strikes in a single click, directly from the option chain with Quick Trading Mode.",
      },
      {
        icon: "/icons/bank.svg",
        title: "Works with 7 Indian brokers",
        text: "Zerodha, Upstox, Angel One, Dhan, Fyers, Groww, and Alice Blue — one terminal for your broker of choice.",
      },
      {
        icon: "/icons/shield-check.svg",
        title: "Strategy-level risk control",
        text: "Preloaded option-selling strategies with stoploss and target at the portfolio, strategy, and position level.",
      },
      {
        icon: "/icons/bar_chart.svg",
        title: "Free pro-grade charting",
        text: "TradingView-style charts with tick data and Price-CVD views — no separate charting subscription needed.",
      },
      {
        icon: "/icons/copy.svg",
        title: "Trade copier for sub-accounts",
        text: "Mirror your orders across multiple accounts automatically as you trade.",
      },
      {
        icon: "/icons/portfolio.svg",
        title: "Journal and performance review",
        text: "Trading journal, order history, PnL history, and a live performance dashboard in one place.",
      },
    ],
    gallery: [
      {
        src: "/product-resources/imperium-option-trading-terminal/images/imperium_meridian_office.webp",
        alt: "Imperium Option Trading Terminal main execution workspace",
        title: "Execution workspace",
        caption: "Option chain, one-click multi-strike orders, positions, and market context in one desktop workspace.",
        width: 2000,
        height: 1088,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/imperium_tidal.webp",
        alt: "Imperium Option Trading Terminal shown in an alternate colour theme",
        title: "Built-in themes",
        caption: "Switch between multiple built-in themes to match your screens and trading session.",
        width: 2000,
        height: 1088,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/strategy_builder.webp",
        alt: "Imperium Option Trading Terminal strategy builder",
        title: "Strategy builder",
        caption: "Preloaded option-selling strategies with positions grouped by strategy and expiry.",
        width: 1006,
        height: 710,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/chart_widget.webp",
        alt: "Imperium Option Trading Terminal built-in charting widget",
        title: "Free pro-grade charting",
        caption: "TradingView-style charts with tick data — no separate charting subscription needed.",
        width: 1041,
        height: 731,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/price_blocks.webp",
        alt: "Imperium Option Trading Terminal Price-CVD price blocks",
        title: "Price-CVD blocks",
        caption: "Price and cumulative volume delta across your tracked symbols at a glance.",
        width: 1368,
        height: 739,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/trade_copier_masked.webp",
        alt: "Imperium Option Trading Terminal trade copier",
        title: "Trade copier",
        caption: "Mirror your orders across multiple sub-accounts automatically as you trade.",
        width: 779,
        height: 709,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/journal.webp",
        alt: "Imperium Option Trading Terminal trading journal",
        title: "Journal and review",
        caption: "Trading journal, order history, and PnL review together in one place.",
        width: 976,
        height: 650,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/fii_dii_data.webp",
        alt: "Imperium Option Trading Terminal FII and DII data",
        title: "FII / DII data",
        caption: "Institutional buying and selling activity for daily market context.",
        width: 1363,
        height: 740,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/market_reply_practice.webp",
        alt: "Imperium Option Trading Terminal market replay practice mode",
        title: "Paper trading and replay",
        caption: "Practice with market replay and paper trading before using live capital.",
        width: 1365,
        height: 741,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/order_router_for_static_ip.webp",
        alt: "Imperium Option Trading Terminal order router for static IP",
        title: "Relay server support",
        caption: "Route orders through a relay server for static-IP broker connections.",
        width: 619,
        height: 642,
      },
    ],
    price: 6999,
    monthly_pricing: {
      introductory_price: 199,
      renewal_price: 499,
      duration_months: 1,
    },
    currency: "INR",
    is_active: true,
    audience: [
      "Active intraday options traders and scalpers",
      "Option sellers running multi-leg strategies",
      "Traders managing more than one trading account",
      "Traders who want paper trading before live capital",
    ],
    problems: [
      "Placing each leg of a multi-strike strategy manually, one order at a time",
      "No single view of stoploss and target across portfolio, strategy, and position",
      "Paying separately for charts, tick data, and indicators",
      "Managing multiple accounts without a trade copier",
    ],
    includes: [
      "One-click multi-strike entries and exits with Quick Trading Mode",
      "7 supported brokers: Zerodha, Upstox, Angel One, Dhan, Fyers, Groww, Alice Blue",
      "Preloaded strategy builder with positions grouped by strategy and expiry",
      "Stoploss and target control at portfolio, strategy, and position level",
      "Free TradingView-style charts with tick data and Price-CVD views",
      "Trade copier for mirroring orders across sub-accounts",
      "Trading journal, order history, PnL history, and performance dashboard",
      "Paper trading mode and market replay for practice",
      "One-time daily login — open and close the app instantly all day",
      "Relay server support for static-IP broker connections",
    ],
    outcomes: [
      "Execute multi-strike trades in one click instead of leg by leg",
      "Keep risk defined at every level — portfolio, strategy, and position",
      "Drop the separate charting subscription",
      "Practice safely in paper trading, then go live in the same workspace",
    ],
    faq: [
      {
        question: "How does the ₹199 first month work?",
        answer:
          "A new customer can unlock the complete terminal for one month for ₹199. It is not a reduced-feature demo. After that month, you can add another month for ₹499 or upgrade to lifetime access at any time.",
      },
      {
        question: "Will the monthly plan charge me automatically?",
        answer:
          "No. Monthly access is paid one month at a time through Razorpay. Renew from your account only when you choose, so there is no automatic debit.",
      },
      {
        question: "Can I upgrade from monthly to lifetime?",
        answer:
          "Yes. Choose lifetime access from the product page or your purchase dashboard at any time. Lifetime access starts as soon as that payment is confirmed.",
      },
      {
        question: "Which brokers does the terminal work with?",
        answer:
            "Imperium connects through Zerodha, Upstox, Angel One, Dhan, Fyers, Groww, and Alice Blue for live market data and order execution across NSE and BSE F&O.",
      },
      {
        question: "What makes the multi-strike execution different?",
        answer:
            "You can enter and exit multiple option strikes in a single click with controlled risk, directly from the option chain — instead of placing each leg separately.",
      },
      {
        question: "Do I need a separate charting subscription?",
        answer:
            "No. The terminal includes free TradingView-style charts with tick-data support, Price-CVD views, and indicators added on request.",
      },
      {
        question: "Can I practice without using live capital?",
        answer:
            "Yes. Paper trading mode and market replay let you learn the platform and test strategies before switching to live trading.",
      },
      {
        question: "Does the terminal guarantee profits?",
        answer:
            "No. It is a trading terminal and workflow tool. Options trading is high risk, and you remain responsible for your own decisions, credentials, and risk limits.",
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
      "One professional terminal for Indian and American stock portfolios — Zerodha and IBKR workflows, charting, scanners, alerts, and performance review.",
    image: {
      src: "/product-resources/imperium-investor/Imperium_investor.png",
      alt: "Imperium Investor desktop investment terminal with portfolio, charts, watchlists, and broker workflow panels",
      width: 1672,
      height: 941,
    },
    description:
      "Imperium Investor is a desktop terminal for managing Indian and American stock exposure from one workstation. Zerodha powers the Indian side, IBKR powers the U.S. side, and both share the same portfolio views, watchlists, scanners, professional charting, order tools, stop-loss management, alerts, and performance review. Move from idea discovery to chart validation to disciplined execution without splitting your process across disconnected tools.",
    promise:
      "Manage Indian and American stock portfolios from one focused investment terminal.",
    badges: ["India + U.S. stocks", "Zerodha + IBKR", "Portfolio + swing"],
    highlights: [
      {
        icon: "/icons/usa.svg",
        title: "U.S. investing with IBKR",
        text: "American stock ideas, charts, watchlists, positions, and portfolio review through an IBKR-aware workflow.",
      },
      {
        icon: "/icons/india.svg",
        title: "Indian investing with Zerodha",
        text: "Indian-market watchlists, charts, broker workflows, positions, and review tools in the same terminal.",
      },
      {
        icon: "/icons/portfolio.svg",
        title: "One portfolio workspace",
        text: "Holdings, scanners, multi-timeframe charts, alerts, risk controls, and performance review in one place.",
      },
    ],
    gallery: [
      {
        src: "/product-resources/imperium-investor/imperium_investor_usa_mode.png",
        alt: "Imperium Investor American market mode desktop workspace",
        title: "U.S. market workspace",
        caption: "American stock opportunities, charts, watchlists, and portfolio context in an IBKR-focused workspace.",
        width: 1364,
        height: 767,
      },
      {
        src: "/product-resources/imperium-investor/imperium_investor_indian_mode.png",
        alt: "Imperium Investor Indian market mode desktop workspace",
        title: "Indian market workspace",
        caption: "Indian-market portfolio monitoring and trade planning in the same charting and review environment.",
        width: 1364,
        height: 767,
      },
      {
        src: "/product-resources/imperium-investor/Imperium_investor.png",
        alt: "Imperium Investor desktop investment terminal overview",
        title: "Investment workspace",
        caption: "Portfolio monitoring, scanner discovery, chart validation, broker workflows, and alerts in one workspace.",
        width: 1672,
        height: 941,
      },
    ],
    price: 19999,
    currency: "INR",
    is_active: true,
    audience: [
      "Investors managing both Indian and American stock exposure",
      "Zerodha users adding U.S. investing through IBKR",
      "Swing traders who want disciplined chart, order, and stop workflows",
      "Investors upgrading from spreadsheets and disconnected browser tabs",
    ],
    problems: [
      "Indian and U.S. portfolios split across separate broker apps and tabs",
      "Discovery, charting, orders, and review spread across disconnected tools",
      "Risk handled after entry instead of alongside positions and alerts",
      "Performance review scattered across statements, notes, and spreadsheets",
    ],
    includes: [
      "Indian and American market modes in one desktop workstation",
      "Zerodha workflows for Indian stocks, IBKR workflows for American stocks",
      "Portfolio views, positions, P&L history, order history, and performance review",
      "Scanner tables, Finviz-style workflows, and tabbed watchlists for discovery",
      "Multi-timeframe charting with drawing tools, from intraday to monthly",
      "Broker-aware order dialogs, pending orders, and execution tracking",
      "Stop-loss management, alerts, news, and trade logging",
    ],
    outcomes: [
      "Monitor Indian and American portfolios from a single desktop workflow",
      "Turn scanner results into watchlist and portfolio candidates",
      "Analyze, order, and manage risk from the same workstation",
      "Review performance and improve process quality over time",
    ],
    faq: [
      {
        question: "Is Imperium Investor only for advanced traders?",
        answer:
          "No. Investors can use watchlists, charts, alerts, and portfolio views to stay organized, while active swing traders get scanner workflows, broker-aware execution, and stop-loss management.",
      },
      {
        question: "Is it only for swing trading?",
        answer:
          "No. It is an investment terminal first — a place to manage Indian and American stock portfolios. Swing trading is one strong workflow inside it.",
      },
      {
        question: "Which brokers is it built around?",
        answer:
          "Zerodha workflows for Indian markets and IBKR workflows for American markets, so you can manage both sides of your portfolio from one workstation.",
      },
    ],
    files: productFiles.filter((file) => file.product_slug === "imperium-investor"),
  },
  {
    slug: "option-trading-mastery-course",
    name: "Option Trading Mastery Course",
    type: "course",
    icon: {
      src: "/icons/candlestick.svg",
      alt: "Option Trading Mastery Course icon",
      width: 64,
      height: 64,
    },
    short_description:
      "A structured options course, coming soon — from option basics to option buying workflows, practiced inside the Imperium Option Trading Terminal.",
    image: {
      src: "/product-resources/imperium-option-trading-terminal/images/strategy_builder.webp",
      alt: "Imperium Option Trading Terminal strategy builder workspace used for options education",
      width: 1006,
      height: 710,
    },
    description:
      "A planned learning program for traders who want a structured path into options. It starts with option basics — chains, premiums, expiry, Greeks, risk, and position sizing — then moves into option buying setups, trade planning, execution discipline, and review. Learners practice everything inside the Imperium Option Trading Terminal with paper trading, so concepts connect directly to the trading workspace.",
    promise:
      "Learn options from the basics to option buying execution, then practice inside the Imperium terminal.",
    badges: ["Coming soon", "Options basics", "Option buying", "Terminal training"],
    highlights: [
      {
        icon: "/icons/help.svg",
        title: "Basics to execution",
        text: "Option chains, expiry, premiums, Greeks, risk, and practical trade planning before execution.",
      },
      {
        icon: "/icons/candlestick.svg",
        title: "Option buying workflows",
        text: "Setup selection, entry planning, stoploss discipline, targets, and review.",
      },
      {
        icon: "/icons/bar_chart.svg",
        title: "Terminal-based practice",
        text: "Paper trading, charts, order review, and journaling inside the Imperium terminal.",
      },
    ],
    gallery: [
      {
        src: "/product-resources/imperium-option-trading-terminal/images/strategy_builder.webp",
        alt: "Imperium Option Trading Terminal strategy builder for options course practice",
        title: "Strategy workflow",
        caption: "Concepts connect to terminal workflows for planning, practice, and review.",
        width: 1006,
        height: 710,
      },
      {
        src: "/product-resources/imperium-option-trading-terminal/images/chart_snapshot_sample.webp",
        alt: "Imperium Option Trading Terminal chart used for options course market context",
        title: "Market context",
        caption: "Chart context and terminal tools while preparing option buying trades.",
        width: 2000,
        height: 1241,
      },
    ],
    price: 4999,
    currency: "INR",
    is_active: true,
    audience: [
      "Beginners who want to understand options from the ground up",
      "Learners who want a structured path into option buying",
      "Traders who want to practice before placing live orders",
      "Imperium terminal users who want product-specific training",
    ],
    problems: [
      "Options feel confusing when basics, risk, and execution are learned out of order",
      "Trades placed without a clear setup, stoploss, target, or review process",
      "Learning disconnected from the actual trading terminal",
      "Skipping paper trading and practicing with live capital",
    ],
    includes: [
      "Options basics: terminology, option chain reading, expiry, premiums, Greeks",
      "Risk management, position sizing, stoploss and target planning",
      "Option buying setup planning and execution workflow",
      "Imperium terminal onboarding and guided paper trading practice",
      "Charting, journal, and performance review workflows",
    ],
    outcomes: [
      "Understand core option mechanics before live execution",
      "Plan option buying trades with clear entry, exit, and risk rules",
      "Practice workflows inside the Imperium terminal before trading live",
      "Build a structured process for learning and improving",
    ],
    lessons: [
      { id: "options-foundation", title: "Options foundation and market structure", video_url: "", sort_order: 1, is_preview: true },
      { id: "option-chain-basics", title: "Option chain, expiry, premiums, and Greeks", video_url: "", sort_order: 2, is_preview: false },
      { id: "risk-and-position-sizing", title: "Risk, position sizing, stoploss, and targets", video_url: "", sort_order: 3, is_preview: false },
      { id: "option-buying-setups", title: "Option buying setups and execution planning", video_url: "", sort_order: 4, is_preview: false },
      { id: "terminal-paper-trading", title: "Paper trading with Imperium Option Trading Terminal", video_url: "", sort_order: 5, is_preview: false },
      { id: "terminal-workflow", title: "Terminal charts, orders, journal, and review workflow", video_url: "", sort_order: 6, is_preview: false },
    ],
    faq: [
      {
        question: "Is the course available now?",
        answer:
          "Not yet. The course is coming soon, so checkout is disabled until the learning program is ready.",
      },
      {
        question: "Is this only for existing Imperium terminal users?",
        answer:
          "No. It teaches options from the basics, with terminal-specific practice so concepts connect to a real trading workflow.",
      },
      {
        question: "Will this course guarantee profitable trading?",
        answer:
          "No. The course is educational and focuses on process, risk, and practice. Options trading is risky, and learners remain responsible for their own decisions.",
      },
    ],
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
export function getDefaultCheckoutPlan(product: Pick<Product, "monthly_pricing">): CheckoutPlanId {
  return product.monthly_pricing ? "monthly" : "lifetime";
}

export function isCheckoutPlanAvailable(
  product: Pick<Product, "monthly_pricing">,
  planId: CheckoutPlanId,
) {
  return planId === "lifetime" || Boolean(product.monthly_pricing);
}

export function resolveCheckoutPrice(
  product: Pick<Product, "price" | "monthly_pricing">,
  planId: CheckoutPlanId,
  introEligible: boolean,
): { amount: number; accessType: PurchaseAccessType } {
  if (planId === "lifetime") {
    return { amount: product.price, accessType: "lifetime" };
  }
  if (!product.monthly_pricing) {
    throw new Error("Monthly access is not available for this product");
  }
  return introEligible
    ? { amount: product.monthly_pricing.introductory_price, accessType: "intro_month" }
    : { amount: product.monthly_pricing.renewal_price, accessType: "monthly" };
}

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
