import { Mail, Phone } from 'lucide-react'

export default function ResetMethodOption({
  method,
  title,
  subtitle,
  checked,
  onChange,
}) {
  const Icon = method === 'email' ? Mail : Phone

  return (
    <button
      type="button"
      onClick={onChange}
      className={`bg-white border rounded-md w-full flex items-center gap-3 px-[17px] py-1 transition-all cursor-pointer ${
        checked
          ? 'border-zinc-900'
          : 'border-[#e4e4e7] hover:border-base-foreground'
      }`}
      style={{ height: '66px' }}
    >
      <Icon className="w-5 h-5 text-zinc-900 shrink-0" />
      <div className="flex-1 flex flex-col items-start gap-0">
        <p className="text-l2-medium text-zinc-900">
          {title}
        </p>
        <p className="text-l2-regular text-[#71717b]">
          {subtitle}
        </p>
      </div>
      <div className={`border-2 rounded-full shrink-0 size-5 flex items-center justify-center ${
        checked
          ? 'border-zinc-900'
          : 'border-[#e4e4e7]'
      }`}>
        {checked && (
          <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />
        )}
      </div>
    </button>
  )
}

