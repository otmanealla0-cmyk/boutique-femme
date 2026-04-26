'use client'

import { useEffect, useState } from 'react'

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fond flouté */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Carte */}
      <div
        className="relative bg-white rounded-3xl px-10 py-10 mx-4 max-w-sm w-full text-center shadow-2xl"
        style={{ animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <div className="text-5xl mb-4">🚚</div>
        <h2 className="font-playfair text-2xl text-charcoal mb-2">Livraison gratuite</h2>
        <p className="text-nude-dark text-sm mb-1">Dans toute l&apos;Europe 🇪🇺</p>
        <p className="text-xs text-nude-dark mb-8">Sur toutes vos commandes, sans minimum d&apos;achat</p>

        <button
          onClick={() => setVisible(false)}
          className="btn-primary w-full"
        >
          Super, je continue !
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
