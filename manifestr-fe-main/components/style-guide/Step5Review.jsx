import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, Check, Upload, Download, FileText as FileTextIcon, Share2 } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Select from '../forms/Select'

export default function StyleGuideStep5Review({ data, updateData, onBack, onNext, isSubmitting }) {
  // Derive state from props
  const selectedColors = data?.colors?.selected || []
  const permittedBackgroundTypes = data?.backgrounds?.permitted || 'light-dark'
  const darkBackgroundUses = data?.backgrounds?.darkUses || 'white-reversed'
  const minimumContrastRatio = data?.backgrounds?.minContrast || ''
  const logoUsageRulesEnabled = data?.logoRules?.enabled ?? true
  const selectedToneDescriptors = data?.style?.toneDescriptors || []
  const selectedAudience = data?.style?.audience || []
  const brandPersonality = data?.style?.personality || ''
  const examplePhrases = data?.style?.examplePhrases || []
  const personas = data?.style?.personas || []
  const brandKitName = data?.brandKitName || 'Untitled Brand Kit'
  const uploadedLogos = data?.logos || []

  // Mock completion status based on data presence
  const completionStatus = {
    brandKitName: !!brandKitName,
    logoUpload: uploadedLogos.length > 0,
    typography: !!data?.typography, // Or check specifically
    colorPalette: (data?.colors?.primary?.length > 0 || selectedColors.length > 0),
    brandVoice: (selectedToneDescriptors.length > 0 || !!brandPersonality),
  }

  const completionPercentage = Math.round(
    (Object.values(completionStatus).filter(Boolean).length / Object.keys(completionStatus).length) * 100
  )

  const steps = [
    { id: 1, label: 'Logo', icon: Folder, active: false },
    { id: 2, label: 'Typography', icon: Type, active: false },
    { id: 3, label: 'Color', icon: Palette, active: false },
    { id: 4, label: 'Style', icon: Grid, active: false },
    { id: 5, label: 'Review & Apply', icon: FileText, active: true },
  ]

  // Helpers to update data if review allows editing
  // For brevity, I'll allow some edits (like background/visibility) as they were in the original file, 
  // but many sections like Style/Voice are just display or have minimal edit controls in this view 
  // (unless we duplicate the edit logic from previous steps). 
  // Given the UI allows "Regenerate" etc, I'll keep the input fields for the ones that were present.

  const updateBackgrounds = (field, value) => updateData({ backgrounds: { ...data?.backgrounds, [field]: value } })
  const updateRules = (field, value) => updateData({ logoRules: { ...data?.logoRules, [field]: value } })
  const updateStyleInfo = (updates) => updateData({ style: { ...data?.style, ...updates } })

  return (
    <div className="min-h-[calc(100vh-72px)] pb-24" style={{ backgroundColor: 'rgba(242, 242, 247, 1)' }}>
      {/* Left Sidebar - Fixed */}
      <div className="hidden lg:block fixed top-[72px] left-0 w-[240px] h-[calc(100vh-72px)] bg-white border-r border-[#e4e4e7] py-8 z-40">
        <div className="px-8">
          <div className="space-y-2">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${step.active
                    ? 'bg-[#f4f4f5] border border-[#e4e4e7]'
                    : 'hover:bg-[#f4f4f5]'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${step.active ? 'text-[#18181b]' : 'text-[#71717a]'}`} />
                  <span
                    className={`text-[14px] leading-[20px] font-medium ${step.active ? 'text-[#18181b]' : 'text-[#71717a]'
                      }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-0 lg:pl-[240px] pr-0 xl:pr-[360px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-8">
          <div className="mb-8 pt-[51px]">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
              <div>
                <h1 className="text-[32px] md:text-[48px] font-bold leading-[40px] md:leading-[56px] tracking-[-0.96px] text-[#18181b] mb-2">
                  Review & Apply
                </h1>
                <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#71717a]">
                  Review your brand style guide and apply it to your workspace
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <Button variant="primary" size="md" onClick={onNext} disabled={isSubmitting} className="flex-1 md:flex-none justify-center">
                  {isSubmitting ? 'Creating...' : 'Create Brand Kit'} <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Cards */}
          <div className="mt-16 space-y-6">
            {/* Logo Card */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Logo
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                {uploadedLogos.length} logo(s) uploaded
              </p>

              <div className="space-y-4">
                {uploadedLogos.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-[#e4e4e7] rounded-lg">
                    <div>
                      <div className="text-[16px] font-medium text-[#18181b] mb-1">{file.name || 'Logo File'}</div>
                      <div className="text-[14px] text-[#71717a]">{((file.size || 0) / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                ))}
                {uploadedLogos.length === 0 && (
                  <div className="text-sm text-gray-500 italic">No logos uploaded.</div>
                )}
              </div>
            </Card>

            {/* Background & Visibility */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-6">
                Background & Visibility
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                    Permitted Background Types
                  </label>
                  <Select
                    value={permittedBackgroundTypes}
                    onChange={(e) => updateBackgrounds('permitted', e.target.value)}
                    options={[
                      { value: 'light-dark', label: 'Light & Dark backgrounds' },
                      { value: 'light-only', label: 'Light backgrounds only' },
                      { value: 'dark-only', label: 'Dark backgrounds only' },
                    ]}
                    className="w-full max-w-[600px]"
                  />
                </div>

                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                    Dark Background Uses
                  </label>
                  <Select
                    value={darkBackgroundUses}
                    onChange={(e) => updateBackgrounds('darkUses', e.target.value)}
                    options={[
                      { value: 'white-reversed', label: 'White or Reversed Logo' },
                      { value: 'white-only', label: 'White Logo only' },
                      { value: 'reversed-only', label: 'Reversed Logo only' },
                    ]}
                    className="w-full max-w-[600px]"
                  />
                </div>

                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#18181b] mb-2">
                    Minimum Contrast Ratio
                  </label>
                  <input
                    type="text"
                    value={minimumContrastRatio}
                    onChange={(e) => updateBackgrounds('minContrast', e.target.value)}
                    className="w-full max-w-[600px] px-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                    placeholder="e.g., 4.5:1"
                  />
                </div>
              </div>
            </Card>

            {/* Advanced: Logo Usage Rules */}
            <Card className="bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                  Advanced: Logo Usage Rules
                </h3>
                <button
                  type="button"
                  onClick={() => updateRules('enabled', !logoUsageRulesEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${logoUsageRulesEnabled ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${logoUsageRulesEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </Card>

            {/* Color Palette */}
            <Card className="bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                    Color Palette Summary
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {/* Display combined colors for summary */}
                {[
                  ...(data?.colors?.primary || []),
                  ...(data?.colors?.secondary || []),
                  ...(data?.colors?.other || [])
                ].map((color, index) => (
                  <div key={`${color.hex}-${index}`} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-lg border border-[#e4e4e7]" style={{ backgroundColor: color.hex }} />
                    <span className="text-[12px] leading-[16px] text-[#71717a]">{color.hex}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Style: Brand Voice & Personality */}
            <Card className="bg-white">
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-2">
                Style: Brand Voice & Personality
              </h3>

              <div className="space-y-6 mt-4">
                {/* Tone Descriptors */}
                <div>
                  <div className="text-[16px] font-medium text-[#18181b] mb-3">
                    Selected Tone Descriptors
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedToneDescriptors.map((descriptor) => (
                      <span key={descriptor} className="px-4 py-2 rounded-lg bg-[#18181b] text-white text-[14px] font-medium">
                        {descriptor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Audience */}
                <div>
                  <div className="text-[16px] font-medium text-[#18181b] mb-3">
                    Target Audience
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedAudience.map((audience) => (
                      <span key={audience} className="px-4 py-2 rounded-lg bg-[#18181b] text-white text-[14px] font-medium">
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Brand Personality */}
                <div>
                  <div className="text-[16px] font-medium text-[#18181b] mb-3">
                    Brand personality
                  </div>
                  <div className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e4e4e7] rounded-lg text-[16px] text-[#18181b]">
                    {brandPersonality || 'Not specified'}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Stacked on mobile, Fixed on XL */}
      <div className="relative w-full h-auto xl:fixed xl:top-[72px] xl:right-0 xl:w-[360px] xl:h-[calc(100vh-72px)] bg-white border-l-0 xl:border-l border-[#e4e4e7] py-8 px-6 overflow-y-auto z-30 mb-24 xl:mb-0">
        <div className="space-y-6">
          {/* Live Preview */}
          <Card className="bg-white">
            <h3 className="text-[18px] font-semibold leading-[24px] text-[#18181b] mb-4">
              Live Preview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[12px] text-[#71717a] mb-1">Brand Kit Name</div>
                <div className="text-[14px] font-medium text-[#18181b]">{brandKitName}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#71717a] mb-2">Color Palette</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    ...(data?.colors?.primary || []).slice(0, 5),
                  ].map((color) => (
                    <div
                      key={color.hex || color}
                      className="w-6 h-6 rounded border border-[#e4e4e7]"
                      style={{ backgroundColor: color.hex || color }}
                    />
                  ))}
                  {(data?.colors?.primary?.length === 0) && <span className="text-sm text-gray-500">None selected</span>}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#71717a] mb-1">Brand Voice</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedToneDescriptors.map((descriptor) => (
                    <span
                      key={descriptor}
                      className="px-2 py-1 bg-[#f4f4f5] text-[#18181b] text-[12px] rounded"
                    >
                      {descriptor}
                    </span>
                  ))}
                  {selectedToneDescriptors.length === 0 && <span className="text-sm text-gray-500">None selected</span>}
                </div>
              </div>
            </div>
          </Card>

          {/* Completion Status */}
          <Card className="bg-white">
            <h3 className="text-[18px] font-semibold leading-[24px] text-[#18181b] mb-4">
              Completion Status
            </h3>
            <div className="mb-4">
              <div className="w-full bg-[#e4e4e7] rounded-full h-2 mb-2">
                <div
                  className="bg-[#18181b] h-2 rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="text-[14px] text-[#71717a]">{completionPercentage}% Complete</div>
            </div>
            <div className="space-y-2">
              {Object.entries(completionStatus).map(([key, checked]) => (
                <div key={key} className="flex items-center gap-2">
                  {checked ? (
                    <Check className="w-4 h-4 text-[#18181b]" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-[#e4e4e7] rounded" />
                  )}
                  <span className="text-[14px] text-[#18181b] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white">
            <h3 className="text-[18px] font-semibold leading-[24px] text-[#18181b] mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="secondary" size="md" className="w-full justify-start">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 xl:right-[360px] bg-white border-t border-[#e4e4e7] px-4 md:px-8 py-4 z-50">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="text-[14px] leading-[20px] text-[#71717a]">
            Step 5 of 5 - Review
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" size="md" onClick={onBack} disabled={isSubmitting} className="flex-1 md:flex-none justify-center">
              Back
            </Button>
            <Button variant="primary" size="md" onClick={onNext} disabled={isSubmitting} className="flex-1 md:flex-none justify-center">
              {isSubmitting ? 'Creating...' : 'Create Brand Kit'} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
