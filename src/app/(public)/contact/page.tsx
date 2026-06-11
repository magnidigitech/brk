import { sanityFetch } from '@/sanity/lib/sanityFetch'
import ContactClient from '@/components/ContactClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export default async function ContactPage() {
  let settings = {
    delhiOffice: {
      address: '12, Rajya Sabha Members Residences, New Delhi - 110001',
      phone: '+91 11 2301 XXXX',
      email: 'delhi.office@bramakrishna.mp.in'
    },
    stateOffice: {
      address: 'Door No. 40-5-1, MG Road, Labbipet, Vijayawada, Andhra Pradesh - 520010',
      phone: '+91 866 247 XXXX',
      email: 'state.office@bramakrishna.mp.in'
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

  return (
    <ContactClient settings={settings} />
  )
}
