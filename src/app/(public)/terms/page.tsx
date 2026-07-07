import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.terms.title'][lang] || uiTranslations['meta.terms.title']['en']
  const description = uiTranslations['meta.terms.desc'][lang] || uiTranslations['meta.terms.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bhashyamramakrishna.in/terms',
    },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/terms',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function TermsPage() {
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
        'name': lang === 'te' ? 'నిబంధనలు & షరతులు' : 'Terms of Use',
        'item': 'https://bhashyamramakrishna.in/terms'
      }
    ]
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen text-slate-700">
      <JsonLd schema={breadcrumbSchema} />
      <div className="max-w-3xl mx-auto px-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-black text-navy-900 mb-6 text-left">
          {lang === 'te' ? 'నిబంధనలు & షరతులు' : 'Terms of Use'}
        </h1>
        <div className="space-y-6 text-sm leading-relaxed justify-clean text-left">
          {lang === 'te' ? (
            <>
              <p>
                ఈ వెబ్‌సైట్ మరియు ప్రజా ఫిర్యాదుల పోర్టల్‌ని ఉపయోగించడం ద్వారా, మీరు కింది నిబంధనలకు అంగీకరించినట్లు భావించబడుతుంది.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">1. వినియోగ నిబంధనలు</h2>
              <p>
                ఫిర్యాదులు మరియు అభ్యర్థనలు సమర్పించేటప్పుడు నిజాయితీగా మరియు ఖచ్చితమైన సమాచారాన్ని అందించాలి. తప్పుడు లేదా హానికరమైన సమాచారాన్ని సమర్పించడం నిషిద్ధం.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">2. బాధ్యత</h2>
              <p>
                ఈ పోర్టల్ పౌరుల సమన్వయం మరియు ప్రజా సేవ మెరుగుపరచడానికి ఉద్దేశించబడింది. అధికారిక సమాచారం మరియు అప్‌డేట్‌లను ఇక్కడ పారదర్శకంగా పంచుకోవడం జరుగుతుంది.
              </p>
            </>
          ) : (
            <>
              <p>
                By utilizing this official portal and the Public Grievance Portal, you agree to the following terms and conditions.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">1. Use of the Portal</h2>
              <p>
                Users must provide true, accurate, and complete information when submitting grievances. Submitting false, offensive, or malicious claims is strictly prohibited.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">2. Disclaimer of Liability</h2>
              <p>
                This portal is provided for public assistance and community coordination. We make every effort to ensure accurate information, but serve it on an as-available basis.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
