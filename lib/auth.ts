import { getDemoUserFromToken } from "@/lib/demo-auth";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

export async function getCurrentUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const demoUser = getDemoUserFromToken(token);
  if (demoUser) return demoUser;
  if (!hasSupabaseEnv()) return null;

  const { data, error } = await getSupabaseServerClient().auth.getUser(token);
  if (error) return null;
  return data.user;
}
