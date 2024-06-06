import { serial, text, pgTable, integer, uuid } from "drizzle-orm/pg-core";

export const words = pgTable("words", {
  id: uuid("id").primaryKey().defaultRandom(),
  word: text("word").notNull(),
  definition: text("definition").notNull(),
  example: text("example").notNull(),
  url: text("url"),
});