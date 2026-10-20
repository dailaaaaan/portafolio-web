CREATE TABLE `rate_limits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `testimonials` ALTER COLUMN "role" TO "role" text;--> statement-breakpoint
ALTER TABLE `testimonials` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch());