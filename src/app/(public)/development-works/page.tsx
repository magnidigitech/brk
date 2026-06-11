import { sanityFetch } from '@/sanity/lib/client'
import DevelopmentWorksClient from '@/components/DevelopmentWorksClient'

export const revalidate = 3600 // Cache static page for 1 hour

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
    console.error('Failed to fetch development projects from Sanity, using defaults:', error)
  }

  // Fallback defaults if Sanity database is empty
  const displayProjects = projects.length > 0 ? projects : [
    {
      category: 'Infrastructure',
      title: 'Drinking Water Pipeline Project',
      location: 'Drought-Prone Rural Zones',
      desc: 'Approved pipeline blueprint to bring potable tap water infrastructure to several villages in the dry belt regions.',
      progress: 'Planning & Mapping Phase'
    },
    {
      category: 'Agriculture & Power',
      title: 'Solar Irrigation Subsidy Advocate',
      location: 'Agricultural Belts',
      desc: 'Led a Rajya Sabha appeal to accelerate solar-pump allocations and state-level minor irrigation fund speed.',
      progress: 'Policy Under Discussion'
    },
    {
      category: 'Healthcare',
      title: 'Rural Trauma Center Allocations',
      location: 'Regional Highways',
      desc: 'Secured national health grants for community diagnostic labs and high-quality emergency treatment zones.',
      progress: 'Fund Sanctioned'
    },
    {
      category: 'Digital Access',
      title: 'Rural Fiber-Grid Connectivity Loop',
      location: 'Secondary Villages',
      desc: 'Advocated for optic-fiber secondary loop installations to provide stable wireless network hotspots in village wards.',
      progress: 'Under Review'
    }
  ]

  return (
    <DevelopmentWorksClient projects={displayProjects} />
  )
}
