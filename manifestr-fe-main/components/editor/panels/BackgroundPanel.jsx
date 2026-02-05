import { useState } from 'react'
import { Image, Palette } from 'lucide-react'

export default function BackgroundPanel({ selectedSlide, onApply, onClose }) {
  const [bgType, setBgType] = useState('color')
  const [bgColor, setBgColor] = useState(selectedSlide?.backgroundColor || '#ffffff')
  const [bgImage, setBgImage] = useState(selectedSlide?.backgroundImage || '')

  const presetColors = [
    '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db',
    '#111827', '#1f2937', '#374151', '#4b5563',
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBgImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleApply = () => {
    if (onApply) {
      onApply({
        backgroundColor: bgType === 'color' ? bgColor : undefined,
        backgroundImage: bgType === 'image' ? bgImage : undefined
      })
    }
    if (onClose) onClose()
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Background</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setBgType('color')}
          className={`flex-1 px-4 py-2 rounded-md text-[14px] font-medium ${
            bgType === 'color'
              ? 'bg-[#18181b] text-white'
              : 'bg-[#f4f4f5] text-[#18181b]'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Color
        </button>
        <button
          onClick={() => setBgType('image')}
          className={`flex-1 px-4 py-2 rounded-md text-[14px] font-medium ${
            bgType === 'image'
              ? 'bg-[#18181b] text-white'
              : 'bg-[#f4f4f5] text-[#18181b]'
          }`}
        >
          <Image className="w-4 h-4 inline mr-2" />
          Image
        </button>
      </div>

      {bgType === 'color' ? (
        <div>
          <label className="block text-[14px] font-medium text-[#18181b] mb-2">Background Color</label>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-16 h-16 border border-[#e4e4e7] rounded cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px]"
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setBgColor(color)}
                className="w-full h-10 rounded border-2 border-[#e4e4e7] hover:border-[#18181b]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-[14px] font-medium text-[#18181b] mb-2">Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px] mb-4"
          />
          {bgImage && (
            <div className="w-full h-32 rounded border border-[#e4e4e7] overflow-hidden mb-4">
              <img src={bgImage} alt="Background preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <button
          onClick={handleApply}
          className="flex-1 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90"
        >
          Apply
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


