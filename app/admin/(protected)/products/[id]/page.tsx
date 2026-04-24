import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-nude-dark hover:text-charcoal text-sm mb-4">
          <ChevronLeft size={16} />
          Retour aux produits
        </Link>
        <h1 className="text-3xl font-playfair text-charcoal">Modifier le produit</h1>
        <p className="text-nude-dark mt-1">{product.name}</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  )
}
