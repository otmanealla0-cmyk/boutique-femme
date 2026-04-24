export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Package } from 'lucide-react'

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order: orderId } = await searchParams

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      })
    : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>

      <h1 className="text-3xl font-playfair text-charcoal mb-3">Merci pour ta commande ! 🎀</h1>
      <p className="text-nude-dark mb-8">
        Ta commande a bien été prise en compte. On te prépare ça avec soin !
      </p>

      {order ? (
        <div className="card p-6 text-left mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-rose-deep" />
            <p className="font-playfair font-bold text-charcoal text-lg">Commande {order.orderNumber}</p>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-charcoal">{item.product.name} ×{item.quantity}</span>
                <span className="text-nude-dark">{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div className="border-t border-nude-medium pt-3 flex justify-between font-bold text-charcoal">
            <span>Total payé</span>
            <span className="text-rose-deep">{order.total.toFixed(2)} €</span>
          </div>

          <div className="mt-4 pt-4 border-t border-nude-light text-sm text-nude-dark space-y-1">
            <p>📦 Livraison à : {order.address}, {order.postalCode} {order.city}</p>
            <p>✉️ Confirmation envoyée à : {order.customerEmail}</p>
          </div>
        </div>
      ) : (
        <div className="card p-6 mb-8">
          <p className="text-nude-dark text-sm">Ton paiement a été validé. Garde ton numéro de commande reçu par email.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/boutique/compte" className="btn-secondary inline-flex items-center justify-center gap-2">
          Suivre ma commande
        </Link>
        <Link href="/boutique" className="btn-primary inline-flex items-center justify-center gap-2">
          Continuer mes achats
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
