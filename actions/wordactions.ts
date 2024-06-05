import db from "@/db/drizzle";
import { words } from "@/db/schema";
import { asc } from 'drizzle-orm';

export const addWord = async (text: string) => {
  await db.insert(words).values({
    word: text,
  });
};

export const getWords = async () => {
  const data = await db.select().from(words);
  console.log("getWords server aciton: ", data);
  return data;
};

