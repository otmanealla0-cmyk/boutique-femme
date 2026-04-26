'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Upload, Save, X, Plus } from 'lucide-react'
import Image from 'next/image'

interface Props {
  settings: Record<string, string>
}

export default function SettingsForm({ settings }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const initial: string[] = settings.hero_images
    ? JSON.parse(settings.hero_images)
    : [settings.hero_image || '/hero.jpg']

  const [images, setImages] = useState<string[]>(initial)

  async function handleUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    setImages(prev => [...prev, url])
    setUploading(false)
    toast.success('Image ajoutée !')
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hero_images: JSON.stringify(images),
        hero_image: images[0] || '/hero.jpg',
      }),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Paramètres sauvegardés !')
      router.refresh()
    } else {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card p-6 space-y-5">
        <h2 className="font-playfair text-lg font-semibold text-charcoal">
          Images du carousel (page d&apos;accueil)
        </h2>
        <p className="text-sm text-nude-dark">Les images défilent automatiquement toutes les 4 secondes.</p>

        <div className="grid grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={src + i} className="relative aspect-square rounded-xl overflow-hidden bg-nude-base group">
              <Image src={src} alt={`Hero ${i + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => removeImage(i)}
                  className="bg-white text-red-500 rounded-full p-1.5 hover:bg-red-50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-charcoal text-white text-[9px] px-1.5 py-0.5 rounded-sm">
                  Principale
                </span>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-nude-medium flex flex-col items-center justify-center gap-2 hover:border-charcoal hover:bg-nude-base transition-colors text-nude-dark hover:text-charcoal"
          >
            {uploading ? (
              <span className="animate-spin text-xl">◌</span>
            ) : (
              <>
                <Plus size={20} />
                <span className="text-xs">Ajouter</span>
              </>
            )}
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
            e.target.value = ''
          }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2"
      >
        {saving ? <span className="animate-spin">◌</span> : <Save size={16} />}
        Enregistrer
      </button>
    </div>
  )
}
