'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'
import CartDrawer from './CartDrawer'

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
  const [cartOpen, setCartOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/boutique', label: 'Accueil' },
    ...categories.map(cat => ({
      href: `/boutique/produits?cat=${cat.slug}`,
      label: cat.name,
    })),
  ]

  function isActive(href: string) {
    if (href === '/boutique') return pathname === '/boutique'
    return pathname.startsWith('/boutique/produits') && href.includes('cat=')
      ? pathname + (typeof window !== 'undefined' ? window.location.search : '') === href
      : pathname === href
  }

  return (
    <>
      <header className="bg-white border-b border-nude-medium sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 relative">

          <div className="flex items-center justify-between pt-3 pb-2 md:pt-3 md:pb-3 border-b border-nude-light">
            <button
              className="md:hidden p-2 hover:bg-nude-base rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className={`transition-transform duration-200 block ${menuOpen ? 'rotate-90' : 'rotate-0'}`}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </span>
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
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-nude-base rounded-xl transition-colors"
                aria-label="Panier"
              >
                <ShoppingBag size={20} className="text-charcoal" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-deep text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce-once">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center justify-center h-11 gap-10">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium tracking-[0.2em] uppercase transition-colors relative group ${
                  isActive(link.href) ? 'text-rose-deep' : 'text-charcoal hover:text-rose-deep'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-rose-deep transition-all duration-300 ${
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Menu mobile avec animation */}
        <div className={`md:hidden bg-white border-t border-nude-medium overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-3 rounded-lg text-sm tracking-wider uppercase font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-nude-base text-rose-deep'
                    : 'text-charcoal hover:bg-nude-base'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
