interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  inverted?: boolean
}

export default function Logo({ size = 'md', inverted = false }: LogoProps) {
  const textColor = inverted ? 'text-white' : 'text-charcoal'
  const subColor = inverted ? 'text-nude-medium' : 'text-nude-dark'

  const sizes = {
    sm: { main: 'text-2xl', sub: 'text-[9px]', gap: 'gap-0' },
    md: { main: 'text-4xl', sub: 'text-[10px]', gap: 'gap-0.5' },
    lg: { main: 'text-6xl', sub: 'text-xs', gap: 'gap-1' },
  }

  const { main, sub, gap } = sizes[size]

  return (
    <div className={`flex flex-col items-center ${gap}`}>
      <span className={`font-playfair font-bold tracking-tight leading-none ${main} ${textColor}`}>
        DRESS
      </span>
      <span className={`font-poppins font-light tracking-[0.35em] uppercase ${sub} ${subColor} flex items-center gap-1`}>
        by me 🎀
      </span>
    </div>
  )
}
