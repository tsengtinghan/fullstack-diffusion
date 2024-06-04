import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const todo = pgTable("words", {
  id: integer("id").primaryKey(),
  word: text("word").notNull(),
});