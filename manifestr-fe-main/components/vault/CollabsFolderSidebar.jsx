import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Folder, Plus, ChevronDown } from 'lucide-react'

export default function CollabsFolderSidebar() {
  const router = useRouter()
  const currentPath = router.pathname

  const folders = [
    { id: 'marketing-materials', name: 'Marketing Materials', href: '/vault/collabs/marketing-materials' },
    { id: 'finance-reports', name: 'Finance Reports', href: '/vault/collabs/finance-reports' },
    { id: 'presentations', name: 'Presentations', href: '/vault/collabs/presentations' },
    { id: 'client-assets', name: 'Client Assets', href: '/vault/collabs/client-assets' },
  ]

  const isActive = (href) => {
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <div className="w-[218.5px] bg-white border-r border-[#e4e4e7] h-full flex flex-col">
      <div className="p-5">
        {/* Folders List */}
        <div className="space-y-0 mb-4">
          {folders.map((folder, index) => {
            const folderIsActive = isActive(folder.href)

            return (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Link href={folder.href}>
                  <motion.div
                    whileHover={{ backgroundColor: '#f4f4f5' }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-[37px] px-3 flex items-center gap-2 rounded-md transition-colors cursor-pointer ${
                      folderIsActive ? 'bg-[#f4f4f5]' : ''
                    }`}
                  >
                    <Folder className="w-4 h-4 text-[#18181b]" />
                    <span className={`text-[14px] leading-[21px] ${
                      folderIsActive ? 'font-medium text-[#18181b]' : 'text-[#18181b]'
                    }`}>
                      {folder.name}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* New Folder Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-[32px] flex items-center gap-2 px-3 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Folder
        </motion.button>
      </div>
    </div>
  )
}




