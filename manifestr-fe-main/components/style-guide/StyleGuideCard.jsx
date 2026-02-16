import { motion } from 'framer-motion'
import { MoreVertical } from 'lucide-react'

export default function StyleGuideCard({
  category,
  title,
  subtitle,
  projectCount,
  gradient,
  index = 0,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-3xl overflow-hidden cursor-pointer min-h-[200px] group"
      style={{
        background: gradient,
      }}
      onClick={onClick}
    >
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[14px] leading-[20px] text-white/80 mb-2">
              {category}
            </p>
            <h3 className="text-[20px] md:text-[24px] font-bold leading-[28px] md:leading-[32px] text-white mb-1">
              {title}
            </h3>
            <p className="text-[16px] leading-[24px] text-white/90">
              {subtitle}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Handle menu click
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-[14px] leading-[20px] text-white/80">
          {projectCount} Projects
        </div>
      </div>
    </motion.div>
  )
}

