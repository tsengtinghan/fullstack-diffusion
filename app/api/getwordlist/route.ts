import { getWords } from "@/actions/wordactions";

export const revalidate = 0

export async function GET(req:Request) {
  const words = await getWords();
  const res = Response.json({ 
    words: words.map((word) => ({
      word: word.word,
      definition: word.definition,
      example: word.example,
      url: word.url,
    })),
}, { status: 200 })
  return res;
}