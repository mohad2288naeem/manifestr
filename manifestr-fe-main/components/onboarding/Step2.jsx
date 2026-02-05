import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Button from '../ui/Button'
import ToggleCheckbox from '../forms/ToggleCheckbox'
import RadioButton from '../forms/RadioButton'

const achievementOptions = [
  'Client Work',
  'Internal Ops',
  'Reports',
  'Presentations',
  'Content Creation',
  'Brand Strategy',
  'Sales Pitches',
  'Project Planning',
  'Other',
]

export default function Step2({ onNext, onBack }) {
  const [selectedAchievements, setSelectedAchievements] = useState([])
  const [workStyle, setWorkStyle] = useState('solo')

  const handleAchievementToggle = (achievement) => {
    setSelectedAchievements((prev) => {
      if (prev.includes(achievement)) {
        return prev.filter((item) => item !== achievement)
      } else {
        return [...prev, achievement]
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({
      achievements: selectedAchievements,
      workStyle,
    })
  }

  const isFormValid = selectedAchievements.length > 0 && workStyle

  return (
    <div className="flex flex-col gap-8 w-full max-w-[400px] mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0px_44px_110px_0px_rgba(22,34,51,0.2)] p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* What Do You Want to Achieve Section */}
          <div className="flex flex-col gap-6">
            {/* Section Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-black" />
                <h2 className="text-[20px] leading-[28px] font-semibold text-[#09090b] font-hero">
                  What Do You Want to Achieve?
                </h2>
              </div>
              <p className="text-l2-regular text-base-muted-foreground">
                Tell us what you're here to create, improve, or master. (Select all that apply)
              </p>
            </div>

            {/* Achievement Options Grid */}
            <div className="grid grid-cols-2 gap-1">
              {achievementOptions.map((achievement) => (
                <ToggleCheckbox
                  key={achievement}
                  label={achievement}
                  checked={selectedAchievements.includes(achievement)}
                  onChange={() => handleAchievementToggle(achievement)}
                  className="w-full"
                />
              ))}
            </div>
          </div>

          {/* How do you usually work Section */}
          <div className="flex flex-col gap-6">
            {/* Section Header */}
            <div className="flex flex-col gap-3">
              <h2 className="text-[20px] leading-[28px] font-semibold text-[#09090b] font-hero">
                How do you usually work?
              </h2>
            </div>

            {/* Radio Button Options */}
            <div className="flex gap-3">
              <RadioButton
                label="Solo"
                name="workStyle"
                value="solo"
                checked={workStyle === 'solo'}
                onChange={(e) => setWorkStyle(e.target.value)}
                className="flex-1"
              />
              <RadioButton
                label="With a Team"
                name="workStyle"
                value="team"
                checked={workStyle === 'team'}
                onChange={(e) => setWorkStyle(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

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
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-2 text-l2-medium text-zinc-900 hover:opacity-80 self-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

