import 'server-only'

import { cookies } from 'next/headers'
import { client } from './client'
import { translateText } from '@/lib/translate'

async function translateObject(obj: any, targetLang: 'en' | 'te' | 'ten'): Promise<any> {
  if (!obj) return obj

  if (typeof obj === 'string') {
    // Skip technical strings like dates, URLs, assets, image reference IDs
    if (
      obj.startsWith('http') || 
      /^\d{4}-\d{2}-\d{2}/.test(obj) || 
      obj.startsWith('image-') ||
      obj.startsWith('file-')
    ) {
      return obj
    }
    return await translateText(obj, targetLang)
  }

  if (Array.isArray(obj)) {
    return await Promise.all(obj.map(item => translateObject(item, targetLang)))
  }

  if (typeof obj === 'object') {
    // Backward compatibility: If it is an old localized field object { en, te, ten }
    if ('en' in obj || 'te' in obj || 'ten' in obj) {
      const val = obj[targetLang] || obj['en'] || obj['te'] || obj['ten']
      return await translateObject(val, targetLang)
    }

    if (obj._type === 'slug') {
      return obj
    }

    const newObj: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (
        key.startsWith('_') || 
        key === 'slug' || 
        key === 'speechUrl' || 
        key === 'url' || 
        key === 'youtube' || 
        key === 'instagram' || 
        key === 'twitter' || 
        key === 'email' || 
        key === 'phone' ||
        key === 'asset'
      ) {
        newObj[key] = value
      } else {
        newObj[key] = await translateObject(value, targetLang)
      }
    }
    return newObj
  }

  return obj
}

export async function sanityFetch<
  Response = any,
  const QueryString extends string = string,
>({
  query,
  params = {},
  revalidate = 0, // Disable Next.js data caching by default for live CMS updates
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

    // Determine target language from client cookie
    let targetLang: 'en' | 'te' | 'ten' = 'en'
    try {
      const cookieStore = await cookies()
      const langCookie = cookieStore.get('user-language')?.value
      if (langCookie === 'en' || langCookie === 'te' || langCookie === 'ten') {
        targetLang = langCookie
      }
    } catch (e) {
      // Ignore headers errors in static build time
    }

    // Server-side translate the Sanity response object
    return await translateObject(result, targetLang)
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
