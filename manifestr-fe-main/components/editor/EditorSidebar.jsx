import { useState } from 'react'
import { motion } from 'framer-motion'
import { Folder, Grid, Plus, FileText } from 'lucide-react'

export default function EditorSidebar({ 
  slides = [],
  currentSlideIndex = 0,
  onSlideSelect,
  onNewSlide,
  viewMode = 'page', // 'page' or 'grid'
  onViewModeChange
}) {
  return (
    <div className="bg-white border-r border-[#e4e4e7] w-[139px] h-full flex flex-col">
      {/* Top Actions */}
      <div className="border-b border-[#e4e4e7] p-3">
        <motion.button
          onClick={onNewSlide}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-[#18181b] text-white rounded px-3 py-2 flex items-center gap-2 text-[10px] font-medium"
        >
          <Plus className="w-3 h-3" />
          <span>New</span>
        </motion.button>
      </div>

      {/* Slide Thumbnails */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            onClick={() => onSlideSelect(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`h-[70px] rounded border cursor-pointer bg-white ${
              index === currentSlideIndex
                ? 'border-[#18181b]'
                : 'border-[rgba(106,114,130,0.14)]'
            }`}
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-[8px] text-[#6a7282]">{index + 1}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom View Toggle */}
      <div className="border-t border-[#e4e4e7] p-3">
        <div className="flex rounded overflow-hidden">
          <button
            onClick={() => onViewModeChange('page')}
            className={`flex-1 px-2 py-1.5 text-[6px] font-medium flex items-center justify-center gap-1 ${
              viewMode === 'page'
                ? 'bg-[#18181b] text-white'
                : 'bg-transparent text-[#18181b]'
            }`}
          >
            <FileText className="w-2 h-2" />
            <span>Page View</span>
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex-1 px-2 py-1.5 text-[6px] font-medium flex items-center justify-center gap-1 ${
              viewMode === 'grid'
                ? 'bg-[#18181b] text-white'
                : 'bg-transparent text-[#18181b]'
            }`}
          >
            <Grid className="w-2 h-2" />
            <span>Grid View</span>
          </button>
        </div>
      </div>
    </div>
  )
}


