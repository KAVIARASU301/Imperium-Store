"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";

type CatalogTab = "app" | "course";

const tabs: Array<{ id: CatalogTab; label: string }> = [
  { id: "app", label: "Software" },
  { id: "course", label: "Courses" },
];

export default function ProductCatalog({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeProducts = products.filter((product) => product.is_active);
  const productCounts: Record<CatalogTab, number> = {
    app: activeProducts.filter((product) => product.type === "app").length,
    course: activeProducts.filter((product) => product.type === "course").length,
  };
  const visibleTabs = tabs.filter((tab) => productCounts[tab.id] > 0);

  const activeTab = getCatalogTabFromQuery(searchParams.get("type"));
  const selectedTab = visibleTabs.some((tab) => tab.id === activeTab) ? activeTab : visibleTabs[0]?.id;
  const visibleProducts = activeProducts.filter((product) => product.type === selectedTab);

  function selectTab(tab: CatalogTab) {
    router.replace(`/products?type=${tab === "course" ? "courses" : "software"}`, { scroll: false });
  }

  return (
    <section>
      <div className="section-heading mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="section-title">Products</h1>
        {visibleTabs.length > 1 ? (
          <div className="flex gap-2">
            {visibleTabs.map((tab) => {
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`min-h-10 rounded-md border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-brand bg-card-hover text-white shadow-[0_12px_26px_rgba(0,0,0,0.24)]"
                      : "border-cyan-border bg-card text-muted hover:border-brand hover:text-white"
                  }`}
                  onClick={() => selectTab(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {visibleProducts.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} product={product} variant="vertical" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-cyan-border bg-section px-6 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
          <h2 className="text-2xl font-extrabold text-white">
            {selectedTab === "course" ? "Courses are coming soon." : "No products here yet."}
          </h2>
        </div>
      )}
    </section>
  );
}

function getCatalogTabFromQuery(value: string | null): CatalogTab {
  return value === "courses" || value === "course" ? "course" : "app";
}
