export async function POST(req:Request) {
  const { prompt } = await req.json()
  const res = Response.json({ message: "Hello - GET" + prompt }, { status: 200 })
  return res;
}