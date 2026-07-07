import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.privacy.title'][lang] || uiTranslations['meta.privacy.title']['en']
  const description = uiTranslations['meta.privacy.desc'][lang] || uiTranslations['meta.privacy.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bhashyamramakrishna.in/privacy',
    },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/privacy',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function PrivacyPage() {
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
        'item': 'https://bhashyamramakrishna.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': lang === 'te' ? 'గోప్యతా విధానం' : 'Privacy Policy',
        'item': 'https://bhashyamramakrishna.in/privacy'
      }
    ]
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen text-slate-700">
      <JsonLd schema={breadcrumbSchema} />
      <div className="max-w-3xl mx-auto px-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-black text-navy-900 mb-6 text-left">
          {lang === 'te' ? 'గోప్యతా విధానం' : 'Privacy Policy'}
        </h1>
        <div className="space-y-6 text-sm leading-relaxed justify-clean text-left">
          {lang === 'te' ? (
            <>
              <p>
                శ్రీ భాష్యం రామకృష్ణ అధికారిక ప్రజా సేవా పోర్టల్ ద్వారా పౌరుల వ్యక్తిగత వివరాల గోప్యతను కాపాడటానికి మేము కట్టుబడి ఉన్నాము.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">1. సేకరించిన సమాచారం</h2>
              <p>
                ప్రజా ఫిర్యాదుల పోర్టల్ ద్వారా సమర్పించబడిన పౌరుల పేరు, ఈమెయిల్, ఫోన్ నంబర్, చిరునామా మరియు సమస్యల వివరాలను మాత్రమే మేము సేకరిస్తాము.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">2. సమాచార వినియోగం</h2>
              <p>
                సేకరించిన సమాచారం కేవలం సమస్యల పరిష్కారం మరియు అభివృద్ధి పనుల సమన్వయం కోసం మాత్రమే ఉపయోగించబడుతుంది. ఇది ఎటువంటి మూడో పక్షానికి (Third Party) పంచుకోబడదు.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">3. భద్రత</h2>
              <p>
                మీ డేటా భద్రతకు మేము అత్యంత ప్రాధాన్యత ఇస్తాము. అనధికారిక యాక్సెస్ నుండి సమాచారాన్ని రక్షించడానికి తగిన భద్రతా చర్యలు అమలు చేయబడ్డాయి.
              </p>
            </>
          ) : (
            <>
              <p>
                We are committed to protecting the privacy of citizens utilizing the official public portal of Shri Bhashyam Rama Krishna.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">1. Information We Collect</h2>
              <p>
                We collect personal information such as name, email, phone number, and address details submitted through the Public Grievance Portal.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">2. How We Use Information</h2>
              <p>
                The information collected is used solely for grievance resolution, public initiatives coordination, and feedback. No details are shared with third parties.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">3. Data Security</h2>
              <p>
                We implement robust security measures to protect your personal data from unauthorized access, alteration, or disclosure.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
