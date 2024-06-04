import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const todo = pgTable("word", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
});