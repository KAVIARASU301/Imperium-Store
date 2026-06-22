import { getCurrentUserFromRequest } from "@/lib/auth";
import { createSignedDownloadUrl } from "@/lib/downloads";
import { getProductFileById } from "@/lib/products";
import { hasPaidAccess } from "@/lib/purchases";
import { NextResponse } from "next/server";

export async function GET(request: Request, ctx: RouteContext<"/api/downloads/[fileId]">) {
  try {
    const { fileId } = await ctx.params;
    const file = getProductFileById(fileId);
    if (!file) return NextResponse.json({ message: "File not found" }, { status: 404 });
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    if (!(await hasPaidAccess(user.id, file.product_slug))) return NextResponse.json({ message: "Paid access required" }, { status: 403 });
    return NextResponse.json({ url: await createSignedDownloadUrl(file.file_path) });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create signed URL" }, { status: 500 });
  }
}
