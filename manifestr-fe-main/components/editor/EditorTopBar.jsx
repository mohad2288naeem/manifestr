import { motion } from 'framer-motion'
import { Folder, Grid, Search } from 'lucide-react'

export default function EditorTopBar({ onSearchClick, onInsertClick }) {
  return (
    <div className="bg-white border-b border-[#e4e4e7] px-6 py-3 flex items-center gap-3 h-[53px]">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-[#f4f4f5] px-3 py-2 rounded-lg flex items-center gap-2 text-[14px] font-medium text-[#18181b]"
      >
        <Folder className="w-4 h-4" />
        <span>Browse Vault</span>
      </motion.button>
      
      <div className="w-px h-6 bg-[#d1d5dc]" />
      
      <motion.button
        onClick={onInsertClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-[#f4f4f5] px-3 py-2 rounded-lg flex items-center gap-2 text-[14px] font-medium text-[#18181b]"
      >
        <Grid className="w-4 h-4" />
        <span>Insert</span>
      </motion.button>

      <motion.button
        onClick={onSearchClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-[#f4f4f5] px-3 py-2 rounded-lg flex items-center gap-2 text-[14px] font-medium text-[#18181b] ml-auto"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
      </motion.button>
    </div>
  )
}

