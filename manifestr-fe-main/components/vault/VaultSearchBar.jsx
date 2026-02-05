import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mic, ChevronDown, Grid, List, X } from 'lucide-react'

export default function VaultSearchBar({ viewMode, setViewMode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllToolsDropdown, setShowAllToolsDropdown] = useState(false)
  const [showLastEditedDropdown, setShowLastEditedDropdown] = useState(false)
  const [selectedTool, setSelectedTool] = useState('All Tools')
  const [selectedSort, setSelectedSort] = useState('Last Edited')

  const tools = ['All Tools', 'The Deck', 'The Briefcase', 'The Strategist', 'The Analyzer']
  const sortOptions = ['Last Edited', 'Name', 'Date Created', 'Size']

  return (
    <div className="px-4 md:px-[30px] py-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative h-[48px] bg-white border border-[#e4e4e7] rounded-md overflow-hidden">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-[#71717a]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search The Vault..."
            className="w-full h-full pl-10 pr-4 text-[14px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:border-[#18181b]"
          />
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* All Tools Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowAllToolsDropdown(!showAllToolsDropdown)
                setShowLastEditedDropdown(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <span>{selectedTool}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllToolsDropdown ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showAllToolsDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[129px] overflow-hidden"
                >
                  {tools.map((tool) => (
                    <motion.button
                      key={tool}
                      onClick={() => {
                        setSelectedTool(tool)
                        setShowAllToolsDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                    >
                      {tool}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Last Edited Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowLastEditedDropdown(!showLastEditedDropdown)
                setShowAllToolsDropdown(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <span>{selectedSort}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showLastEditedDropdown ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showLastEditedDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[148px] overflow-hidden"
                >
                  {sortOptions.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option)
                        setShowLastEditedDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                    >
                      {option}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Filters */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-3 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            More Filters
          </motion.button>

          {/* Reset Filters */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-[#e4e4e7] rounded-md h-[32px] px-3 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            Reset Filters
          </motion.button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white border border-[#e4e4e7] rounded-md p-1 self-end md:self-auto">
          <motion.button
            onClick={() => setViewMode('grid')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#f4f4f5]' : ''
              }`}
          >
            <Grid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-[#18181b]' : 'text-[#71717a]'}`} />
          </motion.button>
          <motion.button
            onClick={() => setViewMode('list')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#f4f4f5]' : ''
              }`}
          >
            <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-[#18181b]' : 'text-[#71717a]'}`} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

