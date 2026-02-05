import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ChevronDown from '../icons/ChevronDown'
import Logo from '../logo/Logo'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[rgba(255,255,255,0.9)] fixed top-0 left-0 right-0 z-50 border-b border-[#e4e4e7] backdrop-blur-sm">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px] py-[20px]">
        <div className="flex items-center justify-between md:justify-start">

          {/* Mobile: Logo Left */}
          <div className="md:hidden">
            <Logo size="sm" />
          </div>

          {/* Desktop Left Navigation */}
          <div className="hidden md:flex items-center gap-[44px] flex-1">
            <Link
              href="/"
              className="text-l2-medium text-base-foreground border-b-2 border-base-foreground px-1 pb-1"
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="text-l2-medium text-base-foreground px-1 border-b-2 border-transparent pb-1"
            >
              Tools
            </Link>
            <div className="flex items-center gap-2 text-l2-medium text-base-foreground cursor-pointer px-1 border-b-2 border-transparent pb-1">
              <span>About</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Link
              href="/blog"
              className="text-l2-medium text-base-foreground px-1 border-b-2 border-transparent pb-1"
            >
              Blog
            </Link>
          </div>

          {/* Desktop Logo - Centered */}
          <div className="hidden md:flex w-[271.392px] justify-center">
            <Logo size="md" />
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center gap-[24px] flex-1 justify-end">
            <div className="flex items-center gap-[44px]">
              <Link
                href="/pricing"
                className="text-l2-medium text-base-foreground px-1"
              >
                Pricing
              </Link>
              <div className="flex items-center gap-2 text-l2-medium text-base-foreground cursor-pointer px-1">
                <span>Support</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-[12px]">
              {user ? (
                <Link
                  href="/home"
                  className="bg-[#18181b] text-white h-[36px] px-3 py-2 rounded-md text-l2-medium hover:opacity-90 transition-opacity flex items-center"
                >
                  Home
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-base-background border border-[#e4e4e7] text-base-foreground h-[36px] px-3 py-2 rounded-md text-l2-medium hover:bg-base-muted transition-colors flex items-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-[#18181b] text-white h-[36px] px-3 py-2 rounded-md text-l2-medium hover:opacity-90 transition-opacity flex items-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -mr-2 text-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-[101]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[102] shadow-xl flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <Link href="/" className="text-lg font-medium text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/tools" className="text-lg font-medium text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Tools</Link>
                <Link href="/about" className="text-lg font-medium text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                <Link href="/blog" className="text-lg font-medium text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                <Link href="/pricing" className="text-lg font-medium text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                <Link href="/support" className="text-lg font-medium text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>

                <div className="border-t border-gray-100 my-2" />

                {user ? (
                  <Link
                    href="/home"
                    className="bg-[#18181b] text-white h-[44px] px-4 rounded-md font-medium flex items-center justify-center hover:opacity-90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      className="bg-white border border-[#e4e4e7] text-gray-900 h-[44px] px-4 rounded-md font-medium flex items-center justify-center hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-[#18181b] text-white h-[44px] px-4 rounded-md font-medium flex items-center justify-center hover:opacity-90"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
