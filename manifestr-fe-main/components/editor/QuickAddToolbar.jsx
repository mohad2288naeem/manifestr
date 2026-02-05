import { motion } from 'framer-motion'
import { Type, Square, Circle, Image, Plus } from 'lucide-react'

export default function QuickAddToolbar({ onAddElement, position = { x: 0, y: 0 }, visible = false }) {
  if (!visible) return null

  const quickAddOptions = [
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'shape-rect', icon: Square, label: 'Rectangle' },
    { type: 'shape-circle', icon: Circle, label: 'Circle' },
    { type: 'image', icon: Image, label: 'Image' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-2 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex items-center gap-1">
        {quickAddOptions.map((option) => {
          const Icon = option.icon
          return (
            <motion.button
              key={option.type}
              onClick={() => onAddElement && onAddElement(option.type)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-[#f4f4f5] flex flex-col items-center gap-1 min-w-[60px]"
              title={option.label}
            >
              <Icon className="w-4 h-4 text-[#18181b]" />
              <span className="text-[9px] text-[#71717a]">{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}


