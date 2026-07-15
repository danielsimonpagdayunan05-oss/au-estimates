import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { eq } from "drizzle-orm";
import { db } from "../../db/index";
import { portfolioItems } from "../../db/schema";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json, notFound } from "./_shared/response";

export default async (req: Request) => {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body || typeof body.title !== "string") return badRequest("Expected { title: string, ... }");
    const [row] = await db
      .insert(portfolioItems)
      .values({
        title: body.title,
        description: body.description ?? null,
        category: body.category ?? null,
        location: body.location ?? null,
        floorAreaSqm: body.floorAreaSqm ?? null,
        completionYear: body.completionYear ?? null,
        coverImageKey: body.coverImageKey ?? null,
        galleryImageKeys: Array.isArray(body.galleryImageKeys) ? body.galleryImageKeys : [],
        featured: !!body.featured,
        sortOrder: body.sortOrder ?? 0,
      })
      .returning();
    return json(row, { status: 201 });
  }

  if (req.method === "PUT") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number") return badRequest("Expected { id: number, ...fields }");
    const { id, ...fields } = body;
    const [row] = await db
      .update(portfolioItems)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(portfolioItems.id, id))
      .returning();
    if (!row) return notFound();
    return json(row);
  }

  if (req.method === "DELETE") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number") return badRequest("Expected { id: number }");
    const [existing] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, body.id)).limit(1);
    if (existing) {
      const store = getStore({ name: "portfolio-images" });
      const keys = [existing.coverImageKey, ...(existing.galleryImageKeys ?? [])].filter(Boolean) as string[];
      await Promise.all(keys.map((key) => store.delete(key)));
    }
    await db.delete(portfolioItems).where(eq(portfolioItems.id, body.id));
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = { path: "/api/admin/portfolio" };
