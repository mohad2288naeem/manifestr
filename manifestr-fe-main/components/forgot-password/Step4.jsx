import { CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Button from '../ui/Button'

export default function Step4({ onContinue }) {
  return (
    <>
      {/* Check Icon */}
      <div className="w-10 h-10 border border-[#e4e4e7] rounded-md flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-zinc-600" />
      </div>

      {/* Title and Subtitle */}
      <div className="flex flex-col gap-3 items-center text-center w-full max-w-[360px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-[#09090b] font-hero">
          Password reset
        </h1>
        <p className="text-l2-regular text-base-muted-foreground">
          Your password has been successfully reset.
          <br />
          Click below to log in magically.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-6 items-center w-full max-w-[360px]">
        {/* Continue Button */}
        <Button 
          type="button"
          variant="primary" 
          size="md" 
          className="w-full"
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </>
  )
}

