import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'

export default function EditTeamMemberModal({ isOpen, onClose, member = null, onSave }) {
  const modalRef = useRef(null)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'Owner',
    email: '',
    department: 'Leadership',
    jobTitle: '',
    bio: ''
  })

  const roles = ['Owner', 'Admin', 'Editor', 'Viewer']
  const departments = ['Leadership', 'Engineering', 'Design', 'Marketing', 'Sales', 'Support']

  // Initialize form data when member is provided (edit mode) or modal opens (add mode)
  useEffect(() => {
    if (isOpen) {
      if (member) {
        // Edit mode - populate with member data
        setFormData({
          fullName: member.name || '',
          role: member.details?.role || member.role || 'Owner',
          email: member.email || '',
          department: member.details?.department || 'Leadership',
          jobTitle: member.role || '',
          bio: member.details?.bio || ''
        })
      } else {
        // Add mode - reset form
        setFormData({
          fullName: '',
          role: 'Owner',
          email: '',
          department: 'Leadership',
          jobTitle: '',
          bio: ''
        })
      }
    }
  }, [isOpen, member])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowRoleDropdown(false)
        setShowDepartmentDropdown(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-[#e4e4e7] rounded-lg w-full max-w-[512px] max-h-[90vh] overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-[#e4e4e7] p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[18px] font-semibold leading-[24px] text-[#18181b] mb-1">
                    {member ? 'Edit Team Member' : 'Add Team Member'}
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#71717a]">
                    {member ? 'Update team member information and settings' : 'Add a new team member to your workspace'}
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-4 h-4 flex items-center justify-center text-[#71717a] hover:text-[#18181b] transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Row 1: Full Name and Role */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[14px] font-medium leading-[20px] text-[#18181b] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Role Dropdown */}
                  <div className="relative">
                    <label className="block text-[14px] font-medium leading-[20px] text-[#18181b] mb-2">
                      Role
                    </label>
                    <motion.button
                      onClick={() => {
                        setShowRoleDropdown(!showRoleDropdown)
                        setShowDepartmentDropdown(false)
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-between text-[14px] leading-[20px] text-[#18181b] hover:border-[#18181b] transition-colors"
                    >
                      <span>{formData.role}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                    </motion.button>
                    <AnimatePresence>
                      {showRoleDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                        >
                          {roles.map((role) => (
                            <motion.button
                              key={role}
                              onClick={() => {
                                handleInputChange('role', role)
                                setShowRoleDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {role}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Row 2: Email and Department */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-[14px] font-medium leading-[20px] text-[#18181b] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Department Dropdown */}
                  <div className="relative">
                    <label className="block text-[14px] font-medium leading-[20px] text-[#18181b] mb-2">
                      Department
                    </label>
                    <motion.button
                      onClick={() => {
                        setShowDepartmentDropdown(!showDepartmentDropdown)
                        setShowRoleDropdown(false)
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-between text-[14px] leading-[20px] text-[#18181b] hover:border-[#18181b] transition-colors"
                    >
                      <span>{formData.department}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} />
                    </motion.button>
                    <AnimatePresence>
                      {showDepartmentDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                        >
                          {departments.map((dept) => (
                            <motion.button
                              key={dept}
                              onClick={() => {
                                handleInputChange('department', dept)
                                setShowDepartmentDropdown(false)
                              }}
                              whileHover={{ backgroundColor: '#f4f4f5' }}
                              className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#18181b]"
                            >
                              {dept}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Row 3: Job Title */}
                <div>
                  <label className="block text-[14px] font-medium leading-[20px] text-[#18181b] mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="w-full h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent"
                    placeholder="Enter job title"
                  />
                </div>

                {/* Row 4: Bio / Notes */}
                <div>
                  <label className="block text-[14px] font-medium leading-[20px] text-[#18181b] mb-2">
                    Bio / Notes
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-white border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent resize-none"
                    placeholder="Enter bio or notes"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#e4e4e7] p-6 flex items-center justify-end gap-3">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-[36px] px-4 bg-white border border-[#e4e4e7] rounded-md text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-[36px] px-4 bg-[#18181b] text-white rounded-md text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
              >
                {member ? 'Save Changes' : 'Add Member'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

