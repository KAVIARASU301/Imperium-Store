import PricingBox from "@/components/PricingBox";
import ProductImage from "@/components/ProductImage";
import { getActiveProducts, getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

export function generateStaticParams() { return getActiveProducts().map((product) => ({ slug: product.slug })); }

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">{product.type}</p>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">{product.name}</h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-300">{product.promise}</p>
          <p className="mt-4 max-w-3xl leading-7 text-slate-400">{product.description}</p>
          <div className="mt-10"><ProductImage product={product} priority /></div>
          <Info title="Who this is for" items={product.audience} />
          <Info title="What problem it solves" items={product.problems} />
          <Info title="What you get" items={product.includes} />
          <Info title="How it helps" items={product.outcomes} />
          {product.lessons ? <Info title="Course lessons" items={product.lessons.sort((a, b) => a.sort_order - b.sort_order).map((lesson) => `${lesson.title}${lesson.is_preview ? " (preview)" : ""}`)} /> : null}
          <section className="mt-12"><h2 className="text-2xl font-semibold text-white">FAQ</h2><div className="mt-5 space-y-4">{product.faq.map((item) => <div key={item.question} className="border border-slate-800 bg-[#0B1020] p-5"><h3 className="font-semibold text-white">{item.question}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.answer}</p></div>)}</div></section>
          <section className="mt-12 border border-amber-300/30 bg-amber-300/5 p-5"><h2 className="font-semibold text-amber-200">Disclaimer</h2><p className="mt-2 text-sm leading-6 text-slate-300">This content is for educational purposes only. It is not investment advice. Trading involves risk. Past performance does not guarantee future results.</p></section>
        </section>
        <div className="lg:sticky lg:top-8 lg:self-start"><PricingBox price={product.price} currency={product.currency} slug={product.slug} productName={product.name} /></div>
      </div>
    </main>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-12"><h2 className="text-2xl font-semibold text-white">{title}</h2><ul className="mt-5 grid gap-3 md:grid-cols-2">{items.map((item) => <li key={item} className="border border-slate-800 bg-[#0B1020] p-4 text-slate-300">{item}</li>)}</ul></section>;
}
