import Image from 'next/image'

export default function Logo({ size = 'md', className = '' }) {
  const sizes = {
    xs: { width: 100, height: 14 },
    sm: { width: 120, height: 18 },
    md: { width: 214.5, height: 24 },
    lg: { width: 286, height: 32 },
    xl: { width: 429, height: 48 },
  }

  const { width, height } = sizes[size] || sizes.md

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src="/assets/logos/text-logo.svg"
        alt="Manifestr Logo"
        fill
        className="object-contain"
        draggable={false}
      />
    </div>
  )
}
