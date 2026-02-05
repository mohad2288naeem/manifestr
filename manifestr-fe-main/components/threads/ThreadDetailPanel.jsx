import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ArrowLeft, MapPin, Users, AlertCircle, Calendar, FileText,
  ChevronDown, Plus, CheckCircle2, MessageSquare, Circle, Filter, Search
} from 'lucide-react'

export default function ThreadDetailPanel({ thread, onBack, onClose, onSave }) {
  const [comment, setComment] = useState(thread?.comment || '')
  const [assignees, setAssignees] = useState(thread?.assignedTo || [])
  const [priority, setPriority] = useState(thread?.priority || 'high')
  const [dueDate, setDueDate] = useState(thread?.dueDate || '')
  const [notes, setNotes] = useState('')
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)
  const [newAssignee, setNewAssignee] = useState('')

  const priorityOptions = ['Low', 'Medium', 'High', 'Critical']
  const teamMembers = ['Mike', 'Sarah', 'Alex', 'Jordan', 'Taylor', 'Emily', 'Lawn']

  const handleRemoveAssignee = (name) => {
    setAssignees(assignees.filter((a) => a !== name))
  }

  const handleAddAssignee = () => {
    if (newAssignee && !assignees.includes(newAssignee)) {
      setAssignees([...assignees, newAssignee])
      setNewAssignee('')
    }
  }

  const breadcrumbs = thread?.location?.split(' → ') || ['Product Page', 'Gallery', 'Primary Image']

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white border border-zinc-200 rounded-[10px] w-[406px] h-[815px] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-b from-white to-[rgba(236,236,240,0.05)] border-b border-zinc-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-neutral-950" />
              <h2 className="text-[16px] font-medium leading-[24px] text-neutral-950 tracking-[-0.3125px]">
                Threads
              </h2>
            </div>
            <p className="text-[12px] font-normal leading-[16px] text-[#717182]">
              Design feedback & comments
            </p>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-[#f4f4f5] transition-colors"
          >
            <X className="w-4 h-4 text-[#4f5857]" />
          </motion.button>
        </div>

        {/* Stats Cards (same as front view) */}
        <div className="grid grid-cols-4 gap-2">
          <div className="border border-[rgba(3,2,19,0.1)] rounded-[14px] p-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[rgba(113,113,130,0.8)]" />
              <span className="text-[9px] font-normal leading-[13.5px] text-[rgba(113,113,130,0.8)] tracking-[0.617px] uppercase">
                Total
              </span>
            </div>
            <p className="text-[20px] font-normal leading-[28px] text-neutral-950 tracking-[-0.4492px]">
              16
            </p>
          </div>
          <div className="border border-[rgba(0,201,80,0.15)] rounded-[14px] p-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[rgba(113,113,130,0.8)]" />
              <span className="text-[9px] font-normal leading-[13.5px] text-[rgba(113,113,130,0.8)] tracking-[0.617px] uppercase">
                Done
              </span>
            </div>
            <p className="text-[20px] font-normal leading-[28px] text-neutral-950 tracking-[-0.4492px]">
              4
            </p>
          </div>
          <div className="border border-[rgba(255,105,0,0.15)] rounded-[14px] p-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-[rgba(113,113,130,0.8)]" />
              <span className="text-[9px] font-normal leading-[13.5px] text-[rgba(113,113,130,0.8)] tracking-[0.617px] uppercase">
                Open
              </span>
            </div>
            <p className="text-[20px] font-normal leading-[28px] text-neutral-950 tracking-[-0.4492px]">
              6
            </p>
          </div>
          <div className="border border-[rgba(251,44,54,0.15)] rounded-[14px] p-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-[rgba(113,113,130,0.8)]" />
              <span className="text-[9px] font-normal leading-[13.5px] text-[rgba(113,113,130,0.8)] tracking-[0.617px] uppercase">
                Alert
              </span>
            </div>
            <p className="text-[20px] font-normal leading-[28px] text-neutral-950 tracking-[-0.4492px]">
              0
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search (same as front view) */}
      <div className="border-b border-zinc-200 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-0 bg-gray-200 rounded-[14px] p-[3.5px]">
          <div className="h-[29px] rounded-[14px] bg-black border border-[rgba(0,0,0,0.2)] flex items-center justify-center">
            <span className="text-[12px] font-normal leading-[16px] text-white">
              My Threads
            </span>
          </div>
          <div className="h-[29px] rounded-[14px] border border-[rgba(0,0,0,0.2)] flex items-center justify-center">
            <span className="text-[12px] font-normal leading-[16px] text-black">
              All Project
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Status', 'Priority', 'Due', 'Assignee'].map((filter) => (
            <div
              key={filter}
              className="border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[22px] px-2 flex items-center gap-1.5 text-[12px] font-normal leading-[16px] text-neutral-950"
            >
              <Filter className="w-3 h-3" />
              {filter}
            </div>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#717182]" />
          <input
            type="text"
            placeholder="Search threads..."
            className="w-full h-[36px] pl-9 pr-10 bg-white border border-[rgba(0,0,0,0.04)] rounded-[10px] text-[14px] font-normal leading-[normal] text-[#717182] tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[#f4f4f5] transition-colors"
          >
            <Filter className="w-4 h-4 text-[#71717a]" />
          </motion.button>
        </div>
      </div>

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 p-4">
        {/* Back Button & Advanced Settings */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-[28px] px-2 flex items-center gap-1.5 text-[14px] font-medium leading-[20px] text-neutral-950 tracking-[-0.1504px] hover:bg-[#f4f4f5] rounded-[8px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
          <span className="text-[12px] font-normal leading-[16px] text-neutral-950">
            Advanced Settings
          </span>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-4 px-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-1">
              {index > 0 && <span className="text-[#4a5565]">→</span>}
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#4a5565]" />
                <span className="text-[12px] font-normal leading-[16px] text-[#4a5565]">
                  {crumb}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Comment */}
        <div className="space-y-1 mb-4">
          <label className="text-[12px] font-medium leading-[16px] text-neutral-950">
            Comment
          </label>
          <div className="bg-white h-[56px] rounded-[4px] p-2">
            <p className="text-[12px] font-normal leading-[16px] text-neutral-950">
              {comment}
            </p>
          </div>
        </div>

        {/* Assignees */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-neutral-950" />
            <label className="text-[12px] font-medium leading-[16px] text-neutral-950">
              Assignee(s)
            </label>
          </div>
          <div className="flex gap-1.5 flex-wrap mb-2">
            {assignees.map((assignee) => (
              <div
                key={assignee}
                className="bg-white h-[32px] px-1.5 py-0 rounded-[6px] flex items-center justify-between gap-1.5"
              >
                <span className="text-[12px] font-normal leading-[16px] text-neutral-950">
                  {assignee}
                </span>
                <motion.button
                  onClick={() => handleRemoveAssignee(assignee)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-5 h-5 flex items-center justify-center rounded-[8px] hover:bg-[#f4f4f5] transition-colors"
                >
                  <X className="w-4 h-4 text-[#71717a]" />
                </motion.button>
              </div>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddAssignee()
                }
              }}
              placeholder="Add members..."
              className="w-full h-[28px] px-3 bg-white border border-transparent rounded-[8px] text-[14px] font-normal leading-[normal] text-[#717182] tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
            />
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-neutral-950" />
            <label className="text-[12px] font-medium leading-[16px] text-neutral-950">
              Priority
            </label>
          </div>
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowPriorityDropdown(!showPriorityDropdown)
                setShowAssigneeDropdown(false)
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-white border border-transparent rounded-[8px] px-[13px] py-1 h-[36px] flex items-center justify-between hover:border-[#e4e4e7] transition-colors"
            >
              <span className={`text-[12px] font-normal leading-[16px] capitalize ${
                priority === 'Critical' ? 'text-[#e7000b]' : 
                priority === 'High' ? 'text-[#e7000b]' : 
                priority === 'Medium' ? 'text-[#f59e0b]' : 
                'text-[#4a5565]'
              }`}>
                {priority}
              </span>
              <ChevronDown className="w-4 h-4 text-[#71717a]" />
            </motion.button>
            <AnimatePresence>
              {showPriorityDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                >
                  {priorityOptions.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => {
                        setPriority(option.toLowerCase())
                        setShowPriorityDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[12px] leading-[16px] text-[#18181b]"
                    >
                      {option}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-950" />
            <label className="text-[12px] font-medium leading-[16px] text-neutral-950">
              Due Date
            </label>
          </div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full h-[28px] px-3 bg-white border border-transparent rounded-[8px] text-[14px] font-normal leading-[normal] text-[#717182] tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-neutral-950" />
            <label className="text-[12px] font-medium leading-[16px] text-neutral-950">
              Notes
            </label>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add instructions or context..."
            rows={3}
            className="w-full h-[64px] px-3 py-2 bg-white border border-transparent rounded-[8px] text-[14px] font-normal leading-[20px] text-[#717182] tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => {
              if (onSave) {
                onSave({
                  comment,
                  assignees,
                  priority,
                  dueDate,
                  notes,
                })
              }
              onBack()
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-[#030213] text-white rounded-[8px] h-[32px] px-3 text-[12px] font-medium leading-[16px] hover:opacity-90 transition-opacity"
          >
            Save Changes
          </motion.button>
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[32px] px-[13px] text-[12px] font-medium leading-[16px] text-neutral-950 hover:bg-[#f4f4f5] transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

