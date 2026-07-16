CREATE TABLE "pricing_rules" (
	"id" serial PRIMARY KEY,
	"label" varchar(200) NOT NULL,
	"condition_field" varchar(40) NOT NULL,
	"condition_value" varchar(120) NOT NULL,
	"action_target" varchar(40) NOT NULL,
	"action_type" varchar(20) NOT NULL,
	"action_value" double precision DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
