import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans, Manrope } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] });
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const _manrope = Manrope({ weight: ["700", "800"], subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: 'Ocean — Suzish havzasi va Sauna | Chortoq, Namangan',
  description: "Ocean — Chortoq, Namangan'dagi suzish havzasi va sauna majmuasi. 500 m² suzish havzasi, Harvia jihozlari bilan jihozlangan sauna xonalari, milliy taomlar va jonli musiqa.",
  keywords: ['suzish havzasi', 'basseyn', 'sauna', 'Namangan', 'Chortoq', 'Ocean basseyn'],
  authors: [{ name: 'Ocean' }],
  openGraph: {
    title: 'Ocean — Suzish havzasi va Sauna',
    description: "Chortoq, Namangan'dagi suzish havzasi va sauna majmuasi.",
    type: 'website',
    url: 'https://oceanbasseyn.uz',
    siteName: 'Ocean',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ocean — Suzish havzasi va Sauna',
    description: "Chortoq, Namangan'dagi suzish havzasi va sauna majmuasi.",
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_manrope.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
