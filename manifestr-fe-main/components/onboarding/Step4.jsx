import { Check } from 'lucide-react'
import { useRouter } from 'next/router'
import Button from '../ui/Button'
import BlobCanvas from './BlobCanvas'

export default function Step4({ onFinish }) {
  const router = useRouter()

  const handleTakeTour = () => {
    // Navigate to tour or home
    if (onFinish) onFinish()
    else router.push('/')
  }

  const handleExploreOwn = () => {
    // Navigate to home
    if (onFinish) onFinish()
    else router.push('/')
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-[400px] mt-[64px] mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0px_44px_110px_0px_rgba(22,34,51,0.2)] p-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-[#18181b] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-[#18181b]" strokeWidth={3} />
              </div>
              <h2 className="text-[20px] leading-[28px] font-semibold text-[#09090b] font-hero">
                You're All Set
              </h2>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-l2-regular text-base-muted-foreground">
                Your MANIFESTR workspace is ready
              </p>
              <p className="text-l2-regular text-base-muted-foreground">
                Everything's set for you to dive in, create and move faster.
              </p>
            </div>
          </div>

          {/* Three.js Blob Canvas */}
          <div className="flex justify-center items-center py-4">
            <BlobCanvas />
          </div>

          {/* Additional Text */}
          <div className="flex flex-col gap-1">
            <p className="text-l2-regular text-base-muted-foreground text-center">
              Your tools, templates, and preferences have been
            </p>
            <p className="text-l2-regular text-base-muted-foreground text-center">
              configured. You're good to go.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleTakeTour}
            >
              Take the Tour →
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full"
              onClick={handleExploreOwn}
            >
              Explore my own
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

