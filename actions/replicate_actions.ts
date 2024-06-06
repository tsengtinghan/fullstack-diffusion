const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export async function pollPrediction(predictionId: string) {
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