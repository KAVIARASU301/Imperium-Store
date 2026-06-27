import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
    return (
        <main className="mx-auto max-w-[1200px] px-6 py-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">Imperium catalog</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-normal text-white sm:text-4xl">Products</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Professional desktop workstations for options execution, stock investing, portfolio
                management, swing trading, market analysis, risk management, and review.
            </p>
            <div className="mt-8 border border-cyan-border bg-cyan-border">
                {getActiveProducts().map((product) => (
                    <ProductCard key={product.slug} product={product} />
                ))}
            </div>
        </main>
    );
}
