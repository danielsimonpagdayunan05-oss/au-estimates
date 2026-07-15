import type { Config } from "@netlify/functions";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index";
import { leads } from "../../db/schema";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json, notFound } from "./_shared/response";

const VALID_STATUSES = new Set(["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"]);

export default async (req: Request) => {
  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body || typeof body.name !== "string" || typeof body.email !== "string" || typeof body.phone !== "string") {
      return badRequest("Expected { name, email, phone, selections, estimate, ... }");
    }
    const [row] = await db
      .insert(leads)
      .values({
        name: body.name,
        email: body.email,
        phone: body.phone,
        projectLocation: body.projectLocation ?? null,
        budget: body.budget ?? null,
        targetCompletion: body.targetCompletion ?? null,
        consultationDate: body.consultationDate ?? null,
        notes: body.notes ?? null,
        selections: body.selections ?? {},
        estimate: body.estimate ?? {},
      })
      .returning();
    return json(row, { status: 201 });
  }

  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (req.method === "GET") {
    const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return json(rows);
  }

  if (req.method === "PATCH") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number" || !VALID_STATUSES.has(body.status)) {
      return badRequest("Expected { id: number, status: New|Contacted|Qualified|Proposal|Negotiation|Won|Lost }");
    }
    const [row] = await db.update(leads).set({ status: body.status }).where(eq(leads.id, body.id)).returning();
    if (!row) return notFound();
    return json(row);
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = { path: "/api/leads" };
