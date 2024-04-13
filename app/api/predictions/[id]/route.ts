export async function POST(req:Request, { params }: { params: { slug: string }}) {
  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + params.slug,
    {
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  let res;
  if (response.status !== 200) {
    let error = await response.json();
    res = Response.json({ error: error.detail }, { status: 500 })
    return res;
  }

  const prediction = await response.json();
  res = Response.json(prediction, { status: 200 })
  return res
}
