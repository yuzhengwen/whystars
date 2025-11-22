// app/api/test/[...slug]/route.ts

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const dynamicParams = true; // Add this

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string[] }> }
) {
  const params = await props.params;
  return Response.json({ 
    message: "Catch-all works!",
    slug: params.slug 
  });
}