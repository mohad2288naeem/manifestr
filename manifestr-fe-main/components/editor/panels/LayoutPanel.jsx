import { useState } from 'react'

const layouts = [
  { id: 'title', name: 'Title Slide', preview: 'bg-blue-100', structure: 'Title + Subtitle' },
  { id: 'content', name: 'Content', preview: 'bg-green-100', structure: 'Title + Content' },
  { id: 'section', name: 'Section Header', preview: 'bg-purple-100', structure: 'Section Title' },
  { id: 'two-content', name: 'Two Content', preview: 'bg-yellow-100', structure: 'Title + 2 Columns' },
  { id: 'blank', name: 'Blank', preview: 'bg-white border-2 border-gray-300', structure: 'Empty slide' },
]

export default function LayoutPanel({ onApply, onClose }) {
  const [selectedLayout, setSelectedLayout] = useState(null)

  const handleApply = () => {
    if (selectedLayout && onApply) {
      onApply(layouts.find(l => l.id === selectedLayout))
    }
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Slide Layouts</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => setSelectedLayout(layout.id)}
            className={`p-4 rounded-lg border-2 text-left ${
              selectedLayout === layout.id
                ? 'border-[#18181b]'
                : 'border-[#e4e4e7] hover:border-[#71717a]'
            }`}
          >
            <div className={`w-full h-20 rounded mb-2 ${layout.preview}`} />
            <p className="text-[14px] font-medium text-[#18181b]">{layout.name}</p>
            <p className="text-[12px] text-[#71717a]">{layout.structure}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={!selectedLayout}
          className="flex-1 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Layout
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


