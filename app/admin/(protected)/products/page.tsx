import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import Image from 'next/image'

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-playfair text-charcoal">Produits</h1>
          <p className="text-nude-dark mt-1">{products.length} produit(s) au total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-xl font-playfair text-charcoal mb-2">Aucun produit</h2>
          <p className="text-nude-dark mb-6">Commencez par ajouter vos premiers articles</p>
          <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-nude-base">
              <tr>
                <th className="text-left px-5 py-4 text-nude-dark font-medium">Produit</th>
                <th className="text-left px-5 py-4 text-nude-dark font-medium">Catégorie</th>
                <th className="text-left px-5 py-4 text-nude-dark font-medium">Prix</th>
                <th className="text-left px-5 py-4 text-nude-dark font-medium">Stock</th>
                <th className="text-left px-5 py-4 text-nude-dark font-medium">Statut</th>
                <th className="text-right px-5 py-4 text-nude-dark font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const images = JSON.parse(product.images || '[]') as string[]
                return (
                  <tr key={product.id} className="border-t border-nude-light hover:bg-nude-light transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-nude-base overflow-hidden flex-shrink-0">
                          {images[0] ? (
                            <Image
                              src={images[0]}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-nude-dark text-xs">
                              📷
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{product.name}</p>
                          {product.featured && (
                            <span className="inline-flex items-center gap-1 text-xs text-gold-dark">
                              <Star size={10} fill="currentColor" />
                              Mis en avant
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-charcoal">{product.category.name}</td>
                    <td className="px-5 py-4 font-medium text-charcoal">{product.price.toFixed(2)} €</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${
                        product.stock === 0
                          ? 'bg-red-50 text-red-600'
                          : product.stock <= 3
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-green-50 text-green-700'
                      }`}>
                        {product.stock} en stock
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${product.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.active ? (
                          <><ToggleRight size={14} className="mr-1" /> Actif</>
                        ) : (
                          <><ToggleLeft size={14} className="mr-1" /> Inactif</>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-nude-base hover:bg-nude-medium text-charcoal text-xs font-medium transition-colors"
                      >
                        <Pencil size={13} />
                        Modifier
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
