import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Logo from '../logo/Logo'

export default function Step4BriefMe({ projectData, updateProjectData }) {
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    impact: true,
    structural: true,
  })

  // Ensure projectData exists to prevent crashes if parent didn't pass it yet
  const data = projectData || {}

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateField = (field, value) => {
    if (updateProjectData) {
      updateProjectData({ [field]: value })
    }
  }

  const ToggleSwitch = ({ label, checked, onChange, textPlacement = 'right' }) => {
    if (textPlacement === 'left') {
      return (
        <button
          type="button"
          onClick={onChange}
          className="flex gap-2 items-start justify-end"
        >
          <div className="flex flex-col gap-1.5 items-start">
            <div className="flex gap-2.5 items-center justify-center pt-0.5 pb-0 px-0">
              <p className="font-medium leading-5 text-base-foreground text-sm text-right whitespace-pre">
                {label}
              </p>
            </div>
          </div>
          <div className={`border-2 border-transparent flex gap-2.5 h-6 items-center px-0.5 py-0 rounded-full w-11 transition-all ${checked ? 'bg-[#18181B]' : 'bg-[#F4F4F5]'
            }`}>
            <div className="bg-white rounded-full shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)] shrink-0 size-5 transition-transform"
              style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }} />
          </div>
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={onChange}
        className="flex gap-2 items-start justify-end"
      >
        <div className={`border-2 border-transparent flex gap-2.5 h-6 items-center px-0.5 py-0 rounded-full w-11 transition-all ${checked ? 'bg-[#18181B]' : 'bg-[#F4F4F5]'
          }`}>
          <div className="bg-white rounded-full shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)] shrink-0 size-5 transition-transform"
            style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }} />
        </div>
        <div className="flex flex-col gap-1.5 items-start w-[185px]">
          <div className="flex gap-2.5 items-center justify-center pt-0.5 pb-0 px-0 w-full">
            <p className="font-medium leading-5 text-base-foreground text-sm w-full text-left">
              {label}
            </p>
          </div>
        </div>
      </button>
    )
  }

  const SelectionButton = ({ label, checked, onChange, className = '' }) => (
    <button
      type="button"
      onClick={onChange}
      className={`bg-[#f7f7f7] border flex gap-2 grow items-center px-3 py-2 rounded-md transition-all ${checked
          ? 'border-base-secondary bg-[#f7f7f7]'
          : 'border-[#e4e4e7]'
        } ${className}`}
    >
      <div className="flex gap-2 grow items-start">
        <div className="flex items-center justify-center pt-0.5 pb-0 px-0 shrink-0">
          <div className={`border-5 rounded-full shrink-0 size-4 flex items-center justify-center relative ${checked
              ? 'border-base-secondary bg-white'
              : 'border-[#e4e4e7] bg-white'
            }`}>
            {checked && (
              <div className="absolute w-2 h-2 bg-base-secondary rounded-full" />
            )}
          </div>
        </div>
        <div className="flex flex-col grow items-start">
          <p className="font-normal leading-5 text-base-muted-foreground+ text-sm w-full text-left">
            {label}
          </p>
        </div>
      </div>
    </button>
  )

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-[940px] mx-auto py-10">
      {/* Heading Section */}
      <div className="flex flex-col gap-6 items-center justify-center">
        {/* Manifestr Logo - At the top */}
        <div className="flex items-center justify-center shrink-0">
          <Logo size="md" />
        </div>

        <div className="flex flex-col gap-[8px] items-center text-center">
          <h1 className="font-hero font-semibold text-[30px] leading-[38px] text-black">
            Brief Me
          </h1>
          <p className="font-normal text-[16px] leading-[24px] text-base-muted-foreground+">
            Your thinking partner
          </p>
        </div>
      </div>

      {/* About Your Document Section */}
      <div className="bg-white rounded-xl shadow-[3px_3px_25px_0px_rgba(0,0,0,0.13)] p-8 w-full">
        <div className="flex flex-col gap-6 items-start w-full">
          {/* Section Header */}
          <div className="flex gap-6 items-center justify-center w-full">
            <h2 className="flex-1 font-medium text-[18px] leading-[28px] text-black">
              About Your Document
            </h2>
            <button
              onClick={() => toggleSection('about')}
              className="cursor-pointer"
            >
              {expandedSections.about ? (
                <ChevronUp className="size-6 text-base-foreground" />
              ) : (
                <ChevronDown className="size-6 text-base-foreground" />
              )}
            </button>
          </div>

          {/* Section Content */}
          {expandedSections.about && (
            <div className="flex flex-col gap-5 items-start w-full">
              {/* Row 1 */}
              <div className="flex gap-5 items-start w-full">
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Document Name"
                    placeholder="What would you like to call this document?"
                    className="bg-[#f7f7f7]"
                    value={data.documentName}
                    onChange={(e) => updateField('documentName', e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Project/Brand Name"
                    placeholder="What's the brand or company this is for?"
                    className="bg-[#f7f7f7]"
                    value={data.projectBrandName}
                    onChange={(e) => updateField('projectBrandName', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex gap-5 items-start w-full">
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Website / URL"
                    placeholder="Please provide your company or project website"
                    className="bg-[#f7f7f7]"
                    value={data.websiteUrl}
                    onChange={(e) => updateField('websiteUrl', e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Role / POV"
                    placeholder="What role should this be written from?"
                    className="bg-[#f7f7f7]"
                    value={data.role}
                    onChange={(e) => updateField('role', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-white rounded-xl shadow-[3px_3px_25px_0px_rgba(0,0,0,0.13)] p-8 w-full">
        <div className="flex flex-col gap-6 items-start w-full">
          {/* Section Header */}
          <div className="flex gap-6 items-center justify-center w-full">
            <h2 className="flex-1 font-medium text-[18px] leading-[28px] text-black">
              Impact
            </h2>
            <button
              onClick={() => toggleSection('impact')}
              className="cursor-pointer"
            >
              {expandedSections.impact ? (
                <ChevronUp className="size-6 text-base-foreground" />
              ) : (
                <ChevronDown className="size-6 text-base-foreground" />
              )}
            </button>
          </div>

          {/* Section Content */}
          {expandedSections.impact && (
            <div className="flex flex-col gap-5 items-start w-full">
              {/* Context Textarea */}
              <div className="w-full flex flex-col gap-2 items-start">
                <div className="w-full flex flex-col gap-1.5 items-start">
                  <label className="text-[14px] leading-[20px] text-[#464649]">
                    Context
                  </label>
                  <textarea
                    placeholder="What's the background or reason for this brief?"
                    className="w-full h-[112px] bg-[#f7f7f7] border border-[#e4e4e7] rounded-md px-[14px] py-3 text-[14px] leading-[20px] text-zinc-500 placeholder:text-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-base-secondary focus:border-base-secondary"
                    value={data.context}
                    onChange={(e) => updateField('context', e.target.value)}
                  />
                </div>
                <ToggleSwitch
                  label="Not Sure"
                  checked={data.contextNotSure}
                  onChange={() => updateField('contextNotSure', !data.contextNotSure)}
                />
              </div>

              {/* Primary Objective & Success Definition Row */}
              <div className="flex gap-5 items-start w-full">
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Primary Objective"
                    placeholder="Please provide your company or project website?"
                    className="bg-[#f7f7f7]"
                    value={data.primaryObjective}
                    onChange={(e) => updateField('primaryObjective', e.target.value)}
                  />
                  <ToggleSwitch
                    label="N/A"
                    checked={data.primaryObjectiveNA}
                    onChange={() => updateField('primaryObjectiveNA', !data.primaryObjectiveNA)}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Success Definition"
                    placeholder="What does success look like for this project?"
                    className="bg-[#f7f7f7]"
                    value={data.successDefinition}
                    onChange={(e) => updateField('successDefinition', e.target.value)}
                  />
                  <ToggleSwitch
                    label="N/A"
                    checked={data.successDefinitionNA}
                    onChange={() => updateField('successDefinitionNA', !data.successDefinitionNA)}
                  />
                </div>
              </div>

              {/* Key Message Textarea */}
              <div className="w-full flex flex-col gap-2 items-start">
                <div className="w-full flex flex-col gap-1.5 items-start">
                  <label className="text-[14px] leading-[20px] text-[#464649]">
                    Key Message
                  </label>
                  <textarea
                    placeholder="What's the single most important thing your audience should understand or believe?"
                    className="w-full h-[112px] bg-[#f7f7f7] border border-[#e4e4e7] rounded-md px-[14px] py-3 text-[14px] leading-[20px] text-zinc-500 placeholder:text-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-base-secondary focus:border-base-secondary"
                    value={data.keyMessage}
                    onChange={(e) => updateField('keyMessage', e.target.value)}
                  />
                </div>
                <ToggleSwitch
                  label="N/A"
                  checked={data.keyMessageNA}
                  onChange={() => updateField('keyMessageNA', !data.keyMessageNA)}
                />
              </div>

              {/* Audience Selection */}
              <div className="w-full flex flex-col gap-1.5 items-start">
                <label className="text-[14px] leading-[20px] text-[#464649]">
                  Audience
                </label>
                <div className="w-full flex flex-col gap-2 items-start">
                  <div className="flex gap-2 items-center w-full">
                    <SelectionButton
                      label="Internal Stakeholders"
                      checked={data.primaryAudience === 'internal'}
                      onChange={() => updateField('primaryAudience', 'internal')}
                      className="flex-1"
                    />
                    <SelectionButton
                      label="External Stakeholders"
                      checked={data.primaryAudience === 'external'}
                      onChange={() => updateField('primaryAudience', 'external')}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2 items-start w-full">
                    <SelectionButton
                      label="Employees"
                      checked={data.primaryAudience === 'employees'}
                      onChange={() => updateField('primaryAudience', 'employees')}
                      className="flex-1"
                    />
                    <SelectionButton
                      label="Clients"
                      checked={data.primaryAudience === 'clients'}
                      onChange={() => updateField('primaryAudience', 'clients')}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="w-full flex flex-col gap-1.5 items-start">
                <Input
                  label="Deliverables"
                  placeholder="What needs to be delivered?"
                  className="bg-[#f7f7f7]"
                  value={data.deliverables}
                  onChange={(e) => updateField('deliverables', e.target.value)}
                />
              </div>

              {/* Think / Feel / Do */}
              <div className="w-full flex flex-col gap-5 items-start">
                <label className="text-[14px] leading-[20px] text-[#464649]">
                  What should they Think / Feel / Do?
                </label>
                <div className="flex gap-5 items-start w-full">
                  <div className="flex-1 flex flex-col gap-1.5 items-start">
                    <Input
                      label="Think"
                      placeholder=""
                      className="bg-[#f7f7f7]"
                      value={data.think}
                      onChange={(e) => updateField('think', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 items-start">
                    <Input
                      label="Feel"
                      placeholder=""
                      className="bg-[#f7f7f7]"
                      value={data.feel}
                      onChange={(e) => updateField('feel', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 items-start">
                    <Input
                      label="Do"
                      placeholder=""
                      className="bg-[#f7f7f7]"
                      value={data.do}
                      onChange={(e) => updateField('do', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Tone / Style Selection */}
              <div className="w-full flex flex-col gap-1.5 items-start">
                <label className="text-[14px] leading-[20px] text-[#464649]">
                  Tone / Style
                </label>
                <div className="w-full flex flex-col gap-2 items-start">
                  <div className="flex gap-2 items-center w-full">
                    <SelectionButton
                      label="Professional"
                      checked={data.tone === 'professional'}
                      onChange={() => updateField('tone', 'professional')}
                      className="flex-1"
                    />
                    <SelectionButton
                      label="Persuasive"
                      checked={data.tone === 'persuasive'}
                      onChange={() => updateField('tone', 'persuasive')}
                      className="flex-1"
                    />
                    <SelectionButton
                      label="Creative"
                      checked={data.tone === 'creative'}
                      onChange={() => updateField('tone', 'creative')}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2 items-start w-full">
                    <SelectionButton
                      label="Analytical"
                      checked={data.tone === 'analytical'}
                      onChange={() => updateField('tone', 'analytical')}
                      className="flex-1"
                    />
                    <SelectionButton
                      label="Other"
                      checked={data.tone === 'other'}
                      onChange={() => updateField('tone', 'other')}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structural Details Section */}
      <div className="bg-white rounded-xl shadow-[3px_3px_25px_0px_rgba(0,0,0,0.13)] p-8 w-full">
        <div className="flex flex-col gap-6 items-start w-full">
          {/* Section Header */}
          <div className="flex gap-6 items-center justify-center w-full">
            <h2 className="flex-1 font-medium text-[18px] leading-[28px] text-black">
              Structural Details
            </h2>
            <button
              onClick={() => toggleSection('structural')}
              className="cursor-pointer"
            >
              {expandedSections.structural ? (
                <ChevronUp className="size-6 text-base-foreground" />
              ) : (
                <ChevronDown className="size-6 text-base-foreground" />
              )}
            </button>
          </div>

          {/* Section Content */}
          {expandedSections.structural && (
            <div className="flex flex-col gap-5 items-start w-full">
              {/* How should this be structured? */}
              <div className="w-full flex flex-col gap-1.5 items-start">
                <label className="text-[14px] leading-[20px] text-[#464649]">
                  How should this be structured?
                </label>
                <div className="flex gap-2 items-center w-full">
                  <SelectionButton
                    label="Narrative"
                    checked={data.structure === 'narrative'}
                    onChange={() => updateField('structure', 'narrative')}
                    className="flex-1"
                  />
                  <SelectionButton
                    label="Bullet"
                    checked={data.structure === 'bullet'}
                    onChange={() => updateField('structure', 'bullet')}
                    className="flex-1"
                  />
                  <SelectionButton
                    label="Data-Driven"
                    checked={data.structure === 'data-driven'}
                    onChange={() => updateField('structure', 'data-driven')}
                    className="flex-1"
                  />
                  <SelectionButton
                    label="Storyboard"
                    checked={data.structure === 'storyboard'}
                    onChange={() => updateField('structure', 'storyboard')}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Estimated Page Count & Word Count Preference Row */}
              <div className="flex gap-5 items-start w-full">
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Estimated Page Count"
                    placeholder="Roughly how many pages/slides?"
                    className="bg-[#f7f7f7]"
                    value={data.estimatedPageCount}
                    onChange={(e) => updateField('estimatedPageCount', e.target.value)}
                  />
                  <ToggleSwitch
                    label="N/A"
                    checked={data.estimatedPageCountNA}
                    onChange={() => updateField('estimatedPageCountNA', !data.estimatedPageCountNA)}
                    textPlacement="left"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Word Count Preference"
                    placeholder="Any guidance on depth or word count"
                    className="bg-[#f7f7f7]"
                    value={data.wordCountPreference}
                    onChange={(e) => updateField('wordCountPreference', e.target.value)}
                  />
                  <ToggleSwitch
                    label="N/A"
                    checked={data.wordCountPreferenceNA}
                    onChange={() => updateField('wordCountPreferenceNA', !data.wordCountPreferenceNA)}
                    textPlacement="left"
                  />
                </div>
              </div>

              {/* Budget & Allocation & Timeline / Deadlines Row */}
              <div className="flex gap-5 items-start w-full">
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Budget & Allocation"
                    placeholder=""
                    className="bg-[#f7f7f7]"
                    value={data.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                  />
                  <ToggleSwitch
                    label="N/A"
                    checked={data.budgetAllocationNA}
                    onChange={() => updateField('budgetAllocationNA', !data.budgetAllocationNA)}
                    textPlacement="left"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Timeline / Deadlines"
                    placeholder="What are the key dates or milestones?"
                    className="bg-[#f7f7f7]"
                    value={data.timeline}
                    onChange={(e) => updateField('timeline', e.target.value)}
                  />
                  <ToggleSwitch
                    label="N/A"
                    checked={data.timelineDeadlinesNA}
                    onChange={() => updateField('timelineDeadlinesNA', !data.timelineDeadlinesNA)}
                    textPlacement="left"
                  />
                </div>
              </div>

              {/* Dependencies & Approvers Row */}
              <div className="flex gap-5 items-start w-full">
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Dependencies"
                    placeholder="Which teams/agencies are involved?"
                    className="bg-[#f7f7f7]"
                    value={data.dependencies}
                    onChange={(e) => updateField('dependencies', e.target.value)}
                  />
                  <ToggleSwitch
                    label="N/A"
                    checked={data.dependenciesNA}
                    onChange={() => updateField('dependenciesNA', !data.dependenciesNA)}
                    textPlacement="left"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2 items-start">
                  <Input
                    label="Approvers"
                    placeholder="Who are the key stakeholders/approvers?"
                    className="bg-[#f7f7f7]"
                    value={data.approvers}
                    onChange={(e) => updateField('approvers', e.target.value)}
                  />
                  <ToggleSwitch
                    label="N/A"
                    checked={data.approversNA}
                    onChange={() => updateField('approversNA', !data.approversNA)}
                    textPlacement="left"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
