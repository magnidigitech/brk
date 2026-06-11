import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always fetch live data, no CDN caching
  timeout: 10000,
})

export async function sanityFetch<
  Response = any,
  const QueryString extends string = string,
>({
  query,
  params = {},
  revalidate = 3600, // Cache content for 1 hour by default
  tags = [],
}: {
  query: QueryString
  params?: Record<string, any>
  revalidate?: number | false
  tags?: string[]
}): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // Abort connection attempt after 10 seconds

  try {
    const result = await client.fetch(query, params, {
      next: {
        revalidate,
        tags,
      },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return result
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
