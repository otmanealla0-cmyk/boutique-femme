import { prisma } from '@/lib/prisma'
import { Package, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const [productCount, orderCount, orders, lowStock] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.product.count({ where: { stock: { lte: 3 }, active: true } }),
  ])

  const revenue = await prisma.order.aggregate({
    where: { status: 'paid' },
    _sum: { total: true },
  })

  const stats = [
    {
      label: 'Produits actifs',
      value: productCount,
      icon: Package,
      color: 'bg-rose-blush text-rose-dark',
    },
    {
      label: 'Commandes',
      value: orderCount,
      icon: ShoppingBag,
      color: 'bg-nude-base text-charcoal',
    },
    {
      label: 'Chiffre d\'affaires',
      value: `${(revenue._sum.total || 0).toFixed(2)} €`,
      icon: TrendingUp,
      color: 'bg-gold-light text-gold-dark',
    },
    {
      label: 'Stock faible',
      value: lowStock,
      icon: AlertCircle,
      color: lowStock > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600',
    },
  ]

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair text-charcoal">Tableau de bord</h1>
        <p className="text-nude-dark mt-1">Bienvenue dans votre espace admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-nude-dark font-medium">{label}</span>
              <div className={`p-2 rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-playfair font-bold text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-playfair font-semibold text-charcoal mb-4">
          Dernières commandes
        </h2>
        {orders.length === 0 ? (
          <p className="text-nude-dark text-sm text-center py-8">
            Aucune commande pour le moment
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nude-medium">
                  <th className="text-left py-3 text-nude-dark font-medium">N° commande</th>
                  <th className="text-left py-3 text-nude-dark font-medium">Client</th>
                  <th className="text-left py-3 text-nude-dark font-medium">Total</th>
                  <th className="text-left py-3 text-nude-dark font-medium">Statut</th>
                  <th className="text-left py-3 text-nude-dark font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-nude-light hover:bg-nude-light">
                    <td className="py-3 font-medium text-charcoal">{order.orderNumber}</td>
                    <td className="py-3 text-charcoal">{order.customerName}</td>
                    <td className="py-3 font-medium text-charcoal">{order.total.toFixed(2)} €</td>
                    <td className="py-3">
                      <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-3 text-nude-dark">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
