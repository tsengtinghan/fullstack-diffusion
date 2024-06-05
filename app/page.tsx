"use client";
import { useState, FormEvent, useEffect, use } from "react";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { type } from "os";
import Vocab from "@/components/ui/vocab";
import { addWord } from "@/actions/wordactions";

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
}

interface WordListResponse {
  words: WordWithUrl[];
}

async function pollPrediction(predictionId: string) {
  let attempts = 0;
  const maxAttempts = 300;
  while (true) {
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error("Max polling attempts reached.");
    }

    await sleep(1000);

    const response = await fetch(`/api/predictions/${predictionId}`, {
      cache: "no-store",
    });

    const prediction = await response.json();
    console.log(prediction.status);
    console.log(prediction);
    if (response.status !== 200) {
      throw new Error(`Polling error: ${prediction.detail}`);
    }

    if (prediction.status === "succeeded" || prediction.status === "failed") {
      return prediction;
    }

    console.log("Polling...");
  }
}

async function getWordList(): Promise<WordListResponse> {
  const response = await fetch("/api/getwordlist", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const wordList = await response.json();
  return wordList;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [wordList, setWordList] = useState<WordListResponse | null>(null);
  useEffect(() => {
    getWordList().then((wordList) => {
      setWordList(wordList);
      console.log(wordList);
      setWord(wordList.words[0]);
    });
  }, []);

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [wordState, setWord] = useState<WordResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      prompt: { value: string };
    };

    try {
      // Parallel requests
      const [predictionResponse, wordResponse] = await Promise.all([
        fetch("/api/predictions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: target.prompt.value }),
        }),
        fetch("/api/getword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: target.prompt.value }),
        }),
      ]);

      let predictionJson = await predictionResponse.json();
      const wordText = await wordResponse.text(); // Get the response as text first to log it
      console.log("Raw response text:", wordText); // This will show exactly what the server sent
      const wordJson = JSON.parse(wordText);

      if (predictionResponse.status !== 201) {
        setError(`Prediction error: ${predictionJson.detail}`);
        return;
      }

      if (wordResponse.status !== 200) {
        setError(`Word fetch error: ${wordJson.detail}`);
        return;
      }

      setPrediction(predictionJson);
      setWord(wordJson);

      console.log(predictionJson, prediction);
      console.log(wordJson, wordState);

      if (predictionJson && predictionJson.id) {
        console.log("Polling started...");
        const finalPrediction = await pollPrediction(predictionJson.id);
        setPrediction(finalPrediction);
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

      {/* {wordState && <Vocab wordState={wordState} prediction={prediction} />} */}

      {wordList && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wordList.words.map((word) => (
            <Vocab wordState={word} /> 
          ))}
        </div>
      )}

      {prediction && <div className="text-sky-600">{prediction.status}</div>}
      <p>
        {" "}
        image generation can take up to 10s... Stop generating image after I run
        out of free credits.
      </p>

      {error && <div>{error}</div>}
    </div>
  );
}
