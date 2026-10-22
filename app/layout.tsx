import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const SITE_URL = 'https://dressbymee.shop'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dress By Me – Mode Femme Tendance',
    template: '%s | Dress By Me',
  },
  description: 'Découvrez la collection Dress By Me : vêtements, sacs et accessoires mode femme tendance. Livraison rapide en Europe.',
  keywords: ['mode femme', 'vêtements femme', 'sacs tendance', 'boutique en ligne', 'dress by me'],
  authors: [{ name: 'Dress By Me' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'Dress By Me',
    title: 'Dress By Me – Mode Femme Tendance',
    description: 'Vêtements, sacs et accessoires mode femme. Livraison rapide en Europe.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Dress By Me' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dress By Me – Mode Femme Tendance',
    description: 'Vêtements, sacs et accessoires mode femme. Livraison rapide en Europe.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Poppins, sans-serif', borderRadius: '12px' },
            success: { style: { background: '#F9D1DC', color: '#2C2020' } },
            error: { style: { background: '#fee2e2', color: '#991b1b' } },
          }}
        />
      </body>
    </html>
  )
}
