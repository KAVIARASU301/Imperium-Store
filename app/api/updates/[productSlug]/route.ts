import { getCurrentUserFromRequest } from "@/lib/auth";
import { getGithubReleaseMetadata } from "@/lib/downloads";
import { getProductBySlug } from "@/lib/products";
import { hasPaidAccess } from "@/lib/purchases";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/updates/[productSlug]">,
) {
  try {
    const { productSlug } = await ctx.params;
    const product = getProductBySlug(productSlug);
    if (!product || product.type !== "app") {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    if (!(await hasPaidAccess(user.id, productSlug))) {
      return NextResponse.json({ message: "Paid access required" }, { status: 403 });
    }

    const releaseRepository = product.files?.find((file) => file.is_active)?.release_repository;
    if (!releaseRepository) {
      return NextResponse.json({ message: "Release information is unavailable" }, { status: 404 });
    }

    const release = await getGithubReleaseMetadata(releaseRepository);
    return NextResponse.json(release, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Update metadata request failed", error);
    return NextResponse.json(
      { message: "Update information is temporarily unavailable" },
      { status: 503 },
    );
  }
}
