import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index";
import { provinces } from "../../db/schema";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json, notFound } from "./_shared/response";

export default async (req: Request) => {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body || typeof body.name !== "string" || typeof body.region !== "string") {
      return badRequest("Expected { name: string, region: string, multiplier?: number, cities?: string[], sortOrder?: number }");
    }
    const [row] = await db
      .insert(provinces)
      .values({
        name: body.name,
        region: body.region,
        multiplier: body.multiplier ?? 1,
        cities: Array.isArray(body.cities) ? body.cities : [],
        sortOrder: body.sortOrder ?? 0,
      })
      .returning();
    return json(row, { status: 201 });
  }

  if (req.method === "PUT") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number") return badRequest("Expected { id: number, ...fields }");
    const { id, ...fields } = body;
    const [row] = await db.update(provinces).set(fields).where(eq(provinces.id, id)).returning();
    if (!row) return notFound();
    return json(row);
  }

  if (req.method === "DELETE") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number") return badRequest("Expected { id: number }");
    await db.delete(provinces).where(eq(provinces.id, body.id));
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = { path: "/api/admin/provinces" };
