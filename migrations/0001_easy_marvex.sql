CREATE TABLE `resource` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`code` text NOT NULL,
	`model` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE no action
);
