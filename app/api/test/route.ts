export async function POST(req:Request) {
  const { name } = await req.json()
  const res = Response.json({ message: "Hello - GET" + name }, { status: 200 })
  return res;
}