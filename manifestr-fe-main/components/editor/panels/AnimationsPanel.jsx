import { useState } from 'react'

const animationTypes = [
  { category: 'Entrance', animations: ['fade-in', 'slide-in', 'zoom-in', 'bounce'] },
  { category: 'Emphasis', animations: ['pulse', 'shake', 'rotate', 'scale'] },
  { category: 'Exit', animations: ['fade-out', 'slide-out', 'zoom-out', 'bounce-out'] },
]

export default function AnimationsPanel({ selectedElement, onApply, onClose }) {
  const [selectedAnimation, setSelectedAnimation] = useState(selectedElement?.animation || null)
  const [duration, setDuration] = useState(selectedElement?.animationDuration || 0.5)

  const handleApply = () => {
    if (onApply && selectedElement) {
      onApply({
        ...selectedElement,
        animation: selectedAnimation,
        animationDuration: Number(duration)
      })
    }
    if (onClose) onClose()
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[500px] max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Animations</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      {animationTypes.map((type) => (
        <div key={type.category} className="mb-6">
          <h4 className="text-[14px] font-semibold text-[#18181b] mb-3">{type.category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {type.animations.map((anim) => (
              <button
                key={anim}
                onClick={() => setSelectedAnimation(anim)}
                className={`p-3 rounded-lg border-2 text-left ${
                  selectedAnimation === anim
                    ? 'border-[#18181b] bg-[#f4f4f5]'
                    : 'border-[#e4e4e7] hover:border-[#71717a]'
                }`}
              >
                <p className="text-[12px] font-medium text-[#18181b] capitalize">
                  {anim.replace('-', ' ')}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-[14px] font-medium text-[#18181b] mb-2">
          Duration: {duration}s
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
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


