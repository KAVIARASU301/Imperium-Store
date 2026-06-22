export type DemoUser = { id: string; email?: string };

const DEMO_TOKEN_PREFIX = "demo-user:";

export function createDemoAccessToken(email: string) {
  return `${DEMO_TOKEN_PREFIX}${encodeURIComponent(email.trim().toLowerCase())}`;
}

export function getDemoUserFromToken(token: string | null | undefined): DemoUser | null {
  if (!token?.startsWith(DEMO_TOKEN_PREFIX)) return null;
  const email = decodeURIComponent(token.slice(DEMO_TOKEN_PREFIX.length));
  if (!email) return null;
  return { id: `demo:${email}`, email };
}
