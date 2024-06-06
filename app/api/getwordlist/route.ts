import { getWords } from "@/actions/wordactions";

export async function GET(req:Request) {
  const words = await getWords();
  console.log("api get words: ", words);
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