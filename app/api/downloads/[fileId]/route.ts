import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  // TODO:
  // 1. Get the logged-in user from the Supabase session
  // 2. Check the user has a "paid" purchase for the product owning this file
  // 3. Create a short-lived signed URL via Supabase Storage
  // 4. Return the signed URL — never a permanent public link (Section 11)
  return NextResponse.json({ message: "not implemented" }, { status: 501 });
}
