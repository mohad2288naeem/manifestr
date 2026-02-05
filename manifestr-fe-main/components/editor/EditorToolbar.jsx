import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Type, 
  Plus, 
  Layout, 
  Move, 
  Wand2, 
  ArrowRight, 
  Zap, 
  Play,
  MessageSquare,
  Share2,
  Target,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react'

export default function EditorToolbar({ activeTab = 'style', onTabChange, onAction }) {
  const tabs = [
    { id: 'ai', label: 'AI Prompter', icon: Sparkles },
    { id: 'format', label: 'Format', icon: Type },
    { id: 'insert', label: 'Insert', icon: Plus },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'arrange', label: 'Arrange', icon: Move },
    { id: 'style', label: 'Style', icon: Wand2 },
    { id: 'transitions', label: 'Transitions', icon: ArrowRight },
    { id: 'animations', label: 'Animations', icon: Zap },
    { id: 'slideshow', label: 'Slide Show', icon: Play },
  ]

  return (
    <div className="bg-[#3a3a3a] flex items-center gap-2 px-6 py-2 h-[60px]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id)
              if (onAction) onAction(tab.id)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-[14px] font-medium transition-colors ${
              isActive
                ? 'bg-white text-[#101828] shadow-md'
                : 'text-[#d1d5dc] hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

export function CollaborationToolbar({ position = 'right' }) {
  return (
    <div className={`absolute ${position === 'right' ? 'right-4' : 'left-4'} top-[282px] bg-[#3a3a3a] border border-[rgba(0,0,0,0.3)] rounded-2xl w-[50px] p-2 flex flex-col items-center gap-2`}>
      <div className="relative">
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="absolute -top-1 -right-1 bg-[#fb2c36] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          1
        </span>
      </div>
      <div className="w-full h-px bg-[rgba(74,85,101,0.5)]" />
      <Share2 className="w-5 h-5 text-white" />
      <Target className="w-5 h-5 text-white" />
      <div className="w-full h-px bg-[rgba(74,85,101,0.5)]" />
      <ZoomIn className="w-5 h-5 text-white" />
      <ZoomOut className="w-5 h-5 text-white" />
      <Maximize2 className="w-5 h-5 text-white" />
    </div>
  )
}

