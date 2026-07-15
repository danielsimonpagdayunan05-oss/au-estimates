import { boolean, doublePrecision, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Generic key-value content store for all singular editable content:
 * hero copy, taglines, sample display figures, and every numeric parameter
 * the estimator's cost engine uses (rates, multipliers, fee tiers).
 * Keys are dot-namespaced, e.g. "hero.headline", "estimator.qualityMultipliers".
 */
export const settings = pgTable("settings", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: varchar("updated_by", { length: 255 }),
});

/** The animated stat cards on the landing page — an editable, reorderable list. */
export const statItems = pgTable("stat_items", {
  id: serial().primaryKey(),
  label: varchar("label", { length: 120 }).notNull(),
  value: doublePrecision("value").notNull(),
  prefix: varchar("prefix", { length: 20 }).notNull().default(""),
  suffix: varchar("suffix", { length: 20 }).notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Province/region cost multipliers used by the estimator — admin can add/edit/remove. */
export const provinces = pgTable("provinces", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  region: varchar("region", { length: 60 }).notNull(),
  multiplier: doublePrecision("multiplier").notNull().default(1),
  cities: jsonb("cities").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** Additional service line items offered in the wizard's services step. */
export const additionalServices = pgTable("additional_services", {
  id: varchar("id", { length: 60 }).primaryKey(),
  label: varchar("label", { length: 160 }).notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  feeType: varchar("fee_type", { length: 20 }).notNull(),
  value: doublePrecision("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** Portfolio / past-project showcase entries. */
export const portfolioItems = pgTable("portfolio_items", {
  id: serial().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 60 }),
  location: varchar("location", { length: 160 }),
  floorAreaSqm: doublePrecision("floor_area_sqm"),
  completionYear: integer("completion_year"),
  coverImageKey: varchar("cover_image_key", { length: 300 }),
  galleryImageKeys: jsonb("gallery_image_keys").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Lead / CRM records submitted from the estimator's client info form. */
export const leads = pgTable("leads", {
  id: serial().primaryKey(),
  status: varchar("status", { length: 30 }).notNull().default("New"),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  projectLocation: varchar("project_location", { length: 200 }),
  budget: varchar("budget", { length: 60 }),
  targetCompletion: varchar("target_completion", { length: 30 }),
  consultationDate: varchar("consultation_date", { length: 30 }),
  notes: text("notes"),
  selections: jsonb("selections").notNull(),
  estimate: jsonb("estimate").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type StatItem = typeof statItems.$inferSelect;
export type NewStatItem = typeof statItems.$inferInsert;
export type ProvinceRow = typeof provinces.$inferSelect;
export type NewProvinceRow = typeof provinces.$inferInsert;
export type AdditionalServiceRow = typeof additionalServices.$inferSelect;
export type NewAdditionalServiceRow = typeof additionalServices.$inferInsert;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type NewPortfolioItem = typeof portfolioItems.$inferInsert;
export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;
