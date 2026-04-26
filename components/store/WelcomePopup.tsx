'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border border-nude-medium bg-white"
      style={{ animation: 'slideUp 0.4s ease' }}
    >
      <span className="text-2xl">🚚</span>
      <div>
        <p className="font-semibold text-charcoal text-sm">Livraison gratuite</p>
        <p className="text-xs text-nude-dark">Dans toute l&apos;Europe 🇪🇺</p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 text-nude-dark hover:text-charcoal transition-colors"
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
