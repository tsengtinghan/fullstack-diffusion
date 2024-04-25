"use client";
import { useState, FormEvent } from "react";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

interface PredictionResponse {
  id?: string;
  status?: "succeeded" | "failed";
  output?: string[];
  detail?: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      prompt: { value: string };
    };
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);
    console.log({ prediction });

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id, {
        cache: "no-store",
      });
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log("polling");
      console.log(prediction);
      setPrediction(prediction);
    }
  };

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
          <CardTitle>Word</CardTitle>
        </CardHeader>
        <CardContent className="grid w-full items-center gap-1">
          <Label htmlFor="Definition" className="font-bold">
            Definition
          </Label>
          <p className="text-sm">
            The word "auspicious" is an adjective that means conducive to
            success; favorable or giving or being a sign of future success. It
            is often used to describe situations, events, or times that seem
            likely to produce a positive outcome.
          </p>
          <Label htmlFor="Example Sentence" className="font-bold">
            Example Sentence
          </Label>
          <p className="text-sm">
            The clear skies on the morning of our outdoor event were an
            auspicious sign for a successful day.
          </p>
          <Image
            src="https://replicate.delivery/pbxt/Nv4mzfPIfWoLAk3nd156cubvvF4tq7NM1aQgzekX1dTy60blA/out-0.png"
            alt="word"
            width={300}
            height={300}
          />
        </CardContent>
      </Card>

      {error && <div>{error}</div>}

      {prediction && (
        <div>
          {prediction.output && (
            <div className="w-full relative aspect-square">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="Generated Image"
                sizes="50vw"
              />
            </div>
          )}
          <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}
