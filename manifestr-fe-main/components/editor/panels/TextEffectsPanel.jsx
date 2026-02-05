import { useState, useEffect } from 'react'

export default function TextEffectsPanel({ selectedElement, onUpdate, onClose, effectType = 'all' }) {
  const [gradient, setGradient] = useState(selectedElement?.gradient || false)
  const [gradientColor, setGradientColor] = useState(selectedElement?.gradientColor || '#71717a')
  const [outline, setOutline] = useState(selectedElement?.outline || false)
  const [outlineColor, setOutlineColor] = useState(selectedElement?.outlineColor || '#ffffff')
  const [outlineWidth, setOutlineWidth] = useState(selectedElement?.outlineWidth || 2)
  const [glow, setGlow] = useState(selectedElement?.glow || false)
  const [glowIntensity, setGlowIntensity] = useState(selectedElement?.glowIntensity || 10)
  const [shadow, setShadow] = useState(selectedElement?.textShadow || false)
  const [shadowIntensity, setShadowIntensity] = useState(selectedElement?.shadowIntensity || 5)

  useEffect(() => {
    if (selectedElement) {
      setGradient(selectedElement.gradient || false)
      setGradientColor(selectedElement.gradientColor || '#71717a')
      setOutline(selectedElement.outline || false)
      setOutlineColor(selectedElement.outlineColor || '#ffffff')
      setOutlineWidth(selectedElement.outlineWidth || 2)
      setGlow(selectedElement.glow || false)
      setGlowIntensity(selectedElement.glowIntensity || 10)
      setShadow(selectedElement.textShadow || false)
      setShadowIntensity(selectedElement.shadowIntensity || 5)
    }
  }, [selectedElement])

  const handleApply = () => {
    if (onUpdate && selectedElement) {
      const updates = {}
      
      if (effectType === 'all' || effectType === 'shadow') {
        updates.textShadow = shadow
        updates.shadowIntensity = shadowIntensity
      }
      if (effectType === 'all' || effectType === 'outline') {
        updates.outline = outline
        updates.outlineColor = outlineColor
        updates.outlineWidth = outlineWidth
      }
      if (effectType === 'all' || effectType === 'glow') {
        updates.glow = glow
        updates.glowIntensity = glowIntensity
      }
      if (effectType === 'all' || effectType === 'gradient') {
        updates.gradient = gradient
        updates.gradientColor = gradientColor
      }
      
      onUpdate({
        ...selectedElement,
        ...updates
      })
    }
    if (onClose) onClose()
  }

  const getTitle = () => {
    if (effectType === 'shadow') return 'Text Shadow'
    if (effectType === 'outline') return 'Text Outline'
    if (effectType === 'glow') return 'Text Glow'
    if (effectType === 'gradient') return 'Text Gradient'
    return 'Text Effects'
  }

  if (!selectedElement || selectedElement.type !== 'text') {
    return (
      <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold text-[#18181b]">{getTitle()}</h3>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
        </div>
        <div className="text-center py-8">
          <p className="text-[14px] text-[#71717a] mb-4">Please select a text element to apply effects</p>
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
        <h3 className="text-[18px] font-semibold text-[#18181b]">{getTitle()}</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="space-y-4">
        {(effectType === 'all' || effectType === 'shadow') && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="shadow"
                checked={shadow}
                onChange={(e) => setShadow(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="shadow" className="text-[14px] text-[#18181b]">Text Shadow</label>
            </div>
            {shadow && (
              <div className="ml-6 mb-2">
                <label className="block text-[12px] text-[#71717a] mb-1">Intensity: {shadowIntensity}px</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={shadowIntensity}
                  onChange={(e) => setShadowIntensity(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}

        {(effectType === 'all' || effectType === 'outline') && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="outline"
                checked={outline}
                onChange={(e) => setOutline(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="outline" className="text-[14px] text-[#18181b]">Text Outline</label>
            </div>
            {outline && (
              <div className="ml-6 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-[12px] text-[#71717a]">Color:</label>
                  <input
                    type="color"
                    value={outlineColor}
                    onChange={(e) => setOutlineColor(e.target.value)}
                    className="w-8 h-8 border border-[#e4e4e7] rounded"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#71717a] mb-1">Width: {outlineWidth}px</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={outlineWidth}
                    onChange={(e) => setOutlineWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {(effectType === 'all' || effectType === 'glow') && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="glow"
                checked={glow}
                onChange={(e) => setGlow(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="glow" className="text-[14px] text-[#18181b]">Glow Effect</label>
            </div>
            {glow && (
              <div className="ml-6 mb-2">
                <label className="block text-[12px] text-[#71717a] mb-1">Intensity: {glowIntensity}px</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}

        {(effectType === 'all' || effectType === 'gradient') && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="gradient"
                checked={gradient}
                onChange={(e) => setGradient(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="gradient" className="text-[14px] text-[#18181b]">Gradient Text</label>
            </div>
            {gradient && (
              <div className="ml-6">
                <div className="flex items-center gap-2">
                  <label className="text-[12px] text-[#71717a]">End Color:</label>
                  <input
                    type="color"
                    value={gradientColor}
                    onChange={(e) => setGradientColor(e.target.value)}
                    className="w-8 h-8 border border-[#e4e4e7] rounded"
                  />
                </div>
              </div>
            )}
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

