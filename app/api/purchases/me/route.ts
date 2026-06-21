import { getCurrentUserFromRequest } from "@/lib/auth";
import { getPurchasesForUser } from "@/lib/purchases";
import { hasSupabaseEnv } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    if (!hasSupabaseEnv()) return NextResponse.json({ message: "Supabase is not configured" }, { status: 503 });
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    const purchases = await getPurchasesForUser(user.id);
    return NextResponse.json({ purchases });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load purchases" }, { status: 500 });
  }
}
