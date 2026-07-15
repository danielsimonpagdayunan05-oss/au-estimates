import type { Config } from "@netlify/functions";
import { asc } from "drizzle-orm";
import { db } from "../../db/index";
import { additionalServices, portfolioItems, provinces, settings, statItems } from "../../db/schema";
import { json } from "./_shared/response";

export default async () => {
  const [settingsRows, stats, provinceRows, serviceRows, portfolio] = await Promise.all([
    db.select().from(settings),
    db.select().from(statItems).orderBy(asc(statItems.sortOrder)),
    db.select().from(provinces).orderBy(asc(provinces.sortOrder)),
    db.select().from(additionalServices).orderBy(asc(additionalServices.sortOrder)),
    db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder)),
  ]);

  const settingsMap: Record<string, unknown> = {};
  for (const row of settingsRows) settingsMap[row.key] = row.value;

  return json(
    { settings: settingsMap, stats, provinces: provinceRows, services: serviceRows, portfolio },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } },
  );
};

export const config: Config = { path: "/api/site-data" };
