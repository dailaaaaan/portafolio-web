CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`relationship` text NOT NULL,
	`message` text NOT NULL,
	`locale` text NOT NULL,
	`approved` integer DEFAULT false NOT NULL,
	`is_seed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
