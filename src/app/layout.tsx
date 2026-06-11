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
import { LanguageProvider } from "@/components/LanguageContext";

export const metadata: Metadata = {
  title: "Bhashyam Ramakrishna | Official Rajya Sabha Portal",
  description: "Official public service portal of Bhashyam Ramakrishna, educationist, Founder Chairman of Bhashyam Educational Institutions, and Telugu Desam Party (TDP) Rajya Sabha Candidate from Andhra Pradesh.",
  keywords: ["Bhashyam Ramakrishna", "Rajya Sabha MP AP", "Andhra Pradesh Rajya Sabha", "Telugu Desam Party", "Bhashyam Chairman", "Grievance Portal AP", "State Focus Andhra Pradesh"],
  icons: {
    icon: "/images/telugudesamlogo.png",
    shortcut: "/images/telugudesamlogo.png",
    apple: "/images/telugudesamlogo.png",
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
      <body className="min-h-full flex flex-col bg-slate-50">
        <PWARegistration />
        <LanguageProvider>
          <PWAInstallPrompt />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}


