import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index";
import { additionalServices } from "../../db/schema";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json, notFound } from "./_shared/response";

const FEE_TYPES = new Set(["percent", "flat", "per_sqm"]);
const CATEGORIES = new Set(["design", "engineering", "construction", "documentation", "survey"]);

export default async (req: Request) => {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (
      !body ||
      typeof body.id !== "string" ||
      typeof body.label !== "string" ||
      !CATEGORIES.has(body.category) ||
      !FEE_TYPES.has(body.feeType) ||
      typeof body.value !== "number"
    ) {
      return badRequest("Expected { id: string, label: string, category: design|engineering|construction|documentation|survey, feeType: percent|flat|per_sqm, value: number, sortOrder?: number }");
    }
    const [row] = await db
      .insert(additionalServices)
      .values({ id: body.id, label: body.label, category: body.category, feeType: body.feeType, value: body.value, sortOrder: body.sortOrder ?? 0 })
      .returning();
    return json(row, { status: 201 });
  }

  if (req.method === "PUT") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "string") return badRequest("Expected { id: string, ...fields }");
    const { id, ...fields } = body;
    if (fields.feeType && !FEE_TYPES.has(fields.feeType)) return badRequest("Invalid feeType");
    if (fields.category && !CATEGORIES.has(fields.category)) return badRequest("Invalid category");
    const [row] = await db.update(additionalServices).set(fields).where(eq(additionalServices.id, id)).returning();
    if (!row) return notFound();
    return json(row);
  }

  if (req.method === "DELETE") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "string") return badRequest("Expected { id: string }");
    await db.delete(additionalServices).where(eq(additionalServices.id, body.id));
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = { path: "/api/admin/services" };
