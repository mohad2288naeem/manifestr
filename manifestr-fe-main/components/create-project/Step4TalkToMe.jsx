import { X, Mic } from 'lucide-react'
import Image from 'next/image'
import Logo from '../logo/Logo'

export default function Step4TalkToMe() {
  return (
    <div className="flex flex-col gap-[40px] items-center justify-center w-full px-16 py-10">
      <div className="flex flex-col gap-6 items-center w-full max-w-[968px]">
        {/* Main Content Container */}
        <div className="flex flex-col gap-6 items-center w-full">
          {/* Manifestr Logo - At the top */}
          <div className="flex items-center justify-center shrink-0">
            <Logo size="md" />
          </div>

          {/* Heading Section */}
          <div className="flex flex-col gap-[8px] items-start text-center w-[455px] shrink-0">
            <h1 className="font-hero font-semibold text-[30px] leading-[38px] text-black w-full">
              Talk to me
            </h1>
            <p className="font-normal text-[16px] leading-[24px] text-base-muted-foreground+ w-full">
              "Speak your brief - I'll take care of the details."
            </p>
          </div>
        </div>

        {/* Large Microphone Button */}
        <div className="relative w-[180px] h-[180px] mt-8 rounded-full cursor-pointer overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-200 ease-in-out">
          <Image
            src="/assets/icons/microphone.svg"
            alt="Microphone"
            width={180}
            height={180}
            className="w-full h-full"
          />
        </div>

        {/* Instructional Text */}
        <p className="text-[16px] leading-[24px] text-base-muted-foreground+ text-center">
          I'm listening... Say 'Stop' or click the button to finish.
        </p>

        {/* Small Action Buttons */}
        <div className="flex gap-6 items-start shrink-0">
          {/* Small Microphone Button */}
          <div className="relative size-[48px] bg-base-muted rounded-[28px] cursor-pointer hover:bg-base-muted/80 hover:scale-110 hover:shadow-md active:scale-95 transition-all duration-200 ease-in-out flex items-center justify-center shadow-sm">
            <Mic className="size-6 text-base-foreground" strokeWidth={1.5} />
          </div>

          {/* Close/Stop Button */}
          <div className="relative size-[48px] bg-base-muted rounded-[28px] cursor-pointer hover:bg-base-muted/80 hover:scale-110 hover:shadow-md active:scale-95 transition-all duration-200 ease-in-out flex items-center justify-center shadow-sm">
            <X className="size-6 text-base-foreground" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  )
}
