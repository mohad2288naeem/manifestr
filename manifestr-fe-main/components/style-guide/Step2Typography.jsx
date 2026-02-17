import { motion } from 'framer-motion'
import { Folder, Type, Palette, Grid, FileText, Plus, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import Select from '../forms/Select'

export default function StyleGuideStep2Typography({ data, updateData, onBack, onNext }) {
  const defaultStyles = [
    { id: 1, name: 'Heading 1', font: 'Inter', fontSize: '62px', fontWeight: 'Bold', lineHeight: '62px', letterSpacing: '0' },
    { id: 2, name: 'Heading 2', font: 'Inter', fontSize: '48px', fontWeight: 'Bold', lineHeight: '48px', letterSpacing: '0' },
    { id: 3, name: 'Heading 3', font: 'Inter', fontSize: '34px', fontWeight: 'Bold', lineHeight: '34px', letterSpacing: '0' },
    { id: 4, name: 'Sub title 1', font: 'Inter', fontSize: '28px', fontWeight: 'Bold', lineHeight: '28px', letterSpacing: '0' },
    { id: 5, name: 'Sub title 2', font: 'Inter', fontSize: '20px', fontWeight: 'Bold', lineHeight: '20px', letterSpacing: '0' },
    { id: 6, name: 'Body 1', font: 'Inter', fontSize: '16px', fontWeight: 'Medium', lineHeight: '16px', letterSpacing: '0' },
    { id: 7, name: 'Body 1 - Bold', font: 'Inter', fontSize: '16px', fontWeight: 'SemiBold', lineHeight: '16px', letterSpacing: '0' },
    { id: 8, name: 'Body 2', font: 'Inter', fontSize: '16px', fontWeight: 'Medium', lineHeight: '16px', letterSpacing: '0' },
    { id: 9, name: 'Body 2 - Bold', font: 'Inter', fontSize: '16px', fontWeight: 'SemiBold', lineHeight: '16px', letterSpacing: '0' },
    { id: 10, name: 'Caption', font: 'Inter', fontSize: '14px', fontWeight: 'Medium', lineHeight: '14px', letterSpacing: '0' },
  ]

  // Use data from props or defaults. Handle case where typography might be the initial object structure.
  const typographyStyles = Array.isArray(data?.typography) ? data.typography : defaultStyles

  const steps = [
    { id: 1, label: 'Logo', icon: Folder, active: false },
    { id: 2, label: 'Typography', icon: Type, active: true },
    { id: 3, label: 'Color', icon: Palette, active: false },
    { id: 4, label: 'Style', icon: Grid, active: false },
    { id: 5, label: 'Review & Apply', icon: FileText, active: false },
  ]

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
  ]

  const fontWeightOptions = [
    { value: 'Light', label: 'Light' },
    { value: 'Regular', label: 'Regular' },
    { value: 'Medium', label: 'Medium' },
    { value: 'SemiBold', label: 'SemiBold' },
    { value: 'Bold', label: 'Bold' },
    { value: 'ExtraBold', label: 'ExtraBold' },
  ]

  const updateStyle = (id, field, value) => {
    const newStyles = typographyStyles.map((style) => (style.id === id ? { ...style, [field]: value } : style))
    updateData({ typography: newStyles })
  }

  const adjustNumericValue = (rawValue, delta, withPx) => {
    const numeric = parseInt(String(rawValue || '').replace('px', ''), 10)
    const base = Number.isNaN(numeric) ? 0 : numeric
    const next = Math.max(0, base + delta)
    return withPx ? `${next}px` : String(next)
  }

  const bumpField = (id, field, delta) => {
    const style = typographyStyles.find((item) => item.id === id)
    if (!style) return
    const withPx = field === 'fontSize' || field === 'lineHeight'
    const nextValue = adjustNumericValue(style[field], delta, withPx)
    updateStyle(id, field, nextValue)
  }

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
      <div className="pl-0 lg:pl-[240px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-8">
          <div className="mb-8 pt-[51px]">
            <h1 className="text-[32px] md:text-[48px] font-bold leading-[40px] md:leading-[56px] tracking-[-0.96px] text-[#18181b] mb-2">
              Typography
            </h1>
            <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#71717a]">
              Establish a clear typographic hierarchy for your brand.
            </p>
          </div>

          {/* Add Font Button */}
          <div className="mb-6 mt-8 md:mt-12">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-2" />
              Add Font
            </Button>
          </div>

          {/* Typography Table */}
          <div className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f4f4f5] border-b border-[#e4e4e7]">
                    <th className="px-6 py-4 text-left text-[14px] font-semibold leading-[20px] text-[#18181b] min-w-[150px]">
                      Style
                    </th>
                    <th className="px-6 py-4 text-left text-[14px] font-semibold leading-[20px] text-[#18181b] min-w-[180px]">
                      font
                    </th>
                    <th className="px-6 py-4 text-left text-[14px] font-semibold leading-[20px] text-[#18181b] min-w-[120px]">
                      font-size
                    </th>
                    <th className="px-6 py-4 text-left text-[14px] font-semibold leading-[20px] text-[#18181b] min-w-[180px]">
                      font-weight
                    </th>
                    <th className="px-6 py-4 text-left text-[14px] font-semibold leading-[20px] text-[#18181b] min-w-[120px]">
                      line-height
                    </th>
                    <th className="px-6 py-4 text-left text-[14px] font-semibold leading-[20px] text-[#18181b] min-w-[140px]">
                      letter-spacing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typographyStyles.map((style, index) => (
                    <tr
                      key={style.id}
                      className={`border-b border-[#e4e4e7] ${
                        index === typographyStyles.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div
                          style={{
                            fontFamily: style.font,
                            fontSize: style.fontSize,
                            fontWeight:
                              style.fontWeight === 'Bold'
                                ? '700'
                                : style.fontWeight === 'SemiBold'
                                ? '600'
                                : style.fontWeight === 'Medium'
                                ? '500'
                                : style.fontWeight === 'Regular'
                                ? '400'
                                : style.fontWeight === 'Light'
                                ? '300'
                                : '400',
                            lineHeight: style.lineHeight,
                            letterSpacing: style.letterSpacing,
                          }}
                          className="text-[#18181b]"
                        >
                          {style.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-[150px]">
                          <Select
                            value={style.font}
                            onChange={(e) => updateStyle(style.id, 'font', e.target.value)}
                            options={fontOptions}
                            className="w-full"
                            fieldClassName="bg-[#F3F3F5]"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-flex items-center">
                          <input
                            type="text"
                            value={style.fontSize}
                            onChange={(e) => updateStyle(style.id, 'fontSize', e.target.value)}
                            className="w-[100px] px-3 py-2 pr-8 bg-[#F3F3F5] border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[14px] leading-[20px] text-[#18181b]"
                          />
                          <div className="absolute inset-y-0 right-1 flex flex-col justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => bumpField(style.id, 'fontSize', 1)}
                              className="w-5 h-3 flex items-center justify-center text-[#71717a] hover:text-[#18181b]"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => bumpField(style.id, 'fontSize', -1)}
                              className="w-5 h-3 flex items-center justify-center text-[#71717a] hover:text-[#18181b]"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-[150px]">
                          <Select
                            value={style.fontWeight}
                            onChange={(e) => updateStyle(style.id, 'fontWeight', e.target.value)}
                            options={fontWeightOptions}
                            className="w-full"
                            fieldClassName="bg-[#F3F3F5]"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-flex items-center">
                          <input
                            type="text"
                            value={style.lineHeight}
                            onChange={(e) => updateStyle(style.id, 'lineHeight', e.target.value)}
                            className="w-[100px] px-3 py-2 pr-8 bg-[#F3F3F5] border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[14px] leading-[20px] text-[#18181b]"
                          />
                          <div className="absolute inset-y-0 right-1 flex flex-col justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => bumpField(style.id, 'lineHeight', 1)}
                              className="w-5 h-3 flex items-center justify-center text-[#71717a] hover:text-[#18181b]"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => bumpField(style.id, 'lineHeight', -1)}
                              className="w-5 h-3 flex items-center justify-center text-[#71717a] hover:text-[#18181b]"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-flex items-center">
                          <input
                            type="text"
                            value={style.letterSpacing}
                            onChange={(e) => updateStyle(style.id, 'letterSpacing', e.target.value)}
                            className="w-[100px] px-3 py-2 pr-8 bg-[#F3F3F5] border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[14px] leading-[20px] text-[#18181b]"
                          />
                          <div className="absolute inset-y-0 right-1 flex flex-col justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => bumpField(style.id, 'letterSpacing', 1)}
                              className="w-5 h-3 flex items-center justify-center text-[#71717a] hover:text-[#18181b]"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => bumpField(style.id, 'letterSpacing', -1)}
                              className="w-5 h-3 flex items-center justify-center text-[#71717a] hover:text-[#18181b]"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 bg-white border-t border-[#e4e4e7] px-4 md:px-8 py-4 z-50">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="text-[14px] leading-[20px] text-[#71717a]">
            Step 2 of 6 — Next up: Color
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" size="md" onClick={onBack} className="flex-1 md:flex-none justify-center">
              Skip
            </Button>
            <Button variant="secondary" size="md" onClick={onBack} className="flex-1 md:flex-none justify-center">
              Back
            </Button>
            <Button variant="primary" size="md" onClick={onNext} className="flex-1 md:flex-none justify-center">
              Continue <ArrowRight className="w-4 h-4 ml-1 hidden md:inline" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
