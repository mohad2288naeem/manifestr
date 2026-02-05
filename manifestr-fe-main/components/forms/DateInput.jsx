import { CalendarDays } from 'lucide-react'

export default function DateInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
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

      {/* Date Input Field */}
      <div className={`bg-base-background border rounded-md w-full flex items-center gap-2 px-3 py-2 ${
        error ? 'border-[#fca5a5]' : 'border-[#e4e4e7]'
      }`}>
        <CalendarDays className="w-5 h-5 text-base-muted-foreground shrink-0" />
        <input
          type="date"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 text-b2-regular text-base-foreground placeholder:text-base-muted-foreground outline-none bg-transparent"
          {...props}
        />
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

