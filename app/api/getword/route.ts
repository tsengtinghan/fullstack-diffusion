import OpenAI from "openai";
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
  const theResponse = completion.choices[0].message.content;

  return new Response(JSON.stringify(theResponse) , { status: 200 });
}
