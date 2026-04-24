import { redirect } from 'next/navigation'
import { getCustomerFromCookies } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AccountLogout from '@/components/store/AccountLogout'
import { Package, ChevronRight } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  pending: 'En attente de paiement',
  paid: 'Payée — en préparation',
  shipped: 'Expédiée 🚚',
  delivered: 'Livrée ✓',
  cancelled: 'Annulée',
}

export default async function AccountPage() {
  const customer = await getCustomerFromCookies()
  if (!customer) redirect('/boutique/compte/connexion')

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-playfair text-charcoal">Mon compte</h1>
          <p className="text-nude-dark mt-1">Bonjour {customer.name} 👋</p>
        </div>
        <AccountLogout />
      </div>

      <h2 className="text-xl font-playfair text-charcoal mb-4 flex items-center gap-2">
        <Package size={20} className="text-rose-deep" />
        Mes commandes
      </h2>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🛍️</div>
          <p className="text-charcoal font-medium mb-2">Aucune commande pour le moment</p>
          <p className="text-nude-dark text-sm mb-6">Découvre nos articles et passe ta première commande !</p>
          <Link href="/boutique/produits" className="btn-primary inline-flex items-center gap-2">
            Voir la boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-medium text-charcoal">{order.orderNumber}</p>
                  <p className="text-xs text-nude-dark mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-playfair font-bold text-rose-deep">{order.total.toFixed(2)} €</p>
                  <span className={`badge text-xs mt-1 ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-nude-light pt-3 space-y-1.5">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-charcoal">
                      {item.product.name}
                      {item.size && <span className="text-nude-dark ml-1">({item.size})</span>}
                    </span>
                    <span className="text-nude-dark">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
