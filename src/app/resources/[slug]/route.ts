const RESOURCE_BASE_URL = process.env.RESOURCE_BASE_URL

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const isNoStore = request.cache === 'no-store'

  const response = await fetch(`${RESOURCE_BASE_URL}/${slug}`, {
    cache: isNoStore ? 'no-store' : undefined,
  })

  if (response.status === 404) {
    return new Response('Not found', { status: 404 })
  }

  return response
}
