import { useState, useEffect } from 'react'
import { Square, Circle } from 'lucide-react'

export default function ShapeFormatPanel({ selectedElement, onUpdate, onClose, formatType = 'all' }) {
  const [fillColor, setFillColor] = useState(selectedElement?.fill || '#e4e4e7')
  const [strokeColor, setStrokeColor] = useState(selectedElement?.stroke || '#18181b')
  const [strokeWidth, setStrokeWidth] = useState(selectedElement?.strokeWidth || 1)
  const [shadow, setShadow] = useState(selectedElement?.shadow || false)

  useEffect(() => {
    if (selectedElement) {
      setFillColor(selectedElement.fill || '#e4e4e7')
      setStrokeColor(selectedElement.stroke || '#18181b')
      setStrokeWidth(selectedElement.strokeWidth || 1)
      setShadow(selectedElement.shadow || false)
    }
  }, [selectedElement])

  const handleApply = () => {
    if (onUpdate && selectedElement) {
      const updates = {}
      
      if (formatType === 'all' || formatType === 'fill') {
        updates.fill = fillColor
      }
      if (formatType === 'all' || formatType === 'outline') {
        updates.stroke = strokeColor
        updates.strokeWidth = Number(strokeWidth)
      }
      if (formatType === 'all' || formatType === 'effects') {
        updates.shadow = shadow
      }
      
      onUpdate({
        ...selectedElement,
        ...updates
      })
    }
    if (onClose) onClose()
  }

  if (!selectedElement || selectedElement.type !== 'shape') {
    return (
      <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold text-[#18181b]">Shape Format</h3>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
        </div>
        <div className="text-center py-8">
          <p className="text-[14px] text-[#71717a] mb-4">Please select a shape element to format</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#18181b] text-white rounded-md text-[14px] font-medium hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Shape Format</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="space-y-4">
        {(formatType === 'all' || formatType === 'fill') && (
          <div>
            <label className="block text-[14px] font-medium text-[#18181b] mb-2">Fill Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-12 h-12 border border-[#e4e4e7] rounded cursor-pointer"
              />
              <input
                type="text"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px]"
              />
            </div>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {['#e4e4e7', '#18181b', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'].map((color) => (
                <button
                  key={color}
                  onClick={() => setFillColor(color)}
                  className="w-full h-8 rounded border-2 border-[#e4e4e7] hover:border-[#18181b]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {(formatType === 'all' || formatType === 'outline') && (
          <>
            <div>
              <label className="block text-[14px] font-medium text-[#18181b] mb-2">Stroke Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-12 h-12 border border-[#e4e4e7] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#18181b] mb-2">Stroke Width</label>
              <input
                type="number"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(e.target.value)}
                min="0"
                max="20"
                className="w-full px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px]"
              />
            </div>
          </>
        )}

        {formatType === 'all' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shadow"
              checked={shadow}
              onChange={(e) => setShadow(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="shadow" className="text-[14px] text-[#18181b]">Add Shadow</label>
          </div>
        )}
      </div>

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

