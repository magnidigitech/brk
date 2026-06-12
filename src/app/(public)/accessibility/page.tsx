import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.accessibility.title'][lang] || uiTranslations['meta.accessibility.title']['en']
  const description = uiTranslations['meta.accessibility.desc'][lang] || uiTranslations['meta.accessibility.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bramakrishna.mp.in/accessibility',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in/accessibility',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function AccessibilityPage() {
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
        'name': lang === 'te' ? 'యాక్సెసిబిలిటీ ప్రకటన' : 'Accessibility',
        'item': 'https://bramakrishna.mp.in/accessibility'
      }
    ]
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen text-slate-700">
      <JsonLd schema={breadcrumbSchema} />
      <div className="max-w-3xl mx-auto px-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-black text-navy-900 mb-6 text-left">
          {lang === 'te' ? 'యాక్సెసిబిలిటీ ప్రకటన' : 'Accessibility Statement'}
        </h1>
        <div className="space-y-6 text-sm leading-relaxed justify-clean text-left">
          {lang === 'te' ? (
            <>
              <p>
                ఈ వెబ్‌సైట్ అందరికీ సులభంగా అందుబాటులో ఉండేలా మరియు సమానమైన ప్రాప్తిని కల్పించేలా మేము నిరంతరం కృషి చేస్తున్నాము.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">1. ప్రమాణాలు</h2>
              <p>
                మేము వెబ్ కంటెంట్ యాక్సెసిబిలిటీ గైడ్‌లైన్స్ (WCAG 2.1) స్థాయి AA ప్రమాణాలకు అనుగుణంగా ఈ వెబ్‌సైట్‌ను డిజైన్ చేసాము.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">2. లక్షణాలు</h2>
              <p>
                - సరైన రీడబిలిటీ కొరకు తగిన రంగుల వ్యత్యాసం (Contrast) మరియు టెక్స్ట్ సైజ్ ఉపయోగించబడింది.<br />
                - చిత్రాలన్నింటికీ ప్రత్యామ్నాయ వివరణలు (Alt Text) అందించబడ్డాయి.<br />
                - కీబోర్డ్ నావిగేషన్ మరియు స్క్రీన్ రీడర్‌లకు అనువుగా కోడ్ రాయబడింది.
              </p>
            </>
          ) : (
            <>
              <p>
                We are committed to ensuring digital accessibility for all visitors, including individuals with disabilities.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">1. Compliance Standards</h2>
              <p>
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA to provide an optimal and inclusive viewing experience.
              </p>
              <h2 className="text-lg font-bold text-navy-950 mt-4">2. Key Accessibility Features</h2>
              <p>
                - High-contrast visual structure and highly legible typography sizing.<br />
                - Descriptive alternative text (alt attributes) on all functional images.<br />
                - Optimized keyboard navigation order and semantic ARIA labeling where needed.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
