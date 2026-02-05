import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import Button from '../ui/Button'

export default function CompletionModal({ isOpen, onClose, onContinue }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100]"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-[480px] w-full mx-4 pointer-events-auto"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#18181b] rounded-xl flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-[#18181b]" strokeWidth={3} />
                  </div>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-[32px] font-bold leading-[40px] text-[#18181b] text-center mb-4">
                Done. Precise. Professional.
              </h2>

              {/* Body Text */}
              <p className="text-[16px] leading-[24px] text-[#71717a] text-center mb-8">
                Your visual standards are locked and stored for future documents
              </p>

              {/* Continue Button */}
              <div className="flex justify-center">
                <Button variant="primary" size="lg" onClick={onContinue} className="w-full">
                  Continue
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

