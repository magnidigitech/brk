import { sanityFetch } from '@/sanity/lib/client'
import StateFocusClient from '@/components/StateFocusClient'

export const revalidate = 3600 // Cache static page for 1 hour

export default async function StateFocusPage() {
  let sectors: any[] = []

  try {
    const fetchedSectors = await sanityFetch<any[]>({
      query: `*[_type == "stateSector"] | order(order asc) {
        _id,
        title,
        short,
        iconName,
        vision,
        concerns
      }`
    })
    sectors = fetchedSectors || []
  } catch (error) {
    console.error('Failed to fetch state sectors from Sanity, using defaults:', error)
  }

  // Fallback default sectors if Sanity database is empty
  const displaySectors = sectors.length > 0 ? sectors : [
    {
      _id: 'education',
      title: 'Education',
      short: 'Modernizing primary schools and promoting digital labs in high schools.',
      iconName: 'BookOpen',
      vision: 'Establishing smart classrooms in rural public schools, enhancing vocational and skill-oriented secondary courses, and expanding college fellowship funds.',
      concerns: ['Digital divide in remote rural government schools.', 'Need for updated market-aligned curriculum in polytechnic colleges.']
    },
    {
      _id: 'healthcare',
      title: 'Healthcare',
      short: 'Supporting primary medical centers and state health facilities.',
      iconName: 'HeartPulse',
      vision: 'Advocating for central grants to build state-of-the-art trauma centers, increasing funding for community clinics, and improving drinking water sanitation to prevent local water-borne illnesses.',
      concerns: ['Shortage of specialist doctors in taluk and block level clinics.', 'Clean drinking water access in arid zones.']
    },
    {
      _id: 'agriculture',
      title: 'Agriculture',
      short: 'Expanding solar irrigation, cold storage facilities, and fair crop subsidies.',
      iconName: 'Sprout',
      vision: 'Encouraging minor irrigation projects, solar-powered pump distribution, setting up food processing units close to farming fields, and ensuring prompt settlement of crop insurance claims.',
      concerns: ['Erratic monsoon rains and lack of storage facilities leading to waste.', 'Inadequate market access for minor forest produce cultivators.']
    },
    {
      _id: 'infrastructure',
      title: 'Infrastructure',
      short: 'Pushing for highway connectivity and industrial port upgrades.',
      iconName: 'Navigation',
      vision: 'Driving policies to construct secondary road links connecting farming villages to national highways, and pushing for faster execution of coastal highway corridors.',
      concerns: ['Maintenance gaps in rural arterial roads.', 'Congestion near major transport checkposts.']
    },
    {
      _id: 'employment',
      title: 'Employment',
      short: 'Promoting vocational skill centers and startup ecosystems.',
      iconName: 'Briefcase',
      vision: 'Supporting training institutes that focus on modern skills like green-energy technicians, solar installers, and digital support assistants.',
      concerns: ['Under-employment among educated youth in tier-2 towns.', 'Lack of localized tech incubator spaces.']
    },
    {
      _id: 'welfare',
      title: 'Women & Youth Welfare',
      short: 'Empowering self-help groups and youth sports development.',
      iconName: 'Users',
      vision: 'Strengthening credit access for rural women self-help networks, expanding scholarship reach, and establishing rural sports development fields.',
      concerns: ['Drop-out rates among female students in higher secondary schools.', 'Underfunded local community centers.']
    },
    {
      _id: 'digital',
      title: 'Digital Development',
      short: 'Bringing fiber-grid loops to remote villages.',
      iconName: 'Cpu',
      vision: 'Ensuring 100% network connectivity in public offices, advocating for cheaper broadband infrastructure, and establishing local common service kiosks.',
      concerns: ['Incomplete telecom loop infrastructure in interior villages.', 'Digital literacy gaps among senior citizens.']
    },
    {
      _id: 'environment',
      title: 'Environment',
      short: 'Promoting afforestation and clean river initiatives.',
      iconName: 'Leaf',
      vision: 'Fostering community-led afforestation, campaigning against industrial river discharges, and boosting renewable solar panel farms.',
      concerns: ['Depletion of ground water tables.', 'Plastic accumulation in river basins.']
    }
  ]

  return (
    <StateFocusClient sectors={displaySectors} />
  )
}
