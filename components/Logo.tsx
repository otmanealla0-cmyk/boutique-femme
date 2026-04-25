interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  inverted?: boolean
}

export default function Logo({ size = 'md', inverted = false }: LogoProps) {
  const textColor = inverted ? 'text-white' : 'text-charcoal'

  const sizes = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
  }

  return (
    <span className={`font-calligraphy leading-none ${sizes[size]} ${textColor}`}>
      Dress by me
    </span>
  )
}
