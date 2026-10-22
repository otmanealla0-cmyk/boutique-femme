'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function PaiementAnnulePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <XCircle size={60} className="mx-auto text-red-400 mb-6" />
      <h1 className="text-2xl font-playfair text-charcoal mb-3">Paiement annulé</h1>
      <p className="text-nude-dark mb-8">
        Votre paiement a été annulé. Votre panier est toujours disponible.
      </p>
      <Link href="/boutique/panier" className="btn-primary inline-flex items-center gap-2">
        Retour au panier
      </Link>
    </div>
  )
}
