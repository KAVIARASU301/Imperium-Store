import { products } from "@/lib/products";
import { notFound } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-white">{product.name}</h1>
      {/* TODO: who it's for, what's included, screenshots, price,
          buy button, FAQ, disclaimer (Section 6) */}
    </main>
  );
}
