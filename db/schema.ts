import { serial, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const words = pgTable("words", {
  id: serial('id').primaryKey(),
  word: text("word").notNull(),
});