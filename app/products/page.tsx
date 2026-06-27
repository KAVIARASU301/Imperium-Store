import { getActiveProducts } from "@/lib/products";
import ProductCatalog from "@/components/ProductCatalog";

export default function ProductsPage() {
    const products = getActiveProducts();

    return (
        <main className="mx-auto max-w-[1200px] px-6 py-6">
            <ProductCatalog products={products} />
        </main>
    );
}
