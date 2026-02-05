import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Select({
  label,
  placeholder,
  value,
  onChange,
  options = [],
  error,
  required = false,
  className = '',
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`flex flex-col gap-1.5 items-start relative w-full ${className}`}>
      {/* Label */}
      <div className="flex gap-0.5 items-start">
        <label className="text-l2-medium text-base-muted-foreground+">
          {label}
        </label>
        {required && (
          <span className="text-l2-medium text-[#dc2626]">*</span>
        )}
      </div>

      {/* Select Field */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-base-background border rounded-md w-full flex items-center justify-between gap-2 px-3 py-2 ${
            error ? 'border-[#fca5a5]' : 'border-[#e4e4e7]'
          }`}
          {...props}
        >
          <span className={`flex-1 text-left text-b2-regular ${
            value ? 'text-base-foreground' : 'text-base-muted-foreground'
          }`}>
            {value ? options.find(opt => opt.value === value)?.label || value : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-base-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 mt-1 w-full bg-white border border-[#e4e4e7] rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange({ target: { value: option.value } })
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-b2-regular hover:bg-slate-50 transition-colors ${
                    value === option.value ? 'bg-slate-50 font-medium' : 'text-base-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-l2-regular text-[#dc2626]">
          {error}
        </p>
      )}
    </div>
  )
}

