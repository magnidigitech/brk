import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AIAssistant from '@/components/AIAssistant'
import { sanityFetch } from '@/sanity/lib/sanityFetch'

// Fetch site settings server-side so Navbar and Footer never need client-side Sanity calls
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let siteSettings: any = null

  try {
    siteSettings = await sanityFetch<any>({
      query: `*[_type == "siteSettings"][0] {
        candidateName,
        roleBadge,
        tagline,
        socialLinks,
        delhiOffice,
        stateOffice
      }`
    })
  } catch (err) {
    console.error('Failed to fetch siteSettings for layout:', err)
  }

  return (
    <>
      <Navbar siteSettings={siteSettings} />
      <main className="flex-grow">{children}</main>
      <Footer siteSettings={siteSettings} />
      <AIAssistant siteSettings={siteSettings} />
    </>
  )
}
