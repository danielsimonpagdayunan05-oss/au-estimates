import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index";
import { pricingRules } from "../../db/schema";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json, notFound } from "./_shared/response";

const CONDITION_FIELDS = new Set(["projectType", "category", "quality", "mepComplexity"]);
const ACTION_TARGETS = new Set(["architecturalFee", "engineeringFee", "interiorFee", "constructionCost"]);
const ACTION_TYPES = new Set(["waive", "percentDiscount"]);

function validate(body: Record<string, unknown>) {
  return (
    typeof body.label === "string" &&
    CONDITION_FIELDS.has(body.conditionField as string) &&
    typeof body.conditionValue === "string" &&
    ACTION_TARGETS.has(body.actionTarget as string) &&
    ACTION_TYPES.has(body.actionType as string) &&
    typeof body.actionValue === "number"
  );
}

export default async (req: Request) => {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body || !validate(body)) {
      return badRequest(
        "Expected { label: string, conditionField: projectType|category|quality|mepComplexity, conditionValue: string, actionTarget: architecturalFee|engineeringFee|interiorFee|constructionCost, actionType: waive|percentDiscount, actionValue: number, enabled?: boolean, sortOrder?: number }",
      );
    }
    const [row] = await db
      .insert(pricingRules)
      .values({
        label: body.label,
        conditionField: body.conditionField,
        conditionValue: body.conditionValue,
        actionTarget: body.actionTarget,
        actionType: body.actionType,
        actionValue: body.actionValue,
        enabled: body.enabled ?? true,
        sortOrder: body.sortOrder ?? 0,
      })
      .returning();
    return json(row, { status: 201 });
  }

  if (req.method === "PUT") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number") return badRequest("Expected { id: number, ...fields }");
    const { id, ...fields } = body;
    if (fields.conditionField && !CONDITION_FIELDS.has(fields.conditionField)) return badRequest("Invalid conditionField");
    if (fields.actionTarget && !ACTION_TARGETS.has(fields.actionTarget)) return badRequest("Invalid actionTarget");
    if (fields.actionType && !ACTION_TYPES.has(fields.actionType)) return badRequest("Invalid actionType");
    const [row] = await db.update(pricingRules).set(fields).where(eq(pricingRules.id, id)).returning();
    if (!row) return notFound();
    return json(row);
  }

  if (req.method === "DELETE") {
    const body = await readJsonBody(req);
    if (!body || typeof body.id !== "number") return badRequest("Expected { id: number }");
    await db.delete(pricingRules).where(eq(pricingRules.id, body.id));
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = { path: "/api/admin/pricing-rules" };
