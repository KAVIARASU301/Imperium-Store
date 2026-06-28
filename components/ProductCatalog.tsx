"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import { useState } from "react";

type CatalogTab = "app" | "course";
type LanguageFilter = "all" | "english" | "tamil" | "other";

const tabs: Array<{ id: CatalogTab; label: string; eyebrow: string }> = [
  { id: "app", label: "Software", eyebrow: "Apps" },
  { id: "course", label: "Courses", eyebrow: "Learning" },
];

const languages: Array<{ id: LanguageFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "english", label: "English" },
  { id: "tamil", label: "Tamil" },
  { id: "other", label: "Other" },
];

export default function ProductCatalog({ products }: { products: Product[] }) {
  const activeProducts = products.filter((product) => product.is_active);
  const appCount = activeProducts.filter((product) => product.type === "app").length;
  const courseCount = activeProducts.filter((product) => product.type === "course").length;
  const productCounts: Record<CatalogTab, number> = {
    app: appCount,
    course: courseCount,
  };
  const visibleTabs = tabs.filter((tab) => productCounts[tab.id] > 0);

  const [activeTab, setActiveTab] = useState<CatalogTab>("app");
  const [activeLanguage, setActiveLanguage] = useState<LanguageFilter>("all");
  const selectedTab = visibleTabs.some((tab) => tab.id === activeTab) ? activeTab : visibleTabs[0]?.id;

  const visibleProducts = activeProducts.filter((product) => {
    const productLanguage = getProductLanguage();
    return product.type === selectedTab && (activeLanguage === "all" || productLanguage === activeLanguage);
  });

  return (
    <section>
      <div className="rounded-md border border-cyan-border bg-section/90 p-2 shadow-[0_14px_42px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {visibleTabs.length ? (
            <div className={`grid gap-1.5 ${visibleTabs.length > 1 ? "grid-cols-2 sm:w-[320px]" : "grid-cols-1 sm:w-40"}`}>
              {visibleTabs.map((tab) => {
                const isActive = selectedTab === tab.id;
                const count = productCounts[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`min-h-10 rounded-md border px-3 py-1.5 text-left transition ${
                      isActive
                        ? "border-brand bg-card-hover text-white shadow-[0_12px_26px_rgba(0,0,0,0.24)]"
                        : "border-cyan-border bg-card text-muted hover:border-brand hover:text-white"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>
                        <span className="block text-sm font-extrabold">{tab.label}</span>
                        <span className="block font-mono text-[9px] font-semibold uppercase tracking-wider text-muted">{tab.eyebrow}</span>
                      </span>
                      <span className="font-mono text-xs text-muted">{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <label className="flex min-w-0 items-center gap-2 sm:w-56">
            <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Language</span>
            <div className="relative">
              <select
                value={activeLanguage}
                onChange={(event) => setActiveLanguage(event.target.value as LanguageFilter)}
                className="h-10 w-full appearance-none rounded-md border border-cyan-border bg-card px-3 pr-8 text-sm font-bold text-white outline-none transition hover:border-brand focus:border-brand"
              >
                {languages.map((language) => (
                  <option key={language.id} value={language.id} className="bg-card text-white">
                    {language.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand" aria-hidden="true">
                ▼
              </span>
            </div>
          </label>
        </div>
      </div>

      {visibleProducts.length ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} product={product} variant="vertical" />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-cyan-border bg-section px-6 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-brand">
            {selectedTab === "course" ? "Courses in production" : "No matching products"}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-white">
            {selectedTab === "course" ? "Imperium learning products will appear here." : "Try another language filter."}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            The catalog layout is ready for software, courses, and future language-specific releases.
          </p>
        </div>
      )}
    </section>
  );
}

function getProductLanguage(): Exclude<LanguageFilter, "all"> {
  return "english";
}
