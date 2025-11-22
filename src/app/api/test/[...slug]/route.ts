// app/api/test/[...slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  return Response.json({ 
    message: "Catch-all works!",
    slug: params.slug 
  });
}