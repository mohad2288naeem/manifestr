import { useState } from 'react'
import { motion } from 'framer-motion'

const themes = [
  { id: 'modern', name: 'Modern', colors: ['#3b82f6', '#8b5cf6', '#ec4899'], description: 'Clean and contemporary' },
  { id: 'corporate', name: 'Corporate', colors: ['#374151', '#4b5563', '#6b7280'], description: 'Professional business' },
  { id: 'creative', name: 'Creative', colors: ['#f59e0b', '#ef4444', '#ec4899'], description: 'Bold and vibrant' },
  { id: 'minimal', name: 'Minimal', colors: ['#ffffff', '#f3f4f6', '#e5e7eb'], description: 'Simple and elegant' },
  { id: 'dark', name: 'Dark', colors: ['#111827', '#1f2937', '#374151'], description: 'Dark theme' },
]

export default function ThemePanel({ onApply, onClose }) {
  const [selectedTheme, setSelectedTheme] = useState(null)

  const handleApply = () => {
    if (selectedTheme && onApply) {
      const theme = themes.find(t => t.id === selectedTheme)
      onApply(theme)
    }
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Select Theme</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {themes.map((theme) => (
          <motion.div
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer rounded-lg p-4 border-2 ${
              selectedTheme === theme.id
                ? 'border-[#18181b]'
                : 'border-[#e4e4e7] hover:border-[#71717a]'
            }`}
          >
            <div className="flex gap-1 mb-2">
              {theme.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-12 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-[14px] font-medium text-[#18181b]">{theme.name}</p>
            <p className="text-[12px] text-[#71717a]">{theme.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={!selectedTheme}
          className="flex-1 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Theme
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


