import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewProduct() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-nude-dark hover:text-charcoal text-sm mb-4">
          <ChevronLeft size={16} />
          Retour aux produits
        </Link>
        <h1 className="text-3xl font-playfair text-charcoal">Nouveau produit</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
