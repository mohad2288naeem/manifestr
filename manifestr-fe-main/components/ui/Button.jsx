import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: disabled 
      ? 'bg-[#18181b]/50 text-white/50 cursor-not-allowed' 
      : 'bg-[#18181b] text-white hover:opacity-90 focus:ring-[#18181b]',
    secondary: disabled
      ? 'bg-base-background border border-[#e4e4e7] text-base-foreground/50 cursor-not-allowed'
      : 'bg-base-background border border-[#e4e4e7] text-base-foreground hover:bg-base-muted focus:ring-base-border',
    ghost: disabled
      ? 'bg-transparent text-base-secondary/50 cursor-not-allowed'
      : 'bg-transparent text-base-secondary hover:bg-base-muted focus:ring-base-border',
  }
  
  const sizes = {
    sm: 'h-[36px] px-3 py-2 text-l2-medium rounded-md',
    md: 'h-[40px] px-4 py-2 text-l2-medium rounded-md',
    lg: 'h-[44px] px-6 py-3 text-b1-medium rounded-xl',
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const buttonContent = (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      className="w-full h-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  )
  
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {buttonContent}
      </Link>
    )
  }
  
  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled} {...props}>
      {buttonContent}
    </button>
  )
}
