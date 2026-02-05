import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

export default function TextEditor({ 
  element, 
  onUpdate, 
  onClose 
}) {
  const [text, setText] = useState(element?.text || '')
  const [fontSize, setFontSize] = useState(element?.fontSize || 24)
  const [color, setColor] = useState(element?.color || '#18181b')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [])

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...element,
        text,
        fontSize,
        color
      })
    }
    if (onClose) onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave()
    } else if (e.key === 'Escape') {
      if (onClose) onClose()
    }
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-[#18181b]">Edit Text</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center hover:bg-[#f4f4f5] rounded"
        >
          <X className="w-4 h-4 text-[#71717a]" />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px] mb-3 resize-none"
        rows={3}
        placeholder="Enter text..."
      />

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-[#71717a]">Size:</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-16 px-2 py-1 border border-[#e4e4e7] rounded text-[12px]"
            min="8"
            max="200"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[12px] text-[#71717a]">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 border border-[#e4e4e7] rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90"
        >
          Save (Cmd+Enter)
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


