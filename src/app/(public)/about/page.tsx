import { sanityFetch } from '@/sanity/lib/client'
import AboutClient from '@/components/AboutClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export default async function AboutPage() {
  let aboutData: any = {}
  let siteSettings: any = {}

  try {
    const [fetchedAbout, fetchedSettings] = await Promise.all([
      sanityFetch<any>({
        query: `*[_type == "aboutPage"][0] {
          title,
          subtitle,
          badgeText,
          profileShortName,
          bioParagraph1,
          bioParagraph2,
          eduTitle,
          eduContent,
          publicTitle,
          publicContent,
          focusAreas,
          values,
          quoteText,
          quoteAuthor,
          summaryContent
        }`
      }),
      sanityFetch<any>({
        query: `*[_type == "siteSettings"][0] {
          partyName,
          stateRepresented,
          roleBadge
        }`
      })
    ])

    aboutData = fetchedAbout || {}
    siteSettings = fetchedSettings || {}
  } catch (error) {
    console.error('Failed to fetch from Sanity, using default local data:', error)
  }

  return (
    <AboutClient data={aboutData} siteSettings={siteSettings} />
  )
}
