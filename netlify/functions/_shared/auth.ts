import { getUser } from "@netlify/identity";
import type { User } from "@netlify/identity";

export async function requireAdmin(): Promise<{ user: User } | { error: Response }> {
  const user = await getUser();
  if (!user || !user.roles?.includes("admin")) {
    return { error: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } }) };
  }
  return { user };
}
