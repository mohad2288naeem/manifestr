import { Check } from 'lucide-react'

export default function Checkbox({
  label,
  supportingText,
  checked = false,
  onChange,
  className = '',
}) {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onChange) {
      onChange({ target: { checked: !checked } })
    }
  }

  return (
    <div 
      className={`flex gap-2 items-start ${className}`}
      onClick={handleClick}
    >
      <div className="relative flex items-center justify-center pt-0.5 shrink-0">
        <div
          className={`w-4 h-4 border rounded flex items-center justify-center cursor-pointer transition-all ${
            checked
              ? 'bg-[#18181b] border-[#18181b]'
              : 'bg-base-background border-[#e4e4e7] hover:border-base-foreground'
          }`}
        >
          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      </div>
      {(label || supportingText) && (
        <div className="flex flex-col gap-0 flex-1">
          {label && (
            <span className="text-l2-medium text-base-muted-foreground+ cursor-pointer">
              {label}
            </span>
          )}
          {supportingText && (
            <p className="text-l2-regular text-base-muted-foreground">
              {supportingText}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
