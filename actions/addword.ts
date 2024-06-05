import db from "@/db/drizzle";
import { words } from "@/db/schema";
export const addWord = async (text: string) => {
  await db.insert(words).values({
    word: text,
  });
};

