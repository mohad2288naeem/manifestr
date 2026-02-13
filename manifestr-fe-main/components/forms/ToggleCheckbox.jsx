import { Check } from 'lucide-react'

export default function ToggleCheckbox({
  label,
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
    <button
      type="button"
      onClick={handleClick}
      className={`bg-transparent border border-[#e4e4e7] flex gap-2 h-10 items-center px-3 py-[10px] rounded-md transition-all cursor-pointer ${
        checked
          ? 'border-[#18181b] bg-[#F4F4F5]'
          : 'border-[#e4e4e7] hover:border-base-foreground'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <div
          className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
            checked
              ? 'bg-[#F4F4F5] border-[#71717A]'
              : 'bg-base-background border-[#e4e4e7]'
          }`}
        >
          {checked && <Check className="w-3 h-3 text-[#71717A]" strokeWidth={3} />}
        </div>
      </div>
      {label && (
        <span className={`text-l2-medium ${
          checked ? 'text-[#18181b] font-medium' : 'text-base-foreground'
        }`}>
          {label}
        </span>
      )}
    </button>
  )
}

