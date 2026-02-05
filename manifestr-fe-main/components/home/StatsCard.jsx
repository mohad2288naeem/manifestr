import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, FileText } from 'lucide-react'

export default function StatsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl p-6"
    >
      <p className="text-[15px] font-medium leading-[28px] text-[#090909] mb-4">
        YOUR STATS
      </p>
      <div className="h-px bg-[#e4e4e7] mb-6"></div>
      
      {/* Level Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-[51px] h-[51px] rounded-full bg-[#18181b] flex items-center justify-center relative">
          <span 
            className="italic text-white font-bold text-[28px] absolute"
            style={{ 
              fontFamily: "'Castoro Titling', serif",
              fontWeight: '700',
              top: '50%',
              left: '50%',
              transform: 'translate(-58%, -43%)',
              lineHeight: '1'
            }}
          >
            2
          </span>
        </div>
        <div>
          <p className="text-[24px] font-semibold leading-[49px] text-black mb-0">You Are Level 2</p>
          <p className="text-[14px] font-normal leading-[21px] text-black">500 points to the next level</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-[31px] bg-[#b9c0b5] rounded-full relative overflow-hidden flex items-center justify-between px-4">
          <span className="text-[16px] font-semibold text-black relative z-10">5500</span>
          <span className="text-[16px] font-semibold text-black relative z-10">/</span>
          <span className="text-[16px] font-semibold text-black relative z-10">6000</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-[20px]">
        {/* Time saved */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-8 h-8 text-[#18181b]" />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-semibold leading-[24px] text-black mb-0">10h</p>
            <p className="text-[13px] font-normal leading-[19px] text-black mt-0">Time saved this week</p>
          </div>
        </div>

        {/* Documents created */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-8 h-8 text-[#18181b]" />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-semibold leading-[24px] text-black mb-0">7</p>
            <p className="text-[13px] font-normal leading-[19px] text-black mt-0">Documents created</p>
          </div>
        </div>

        {/* Tools used */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Image
              src="/assets/icons/manifestr-icon.svg"
              alt="Manifestr Icon"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-semibold leading-[24px] text-black mb-0">6/8 Tools</p>
            <p className="text-[13px] font-normal leading-[19px] text-black mt-0">Used this week</p>
          </div>
        </div>

        {/* Most Used */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Image
              src="/assets/icons/chess-knight-piece.svg"
              alt="Chess Knight"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-semibold leading-[24px] text-black mb-0">Most Used</p>
            <p className="text-[13px] font-normal leading-[19px] text-black mt-0">The Strategist</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

