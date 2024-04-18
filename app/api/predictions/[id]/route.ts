// export async function GET(req:Request, { params }: { params: { id: string }}) {
//   const response = await fetch(
//     "https://api.replicate.com/v1/predictions/" + params.id,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   let res;
//   if (response.status !== 200) {
//     let error = await response.json();
//     res = Response.json({ error: error.detail }, { status: 500 })
//     return res;
//   }

//   const prediction = await response.json();
//   res = Response.json(prediction, { status: 200 })
//   return res
// }
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export async function GET(request: Request,
  { params }: { params: { id: string } }) {
  const prediction = await replicate.predictions.get(params.id);

  if (prediction?.error) {
    return new Response(
      JSON.stringify({ detail: prediction.error.detail }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify(prediction),
    { status: 200 }
  );
}