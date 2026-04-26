'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  product?: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    images: string
    sizes: string
    colors: string
    bagSizes: string
    hasBoxOption: boolean
    featured: boolean
    active: boolean
    categoryId: string
  }
}

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unique', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
const BAG_SIZE_OPTIONS = ['16cm', '20cm', '25cm', '30cm', '35cm', '45cm']
const COLOR_OPTIONS = [
  'Noir', 'Noir détail argent', 'Noir détail or',
  'Blanc', 'Beige',
  'Rose',
  'Rouge vif', 'Rouge bordeaux',
  'Bleu marine', 'Bleu',
  'Vert', 'Kaki',
  'Marron', 'Gris',
  'Doré', 'Argenté', 'Jaune',
]

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = !!product

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '0',
    categoryId: product?.categoryId || '',
    featured: product?.featured || false,
    active: product?.active ?? true,
  })
  const [images, setImages] = useState<string[]>(
    product ? JSON.parse(product.images || '[]') : []
  )
  const [sizes, setSizes] = useState<string[]>(
    product ? JSON.parse(product.sizes || '[]') : []
  )
  const [colors, setColors] = useState<string[]>(
    product ? JSON.parse(product.colors || '[]') : []
  )
  const [bagSizes, setBagSizes] = useState<string[]>(
    product ? JSON.parse(product.bagSizes || '[]') : []
  )
  const [hasBoxOption, setHasBoxOption] = useState(product?.hasBoxOption || false)

  async function uploadImage(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    setImages(prev => [...prev, url])
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.categoryId) return toast.error('Sélectionnez une catégorie')

    setLoading(true)
    const payload = { ...form, images, sizes, colors, bagSizes, hasBoxOption }

    const res = await fetch(
      isEdit ? `/api/products/${product!.id}` : '/api/products',
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    setLoading(false)

    if (res.ok) {
      toast.success(isEdit ? 'Produit mis à jour !' : 'Produit créé !')
      router.push('/admin/products')
      router.refresh()
    } else {
      const err = await res.json()
      toast.error(err.error || 'Erreur lors de la sauvegarde')
    }
  }

  async function handleDelete() {
    if (!confirm('Désactiver ce produit ?')) return
    await fetch(`/api/products/${product!.id}`, { method: 'DELETE' })
    toast.success('Produit désactivé')
    router.push('/admin/products')
    router.refresh()
  }

  function toggleItem(arr: string[], setArr: (a: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="font-playfair text-lg font-semibold text-charcoal">Informations</h2>

            <div>
              <label className="label">Nom du produit *</label>
              <input
                className="input-field"
                placeholder="Ex: Robe fleurie bohème"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                className="input-field resize-none"
                rows={4}
                placeholder="Décrivez votre produit..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prix (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-field"
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Stock</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  value={form.stock}
                  onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-charcoal">Photos</h2>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={e => {
                Array.from(e.target.files || []).forEach(uploadImage)
                e.target.value = ''
              }}
            />
            <div className="grid grid-cols-3 gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-nude-base">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X size={12} className="text-red-500" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed border-nude-medium
                           flex flex-col items-center justify-center gap-2 text-nude-dark
                           hover:border-rose-soft hover:text-rose-deep transition-colors"
              >
                {uploading ? (
                  <span className="animate-spin text-xl">◌</span>
                ) : (
                  <>
                    <Upload size={20} />
                    <span className="text-xs">Ajouter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-charcoal">Tailles disponibles</h2>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleItem(sizes, setSizes, s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    sizes.includes(s)
                      ? 'bg-rose-deep border-rose-deep text-white'
                      : 'border-nude-medium text-charcoal hover:border-rose-soft'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-charcoal">Tailles sac (cm)</h2>
            <div className="flex flex-wrap gap-2">
              {BAG_SIZE_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleItem(bagSizes, setBagSizes, s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    bagSizes.includes(s)
                      ? 'bg-rose-deep border-rose-deep text-white'
                      : 'border-nude-medium text-charcoal hover:border-rose-soft'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-charcoal">Option boîte</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setHasBoxOption(v => !v)}
                className={`w-11 h-6 rounded-full transition-colors relative ${hasBoxOption ? 'bg-rose-deep' : 'bg-nude-medium'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${hasBoxOption ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-medium text-charcoal">Proposer l&apos;option boîte (+10 €)</span>
            </label>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-charcoal">Couleurs disponibles</h2>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleItem(colors, setColors, c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    colors.includes(c)
                      ? 'bg-rose-deep border-rose-deep text-white'
                      : 'border-nude-medium text-charcoal hover:border-rose-soft'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-playfair text-lg font-semibold text-charcoal">Organisation</h2>
            <div>
              <label className="label">Catégorie *</label>
              <select
                className="input-field"
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                required
              >
                <option value="">Choisir...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  form.featured ? 'bg-gold-base' : 'bg-nude-medium'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.featured ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
              <span className="text-sm font-medium text-charcoal">Mis en avant</span>
            </label>

            {isEdit && (
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    form.active ? 'bg-green-400' : 'bg-nude-medium'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    form.active ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
                <span className="text-sm font-medium text-charcoal">Actif en boutique</span>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <span className="animate-spin">◌</span> : <Plus size={18} />}
            {isEdit ? 'Enregistrer les modifications' : 'Créer le produit'}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full
                         border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Désactiver le produit
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
