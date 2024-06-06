ALTER TABLE "words" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "url" text;