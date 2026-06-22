import { getCurrentUserFromRequest } from "@/lib/auth";
import { getPurchaseByOrderId } from "@/lib/purchases";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    const orderId = new URL(request.url).searchParams.get("order_id");
    if (!orderId) return NextResponse.json({ message: "order_id is required" }, { status: 400 });
    const purchase = await getPurchaseByOrderId(user.id, orderId);
    if (!purchase) return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
    return NextResponse.json({ status: purchase.status, productId: purchase.product_id });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load purchase status" }, { status: 500 });
  }
}
