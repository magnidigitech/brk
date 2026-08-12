import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import PWARegistration from "@/components/PWARegistration";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import FloatingSocials from "@/components/FloatingSocials";
import PullToRefresh from "@/components/PullToRefresh";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import { LanguageProvider } from "@/components/LanguageContext";
import Script from "next/script";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  metadataBase: new URL("https://bhashyamramakrishna.in"),
  title: {
    default: "Bhashyam Rama Krishna | Official TDP Rajya Sabha MP Portal | Andhra Pradesh",
    template: "%s | Shri Bhashyam Rama Krishna, MP"
  },
  description: "Official portal of Shri Bhashyam Rama Krishna – Telugu Desam Party (TDP) Rajya Sabha MP from Andhra Pradesh. Latest Rajya Sabha speeches, parliamentary questions, Guntur political news, AP development updates, and education debates.",
  keywords: [
    "Bhashyam Rama Krishna",
    "Rajya Sabha MP Andhra Pradesh",
    "Andhra Pradesh Rajya Sabha members",
    "TDP Rajya Sabha MP",
    "TDP Rajya Sabha members",
    "Andhra Pradesh Parliament news",
    "Rajya Sabha news Andhra Pradesh",
    "Rajya Sabha speech Andhra Pradesh",
    "TDP Parliament speech",
    "Andhra Pradesh MP latest news",
    "Rajya Sabha MP latest news",
    "Guntur political news",
    "Guntur TDP news",
    "Guntur development news",
    "Guntur political leaders",
    "Andhra Pradesh political news",
    "TDP latest news Andhra Pradesh",
    "Rajya Sabha education debate",
    "Parliament education debate India",
    "Public Examinations Bill 2026",
    "Andhra Pradesh development programmes",
    "Bhashyam Chairman",
    "Grievance Portal AP"
  ],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "S0ZBLecUD_EplEybKPsZ3-e6ZRnNg8-WkOtYsM3KBSM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhashyam Rama Krishna | TDP Rajya Sabha MP Andhra Pradesh",
    description: "Official portal of Shri Bhashyam Rama Krishna – TDP Rajya Sabha MP from Andhra Pradesh. Latest Rajya Sabha speeches, Guntur political news, and AP development updates.",
    images: ["/profile.jpg"],
    creator: "@bhashyambrk",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const initialLang = (cookieStore.get('user-language')?.value as any) || 'en'
  return (
    <html
      lang={initialLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/images/header_bg.png?v=2" as="image" />
        <link rel="preload" href="/images/header_logo.png?v=2" as="image" />
        <link rel="preload" href="/images/header_cbn.png?v=2" as="image" />
        <link rel="preload" href="/images/header_lokesh.png?v=2" as="image" />
        <link rel="preload" href="/images/header_brk.png?v=2" as="image" />
        <link rel="preload" href="/images/brk.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://bhashyamramakrishna.in/#person",
                "name": "Bhashyam Ramakrishna",
                "alternateName": [
                  "Bhashyam Rama Krishna",
                  "Bhashyam Rama Krishna Garu",
                  "Bhashyam BRK"
                ],
                "url": "https://bhashyamramakrishna.in/",
                "image": "https://bhashyamramakrishna.in/profile.jpg",
                "description": "Official profile of Shri Bhashyam Ramakrishna, Member of Parliament (Rajya Sabha) representing Andhra Pradesh and Telugu Desam Party (TDP).",
                "jobTitle": "Member of Parliament (Rajya Sabha)",
                "gender": "Male",
                "nationality": {
                  "@type": "Country",
                  "name": "India"
                },
                "knowsAbout": [
                  "Rajya Sabha MP Andhra Pradesh",
                  "Parliament Education Debates",
                  "TDP Political Affairs",
                  "Guntur Infrastructure & Development",
                  "Public Policy & Legislation"
                ],
                "worksFor": {
                  "@type": "EducationalOrganization",
                  "name": "Bhashyam Educational Institutions",
                  "url": "https://www.bhashyamschools.com/"
                },
                "affiliation": {
                  "@type": "PoliticalParty",
                  "name": "Telugu Desam Party",
                  "alternateName": "TDP",
                  "sameAs": "https://en.wikipedia.org/wiki/Telugu_Desam_Party"
                },
                "memberOf": {
                  "@type": "GovernmentOrganization",
                  "name": "Parliament of India (Rajya Sabha)",
                  "sameAs": "https://en.wikipedia.org/wiki/Rajya_Sabha"
                },
                "sameAs": [
                  "https://en.wikipedia.org/wiki/Bhashyam_Rama_Krishna",
                  "https://www.youtube.com/@ramakrishnabhashyam",
                  "https://www.instagram.com/ramakrishnabhashyam",
                  "https://www.facebook.com/ramakrishnabhashyam",
                  "https://x.com/bhashyambrk"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://bhashyamramakrishna.in/#website",
                "name": "Shri Bhashyam Rama Krishna MP Portal",
                "url": "https://bhashyamramakrishna.in/",
                "publisher": {
                  "@id": "https://bhashyamramakrishna.in/#person"
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://bhashyamramakrishna.in/api/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ])
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 pb-20 lg:pb-0 font-sans">
        <PullToRefresh />
        <PWARegistration />
        <LanguageProvider initialLanguage={initialLang}>
          <PWAInstallPrompt />
          <FloatingSocials />
          <AccessibilityPanel />
          {children}
        </LanguageProvider>

        {/* OneSignal Push Notifications */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "5dc88ca6-55a7-4377-9f2b-7dfd0c2a6a48",
                safari_web_id: "web.onesignal.auto.34cabfa2-ddd9-46d0-b8b2-6fad793020e0",
                notifyButton: {
                  enable: false,
                },
                serviceWorkerPath: "OneSignalSDKWorker.js"
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}


