import type { Config } from "@netlify/functions";
import { asc } from "drizzle-orm";
import { db } from "../../db/index";
import { additionalServices, portfolioItems, pricingRules, provinces, settings, statItems } from "../../db/schema";
import { json } from "./_shared/response";

export default async () => {
  const [settingsRows, stats, provinceRows, serviceRows, portfolio, pricingRuleRows] = await Promise.all([
    db.select().from(settings),
    db.select().from(statItems).orderBy(asc(statItems.sortOrder)),
    db.select().from(provinces).orderBy(asc(provinces.sortOrder)),
    db.select().from(additionalServices).orderBy(asc(additionalServices.sortOrder)),
    db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder)),
    db.select().from(pricingRules).orderBy(asc(pricingRules.sortOrder)),
  ]);

  const settingsMap: Record<string, unknown> = {};
  for (const row of settingsRows) settingsMap[row.key] = row.value;

  // No caching: the admin dashboard re-fetches this same endpoint immediately after every
  // save to confirm it took. Any CDN/browser caching here (this used to be a 30s/300s SWR
  // cache) means that immediate re-fetch can be served the pre-edit response, making a
  // successful save look like it silently reverted.
  return json(
    { settings: settingsMap, stats, provinces: provinceRows, services: serviceRows, portfolio, pricingRules: pricingRuleRows },
    { headers: { "Cache-Control": "no-store" } },
  );
};

export const config: Config = { path: "/api/site-data" };
