import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, CheckCircle2, Circle, AlertCircle, MessageSquare, 
  Search, Filter, MapPin, ThumbsUp, Heart, Smile,
  ArrowRight, MoreVertical
} from 'lucide-react'

export default function ThreadsPanel({ onClose, onThreadClick }) {
  const [activeTab, setActiveTab] = useState('My Threads')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample thread data
  const threads = [
    {
      id: '1',
      author: {
        name: 'Zaibi Ali',
        avatar: 'http://localhost:3845/assets/9715539ff58ee831d2dfa815799f62f041d8cc89.png',
        isOnline: true,
      },
      timestamp: '5m',
      location: 'Product Page → Gallery → Primary Image',
      dueDate: 'Jul 17',
      assignedTo: ['Sarah', 'Mike'],
      comment: "The heading looks way too small for this design. Consider increasing it for better visual hierarchy. what do you think?",
      reactions: { thumbsUp: 5, heart: 2, smile: 1 },
      status: 'open',
    },
    {
      id: '2',
      author: {
        name: 'Alex Martinez',
        avatar: 'http://localhost:3845/assets/9715539ff58ee831d2dfa815799f62f041d8cc89.png',
        isOnline: true,
      },
      timestamp: '18m',
      location: 'Landing → Above Fold → Call to Action',
      assignedTo: ['Lawn'],
      comment: "The color contrast here isn't meeting WCAG AA standards. We should increase the contrast ratio.",
      reactions: { thumbsUp: 4, heart: 1 },
      status: 'open',
    },
    {
      id: '3',
      author: {
        name: 'Alex Rodriguez',
        avatar: 'http://localhost:3845/assets/593b568f89f75ed2974b5cdc2bf0ca1ec1971633.png',
        isOnline: false,
      },
      timestamp: '1/7/2024',
      location: 'Dashboard → Mobile View',
      dueDate: 'Jan 9',
      assignedTo: ['Alex', 'Jordan', 'Taylor'],
      comment: "Mobile responsiveness is broken on the dashboard page. Elements are overlapping on screens smaller than 768px.",
      reactions: { thumbsUp: 12, heart: 15, smile: 8 },
      priority: 'Critical',
      status: 'open',
    },
    {
      id: '4',
      author: {
        name: 'Emily Parker',
        avatar: 'http://localhost:3845/assets/9715539ff58ee831d2dfa815799f62f041d8cc89.png',
        isOnline: false,
      },
      timestamp: '1/6/2024',
      location: 'Data Tables → Loading States',
      dueDate: 'Jan 20',
      assignedTo: ['Emily'],
      comment: "Can we add loading states to all the data tables? Currently showing blank screens which confuses users.",
      reactions: { thumbsUp: 1, heart: 2, smile: 0 },
      priority: 'Low',
      status: 'open',
    },
  ]

  const stats = {
    total: 16,
    done: 4,
    open: 6,
    alert: 0,
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-zinc-200 rounded-[10px] w-[405px] h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-b from-white to-[rgba(236,236,240,0.05)] border-b border-[rgba(0,0,0,0.05)] p-5">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="border border-[rgba(3,2,19,0.1)] rounded-[14px] p-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[rgba(113,113,130,0.8)]" />
              <span className="text-[9px] font-normal leading-[13.5px] text-[rgba(113,113,130,0.8)] tracking-[0.617px] uppercase">
                Total
              </span>
            </div>
            <p className="text-[20px] font-normal leading-[28px] text-neutral-950 tracking-[-0.4492px]">
              {stats.total}
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
              {stats.done}
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
              {stats.open}
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
              {stats.alert}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="border-b border-zinc-200 p-4 space-y-3">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-0 bg-gray-200 rounded-[14px] p-[3.5px]">
          <motion.button
            onClick={() => setActiveTab('My Threads')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`h-[29px] rounded-[14px] text-[12px] font-normal leading-[16px] transition-all ${
              activeTab === 'My Threads'
                ? 'bg-black border border-[rgba(0,0,0,0.2)] text-white'
                : 'border border-[rgba(0,0,0,0.2)] text-black'
            }`}
          >
            My Threads
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('All Project')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`h-[29px] rounded-[14px] text-[12px] font-normal leading-[16px] transition-all ${
              activeTab === 'All Project'
                ? 'bg-black border border-[rgba(0,0,0,0.2)] text-white'
                : 'border border-[rgba(0,0,0,0.2)] text-black'
            }`}
          >
            All Project
          </motion.button>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2 flex-wrap">
          {['Status', 'Priority', 'Due', 'Assignee'].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[22px] px-2 flex items-center gap-1.5 text-[12px] font-normal leading-[16px] text-neutral-950 hover:bg-[#f4f4f5] transition-colors"
            >
              <Filter className="w-3 h-3" />
              {filter}
            </motion.button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#717182]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {threads.map((thread, index) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-[rgba(0,0,0,0.1)] pb-4 last:border-b-0"
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full bg-[#ececf0] border border-[rgba(0,0,0,0.05)] shadow-sm overflow-hidden">
                  <img
                    src={thread.author.avatar}
                    alt={thread.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {thread.author.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00c950] border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#ececf0] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#717182] rounded-full" />
                    </div>
                    <span className="text-[13px] font-normal leading-[19.5px] text-neutral-950 tracking-[-0.0762px]">
                      {thread.author.name}
                    </span>
                    <span className="text-[11px] font-normal leading-[16.5px] text-[#717182] tracking-[0.0645px]">
                      {thread.timestamp}
                    </span>
                  </div>
                  <MoreVertical className="w-4.5 h-4.5 text-[#71717a] shrink-0" />
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3 h-3 text-[#717182]" />
                  <span className="text-[11px] font-normal leading-[16.5px] text-[rgba(113,113,130,0.8)] tracking-[0.0645px]">
                    {thread.location}
                  </span>
                </div>

                {/* Due Date & Assigned */}
                <div className="flex items-center gap-2 mb-2 text-[12px] font-normal leading-[16px] text-[rgba(113,113,130,0.9)]">
                  {thread.dueDate && (
                    <>
                      <span>📅 Due: {thread.dueDate}</span>
                      <span>|</span>
                    </>
                  )}
                  <span>Assigned to {thread.assignedTo.join(', ')}</span>
                </div>

                {/* Comment */}
                <p className="text-[13px] font-normal leading-[16px] text-[rgba(113,113,130,0.9)] tracking-[-0.0762px] mb-3">
                  {thread.comment}
                </p>

                {/* Actions & Reactions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-[12px] font-normal leading-[16px] text-[#6a7282] hover:text-[#18181b] transition-colors"
                    >
                      Reply
                    </motion.button>
                    <motion.button
                      onClick={() => onThreadClick && onThreadClick(thread)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 text-[12px] font-normal leading-[16px] text-[#155dfc] hover:text-[#0d4fc7] transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                      More Details
                    </motion.button>
                  </div>
                  <div className="flex items-center gap-1">
                    {thread.reactions.thumbsUp > 0 && (
                      <div className="bg-[rgba(43,127,255,0.1)] border border-[rgba(43,127,255,0.2)] rounded-[8px] h-[21px] px-1.5 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-neutral-950" />
                        <span className="text-[10px] font-normal leading-[15px] text-neutral-950 tracking-[0.1172px]">
                          {thread.reactions.thumbsUp}
                        </span>
                      </div>
                    )}
                    {thread.reactions.heart > 0 && (
                      <div className="bg-[rgba(251,44,54,0.1)] border border-[rgba(251,44,54,0.2)] rounded-[8px] h-[21px] px-1.5 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-neutral-950" />
                        <span className="text-[10px] font-normal leading-[15px] text-neutral-950 tracking-[0.1172px]">
                          {thread.reactions.heart}
                        </span>
                      </div>
                    )}
                    {thread.reactions.smile > 0 && (
                      <div className="bg-[rgba(240,177,0,0.1)] border border-[rgba(240,177,0,0.2)] rounded-[8px] h-[21px] px-1.5 flex items-center gap-1">
                        <Smile className="w-3 h-3 text-neutral-950" />
                        <span className="text-[10px] font-normal leading-[15px] text-neutral-950 tracking-[0.1172px]">
                          {thread.reactions.smile}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

