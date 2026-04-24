'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useState } from 'react'
import Logo from '@/components/Logo'

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  categories: Category[]
}

export default function StoreHeader({ categories }: Props) {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/boutique', label: 'Accueil' },
    ...categories.map(cat => ({
      href: `/boutique/produits?cat=${cat.slug}`,
      label: cat.name,
    })),
  ]

  return (
    <header className="bg-white border-b border-nude-medium sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 relative">

        {/* Logo centré + hamburger gauche + panier droite */}
        <div className="flex items-center justify-between pt-3 pb-2 md:pt-5 md:pb-4 border-b border-nude-light">
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden md:block w-10" />

          <Link href="/boutique" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <span className="md:hidden"><Logo size="sm" /></span>
            <span className="hidden md:block"><Logo size="lg" /></span>
          </Link>

          <div className="flex items-center gap-1">
            <Link href="/boutique/compte" className="p-2 hover:bg-nude-base rounded-xl transition-colors">
              <User size={20} className="text-charcoal" />
            </Link>
            <Link href="/boutique/panier" className="relative p-2 hover:bg-nude-base rounded-xl transition-colors">
              <ShoppingBag size={20} className="text-charcoal" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-deep text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation desktop */}
        <div className="hidden md:flex items-center justify-center h-11 gap-10">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal hover:text-rose-deep transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-nude-medium px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-3 rounded-lg text-sm tracking-wider uppercase text-charcoal hover:bg-nude-base font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
