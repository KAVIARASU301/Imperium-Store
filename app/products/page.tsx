import { getActiveProducts } from "@/lib/products";
import ProductCatalog from "@/components/ProductCatalog";
import type { Metadata } from "next";
import { connection } from "next/server";

const title = "Trading Software & Courses | Imperium Store";
const description =
    "Browse Imperium Store trading software for Indian market traders, including options execution, portfolio management, risk control, and market review tools.";
const catalogPreviewImage = "/product-resources/imperium-option-trading-terminal/imperium_option_trading_terminal.png";

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: "/products" },
    openGraph: {
        title,
        description,
        url: "/products",
        siteName: "Imperium Store",
        type: "website",
        images: [
            {
                url: catalogPreviewImage,
                width: 2048,
                height: 1113,
                alt: "Imperium Store catalog with trading software for Indian market traders",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [catalogPreviewImage],
    },
};

export default async function ProductsPage() {
    await connection();
    const products = getActiveProducts();

    return (
        <main className="mx-auto max-w-[1200px] px-6 py-6">
            <ProductCatalog products={products} />
        </main>
    );
}
