import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Imperium catalog</p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Products</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Professional desktop workstations for options execution, stock investing, portfolio
                management, swing trading, market analysis, risk management, and review.
            </p>
            <div className="mt-8 divide-y divide-white/10 border border-white/10">
                {getActiveProducts().map((product) => (
                    <ProductCard key={product.slug} product={product} />
                ))}
            </div>
        </main>
    );
}