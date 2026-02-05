import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../forms/Input'
import Select from '../forms/Select'

export default function Step1({ onNext, onSkip }) {
  const [areaOfExpertise, setAreaOfExpertise] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [industry, setIndustry] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({
      expertise: areaOfExpertise,
      jobTitle,
      industry
    })
  }

  const isFormValid = areaOfExpertise && jobTitle && industry

  return (
    <div className="flex flex-col gap-8 w-full max-w-[400px] mx-auto">
      {/* Title and Description */}
      <div className="flex flex-col gap-2 items-center text-center mt-[64px]">
        <h1 className="text-[24px] leading-[40px] font-semibold text-[#09090b] font-hero">
          Let's set up MANIFESTR for you.
        </h1>
        <p className="text-l2-regular text-base-foreground">
          Your way of working is your edge...MANIFESTR is built to amplify it. Answer a few quick questions to make MANIFESTR work the way you do.
        </p>
      </div>

      {/* Work Profile Card */}
      <div className="bg-white rounded-2xl shadow-[0px_44px_110px_0px_rgba(22,34,51,0.2)] p-8">
        <div className="flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-black" />
              <h2 className="text-[20px] leading-[28px] font-semibold text-[#09090b] font-hero">
                Your Work Profile
              </h2>
            </div>
            <p className="text-l2-regular text-base-muted-foreground">
              Your answers help MANIFESTR activate the right tools, templates and recommendations for you.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Area of Expertise */}
            <Select
              label="What is your Area of Expertise?"
              placeholder="e.g., Digital Marketing, Management."
              value={areaOfExpertise}
              onChange={(e) => setAreaOfExpertise(e.target.value)}
              options={[
                { value: 'digital-marketing', label: 'Digital Marketing' },
                { value: 'management', label: 'Management' },
                { value: 'sales', label: 'Sales' },
                { value: 'product', label: 'Product' },
                { value: 'engineering', label: 'Engineering' },
                { value: 'design', label: 'Design' },
                { value: 'operations', label: 'Operations' },
                { value: 'finance', label: 'Finance' },
              ]}
              required
            />

            {/* Job Title */}
            <Input
              label="What is your Job Title?"
              type="text"
              placeholder="e.g., Marketing Director, Manager."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />

            {/* Industry */}
            <Select
              label="Which industry do you operate in?"
              placeholder="Select your industry."
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              options={[
                { value: 'technology', label: 'Technology' },
                { value: 'finance', label: 'Finance' },
                { value: 'healthcare', label: 'Healthcare' },
                { value: 'retail', label: 'Retail' },
                { value: 'education', label: 'Education' },
                { value: 'manufacturing', label: 'Manufacturing' },
                { value: 'consulting', label: 'Consulting' },
                { value: 'media', label: 'Media & Entertainment' },
              ]}
              required
            />

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={!isFormValid}
              >
                Continue →
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="w-full"
                onClick={onSkip}
              >
                Skip for now
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

