import db from "@/db/drizzle";
import { words } from "@/db/schema";
import { asc } from 'drizzle-orm';
import { StringifyOptions } from "querystring";

export const addWord = async (text: string, definition: string, example: string) => {
  await db.insert(words).values({
    word: text,
    definition: definition,
    example: example,
  });
};

export const getWords = async () => {
  const data = await db.select().from(words);
  console.log("getWords server aciton: ", data);
  return data;
};

