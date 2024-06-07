"use client";
import { useState, FormEvent, useEffect, use } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Vocab from "@/components/ui/vocab";
import { pollPrediction } from "@/actions/replicate_actions";
import Image from "next/image";

interface PredictionResponse {
  id?: string;
  status?: "succeeded" | "failed";
  output?: string[];
  detail?: string;
  logs?: string;
}

interface WordResponse {
  word: string;
  definition: string;
  example: string;
}

interface WordWithUrl extends WordResponse {
  url: string;
  isLoading?: boolean;
}

interface WordListResponse {
  words: WordWithUrl[];
}

async function getWordList(): Promise<WordListResponse> {
  const response = await fetch("/api/getwordlist", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const wordList = await response.json();
  return wordList;
}

export default function Home() {
  const [wordList, setWordList] = useState<WordListResponse | null>(null);
  useEffect(() => {
    getWordList().then((wordList) => {
      setWordList(wordList);
      console.log(wordList);
    });
  }, []);

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      prompt: { value: string };
    };

    const tempWord: WordWithUrl = {
      word: target.prompt.value,
      definition: "Loading definition...",
      example: "Loading example...",
      url: URL.createObjectURL(new Blob([])), // Placeholder URL, adjust as needed
      isLoading: true,
    };
    setWordList((prevState) => ({
      words: [...(prevState?.words || []), tempWord],
    }));
    try {
      // Parallel requests
      const [predictionResponse, wordResponse] = await Promise.all([
        fetch("/api/predictions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: target.prompt.value }),
          // improve prompt
        }),
        fetch("/api/getword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: target.prompt.value }),
        }),
      ]);

      let predictionJson = await predictionResponse.json();
      let wordJson = await wordResponse.json();
      setPrediction(predictionJson);

      setWordList((current) => {
        return {
          words: current!.words.map((word) =>
            word.isLoading && word.word === tempWord.word
              ? { ...wordJson, url: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDQ2ZTNuenIzYXZ5cXJqMDNydTdrZHg4bGoweTByODlhZ29jeGl6cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/K9GWAtJoaaIy7vSCW8/giphy.gif", isLoading: false } 
              : word
          ),
        };
      });

      getWordList().then((newWordList) => {
        setWordList(newWordList);
      });

      if (predictionResponse.status !== 201) {
        setError(`Prediction error: ${predictionJson.detail}`);
        return;
      }

      if (wordResponse.status !== 200) {
        setError(`Word fetch error: ${wordJson.detail}`);
        return;
      }

      if (predictionJson && predictionJson.id) {
        console.log("Polling started...");
        const finalPrediction = await pollPrediction(predictionJson.id);
        setPrediction(finalPrediction);
        await fetch("/api/uploadimage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: wordJson.id,
            imageUrl: finalPrediction.output[0],
          }),
        });
        const updatedWordList = await getWordList();
        setWordList(updatedWordList);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error(
        "Error during the prediction and word fetch process:",
        error
      );
    }
  }

  return (
    <div className="p-8 text-lg max-w-4xl mx-auto">
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <p className="pb-4">Add a new word:</p>

      <form className="flex mb-8" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="prompt"
          placeholder="Enter a word"
          className="flex-1 p-4 border border-black rounded-sm text-base mr-4 text-gray-800"
        />
        <Button
          type="submit"
          className="p-4 rounded-sm cursor-pointer text-lg bg-blue-500 hover:bg-blue-600 text-white"
        >
          Go!
        </Button>
      </form>

      {wordList && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wordList.words.map((word) => (
            <Vocab key={word.url} wordState={word} />
          ))}
        </div>
      )}

      {prediction && <div className="text-sky-600">{prediction.status}</div>}
      <p className="mt-5">
        {" "}
        image generation can take up to 10s... Stop generating image after I run
        out of free credits.
      </p>

      {error && <div>{error}</div>}
    </div>
  );
}
