import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalCard({
  icon,
  title,
  description,
  buttonText,
  onClose,
  showButton = true,
  isOpen
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4
                     bg-transparent backdrop-blur-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative bg-white/30 backdrop-blur-md rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] w-full max-w-md p-6 mx-auto"
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              onClick={onClose}
            >
              ×
            </button>

            {/* Top Left Icon with Box Shadow */}
            <div className="absolute top-5 left-3">
              <div className="w-16 h-16 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-gray-900 text-2xl border border-gray-100">
                {icon}
              </div>
            </div>

            {/* Content - Right Side */}
            <div className="ml-20 pt-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {description}
              </p>

              {showButton && buttonText && (
                <button className="bg-gray-900 text-white rounded-lg py-3.5 px-9 text-sm font-medium shadow-md hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                  {buttonText}
                </button>
              )}
            </div>

            {/* Pointer */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <div
                className="w-6 h-3 bg-black shadow-2xl"
                style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
              ></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
