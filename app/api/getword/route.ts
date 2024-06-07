import OpenAI from "openai";
import { addWord } from "@/actions/wordactions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const jsonString = JSON.stringify({
    word: "auspicious",
    definition:
      "Conducive to success; favorable or giving or being a sign of future success.",
    example:
      "The clear skies on the morning of our outdoor event were an auspicious sign for a successful day.",
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "you will receive a word and you will respond with a json that has three elements: the word itself, the definition of the word, and an example sentence of that word. For example you receive: auspicious, you'll reply:" +
          jsonString,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  console.log(completion.choices[0].message.content);
  if(completion.choices[0].message.content) {
    const theResponse = JSON.parse(completion.choices[0].message.content);
    const newWord = await addWord(theResponse.word, theResponse.definition, theResponse.example, "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDQ2ZTNuenIzYXZ5cXJqMDNydTdrZHg4bGoweTByODlhZ29jeGl6cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/K9GWAtJoaaIy7vSCW8/giphy.gif");
    theResponse.id = newWord[0].id;
    return new Response(JSON.stringify(theResponse) , { status: 200 });
  }
}
