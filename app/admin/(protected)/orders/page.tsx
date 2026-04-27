export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'
import OrderDeleteButton from '@/components/admin/OrderDeleteButton'
import OrderStatusFilter from '@/components/admin/OrderStatusFilter'
import ResendEmailButton from '@/components/admin/ResendEmailButton'
import ShippingEmailButton from '@/components/admin/ShippingEmailButton'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  const [orders, allStatuses] = await Promise.all([
    prisma.order.findMany({
      where: status ? { status } : undefined,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.findMany({ select: { status: true } }),
  ])

  const counts = allStatuses.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-playfair text-charcoal">Commandes</h1>
        <p className="text-nude-dark mt-1">{orders.length} commande(s){status ? ` · filtre : ${statusLabels[status] ?? status}` : ''}</p>
      </div>

      <div className="mb-6">
        <OrderStatusFilter counts={counts} current={status ?? ''} />
      </div>

      {orders.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-playfair text-charcoal">Aucune commande</h2>
          <p className="text-nude-dark mt-2">
            {status ? `Aucune commande avec le statut "${statusLabels[status] ?? status}"` : 'Les commandes de vos clientes apparaîtront ici'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-playfair font-semibold text-charcoal">{order.orderNumber}</h3>
                    <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-sm text-nude-dark">
                    {order.customerName} — {order.customerEmail}
                  </p>
                  <p className="text-xs text-nude-dark mt-0.5">
                    {new Date(order.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-xl font-playfair font-bold text-charcoal">{order.total.toFixed(2)} €</p>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  <ResendEmailButton orderId={order.id} />
                  <ShippingEmailButton orderId={order.id} />
                  <OrderDeleteButton orderId={order.id} />
                </div>
              </div>

              <div className="border-t border-nude-light pt-4">
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-charcoal">
                        {item.product.name}
                        {item.size && <span className="text-nude-dark ml-1">({item.size})</span>}
                        {item.color && <span className="text-nude-dark ml-1">– {item.color}</span>}
                      </span>
                      <span className="text-nude-dark">
                        {item.quantity} × {item.price.toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.address && (
                <div className="border-t border-nude-light pt-3 mt-3">
                  <p className="text-xs text-nude-dark">
                    📍 {order.address}, {order.postalCode} {order.city}{order.country ? `, ${order.country}` : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
