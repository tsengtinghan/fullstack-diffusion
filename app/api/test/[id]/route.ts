export async function POST(req:Request, { params }: { params: { slug: string }}) {
    let slug = params.slug
    console.log(slug)
    let res = Response.json({ body: slug }, { status: 201 })
    return res
  }
  