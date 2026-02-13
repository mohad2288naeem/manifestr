import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import ToggleCheckbox from '../forms/ToggleCheckbox'
import RadioButton from '../forms/RadioButton'
import Input from '../forms/Input'

const bottleneckOptions = [
  'Too time-consuming',
  'Starting from scratch',
  'Hard to organize work',
  'Hate writing decks',
  'Inconsistent visuals',
  'Lack of structure',
  'Sales Pitches',
  'Project Planning',
  'Other',
]

export default function Step3({ onNext, onBack, isSubmitting }) {
  const [selectedBottlenecks, setSelectedBottlenecks] = useState([])
  const [otherBottleneck, setOtherBottleneck] = useState('')
  const [workStyle, setWorkStyle] = useState('solo')

  const handleBottleneckToggle = (bottleneck) => {
    setSelectedBottlenecks((prev) => {
      if (prev.includes(bottleneck)) {
        return prev.filter((item) => item !== bottleneck)
      } else {
        return [...prev, bottleneck]
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({
      bottlenecks: selectedBottlenecks,
      otherBottleneck: selectedBottlenecks.includes('Other') ? otherBottleneck : '',
      workStyle,
    })
  }

  const isFormValid = selectedBottlenecks.length > 0 && workStyle

  return (
    <div className="flex flex-col gap-8 w-full max-w-[500px] mx-auto mt-5">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0px_44px_110px_0px_rgba(22,34,51,0.2)] p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* What Slows Your Work Down Section */}
          <div className="flex flex-col gap-6">
            {/* Section Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-black shrink-0" />
                <h2 className="text-[20px] leading-[28px] font-semibold text-[#09090b] font-hero">
                  What Slows Your Work Down?
                </h2>
              </div>
              <p className="text-l2-regular text-[#71717A]">
                Everyone hits bottlenecks.
              </p>
              <p className="text-l2-regular text-base-muted-foreground">
                Tell us where you lose the most time or momentum: (Select all that apply)
              </p>
            </div>

            {/* Bottleneck Options Grid */}
            <div className="flex flex-col gap-1">
              {/* First 4 rows: 2 columns each */}
              {bottleneckOptions.slice(0, 8).map((bottleneck, index) => {
                if (index % 2 === 0) {
                  return (
                    <div key={`row-${index}`} className="flex gap-1">
                      <ToggleCheckbox
                        label={bottleneckOptions[index]}
                        checked={selectedBottlenecks.includes(bottleneckOptions[index])}
                        onChange={() => handleBottleneckToggle(bottleneckOptions[index])}
                        className="flex-1"
                      />
                      {bottleneckOptions[index + 1] && (
                        <ToggleCheckbox
                          label={bottleneckOptions[index + 1]}
                          checked={selectedBottlenecks.includes(bottleneckOptions[index + 1])}
                          onChange={() => handleBottleneckToggle(bottleneckOptions[index + 1])}
                          className="flex-1"
                        />
                      )}
                    </div>
                  )
                }
                return null
              })}
              {/* Last row: "Other" option */}
              {bottleneckOptions[8] && (
                <div className="flex gap-1">
                  <ToggleCheckbox
                    label={bottleneckOptions[8]}
                    checked={selectedBottlenecks.includes(bottleneckOptions[8])}
                    onChange={() => handleBottleneckToggle(bottleneckOptions[8])}
                    className="w-[196px]"
                  />
                </div>
              )}
            </div>

            {/* Other Input Field (shown when Other is selected) */}
            {selectedBottlenecks.includes('Other') && (
              <Input
                label=""
                type="text"
                placeholder="Please specify"
                value={otherBottleneck}
                onChange={(e) => setOtherBottleneck(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* How do you work Section */}
          <div className="flex flex-col gap-6">
            {/* Section Header */}
            <div className="flex flex-col gap-3">
              <h2 className="text-[20px] leading-[28px] font-semibold text-[#09090b] font-hero">
                How do you work?
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
            {isSubmitting ?
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={!isFormValid || isSubmitting}
            >
               Finishing...
            </Button>
             : 
             <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={!isFormValid || isSubmitting}
            >
               Continue <ArrowRight size={15} style={{marginLeft: 5}} />
            </Button>
            }
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-2 text-l2-medium text-zinc-900 hover:opacity-80 self-center"
            >
              <span>Back</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

