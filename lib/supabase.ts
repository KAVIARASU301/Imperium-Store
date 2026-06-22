import { createClient } from "@supabase/supabase-js";
import { createDemoAccessToken } from "@/lib/demo-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_SESSION_KEY = "imperium.demo.session";

type DemoSession = { access_token: string; user: { id: string; email: string } };

function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  const email = window.localStorage.getItem(DEMO_SESSION_KEY);
  if (!email) return null;
  return { access_token: createDemoAccessToken(email), user: { id: `demo:${email}`, email } };
}

function createDemoBrowserClient() {
  return {
    auth: {
      async getSession() {
        return { data: { session: getDemoSession() }, error: null };
      },
      async signInWithPassword({ email }: { email: string; password: string }) {
        window.localStorage.setItem(DEMO_SESSION_KEY, email.trim().toLowerCase());
        return { data: { session: getDemoSession() }, error: null };
      },
      async signUp({ email }: { email: string; password: string; options?: unknown }) {
        window.localStorage.setItem(DEMO_SESSION_KEY, email.trim().toLowerCase());
        return { data: { session: getDemoSession() }, error: null };
      },
      async signInWithOAuth() {
        return { data: null, error: new Error("Add Supabase credentials to enable OAuth providers. Email login works in demo mode.") };
      },
      async resetPasswordForEmail() {
        return { data: {}, error: null };
      },
      async updateUser() {
        return { data: { user: getDemoSession()?.user ?? null }, error: null };
      },
      async signOut() {
        window.localStorage.removeItem(DEMO_SESSION_KEY);
        return { error: null };
      },
    },
  };
}

export function hasSupabaseEnv() { return Boolean(supabaseUrl && supabaseAnonKey); }
export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) return createDemoBrowserClient();
  return createClient(supabaseUrl, supabaseAnonKey);
}
export function getSupabaseServerClient(useServiceRole = false) {
  const key = useServiceRole ? supabaseServiceRoleKey : supabaseAnonKey;
  if (!supabaseUrl || !key) throw new Error("Missing Supabase server environment variables");
  return createClient(supabaseUrl, key, { auth: { persistSession: false } });
}
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
