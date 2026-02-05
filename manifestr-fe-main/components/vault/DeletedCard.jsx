import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCw, Trash2 } from 'lucide-react'

export default function DeletedCard({ card, index }) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="w-full max-w-[320px] flex flex-col"
    >
      {/* Thumbnail Card */}
      <div className="relative w-full h-[180px] bg-white border border-[#e4e4e7] rounded-t-md overflow-hidden mb-0">
        {/* Thumbnail Image */}
        <div className="w-full h-full bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7] relative">
          {card.thumbnail && !imageError ? (
            <img 
              src={card.thumbnail} 
              alt={card.title} 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#f4f4f5]" />
          )}
        </div>

        {/* Days Left Badge */}
        {card.daysLeft && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2.5 py-1.5 rounded-full bg-[#ffe9e2] text-[#f10000] text-[11px] font-semibold leading-[16.5px] tracking-[0.0645px]">
              {card.daysLeft} days left
            </span>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="w-full min-h-[200px] bg-white border border-[#e4e4e7] rounded-b-md p-5 flex flex-col gap-3 shadow-[0px_8px_16px_0px_rgba(22,34,51,0.08)]">
        <h3 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
          {card.title}
        </h3>
        <p className="text-[12px] leading-[18px] text-[#18181b]">
          {card.project}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[40px] bg-white border border-[#18181b] rounded-md flex items-center justify-center gap-1 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            Restore
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[40px] bg-[#18181b] text-white rounded-md flex items-center justify-center gap-1 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity shadow-[0px_1px_1.5px_0.1px_rgba(22,25,36,0.05)]"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}


