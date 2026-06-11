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
import { LanguageProvider } from "@/components/LanguageContext";

export const metadata: Metadata = {
  title: "Bhashyam Ramakrishna | Official Rajya Sabha Portal",
  description: "Official public service portal of Bhashyam Ramakrishna, educationist, Founder Chairman of Bhashyam Educational Institutions, and Telugu Desam Party (TDP) Rajya Sabha Candidate from Andhra Pradesh.",
  keywords: ["Bhashyam Ramakrishna", "Rajya Sabha MP AP", "Andhra Pradesh Rajya Sabha", "Telugu Desam Party", "Bhashyam Chairman", "Grievance Portal AP", "State Focus Andhra Pradesh"],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 pb-20 lg:pb-0">
        <PWARegistration />
        <LanguageProvider>
          <PWAInstallPrompt />
          <FloatingSocials />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}


