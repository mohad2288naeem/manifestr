import { useState } from 'react'

const wordArtStyles = [
  { id: 'gradient-1', name: 'Gradient 1', preview: 'bg-gradient-to-r from-blue-500 to-purple-600' },
  { id: 'gradient-2', name: 'Gradient 2', preview: 'bg-gradient-to-r from-pink-500 to-orange-500' },
  { id: 'gradient-3', name: 'Gradient 3', preview: 'bg-gradient-to-r from-green-400 to-blue-500' },
  { id: '3d', name: '3D Effect', preview: 'bg-blue-600' },
  { id: 'outline', name: 'Outline', preview: 'bg-transparent border-4 border-blue-600' },
  { id: 'shadow', name: 'Shadow', preview: 'bg-gray-800' },
]

export default function WordArtPanel({ selectedElement, onApply, onClose }) {
  const [selectedStyle, setSelectedStyle] = useState(null)

  const handleApply = () => {
    if (selectedStyle && onApply && selectedElement) {
      onApply({
        ...selectedElement,
        wordArtStyle: selectedStyle
      })
    }
    if (onClose) onClose()
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">WordArt Styles</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {wordArtStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`p-4 rounded-lg border-2 text-center ${
              selectedStyle === style.id
                ? 'border-[#18181b]'
                : 'border-[#e4e4e7] hover:border-[#71717a]'
            }`}
          >
            <div className={`w-full h-16 rounded mb-2 ${style.preview} flex items-center justify-center`}>
              <span className="text-white font-bold text-[12px]">Aa</span>
            </div>
            <p className="text-[12px] font-medium text-[#18181b]">{style.name}</p>
          </button>
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


