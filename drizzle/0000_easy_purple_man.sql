CREATE TABLE IF NOT EXISTS "words" (
	"id" serial PRIMARY KEY,
	"word" text NOT NULL,
	"definition" text NOT NULL,
	"example" text NOT NULL
);
