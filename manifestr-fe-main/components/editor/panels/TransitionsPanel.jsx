import { useState } from 'react'

const transitions = [
  { id: 'fade', name: 'Fade', description: 'Smooth fade transition' },
  { id: 'slide', name: 'Slide', description: 'Slide from side' },
  { id: 'zoom', name: 'Zoom', description: 'Zoom in/out effect' },
  { id: 'none', name: 'None', description: 'No transition' },
]

export default function TransitionsPanel({ selectedSlide, onApply, onClose }) {
  const [selectedTransition, setSelectedTransition] = useState(selectedSlide?.transition || 'none')
  const [duration, setDuration] = useState(selectedSlide?.transitionDuration || 0.5)

  const handleApply = () => {
    if (onApply) {
      onApply({
        transition: selectedTransition,
        transitionDuration: Number(duration)
      })
    }
    if (onClose) onClose()
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Transitions</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="space-y-3 mb-4">
        {transitions.map((transition) => (
          <button
            key={transition.id}
            onClick={() => setSelectedTransition(transition.id)}
            className={`w-full p-3 rounded-lg border-2 text-left ${
              selectedTransition === transition.id
                ? 'border-[#18181b] bg-[#f4f4f5]'
                : 'border-[#e4e4e7] hover:border-[#71717a]'
            }`}
          >
            <p className="text-[14px] font-medium text-[#18181b]">{transition.name}</p>
            <p className="text-[12px] text-[#71717a]">{transition.description}</p>
          </button>
        ))}
      </div>

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


