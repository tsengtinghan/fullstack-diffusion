import { serial, text, pgTable, integer, uuid } from "drizzle-orm/pg-core";

export const words = pgTable("words", {
  id: serial('id').primaryKey(),
  word: text("word").notNull(),
  definition: text("definition").notNull(),
  example: text("example").notNull(),
});