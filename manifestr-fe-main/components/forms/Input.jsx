import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function Input({
  label,
  type = 'text',
  placeholder,
  helperText,
  error,
  required = false,
  showPasswordToggle = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type

  // Extract background classes from className to apply only to input field
  const bgMatch = className.match(/bg-\[#[a-fA-F0-9]+\]|bg-\w+/)
  const bgClass = bgMatch ? bgMatch[0] : ''
  const otherClasses = className.replace(/bg-\[#[a-fA-F0-9]+\]|bg-\w+/g, '').trim()

  return (
    <div className={`flex flex-col gap-1.5 items-start relative w-full ${otherClasses}`}>
      {/* Label */}
      <div className="flex gap-0.5 items-start">
        <label className="text-l2-medium text-[#52525B]">
          {label}
        </label>
        {required && (
          <span className="text-l2-medium text-[#dc2626]">*</span>
        )}
      </div>

      {/* Input Field */}
      <div className={`${bgClass || 'bg-base-background'} border rounded-md w-full flex items-center gap-2 px-3 py-2 ${
        error ? 'border-[#fca5a5]' : 'border-[#e4e4e7]'
      }`}>
        <input
          type={inputType}
          placeholder={placeholder}
          className="flex-1 text-b2-regular text-base-foreground placeholder:text-base-muted-foreground outline-none bg-transparent"
          {...props}
        />
        <div className="flex items-center gap-2 shrink-0">
          {error && (
            <AlertCircle className="w-4 h-4 text-[#dc2626]" />
          )}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-base-muted-foreground hover:text-base-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error Message or Helper Text */}
      {error ? (
        <p className="text-l2-regular text-[#dc2626]">
          {error}
        </p>
      ) : helperText && (
        <p className="text-l2-regular text-[#71717A]">
          {helperText}
        </p>
      )}
    </div>
  )
}

