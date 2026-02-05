export default function ProgressBar({ step, totalSteps = 3 }) {
  const progress = (step / totalSteps) * 100

  return (
    <div className="flex gap-[10px] items-center w-full">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#14cb74] rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <p className="text-l2-medium text-slate-600 tracking-[-0.084px]">
        Step {step}/{totalSteps}
      </p>
    </div>
  )
}

