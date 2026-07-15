CREATE TABLE "additional_services" (
	"id" varchar(60) PRIMARY KEY,
	"label" varchar(160) NOT NULL,
	"category" varchar(40) NOT NULL,
	"fee_type" varchar(20) NOT NULL,
	"value" double precision NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY,
	"status" varchar(30) DEFAULT 'New' NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(200) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"project_location" varchar(200),
	"budget" varchar(60),
	"target_completion" varchar(30),
	"consultation_date" varchar(30),
	"notes" text,
	"selections" jsonb NOT NULL,
	"estimate" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" serial PRIMARY KEY,
	"title" varchar(200) NOT NULL,
	"description" text,
	"category" varchar(60),
	"location" varchar(160),
	"floor_area_sqm" double precision,
	"completion_year" integer,
	"cover_image_key" varchar(300),
	"gallery_image_keys" jsonb DEFAULT '[]' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provinces" (
	"id" serial PRIMARY KEY,
	"name" varchar(120) NOT NULL UNIQUE,
	"region" varchar(60) NOT NULL,
	"multiplier" double precision DEFAULT 1 NOT NULL,
	"cities" jsonb DEFAULT '[]' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(255) PRIMARY KEY,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "stat_items" (
	"id" serial PRIMARY KEY,
	"label" varchar(120) NOT NULL,
	"value" double precision NOT NULL,
	"prefix" varchar(20) DEFAULT '' NOT NULL,
	"suffix" varchar(20) DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
