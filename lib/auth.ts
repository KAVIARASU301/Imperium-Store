import { jwtVerify } from "jose";
import { getDemoUserFromToken } from "@/lib/demo-auth";
import { canUseDevelopmentFallbacks } from "@/lib/runtime";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

let cachedJwtSecretKey: Uint8Array | null = null;

function getJwtSecretKey() {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) return null;
  cachedJwtSecretKey ??= new TextEncoder().encode(secret);
  return cachedJwtSecretKey;
}

type VerifiedUser = { id: string; email?: string };

async function verifyTokenLocally(token: string): Promise<VerifiedUser | null> {
  const key = getJwtSecretKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key, { audience: "authenticated" });
    if (typeof payload.sub !== "string") return null;
    return { id: payload.sub, email: typeof payload.email === "string" ? payload.email : undefined };
  } catch {
    // Expired, malformed, or wrong-secret tokens fail closed here.
    return null;
  }
}

/**
 * Resolves the current user from a request's bearer token.
 *
 * By default this verifies the JWT signature locally (no network call),
 * which is what makes dashboard/status/receipt requests fast. Pass
 * `verifyRemotely: true` for actions where a revoked/banned session must be
 * caught immediately - paid downloads, password changes, payment creation.
 */
export async function getCurrentUserFromRequest(
    request: Request,
    options?: { verifyRemotely?: boolean },
) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const demoUser = canUseDevelopmentFallbacks() ? getDemoUserFromToken(token) : null;
  if (demoUser) return demoUser;
  if (!hasSupabaseEnv()) return null;

  if (!options?.verifyRemotely) {
    const localUser = await verifyTokenLocally(token);
    if (localUser) return localUser;
    // No SUPABASE_JWT_SECRET configured, or local verification failed for a
    // reason worth double-checking against Supabase before rejecting outright.
  }

  const { data, error } = await getSupabaseServerClient().auth.getUser(token);
  if (error) return null;
  return data.user;
}