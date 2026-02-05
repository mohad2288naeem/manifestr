import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mic, ChevronDown, Grid, List, Check } from 'lucide-react'

export default function DeletedSearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedSort, setSelectedSort] = useState('Date Deleted (Newest)')
  const [viewMode, setViewMode] = useState('grid')
  const [selectAll, setSelectAll] = useState(false)

  const sortOptions = ['Date Deleted (Newest)', 'Date Deleted (Oldest)', 'Name', 'Size']

  return (
    <div className="px-[30px] py-6 space-y-4">
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
            className="w-full h-full pl-10 pr-12 text-[14px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:border-[#18181b]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Mic className="w-6 h-6 text-[#71717a] cursor-pointer hover:text-[#18181b] transition-colors" />
          </div>
        </div>
      </div>

      {/* Action Buttons and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Select All */}
          <motion.button
            onClick={() => setSelectAll(!selectAll)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            <div className={`w-4 h-4 border border-[#e4e4e7] rounded ${selectAll ? 'bg-[#18181b] border-[#18181b]' : 'bg-white'} flex items-center justify-center`}>
              {selectAll && <Check className="w-3 h-3 text-white" />}
            </div>
            <span>Select All</span>
          </motion.button>

          {/* Restore Selected */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#dddddd] border border-[#e4e4e7] rounded-md h-[36px] px-3 text-[14px] font-medium leading-[20px] text-[#5e5e67] hover:bg-[#d1d1d1] transition-colors"
          >
            Restore Selected
          </motion.button>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-[16px] leading-[24px] text-[#52525c]">Sort by:</span>
            <div className="relative">
              <motion.button
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-[#e4e4e7] rounded-lg h-[40px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
              >
                <span>{selectedSort}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[200px] overflow-hidden"
                  >
                    {sortOptions.map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => {
                          setSelectedSort(option)
                          setShowSortDropdown(false)
                        }}
                        whileHover={{ backgroundColor: '#f4f4f5' }}
                        className="w-full px-4 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                      >
                        {option}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white border border-[#e4e4e7] rounded-lg p-1">
          <motion.button
            onClick={() => setViewMode('grid')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-[#18181b]' : ''
            }`}
          >
            <Grid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-white' : 'text-[#71717a]'}`} />
          </motion.button>
          <motion.button
            onClick={() => setViewMode('list')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-[#18181b]' : ''
            }`}
          >
            <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-white' : 'text-[#71717a]'}`} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}




