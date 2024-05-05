export async function GET(req:Request) {
  const res = Response.json({ 
    word: "test",
    definition: "test",
    example: "test",
    url: "test"
}, { status: 200 })
  return res;
}