import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index";
import { statItems } from "../../db/schema";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json, notFound } from "./_shared/response";

export default async (req: Request) => {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body || typeof body.label !== "string" || typeof body.value !== "number") {
      return badRequest("Expected { label: string, value: number, prefix?: string, suffix?: string, sortOrder?: number }");
    }
    const [row] = await db
      .insert(statItems)
      .values({ label: body.label, value: body.value, prefix: body.prefix ?? "", suffix: body.suffix ?? "", sortOrder: body.sortOrder ?? 0 })
      .returning();
    return json(row, { status: 201 });
  }

  if (req.method === "PUT") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number") return badRequest("Expected { id: number, ...fields }");
    const { id, ...fields } = body;
    const [row] = await db
      .update(statItems)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(statItems.id, id))
      .returning();
    if (!row) return notFound();
    return json(row);
  }

  if (req.method === "DELETE") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number") return badRequest("Expected { id: number }");
    await db.delete(statItems).where(eq(statItems.id, body.id));
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = { path: "/api/admin/stats" };
