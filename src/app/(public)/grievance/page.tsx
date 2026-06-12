import GrievanceClient from '@/components/GrievanceClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.grievance.title'][lang] || uiTranslations['meta.grievance.title']['en']
  const description = uiTranslations['meta.grievance.desc'][lang] || uiTranslations['meta.grievance.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bramakrishna.mp.in/grievance',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in/grievance',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': lang === 'te' ? 'హోమ్' : 'Home',
        'item': 'https://bramakrishna.mp.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': lang === 'te' ? 'ప్రజా ఫిర్యాదుల పోర్టల్' : 'Grievance Portal',
        'item': 'https://bramakrishna.mp.in/grievance'
      }
    ]
  }

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': lang === 'te' ? 'ప్రజా ఫిర్యాదుల పోర్టల్ | శ్రీ భాష్యం రామకృష్ణ' : 'Public Grievance Portal | Shri Bhashyam Ramakrishna',
    'description': lang === 'te' ? 'సమస్యలు, సలహాలను నేరుగా మా కార్యాలయానికి పంపండి.' : 'Submit local challenges, community requests, or suggestions directly to our office.',
    'url': 'https://bramakrishna.mp.in/grievance',
    'mainEntity': {
      '@type': 'GovernmentOffice',
      'name': 'Shri Bhashyam Ramakrishna Camp Office',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Door No. 40-5-1, MG Road, Labbipet',
        'addressLocality': 'Vijayawada',
        'addressRegion': 'Andhra Pradesh',
        'postalCode': '520010',
        'addressCountry': 'IN'
      }
    }
  }

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, contactPageSchema]} />
      <GrievanceClient />
    </>
  )
}
