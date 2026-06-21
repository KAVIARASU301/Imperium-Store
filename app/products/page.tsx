import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">Imperium catalog</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Products</h1>
      <p className="mt-4 max-w-2xl text-slate-400">Focused trading apps, templates, and education for practice, execution, and review.</p>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">{getActiveProducts().map((product) => <ProductCard key={product.slug} product={product} />)}</div>
    </main>
  );
}
