import { NextResponse } from "next/server";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as {
    email?: unknown;
  };
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return NextResponse.json({ message: "Email address is required." }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ exists: false });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { message: "Account availability check is not configured." },
      { status: 503 },
    );
  }

  const supabase = getSupabaseServerClient(true);
  const perPage = 1000;
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      return NextResponse.json(
        { message: "Unable to check account availability." },
        { status: 500 },
      );
    }

    const exists = data.users.some(
      (user) => normalizeEmail(user.email) === normalizedEmail,
    );
    if (exists) return NextResponse.json({ exists: true });

    if (!data.nextPage || data.users.length < perPage) break;
    page = data.nextPage;
  }

  return NextResponse.json({ exists: false });
}
