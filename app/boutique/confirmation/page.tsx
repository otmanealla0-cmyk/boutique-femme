import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string }
}) {
  const order = searchParams.order
    ? await prisma.order.findUnique({
        where: { id: searchParams.order },
        include: { items: { include: { product: true } } },
      })
    : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>

      <h1 className="text-3xl font-playfair text-charcoal mb-3">Merci pour votre commande !</h1>
      <p className="text-nude-dark mb-8">
        Votre commande a bien été prise en compte. Vous recevrez une confirmation par email.
      </p>

      {order && (
        <div className="card p-6 text-left mb-8">
          <p className="text-sm font-medium text-nude-dark mb-1">Numéro de commande</p>
          <p className="font-playfair font-bold text-charcoal text-xl mb-4">{order.orderNumber}</p>

          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-charcoal">{item.product.name} ×{item.quantity}</span>
                <span className="text-nude-dark">{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div className="border-t border-nude-medium pt-3 mt-3 flex justify-between font-bold text-charcoal">
            <span>Total payé</span>
            <span className="text-rose-deep">{order.total.toFixed(2)} €</span>
          </div>
        </div>
      )}

      <Link href="/boutique" className="btn-primary inline-flex items-center gap-2">
        Continuer mes achats
        <ArrowRight size={18} />
      </Link>
    </div>
  )
}
