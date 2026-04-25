import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  inverted?: boolean
}

export default function Logo({ size = 'md', inverted = false }: LogoProps) {
  const heights = { sm: 36, md: 52, lg: 72 }
  const h = heights[size]
  const w = h * (375 / 375)

  return (
    <Image
      src="/logo.png"
      alt="Dress By Me"
      width={w}
      height={h}
      style={{ height: h, width: 'auto', filter: inverted ? 'invert(1)' : 'none' }}
      priority
    />
  )
}
