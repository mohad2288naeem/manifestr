/**
 * Card Component - Manifestr Design System
 * Example component demonstrating design system usage
 */

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-base-background border border-[#e4e4e7] rounded-xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

