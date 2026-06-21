import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseEnv() { return Boolean(supabaseUrl && supabaseAnonKey); }
export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Missing Supabase browser environment variables");
  return createClient(supabaseUrl, supabaseAnonKey);
}
export function getSupabaseServerClient(useServiceRole = false) {
  const key = useServiceRole ? supabaseServiceRoleKey : supabaseAnonKey;
  if (!supabaseUrl || !key) throw new Error("Missing Supabase server environment variables");
  return createClient(supabaseUrl, key, { auth: { persistSession: false } });
}
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
