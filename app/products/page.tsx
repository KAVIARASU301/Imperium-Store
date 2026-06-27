import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
    return (
        <main className="mx-auto max-w-[1200px] px-6 py-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Imperium catalog</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-normal text-[#c5d5ee] sm:text-4xl">Products</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6882a8]">
                Professional desktop workstations for options execution, stock investing, portfolio
                management, swing trading, market analysis, risk management, and review.
            </p>
            <div className="mt-8 border border-[#1b3055] bg-[#1b3055]">
                {getActiveProducts().map((product) => (
                    <ProductCard key={product.slug} product={product} />
                ))}
            </div>
        </main>
    );
}
