'use client';
import { useState, FormEvent } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

// Define TypeScript interfaces for the predictions and errors
interface Prediction {
  id: string;
  status: "succeeded" | "failed" | "pending";
  detail?: string;
  output?: string[];
}

interface Error {
  detail: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Home: React.FC = () => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
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

    let predictionResponse = await response.json() as Prediction;
    if (response.status !== 201) {
      setError(predictionResponse.detail || "Unknown error");
      return;
    }
    setPrediction(predictionResponse);

    while (
      predictionResponse.status === "pending"
    ) {
      await sleep(1000);
      const pollResponse = await fetch("/api/predictions/" + predictionResponse.id);
      predictionResponse = await pollResponse.json() as Prediction;
      if (pollResponse.status !== 200) {
        setError(predictionResponse.detail || "Failed to fetch status");
        return;
      }
      console.log({ prediction: predictionResponse });
      setPrediction(predictionResponse);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <p>
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">SDXL</a>:
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="prompt" placeholder="Enter a prompt to display an image" />
        <button type="submit">Go!</button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <div>
            {prediction.output && (
              <div className={styles.imageWrapper}>
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes='100vw'
              />
              </div>
            )}
            <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
