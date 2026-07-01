import { getCurrentUserFromRequest } from "@/lib/auth";
import { createGithubReleaseDownloadResponse } from "@/lib/downloads";
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
    try {
      const download = await createGithubReleaseDownloadResponse(file);
      if (!download.body) return NextResponse.json({ message: "Download is not ready. Try again." }, { status: 503 });
      return new Response(download.body, {
        status: 200,
        headers: {
          "Content-Type": download.headers.get("content-type") ?? "application/zip",
          "Content-Disposition": `attachment; filename="${file.file_name.replaceAll('"', "")}"`,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      console.error("Download unavailable", error);
      return NextResponse.json({ message: "Download is not ready. Try again." }, { status: 503 });
    }
  } catch (error) {
    console.error("Download request failed", error);
    return NextResponse.json({ message: "Unable to prepare download." }, { status: 500 });
  }
}
