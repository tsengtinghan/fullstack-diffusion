import db from "@/db/drizzle";
import { words } from "@/db/schema";
export const addWord = async (id: number, text: string) => {
  await db.insert(words).values({
    id: id,
    word: text,
  });
};

