import { sanityFetch } from '@/sanity/lib/sanityFetch'
import DevelopmentWorksClient from '@/components/DevelopmentWorksClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export default async function DevelopmentWorksPage() {
  let projects: any[] = []

  try {
    const fetchedProjects = await sanityFetch<any[]>({
      query: `*[_type == "developmentProject"] | order(order asc) {
        _id,
        category,
        title,
        location,
        desc,
        progress
      }`
    })
    projects = fetchedProjects || []
  } catch (error) {
    console.error('Failed to fetch development projects from Sanity:', error)
  }

  return (
    <DevelopmentWorksClient projects={projects} />
  )
}
