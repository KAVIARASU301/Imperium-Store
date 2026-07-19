import { getCurrentUserFromRequest } from "@/lib/auth";
import { getActiveProducts } from "@/lib/products";
import { summarizeProductAccess } from "@/lib/access";
import { getPurchasesForUser } from "@/lib/purchases";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    const purchases = await getPurchasesForUser(user.id);
    const access = Object.fromEntries(
      getActiveProducts().map((product) => [
        product.slug,
        summarizeProductAccess(purchases, product.slug),
      ]),
    );
    return NextResponse.json(
      { purchases, access },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Unable to load purchases", error);
    return NextResponse.json({ message: "Unable to load purchases" }, { status: 500 });
  }
}
