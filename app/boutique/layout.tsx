import { CartProvider } from '@/lib/cart'
import StoreHeader from '@/components/store/Header'
import WelcomePopup from '@/components/store/WelcomePopup'
import Logo from '@/components/Logo'
import { prisma } from '@/lib/prisma'
export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const rawCategories = await prisma.category.findMany()
  const last = ['chaussures', 'bijoux']
  const categories = [
    ...rawCategories.filter(c => !last.includes(c.slug)).sort((a, b) => a.name.localeCompare(b.name)),
    ...last.flatMap(s => rawCategories.filter(c => c.slug === s)),
  ]

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <StoreHeader categories={categories} />
        <WelcomePopup />
        <main className="flex-1">{children}</main>
        <footer className="bg-charcoal text-nude-base py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-3">
              <Logo size="md" inverted />
            </div>
            <p className="text-sm text-nude-dark">Mode femme – Vêtements & Sacs tendance</p>
            <div className="flex justify-center gap-4 mt-4 text-xs text-nude-dark">
              <a href="/boutique/suivi-commande" className="hover:text-nude-base transition-colors">Suivi de commande</a>
              <span>·</span>
              <a href="/boutique/mentions-legales" className="hover:text-nude-base transition-colors">Mentions légales</a>
              <span>·</span>
              <a href="/boutique/cgv" className="hover:text-nude-base transition-colors">CGV</a>
              <span>·</span>
              <a href="/boutique/confidentialite" className="hover:text-nude-base transition-colors">Confidentialité</a>
            </div>
            <p className="text-xs text-nude-dark mt-3">© {new Date().getFullYear()} Dress By Me. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}
