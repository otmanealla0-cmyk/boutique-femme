import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettings() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair text-charcoal">Paramètres du site</h1>
        <p className="text-nude-dark mt-1">Personnalisez l&apos;apparence de votre boutique</p>
      </div>
      <SettingsForm settings={map} />
    </div>
  )
}
