import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientRoot } from "@/components/ClientRoot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Satsfi - Intent-centric DeFi Neobank",
  description: "Stake. Borrow. Earn. All in one sentence. Let AI optimize your Onchain Banking strategy automatically.",
  keywords: ["DeFi", "Staking", "Lending", "Earning", "Cryptocurrency", "Blockchain", "AI Banking", "Intent"],
  authors: [{ name: "Satsfi Team" }],
  creator: "Satsfi",
  publisher: "Satsfi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://satsfi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://satsfi.com',
    title: 'Satsfi - Intent-centric DeFi Neobank',
    description: 'Stake. Borrow. Earn. All in one sentence. Let AI optimize your Onchain Banking strategy automatically.',
    siteName: 'Satsfi',
    images: [
      {
        url: 'https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148',
        width: 1200,
        height: 630,
        alt: 'Satsfi Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satsfi - Intent-centric DeFi Neobank',
    description: 'Stake. Borrow. Earn. All in one sentence. Let AI optimize your Onchain Banking strategy automatically.',
    images: ['https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148'],
    creator: '@satsfi',
    site: '@satsfi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'finance',
  classification: 'DeFi Banking Platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148" />
        <link rel="icon" type="image/png" sizes="192x192" href="https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148" />
        <link rel="icon" type="image/png" sizes="512x512" href="https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#0A0E17" />
        <meta name="msapplication-TileColor" content="#0A0E17" />
        <meta name="msapplication-navbutton-color" content="#0A0E17" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Additional Meta Tags */}
        <meta name="application-name" content="Satsfi" />
        <meta name="apple-mobile-web-app-title" content="Satsfi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileImage" content="https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientRoot>
        {children}
          </ClientRoot>
        </ThemeProvider>
      </body>
    </html>
  )
}
