import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  inverted?: boolean
}

export default function Logo({ size = 'md', inverted = false }: LogoProps) {
  const heights = { sm: 44, md: 60, lg: 64 }
  const h = heights[size]
  const w = h * (1467 / 497)

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
