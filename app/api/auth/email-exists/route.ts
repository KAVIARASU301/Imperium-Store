import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await request.json().catch(() => ({}));
  return NextResponse.json(
    { message: "Account availability checks are disabled." },
    { status: 404 },
  );
}
