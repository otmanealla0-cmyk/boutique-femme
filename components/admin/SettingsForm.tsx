'use client'

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Save, X, Plus } from 'lucide-react'
import Image from 'next/image'
import { compressImage } from '@/lib/compressImage'

interface Props {
  settings: Record<string, string>
}

export default function SettingsForm({ settings }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadCount, setUploadCount] = useState(0)
  const [saving, setSaving] = useState(false)

  const initial: string[] = settings.hero_images
    ? JSON.parse(settings.hero_images)
    : settings.hero_image ? [settings.hero_image] : []

  const [images, setImages] = useState<string[]>(initial)

  async function uploadFile(file: File): Promise<{ url: string } | { error: string }> {
    try {
      const blob = await compressImage(file)
      const fd = new FormData()
      fd.append('file', new File([blob], file.name, { type: 'image/jpeg' }))
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) return { error: data.error || `Erreur ${res.status}` }
      return { url: data.url }
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Erreur réseau' }
    }
  }

  async function handleFiles(files: FileList) {
    const arr = Array.from(files)
    let added = 0
    for (const file of arr) {
      setUploadCount(c => c + 1)
      const result = await uploadFile(file)
      setUploadCount(c => c - 1)
      if ('url' in result) {
        setImages(prev => [...prev, result.url])
        added++
      } else {
        toast.error(result.error)
      }
    }
    if (added > 0) toast.success(added > 1 ? `${added} images ajoutées !` : 'Image ajoutée !')
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
        hero_image: images[0] || '',
      }),
    })
    setSaving(false)
    if (res.ok) toast.success('Sauvegardé !')
    else toast.error('Erreur lors de la sauvegarde')
  }

  const uploading = uploadCount > 0

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card p-6 space-y-5">
        <div>
          <h2 className="font-playfair text-lg font-semibold text-charcoal">
            Images du carousel (page d&apos;accueil)
          </h2>
          <p className="text-sm text-nude-dark mt-1">
            Glisse plusieurs images en même temps — elles défilent toutes les 4 secondes.
          </p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files?.length) handleFiles(e.target.files)
            e.target.value = ''
          }}
        />

        <div className="grid grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] rounded-xl overflow-hidden bg-nude-base group"
            >
              <Image src={src} alt={`Carousel ${i + 1}`} fill className="object-cover" />
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
                  1ère
                </span>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="aspect-[3/4] rounded-xl border-2 border-dashed border-nude-medium flex flex-col items-center justify-center gap-2 hover:border-charcoal hover:bg-nude-base transition-colors text-nude-dark hover:text-charcoal"
          >
            {uploading ? (
              <>
                <span className="animate-spin text-xl">◌</span>
                <span className="text-xs">{uploadCount} en cours</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span className="text-xs">Ajouter</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-nude-dark">{images.length} image{images.length > 1 ? 's' : ''} — pas de limite</p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || uploading}
        className="btn-primary flex items-center gap-2"
      >
        {saving ? <span className="animate-spin">◌</span> : <Save size={16} />}
        Enregistrer
      </button>
    </div>
  )
}
