import type { Product, ProductFile } from "@/types/product";

export const productFiles: ProductFile[] = [
  {
    id: "checklist-pdf-v1",
    product_slug: "imperium-option-buyer-checklist",
    file_name: "Imperium Option Buyer Checklist.pdf",
    file_path: "lead-magnets/imperium-option-buyer-checklist-v1.pdf",
    version: "1.0.0",
    platform: "pdf",
    is_active: true,
  },
  {
    id: "cvd-practice-chart-win-v1",
    product_slug: "cvd-practice-chart",
    file_name: "CVD Practice Chart Windows Installer.zip",
    file_path: "apps/cvd-practice-chart/windows/v1.0.0.zip",
    version: "1.0.0",
    platform: "windows",
    is_active: true,
  },
  {
    id: "banknifty-system-workbook-v1",
    product_slug: "banknifty-options-execution-system",
    file_name: "Execution System Workbook.zip",
    file_path: "courses/banknifty-options-execution-system/workbook-v1.zip",
    version: "1.0.0",
    platform: "zip",
    is_active: true,
  },
];

export const products: Product[] = [
  {
    slug: "imperium-option-buyer-checklist",
    name: "Imperium Option Buyer Checklist",
    type: "template",
    short_description: "A free checklist to build a repeatable pre-trade routine.",
    description:
      "A concise checklist for Indian index option traders who want a cleaner decision process before taking trades.",
    promise: "Build a sharper pre-trade filter before risking capital.",
    price: 0,
    currency: "INR",
    is_active: true,
    audience: ["New option buyers", "Traders who overtrade", "Anyone building a daily preparation routine"],
    problems: ["Impulsive entries", "No written pre-trade process", "Inconsistent review habits"],
    includes: ["Pre-market checklist", "Entry quality prompts", "Risk and invalidation reminders"],
    outcomes: ["Cleaner preparation", "More consistent trade notes", "A simple structure for review"],
    faq: [
      { question: "Is this investment advice?", answer: "No. It is an educational workflow template only." },
      { question: "How do I access it?", answer: "Create an account and download it from My Purchases." },
    ],
    files: productFiles.filter((file) => file.product_slug === "imperium-option-buyer-checklist"),
  },
  {
    slug: "cvd-practice-chart",
    name: "CVD Practice Chart",
    type: "app",
    short_description:
      "Replay trading days, study price-volume behavior, and improve execution discipline.",
    description:
      "A focused replay tool for studying cumulative volume delta behavior and reviewing execution decisions after the market closes.",
    promise: "Practice market-reading without noisy claims or hindsight shortcuts.",
    price: 999,
    currency: "INR",
    is_active: true,
    audience: ["Intraday traders", "Replay-focused learners", "Traders studying price-volume behavior"],
    problems: ["No structured replay routine", "Weak post-market review", "Overreliance on live-market emotion"],
    includes: ["Desktop app download", "Replay workflow guide", "Version updates for the purchased build"],
    outcomes: ["Repeatable replay sessions", "Better execution journaling", "Clearer observation of order-flow context"],
    faq: [
      { question: "Does the app guarantee profit?", answer: "No. It is a practice and review tool, not a signal service." },
      { question: "Which platforms are supported?", answer: "The MVP starts with Windows package metadata; more builds can be added later." },
    ],
    files: productFiles.filter((file) => file.product_slug === "cvd-practice-chart"),
  },
  {
    slug: "banknifty-options-execution-system",
    name: "BankNifty Options Execution System",
    type: "course",
    short_description: "A structured framework for disciplined BankNifty options execution.",
    description:
      "A practical education system for preparing, executing, and reviewing BankNifty option trades with defined risk and written rules.",
    promise: "Replace random entries with a documented execution workflow.",
    price: 2999,
    currency: "INR",
    is_active: true,
    audience: ["Indian index option traders", "Rule-based learners", "Traders rebuilding discipline"],
    problems: ["Undefined setups", "Poor risk planning", "No post-trade feedback loop"],
    includes: ["Structured course lessons", "Execution workbook", "Setup checklist", "Review templates"],
    outcomes: ["Clearer setup selection", "Defined risk before entry", "A better review habit"],
    faq: [
      { question: "Is this a tips channel?", answer: "No. It teaches preparation, execution structure, and review workflows." },
      { question: "When is access unlocked?", answer: "After Razorpay webhook confirmation marks the purchase as paid." },
    ],
    lessons: [
      { id: "bnf-01", title: "Execution Mindset and Risk", video_url: "https://video.example.com/bnf-01", sort_order: 1, is_preview: true },
      { id: "bnf-02", title: "Setup Qualification", video_url: "https://video.example.com/bnf-02", sort_order: 2, is_preview: false },
    ],
    files: productFiles.filter((file) => file.product_slug === "banknifty-options-execution-system"),
  },
];

export function getActiveProducts() { return products.filter((product) => product.is_active); }
export function getProductBySlug(slug: string) { return products.find((product) => product.slug === slug && product.is_active); }
export function getProductFileById(fileId: string) { return productFiles.find((file) => file.id === fileId && file.is_active); }
export function formatPrice(price: number, currency = "INR") { return price === 0 ? "Free" : new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(price); }
