import { useState } from 'react'
import { motion } from 'framer-motion'

const quickStyles = [
  { id: 1, name: 'Modern', preview: 'bg-gradient-to-br from-blue-500 to-purple-600', description: 'Clean and contemporary' },
  { id: 2, name: 'Corporate', preview: 'bg-gradient-to-br from-gray-700 to-gray-900', description: 'Professional business style' },
  { id: 3, name: 'Creative', preview: 'bg-gradient-to-br from-pink-500 to-orange-500', description: 'Bold and vibrant' },
  { id: 4, name: 'Minimal', preview: 'bg-white border-2 border-gray-300', description: 'Simple and elegant' },
  { id: 5, name: 'Dark', preview: 'bg-gray-900', description: 'Dark theme' },
  { id: 6, name: 'Colorful', preview: 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500', description: 'Vibrant colors' },
]

export default function QuickStylePanel({ onApply, onClose }) {
  const [selectedStyle, setSelectedStyle] = useState(null)

  const handleApply = () => {
    if (selectedStyle && onApply) {
      onApply(quickStyles.find(s => s.id === selectedStyle))
    }
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Quick Styles</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {quickStyles.map((style) => (
          <motion.div
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer rounded-lg p-4 border-2 ${
              selectedStyle === style.id
                ? 'border-[#18181b]'
                : 'border-[#e4e4e7] hover:border-[#71717a]'
            }`}
          >
            <div className={`w-full h-24 rounded mb-2 ${style.preview}`} />
            <p className="text-[14px] font-medium text-[#18181b]">{style.name}</p>
            <p className="text-[12px] text-[#71717a]">{style.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={!selectedStyle}
          className="flex-1 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Style
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-[#e4e4e7] rounded-md text-[14px] font-medium hover:bg-[#f4f4f5]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}


