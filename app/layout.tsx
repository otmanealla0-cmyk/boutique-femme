import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Boutique Élégance – Mode Femme',
  description: 'Vêtements et sacs tendance pour femmes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Poppins, sans-serif',
              borderRadius: '12px',
            },
            success: { style: { background: '#F9D1DC', color: '#2C2020' } },
            error: { style: { background: '#fee2e2', color: '#991b1b' } },
          }}
        />
      </body>
    </html>
  )
}
