"use client";
import { useState, FormEvent } from "react";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
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
    <div className={styles.container}>
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

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input type="text" name="prompt" placeholder="Enter a word" />
        <Button type="submit">Go!</Button>
      </form>
      <Card>
        <CardHeader>Word</CardHeader>
        <Label htmlFor="Definition">
          Definition
        </Label>
      </Card>

      {error && <div>{error}</div>}

      {prediction && (
        <div>
          {prediction.output && (
            <div className={styles.imageWrapper}>
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="50vh"
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
