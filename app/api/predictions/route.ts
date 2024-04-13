import { type NextRequest, NextResponse  } from 'next/server'
export async function POST(req:NextRequest) {
  const { prompt } = await req.json()
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/sdxl
      version:
        "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: prompt },
    }),
  });
  let res;
  if (response.status !== 201) {
    let error = await response.json();
    res = Response.json({ error: error.detail }, { status: 500 })
    return res;
  }

  const prediction = await response.json();
  res = Response.json(prediction, { status: 201 })
  return res
}
