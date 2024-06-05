import { getWords } from "@/actions/wordactions";

export async function GET(req:Request) {
  const words = await getWords();
  console.log("api get words: ", words);
  const res = Response.json({ 
    words: words.map((word) => ({
      word: word.word,
    })),
}, { status: 200 })
  return res;
}