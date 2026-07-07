import { sanityFetch } from '@/sanity/lib/sanityFetch'
import ContactClient from '@/components/ContactClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.contact.title'][lang] || uiTranslations['meta.contact.title']['en']
  const description = uiTranslations['meta.contact.desc'][lang] || uiTranslations['meta.contact.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bhashyamramakrishna.in/contact',
    },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/contact',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function ContactPage() {
  let settings = {
    delhiOffice: {
      address: '12, Rajya Sabha Members Residences, New Delhi - 110001',
      phone: '+91 11 2301 XXXX',
      email: 'delhi.office@bhashyamramakrishna.in'
    },
    stateOffice: {
      address: 'Navabharath Nagar 4/3 Line, Guntur - 522006',
      phone: '+91 866 247 XXXX',
      email: 'state.office@bhashyamramakrishna.in'
    }
  }

  try {
    const data = await sanityFetch<any>({
      query: `*[_type == "siteSettings"][0] {
        delhiOffice,
        stateOffice
      }`
    })
    if (data) {
      settings = {
        delhiOffice: {
          address: data.delhiOffice?.address || settings.delhiOffice.address,
          phone: data.delhiOffice?.phone || settings.delhiOffice.phone,
          email: data.delhiOffice?.email || settings.delhiOffice.email,
        },
        stateOffice: {
          address: data.stateOffice?.address || settings.stateOffice.address,
          phone: data.stateOffice?.phone || settings.stateOffice.phone,
          email: data.stateOffice?.email || settings.stateOffice.email,
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch contact office details from Sanity:', error)
  }

  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': uiTranslations['meta.contact.title'][lang] || uiTranslations['meta.contact.title']['en'],
    'description': uiTranslations['meta.contact.desc'][lang] || uiTranslations['meta.contact.desc']['en'],
    'url': 'https://bhashyamramakrishna.in/contact'
  }

  const stateOfficeSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Shri Bhashyam Rama Krishna State Camp Office',
    'image': 'https://bhashyamramakrishna.in/images/logo.png',
    'telephone': settings.stateOffice.phone,
    'email': settings.stateOffice.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Navabharath Nagar 4/3 Line',
      'addressLocality': 'Guntur',
      'addressRegion': 'Andhra Pradesh',
      'postalCode': '522006',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '16.321667',
      'longitude': '80.419433'
    }
  }

  const delhiOfficeSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOffice',
    'name': 'Shri Bhashyam Rama Krishna Parliamentary Office',
    'telephone': settings.delhiOffice.phone,
    'email': settings.delhiOffice.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '12, Rajya Sabha Members Residences',
      'addressLocality': 'New Delhi',
      'postalCode': '110001',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '28.6186',
      'longitude': '77.2144'
    }
  }

  return (
    <>
      <JsonLd schema={[contactSchema, stateOfficeSchema, delhiOfficeSchema]} />
      <ContactClient settings={settings} />
    </>
  )
}
