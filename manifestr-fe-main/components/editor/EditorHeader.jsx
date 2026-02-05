import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { 
  Home, 
  Loader2, 
  Pencil, 
  ChevronDown, 
  CornerUpLeft, 
  CornerUpRight,
  Cloud,
  Plus,
  Share2
} from 'lucide-react'
import Logo from '../logo/Logo'

export default function EditorHeader({ 
  documentTitle = 'Untitled document',
  status = 'In Progress',
  editingMode = 'Editing',
  version = 'v1.1',
  onStatusChange,
  onEditingModeChange,
  onUndo,
  onRedo,
  onShareExport,
  collaborators = []
}) {
  const router = useRouter()
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isEditingModeOpen, setIsEditingModeOpen] = useState(false)

  const statusOptions = ['In Progress', 'Draft', 'Review', 'Completed']
  const editingModeOptions = ['Editing', 'Viewing', 'Commenting']

  return (
    <header className="bg-white border-b border-[#e4e4e7] fixed top-0 left-0 right-0 z-[100] h-[72px]">
      <div className="w-full px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left Section: Home + Logo + Document Title + Status */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className="flex items-center gap-6">
              {/* Home Button */}
              <motion.button
                onClick={() => router.push('/home')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#f4f4f5] transition-colors"
              >
                <Home className="w-4 h-4 text-[#18181b]" />
              </motion.button>

              {/* Logo */}
              <div className="w-[100px]">
                <Logo size="xs" />
              </div>

              {/* Document Title */}
              <div className="flex items-center">
                <h1 className="text-[20px] font-semibold leading-[30px] text-[#18181b] whitespace-nowrap">
                  {documentTitle}
                </h1>
              </div>
            </div>

            {/* Status and Editing Mode Dropdowns */}
            <div className="flex items-center gap-3 ml-6">
              {/* Status Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setIsStatusOpen(!isStatusOpen)
                    setIsEditingModeOpen(false)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-10 px-4 py-2 bg-white border border-[#e4e4e7] rounded-md flex items-center gap-2 hover:bg-[#f4f4f5] transition-colors"
                >
                  <Loader2 className="w-4 h-4 text-[#18181b]" />
                  <span className="text-[14px] font-medium leading-[20px] text-[#18181b]">
                    {status}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#18181b]" />
                </motion.button>

                {isStatusOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsStatusOpen(false)}
                    />
                    <div className="absolute z-20 mt-1 left-0 w-[160px] bg-white border border-[#e4e4e7] rounded-md shadow-lg">
                      {statusOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            if (onStatusChange) onStatusChange(option)
                            setIsStatusOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-[14px] leading-[20px] hover:bg-[#f4f4f5] transition-colors ${
                            status === option ? 'bg-[#f4f4f5] font-medium' : 'text-[#18181b]'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Editing Mode Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setIsEditingModeOpen(!isEditingModeOpen)
                    setIsStatusOpen(false)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-10 px-4 py-2 bg-white border border-[#e4e4e7] rounded-md flex items-center gap-2 hover:bg-[#f4f4f5] transition-colors"
                >
                  <Pencil className="w-4 h-4 text-[#18181b]" />
                  <span className="text-[14px] font-medium leading-[20px] text-[#18181b]">
                    {editingMode}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#18181b]" />
                </motion.button>

                {isEditingModeOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsEditingModeOpen(false)}
                    />
                    <div className="absolute z-20 mt-1 left-0 w-[160px] bg-white border border-[#e4e4e7] rounded-md shadow-lg">
                      {editingModeOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            if (onEditingModeChange) onEditingModeChange(option)
                            setIsEditingModeOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-[14px] leading-[20px] hover:bg-[#f4f4f5] transition-colors ${
                            editingMode === option ? 'bg-[#f4f4f5] font-medium' : 'text-[#18181b]'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Undo/Redo Buttons */}
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={onUndo}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-[#e4e4e7] rounded-md hover:bg-[#f4f4f5] transition-colors opacity-50"
                  disabled
                >
                  <CornerUpLeft className="w-4 h-4 text-[#18181b]" />
                </motion.button>
                <motion.button
                  onClick={onRedo}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-[#e4e4e7] rounded-md hover:bg-[#f4f4f5] transition-colors"
                >
                  <CornerUpRight className="w-4 h-4 text-[#18181b]" />
                </motion.button>
              </div>

              {/* Version Indicator */}
              <div className="px-1">
                <span className="text-[14px] font-medium leading-[20px] text-[#71717a]">
                  {version}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Auto-save + Collaborators + Share */}
          <div className="flex items-center gap-4">
            {/* Auto-save Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#f4f4f5] transition-colors"
            >
              <Cloud className="w-4 h-4 text-[#18181b]" />
            </motion.button>

            {/* Collaborators */}
            <div className="flex items-center -space-x-2">
              {collaborators.slice(0, 2).map((collab, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-[#e4e4e7]"
                >
                  {collab.avatar ? (
                    <img
                      src={collab.avatar}
                      alt={collab.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[12px] font-medium text-[#71717a]">
                        {collab.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white border border-[#e4e4e7] flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#18181b]" />
              </motion.button>
            </div>

            {/* Share & Export Button */}
            <motion.button
              onClick={onShareExport}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-10 px-4 py-2 bg-[#18181b] text-white rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[14px] font-medium leading-[20px]">
                Share & Export
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}

