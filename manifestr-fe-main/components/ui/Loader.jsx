import { motion } from 'framer-motion'

export default function Loader({ className = '', duration = 2500, message = 'Loading...' }) {
  const size = 24
  const strokeWidth = 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference * 0.75 // Show 75% of the circle
  const strokeDashoffset = circumference * 0.25 // Hide 25% of the circle

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative w-6 h-6">
        <motion.svg
          width={size}
          height={size}
          className="text-zinc-600"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </motion.svg>
      </div>
      <motion.p 
        className="text-l2-regular text-base-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </div>
  )
}

