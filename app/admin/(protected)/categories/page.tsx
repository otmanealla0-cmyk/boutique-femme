import { prisma } from '@/lib/prisma'
import CategoryManager from '@/components/admin/CategoryManager'

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair text-charcoal">Catégories</h1>
        <p className="text-nude-dark mt-1">Gérez les catégories de vos produits</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  )
}
