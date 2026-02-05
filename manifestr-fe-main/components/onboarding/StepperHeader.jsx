import Logo from '../logo/Logo'

export default function StepperHeader({ step, totalSteps = 4 }) {
  return (
    <div className="w-full">
      {/* Header Navigation */}
      <div className="bg-white flex flex-col items-center overflow-hidden w-full">
        <div className="flex h-[72px] items-center justify-between max-w-[1280px] w-full px-8">
          <Logo size="md" />
          <div className="flex gap-6 items-center justify-end">
            <p className="text-l1-medium text-base-muted-foreground">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="flex gap-1 items-center w-full">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < step
          const isCurrent = stepNumber === step
          
          return (
            <div
              key={index}
              className="flex-1 h-2 relative rounded-sm overflow-hidden"
            >
              {/* Background */}
              <div
                className={`absolute inset-0 h-2 rounded-sm ${
                  isCompleted || isCurrent
                    ? 'bg-[rgba(24,24,27,0.5)]'
                    : 'bg-[#868687]'
                }`}
              />
              {/* Progress Fill */}
              {isCompleted && (
                <div className="absolute h-2 bg-[#18181b] rounded-bl-sm rounded-tl-sm top-0 left-0 w-full" />
              )}
              {isCurrent && (
                <div className="absolute h-2 bg-[#18181b] rounded-bl-sm rounded-tl-sm top-0 left-0 w-full" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

