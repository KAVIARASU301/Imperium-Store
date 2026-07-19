import { getCurrentUserFromRequest } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/purchases";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";
import { NextResponse } from "next/server";

const TERMINAL_PRODUCT_SLUG = "imperium-option-trading-terminal";
const PASSWORD_COOLDOWN_SECONDS = 15 * 60;
const PASSWORD_LIMITS_TABLE = "terminal_password_update_limits";

type CooldownRow = {
  last_updated_at: string | null;
};

type ClaimCooldownRow = {
  allowed?: boolean;
  last_updated_at?: string | null;
  next_allowed_at?: string | null;
};

type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

function getServiceUnavailableResponse() {
  return NextResponse.json(
    { message: "Terminal password updates are not configured." },
    { status: 503 },
  );
}

function isCooldownSetupMissing(error: SupabaseErrorLike) {
  const message = error.message?.toLowerCase() ?? "";
  return (
    error.code === "42P01" ||
    error.code === "42883" ||
    error.code === "PGRST202" ||
    message.includes(PASSWORD_LIMITS_TABLE) ||
    message.includes("claim_terminal_password_update")
  );
}

function getNextAllowedAt(lastUpdatedAt?: string | null) {
  if (!lastUpdatedAt) return null;
  return new Date(
    new Date(lastUpdatedAt).getTime() + PASSWORD_COOLDOWN_SECONDS * 1000,
  ).toISOString();
}

function getCooldownPayload(lastUpdatedAt?: string | null) {
  const nextAllowedAt = getNextAllowedAt(lastUpdatedAt);
  const canUpdate = !nextAllowedAt || new Date(nextAllowedAt).getTime() <= Date.now();

  return {
    canUpdate,
    cooldownSeconds: PASSWORD_COOLDOWN_SECONDS,
    lastUpdatedAt: lastUpdatedAt ?? null,
    nextAllowedAt,
  };
}

async function getVerifiedTerminalUser(request: Request) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return {
      response: NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      ),
    };
  }

  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { response: getServiceUnavailableResponse() };
  }

  if (!(await hasPaidAccess(user.id, TERMINAL_PRODUCT_SLUG))) {
    return {
      response: NextResponse.json(
        { message: "Paid terminal access required" },
        { status: 403 },
      ),
    };
  }

  return { user };
}

export async function GET(request: Request) {
  try {
    const verified = await getVerifiedTerminalUser(request);
    if (verified.response) return verified.response;

    const supabase = getSupabaseServerClient(true);
    const { data, error } = await supabase
      .from(PASSWORD_LIMITS_TABLE)
      .select("last_updated_at")
      .eq("user_id", verified.user.id)
      .maybeSingle<CooldownRow>();

    if (error) {
      if (isCooldownSetupMissing(error)) return getServiceUnavailableResponse();
      throw error;
    }

    return NextResponse.json(getCooldownPayload(data?.last_updated_at));
  } catch (error) {
    console.error("Unable to load terminal password cooldown", error);
    return NextResponse.json(
      {
        message: "Unable to load terminal password cooldown.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const verified = await getVerifiedTerminalUser(request);
    if (verified.response) return verified.response;

    const body = (await request.json().catch(() => ({}))) as {
      password?: unknown;
    };
    const password = typeof body.password === "string" ? body.password : "";
    if (!password.trim()) {
      return NextResponse.json(
        { message: "Terminal password is required." },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Use at least 8 characters for the terminal password." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient(true);
    const { data: claim, error: claimError } = await supabase
      .rpc("claim_terminal_password_update", {
        p_user_id: verified.user.id,
        p_cooldown_seconds: PASSWORD_COOLDOWN_SECONDS,
      })
      .single<ClaimCooldownRow>();

    if (claimError) {
      if (isCooldownSetupMissing(claimError)) return getServiceUnavailableResponse();
      throw claimError;
    }

    if (!claim?.allowed) {
      return NextResponse.json(
        {
          ...getCooldownPayload(claim?.last_updated_at),
          canUpdate: false,
          nextAllowedAt: claim?.next_allowed_at ?? getNextAllowedAt(claim?.last_updated_at),
          message: "Terminal password was updated recently. Try again after the cooldown.",
        },
        { status: 429 },
      );
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      verified.user.id,
      { password },
    );
    if (updateError) {
      return NextResponse.json(
        { message: "Unable to save the terminal password." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ...getCooldownPayload(claim.last_updated_at),
      canUpdate: false,
      nextAllowedAt: claim.next_allowed_at ?? getNextAllowedAt(claim.last_updated_at),
      message: "Terminal password saved.",
    });
  } catch (error) {
    console.error("Unable to save terminal password", error);
    return NextResponse.json(
      {
        message: "Unable to save the terminal password.",
      },
      { status: 500 },
    );
  }
}
