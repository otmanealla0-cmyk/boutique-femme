'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Upload, Save } from 'lucide-react'
import Image from 'next/image'

interface Props {
  settings: Record<string, string>
}

export default function SettingsForm({ settings }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [heroImage, setHeroImage] = useState(settings.hero_image || '/hero.jpg')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    setHeroImage(url)
    setUploading(false)
    toast.success('Image chargée !')
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hero_image: heroImage }),
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
          Image principale (page d&apos;accueil)
        </h2>

        {/* Aperçu */}
        <div className="relative w-full aspect-square max-w-xs rounded-2xl overflow-hidden bg-nude-base">
          <Image
            src={heroImage}
            alt="Image hero"
            fill
            className="object-cover"
          />
        </div>

        {/* Upload */}
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

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-secondary flex items-center gap-2"
        >
          {uploading ? (
            <span className="animate-spin">◌</span>
          ) : (
            <Upload size={16} />
          )}
          {uploading ? 'Chargement...' : 'Changer l\'image'}
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2"
      >
        {saving ? <span className="animate-spin">◌</span> : <Save size={16} />}
        Enregistrer les paramètres
      </button>
    </div>
  )
}
