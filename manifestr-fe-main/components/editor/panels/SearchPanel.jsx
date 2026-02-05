import { useState } from 'react'
import { Search, FileText, Image, Layout, Box, Layers, HelpCircle } from 'lucide-react'

const searchTypes = [
  { id: 'global', label: 'Global Search', icon: Search, description: 'Find text across all slides' },
  { id: 'media', label: 'Media Search', icon: Image, description: 'Search and insert images/videos' },
  { id: 'template', label: 'Template Search', icon: Layout, description: 'Browse presentation templates' },
  { id: 'object', label: 'Object Search', icon: Box, description: 'Find specific elements in slides' },
  { id: 'slide', label: 'Slide Search', icon: Layers, description: 'Navigate to specific slides' },
  { id: 'format', label: 'Format Search', icon: FileText, description: 'Find formatting options' },
  { id: 'help', label: 'Help Search', icon: HelpCircle, description: 'Search help documentation' },
]

export default function SearchPanel({ searchType = 'global', onClose, onSearch }) {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState(searchType)

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(selectedType, query)
    }
  }

  const currentType = searchTypes.find(t => t.id === selectedType)

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Search</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      {/* Search Type Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {searchTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium whitespace-nowrap ${
                selectedType === type.id
                  ? 'bg-[#18181b] text-white'
                  : 'bg-[#f4f4f5] text-[#18181b] hover:bg-[#e4e4e7]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          )
        })}
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="flex items-center gap-2 border border-[#e4e4e7] rounded-md px-3 py-2">
          <Search className="w-5 h-5 text-[#71717a]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={`${currentType?.description || 'Search...'}`}
            className="flex-1 outline-none text-[14px]"
            autoFocus
          />
        </div>
        <p className="text-[12px] text-[#71717a] mt-2">{currentType?.description}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSearch}
          className="flex-1 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90"
        >
          Search
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


