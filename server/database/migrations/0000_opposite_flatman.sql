CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`authorized` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`word` text NOT NULL,
	`created_at` integer NOT NULL
);
