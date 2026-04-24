'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  function toSlug(str: string) {
    return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), slug: toSlug(name) }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success(`"${name}" ajoutée au menu !`)
      setName('')
      router.refresh()
    } else {
      toast.error('Cette catégorie existe déjà')
    }
  }

  async function handleDelete(id: string, productCount: number, name: string) {
    if (productCount > 0) {
      toast.error(`Impossible : ${productCount} article(s) dans "${name}"`)
      return
    }
    if (!confirm(`Supprimer "${name}" du menu ?`)) return
    await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    toast.success('Catégorie supprimée du menu')
    router.refresh()
  }

  return (
    <div className="max-w-xl space-y-6">

      {/* Aperçu du menu */}
      <div className="card p-6">
        <h2 className="font-playfair text-lg font-semibold text-charcoal mb-1">Menu de la boutique</h2>
        <p className="text-xs text-nude-dark mb-5">Ces catégories apparaissent dans la navigation du site</p>

        <div className="space-y-2">
          {/* Accueil fixe */}
          <div className="flex items-center gap-3 px-4 py-3 bg-nude-light rounded-xl">
            <GripVertical size={14} className="text-nude-medium" />
            <span className="text-sm font-medium text-nude-dark">Accueil</span>
            <span className="ml-auto text-xs text-nude-dark italic">fixe</span>
          </div>

          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 px-4 py-3 bg-white border border-nude-medium rounded-xl hover:border-rose-soft transition-colors">
              <GripVertical size={14} className="text-nude-medium" />
              <div className="flex-1">
                <span className="text-sm font-medium text-charcoal">{cat.name}</span>
                <span className="ml-2 text-xs text-nude-dark">({cat._count.products} article{cat._count.products > 1 ? 's' : ''})</span>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat._count.products, cat.name)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-nude-dark hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ajouter une catégorie */}
      <div className="card p-6">
        <h2 className="font-playfair text-lg font-semibold text-charcoal mb-4">Ajouter au menu</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            className="input-field flex-1"
            placeholder="Ex: Nouveautés, Accessoires..."
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} />
            Ajouter
          </button>
        </form>
      </div>
    </div>
  )
}
