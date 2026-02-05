import { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'

export default function AIPrompterPanel({ onGenerate, onClose }) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    if (onGenerate) {
      await onGenerate(prompt)
    }
    setIsGenerating(false)
    setPrompt('')
  }

  const quickPrompts = [
    'Create a title slide',
    'Add a bullet point list',
    'Generate a chart',
    'Create a conclusion slide',
    'Add a quote slide',
  ]

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[600px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#18181b]" />
          <h3 className="text-[18px] font-semibold text-[#18181b]">AI Prompter</h3>
        </div>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="mb-4">
        <label className="block text-[14px] font-medium text-[#18181b] mb-2">
          What would you like to create?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleGenerate()
            }
          }}
          placeholder="Describe what you want to create... (e.g., 'Create a professional title slide with company logo')"
          className="w-full px-4 py-3 border border-[#e4e4e7] rounded-md text-[14px] resize-none"
          rows={4}
        />
      </div>

      <div className="mb-4">
        <p className="text-[12px] text-[#71717a] mb-2">Quick Prompts:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((quickPrompt, index) => (
            <button
              key={index}
              onClick={() => setPrompt(quickPrompt)}
              className="px-3 py-1.5 bg-[#f4f4f5] border border-[#e4e4e7] rounded-md text-[12px] text-[#18181b] hover:bg-[#e4e4e7]"
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="flex-1 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate (Cmd+Enter)'}
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


