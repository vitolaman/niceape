CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`user_id` text,
	`banner_url` text,
	`image_url` text,
	`token_name` text,
	`token_ticker` text,
	`token_image_url` text,
	`campaign_goal` integer DEFAULT 0,
	`category_id` text,
	`charity_wallet_address` text,
	`raised_value` integer DEFAULT 0,
	`short_description` text,
	`long_description` text,
	`website_url` text,
	`x_handle` text,
	`telegram_handle` text
);
--> statement-breakpoint
CREATE TABLE `master_categories` (
	`id` text,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`bio` text,
	`wallet_address` text,
	`x_handle` text,
	`created_at` text,
	`total_trade` integer,
	`volume_trade` integer,
	`charity_impact` integer
);
