import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { sql } from "drizzle-orm";
import { db } from "../../db/index";
import { settings } from "../../db/schema";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json } from "./_shared/response";

export default async (req: Request) => {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (req.method !== "PUT") return json({ error: "Method not allowed" }, { status: 405 });

  const body = await readJsonBody(req);
  if (!body || typeof body.key !== "string" || body.value === undefined) {
    return badRequest("Expected { key: string, value: any }");
  }

  const user = await getUser();

  const [row] = await db
    .insert(settings)
    .values({ key: body.key, value: body.value, updatedBy: user?.email ?? null })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: body.value, updatedAt: sql`now()`, updatedBy: user?.email ?? null },
    })
    .returning();

  return json(row);
};

export const config: Config = { path: "/api/admin/settings" };
