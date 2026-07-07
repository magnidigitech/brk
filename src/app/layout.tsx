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
  title: "Bhashyam Rama Krishna | Official Rajya Sabha Portal",
  description: "Official public service portal of Bhashyam Rama Krishna, educationist, Founder Chairman of Bhashyam Educational Institutions, and Telugu Desam Party (TDP) Rajya Sabha Candidate from Andhra Pradesh.",
  keywords: ["Bhashyam Rama Krishna", "Rajya Sabha MP AP", "Andhra Pradesh Rajya Sabha", "Telugu Desam Party", "Bhashyam Chairman", "Grievance Portal AP", "State Focus Andhra Pradesh"],
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
    title: "Bhashyam Rama Krishna | Official Rajya Sabha Portal",
    description: "Official public service portal of Bhashyam Rama Krishna, educationist, Founder Chairman of Bhashyam Educational Institutions, and Telugu Desam Party (TDP) Rajya Sabha Candidate from Andhra Pradesh.",
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
                "description": "Official profile of Bhashyam Ramakrishna.",
                "jobTitle": "Member of Parliament (Rajya Sabha)",
                "gender": "Male",
                "nationality": {
                  "@type": "Country",
                  "name": "India"
                },
                "knowsAbout": [
                  "Education",
                  "Public Policy",
                  "Social Welfare",
                  "Andhra Pradesh Development"
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
                  "name": "Parliament of India",
                  "sameAs": "https://en.wikipedia.org/wiki/Parliament_of_India"
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
                "name": "Bhashyam Ramakrishna",
                "url": "https://bhashyamramakrishna.in/",
                "publisher": {
                  "@id": "https://bhashyamramakrishna.in/#person"
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


