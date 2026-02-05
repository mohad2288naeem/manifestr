import { useState, useEffect } from 'react'

const effects = [
  { id: 'shadow', name: 'Drop Shadow', description: 'Add shadow effect' },
  { id: 'glow', name: 'Glow', description: 'Add glow effect' },
  { id: 'blur', name: 'Blur', description: 'Add blur effect' },
  { id: 'reflection', name: 'Reflection', description: 'Add reflection' },
]

export default function EffectsPanel({ selectedElement, onApply, onClose }) {
  const [selectedEffects, setSelectedEffects] = useState(selectedElement?.effects || selectedElement?.shadow ? ['shadow'] : [])
  const [shadowIntensity, setShadowIntensity] = useState(selectedElement?.shadowIntensity || selectedElement?.shadow ? 5 : 5)
  const [glowIntensity, setGlowIntensity] = useState(selectedElement?.glowIntensity || 5)

  useEffect(() => {
    if (selectedElement) {
      setSelectedEffects(selectedElement.effects || (selectedElement.shadow ? ['shadow'] : []))
      setShadowIntensity(selectedElement.shadowIntensity || 5)
      setGlowIntensity(selectedElement.glowIntensity || 5)
    }
  }, [selectedElement])

  const toggleEffect = (effectId) => {
    if (selectedEffects.includes(effectId)) {
      setSelectedEffects(selectedEffects.filter(e => e !== effectId))
    } else {
      setSelectedEffects([...selectedEffects, effectId])
    }
  }

  const handleApply = () => {
    if (onApply && selectedElement) {
      const updates = {
        ...selectedElement,
        effects: selectedEffects,
        shadowIntensity,
        glowIntensity
      }
      
      // For backward compatibility with shadow property
      if (selectedEffects.includes('shadow')) {
        updates.shadow = true
      } else {
        updates.shadow = false
      }
      
      onApply(updates)
    }
    if (onClose) onClose()
  }

  if (!selectedElement) {
    return (
      <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold text-[#18181b]">Effects</h3>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
        </div>
        <div className="text-center py-8">
          <p className="text-[14px] text-[#71717a] mb-4">Please select an element to apply effects</p>
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
        <h3 className="text-[18px] font-semibold text-[#18181b]">Effects</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="space-y-3 mb-4">
        {effects.map((effect) => (
          <div key={effect.id} className="flex items-center justify-between p-3 border border-[#e4e4e7] rounded-lg">
            <div>
              <p className="text-[14px] font-medium text-[#18181b]">{effect.name}</p>
              <p className="text-[12px] text-[#71717a]">{effect.description}</p>
            </div>
            <input
              type="checkbox"
              checked={selectedEffects.includes(effect.id)}
              onChange={() => toggleEffect(effect.id)}
              className="w-4 h-4"
            />
          </div>
        ))}
      </div>

      {selectedEffects.includes('shadow') && (
        <div className="mb-4">
          <label className="block text-[14px] font-medium text-[#18181b] mb-2">
            Shadow Intensity: {shadowIntensity}px
          </label>
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

      {selectedEffects.includes('glow') && (
        <div className="mb-4">
          <label className="block text-[14px] font-medium text-[#18181b] mb-2">
            Glow Intensity: {glowIntensity}px
          </label>
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

