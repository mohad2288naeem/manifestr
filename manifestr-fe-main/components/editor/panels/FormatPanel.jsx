import { useState } from 'react'
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react'

export default function FormatPanel({ selectedElement, onUpdate, onClose }) {
  const [fontSize, setFontSize] = useState(selectedElement?.fontSize || 24)
  const [fontFamily, setFontFamily] = useState(selectedElement?.fontFamily || 'Inter')
  const [bold, setBold] = useState(selectedElement?.bold || false)
  const [italic, setItalic] = useState(selectedElement?.italic || false)
  const [underline, setUnderline] = useState(selectedElement?.underline || false)
  const [align, setAlign] = useState(selectedElement?.align || 'left')

  const fontFamilies = ['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New']

  const handleApply = () => {
    if (onUpdate && selectedElement) {
      onUpdate({
        ...selectedElement,
        fontSize: Number(fontSize),
        fontFamily,
        bold,
        italic,
        underline,
        align
      })
    }
    if (onClose) onClose()
  }

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Format</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[14px] font-medium text-[#18181b] mb-2">Font Size</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            min="8"
            max="200"
            className="w-full px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px]"
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#18181b] mb-2">Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full px-3 py-2 border border-[#e4e4e7] rounded-md text-[14px]"
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#18181b] mb-2">Text Style</label>
          <div className="flex gap-2">
            <button
              onClick={() => setBold(!bold)}
              className={`p-2 rounded border ${
                bold ? 'bg-[#18181b] text-white border-[#18181b]' : 'border-[#e4e4e7]'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => setItalic(!italic)}
              className={`p-2 rounded border ${
                italic ? 'bg-[#18181b] text-white border-[#18181b]' : 'border-[#e4e4e7]'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setUnderline(!underline)}
              className={`p-2 rounded border ${
                underline ? 'bg-[#18181b] text-white border-[#18181b]' : 'border-[#e4e4e7]'
              }`}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#18181b] mb-2">Alignment</label>
          <div className="flex gap-2">
            <button
              onClick={() => setAlign('left')}
              className={`p-2 rounded border ${
                align === 'left' ? 'bg-[#18181b] text-white border-[#18181b]' : 'border-[#e4e4e7]'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAlign('center')}
              className={`p-2 rounded border ${
                align === 'center' ? 'bg-[#18181b] text-white border-[#18181b]' : 'border-[#e4e4e7]'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAlign('right')}
              className={`p-2 rounded border ${
                align === 'right' ? 'bg-[#18181b] text-white border-[#18181b]' : 'border-[#e4e4e7]'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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


