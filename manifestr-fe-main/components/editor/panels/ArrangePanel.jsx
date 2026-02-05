import { MoveUp, MoveDown, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Group } from 'lucide-react'

export default function ArrangePanel({ selectedElements = [], onArrange, onClose }) {
  const handleArrange = (action) => {
    if (onArrange) {
      onArrange(action)
    }
  }

  const arrangeOptions = [
    { id: 'bring-forward', label: 'Bring Forward', icon: MoveUp },
    { id: 'send-backward', label: 'Send Backward', icon: MoveDown },
    { id: 'align-left', label: 'Align Left', icon: AlignLeft },
    { id: 'align-center', label: 'Align Center', icon: AlignCenter },
    { id: 'align-right', label: 'Align Right', icon: AlignRight },
    { id: 'align-top', label: 'Align Top', icon: AlignVerticalJustifyCenter },
    { id: 'align-middle', label: 'Align Middle', icon: AlignHorizontalJustifyCenter },
    { id: 'group', label: 'Group', icon: Group },
  ]

  return (
    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-white border border-[#e4e4e7] rounded-lg shadow-xl p-6 z-50 w-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-[#18181b]">Arrange</h3>
        <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {arrangeOptions.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.id}
              onClick={() => handleArrange(option.id)}
              className="flex items-center gap-2 p-3 border border-[#e4e4e7] rounded-lg hover:bg-[#f4f4f5] hover:border-[#18181b] transition-colors"
            >
              <Icon className="w-4 h-4 text-[#18181b]" />
              <span className="text-[14px] text-[#18181b]">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

