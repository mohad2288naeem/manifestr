import { motion } from 'framer-motion'

export default function ToggleSwitch({ 
  checked = false, 
  onChange, 
  label = null,
  labelPosition = 'right',
  disabled = false,
  className = ''
}) {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && labelPosition === 'left' && (
        <label className="text-[16px] font-normal leading-[24px] text-[#18181b] tracking-[-0.3125px] cursor-pointer">
          {label}
        </label>
      )}
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:ring-offset-2 ${
          checked 
            ? 'bg-[#18181b]' 
            : 'bg-[#e4e4e7]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div
          animate={{
            x: checked ? 22 : 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
          }}
          className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-[0px_2px_4px_rgba(0,0,0,0.15)]"
        />
      </motion.button>
      {label && labelPosition === 'right' && (
        <label className="text-[16px] font-normal leading-[24px] text-[#18181b] tracking-[-0.3125px] cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
}


