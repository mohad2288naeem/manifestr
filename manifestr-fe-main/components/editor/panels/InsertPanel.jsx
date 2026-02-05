import { useState } from 'react'
import { FileText, Image, Table, BarChart3, Square, Circle, Type } from 'lucide-react'

const insertOptions = [
  { id: 'slide', label: 'New Slide', icon: FileText },
  { id: 'text', label: 'Text Box', icon: Type },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'table', label: 'Table', icon: Table },
  { id: 'chart', label: 'Chart', icon: BarChart3 },
  { id: 'shape-rect', label: 'Rectangle', icon: Square },
  { id: 'shape-circle', label: 'Circle', icon: Circle },
]

export default function InsertPanel({ onInsert, onClose }) {
  const handleInsert = (type) => {
    if (onInsert) {
      onInsert(type)
    }
    if (onClose) onClose()
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Insert</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {insertOptions.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.id}
              onClick={() => handleInsert(option.id)}
              className="flex flex-col items-center gap-2 p-4 border border-[#e4e4e7] rounded-lg hover:bg-[#f4f4f5] hover:border-[#18181b] transition-colors"
            >
              <Icon className="w-6 h-6 text-[#18181b]" />
              <span className="text-[12px] font-medium text-[#18181b]">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


