"use client";
import { useState, FormEvent, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { type } from "os";

interface PredictionResponse {
  id?: string;
  status?: "succeeded" | "failed";
  output?: string[];
  detail?: string;
}

interface WordResponse {
  word: string;
  definition: string;
  example: string;
}

async function pollPrediction(predictionId: string) {
  let attempts = 0;
  const maxAttempts = 600;
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
    if (response.status !== 200) {
      throw new Error(`Polling error: ${prediction.detail}`);
    }

    if (prediction.status === "succeeded" || prediction.status === "failed") {
      return prediction;
    }

    console.log("Polling...");
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [wordState, setWord] = useState<WordResponse | null>({
    word: "Auspicous",
    definition:
      "Conducive to success; favorable or giving or being a sign of future success.",
    example:
      "The clear skies on the morning of our outdoor event were an auspicious sign for a successful day.",
  });


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

      <p>
        Dream something with{" "}
        <Link href="https://replicate.com/stability-ai/stable-diffusion">
          SDXL
        </Link>
        :
      </p>

      <form className="flex mb-8" onSubmit={handleSubmit}>
        <input
          type="text"
          name="prompt"
          placeholder="Enter a word"
          className="flex-1 p-4 border border-black rounded-sm text-base mr-4 text-gray-800"
        />
        <button
          type="submit"
          className="p-4 rounded-sm cursor-pointer text-lg bg-blue-500 hover:bg-blue-600 text-white"
        >
          Go!
        </button>
      </form>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{wordState?.word}</CardTitle>
        </CardHeader>
        <CardContent className="grid w-full items-center gap-2">
          <Label htmlFor="Definition" className="font-bold">
            Definition
          </Label>
          <p className="text-sm">{wordState?.definition}</p>
          <Label htmlFor="Example Sentence" className="font-bold">
            Example Sentence
          </Label>
          <p className="text-sm">{wordState?.example}</p>

          <div className="overflow-hidden rounded-md">
            <Image
              src={
                prediction && prediction.output
                  ? prediction.output[prediction.output.length - 1]
                  : "/auspicious.png"
              }
              alt="word"
              width={300}
              height={300}
            />
          </div>
        </CardContent>
      </Card>

      {error && <div>{error}</div>}
    </div>
  );
}
