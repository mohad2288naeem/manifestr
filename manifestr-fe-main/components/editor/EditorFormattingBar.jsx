import { motion } from 'framer-motion'
import { 
  Palette, 
  Droplet, 
  Image, 
  Sparkles, 
  Square, 
  Circle, 
  Type,
  Moon,
  Layers,
  Paintbrush
} from 'lucide-react'

export default function EditorFormattingBar({ onAction }) {
  const sections = [
    {
      title: 'Themes',
      items: [
        { id: 'select-theme', label: 'Select Theme', icon: Palette },
        { id: 'color-scheme', label: 'Color Scheme', icon: Droplet },
        { id: 'background', label: 'Background', icon: Image },
      ]
    },
    {
      title: 'Quick Styles',
      items: [
        { id: 'quick-style', label: 'Quick Style', icon: Sparkles },
      ]
    },
    {
      title: 'Shape Format',
      items: [
        { id: 'shape-fill', label: 'Shape Fill', icon: Square },
        { id: 'outline', label: 'Outline', icon: Circle },
        { id: 'effects', label: 'Effects', icon: Layers },
      ]
    },
    {
      title: 'Text Effects',
      items: [
        { id: 'shadow', label: 'Shadow', icon: Moon },
        { id: 'outline-text', label: 'Outline', icon: Circle },
        { id: 'glow', label: 'Glow', icon: Sparkles },
        { id: 'gradient', label: 'Gradient', icon: Paintbrush },
      ]
    },
    {
      title: 'Styles',
      items: [
        { id: 'wordart', label: 'WordArt', icon: Type },
        { id: 'theme', label: 'Theme', icon: Palette },
      ]
    },
  ]

  return (
    <div className="bg-white border-t border-[#e4e4e7] px-6 py-3">
      <div className="flex items-center gap-8">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="flex flex-col gap-2">
            <span className="text-[12px] text-[#6a7282] text-center">{section.title}</span>
            <div className="flex items-center gap-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={itemIndex}
                    onClick={() => onAction && onAction(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f4f4f5] min-w-[60px]"
                  >
                    <Icon className="w-4 h-4 text-[#4a5565]" />
                    <span className="text-[9px] text-[#4a5565] text-center leading-tight">
                      {item.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

