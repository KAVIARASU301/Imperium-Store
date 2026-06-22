import { createClient } from "@supabase/supabase-js";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createDemoAccessToken } from "@/lib/demo-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_SESSION_KEY = "imperium.demo.session";
const DEMO_AUTH_EVENT = "imperium-auth-change";

type DemoUser = { id: string; email: string; user_metadata: { full_name?: string; name?: string } };
type DemoSession = { access_token: string; user: DemoUser };
type BrowserSession = Session | DemoSession | null;
type BrowserAuthClient = {
  getSession(): Promise<{ data: { session: BrowserSession }; error: null }>;
  signInWithPassword(input: { email: string; password: string }): Promise<{ data: { session: BrowserSession }; error: null } | { data: unknown; error: Error }>;
  signUp(input: { email: string; password: string; options?: unknown }): Promise<{ data: { session: BrowserSession }; error: null } | { data: unknown; error: Error }>;
  signInWithOAuth(input?: unknown): Promise<{ data: unknown; error: Error | null }>;
  exchangeCodeForSession(code: string): Promise<{ data: { session: BrowserSession }; error: Error | null }>;
  resetPasswordForEmail(email: string, options?: unknown): Promise<{ data: unknown; error: Error | null }>;
  updateUser(attributes: unknown): Promise<{ data: { user: User | DemoUser | null }; error: Error | null }>;
  signOut(): Promise<{ error: Error | null }>;
  onAuthStateChange(callback: (event: AuthChangeEvent | string, session: BrowserSession) => void): { data: { subscription: { unsubscribe: () => void } } };
};
type BrowserSupabaseClient = { auth: BrowserAuthClient };

function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  const email = window.localStorage.getItem(DEMO_SESSION_KEY);
  if (!email) return null;
  return { access_token: createDemoAccessToken(email), user: { id: `demo:${email}`, email, user_metadata: {} } };
}

function createDemoBrowserClient() {
  return {
    auth: {
      async getSession() {
        return { data: { session: getDemoSession() }, error: null };
      },
      async signInWithPassword({ email }: { email: string; password: string }) {
        window.localStorage.setItem(DEMO_SESSION_KEY, email.trim().toLowerCase());
        window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
        return { data: { session: getDemoSession() }, error: null };
      },
      async signUp({ email }: { email: string; password: string; options?: unknown }) {
        window.localStorage.setItem(DEMO_SESSION_KEY, email.trim().toLowerCase());
        window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
        return { data: { session: getDemoSession() }, error: null };
      },
      async signInWithOAuth() {
        return { data: null, error: new Error("Add Supabase credentials to enable OAuth providers. Email login works in demo mode.") };
      },
      async exchangeCodeForSession() {
        return { data: { session: getDemoSession() }, error: null };
      },
      async resetPasswordForEmail() {
        return { data: {}, error: null };
      },
      async updateUser() {
        return { data: { user: getDemoSession()?.user ?? null }, error: null };
      },
      async signOut() {
        window.localStorage.removeItem(DEMO_SESSION_KEY);
        window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
        return { error: null };
      },
      onAuthStateChange(callback: (_event: string, session: DemoSession | null) => void) {
        const handler = () => callback("SIGNED_IN", getDemoSession());
        window.addEventListener(DEMO_AUTH_EVENT, handler);
        return { data: { subscription: { unsubscribe: () => window.removeEventListener(DEMO_AUTH_EVENT, handler) } }, error: null };
      },
    },
  };
}

export function hasSupabaseEnv() { return Boolean(supabaseUrl && supabaseAnonKey); }
export function getSupabaseBrowserClient(): BrowserSupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) return createDemoBrowserClient() as BrowserSupabaseClient;
  return createClient(supabaseUrl, supabaseAnonKey) as BrowserSupabaseClient;
}
export function getSupabaseServerClient(useServiceRole = false) {
  const key = useServiceRole ? supabaseServiceRoleKey : supabaseAnonKey;
  if (!supabaseUrl || !key) throw new Error("Missing Supabase server environment variables");
  return createClient(supabaseUrl, key, { auth: { persistSession: false } });
}
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
