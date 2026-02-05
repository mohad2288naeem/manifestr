import { useState } from 'react'

const colorSchemes = [
  { name: 'Monochromatic', colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'] },
  { name: 'Complementary', colors: ['#3b82f6', '#f59e0b'] },
  { name: 'Analogous', colors: ['#3b82f6', '#8b5cf6', '#ec4899'] },
  { name: 'Triadic', colors: ['#3b82f6', '#10b981', '#f59e0b'] },
  { name: 'Warm', colors: ['#ef4444', '#f59e0b', '#eab308'] },
  { name: 'Cool', colors: ['#3b82f6', '#06b6d4', '#10b981'] },
]

export default function ColorSchemePanel({ onApply, onClose }) {
  const [selectedScheme, setSelectedScheme] = useState(null)

  const handleApply = () => {
    if (selectedScheme && onApply) {
      const scheme = colorSchemes.find(s => s.name === selectedScheme)
      onApply(scheme)
    }
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Color Scheme</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.name}
            onClick={() => setSelectedScheme(scheme.name)}
            className={`p-4 rounded-lg border-2 text-left ${
              selectedScheme === scheme.name
                ? 'border-[#18181b] bg-[#f4f4f5]'
                : 'border-[#e4e4e7] hover:border-[#71717a]'
            }`}
          >
            <div className="flex gap-1 mb-2">
              {scheme.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-8 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-[14px] font-medium text-[#18181b]">{scheme.name}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={!selectedScheme}
          className="flex-1 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Scheme
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


