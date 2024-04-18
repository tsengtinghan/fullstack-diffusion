export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  console.log(params.slug);
  let res = Response.json({ body: "hi" }, { status: 201 });
  return res;
}
