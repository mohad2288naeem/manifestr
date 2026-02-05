import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export default function SettingsCard({ title, subtitle, isExpanded, onToggle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-xl p-6"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[18px] font-semibold leading-[28px] text-[#18181b] mb-1">
            {title}
          </h3>
          <p className="text-[14px] leading-[20px] text-[#71717a]">
            {subtitle}
          </p>
        </div>
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-[#18181b] cursor-pointer"
        >
          <ChevronUp
            className={`w-5 h-5 transition-transform ${isExpanded ? '' : 'rotate-180'}`}
          />
        </motion.button>
      </div>

      {/* Card Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

