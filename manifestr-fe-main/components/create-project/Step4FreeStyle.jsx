import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import Logo from '../logo/Logo'

export default function Step4FreeStyle({ projectData, updateProjectData }) {
  // Use context from projectData, default to empty string
  const content = projectData?.context || ''

  const handleChange = (e) => {
    if (updateProjectData) {
      updateProjectData({ context: e.target.value })
    }
  }

  return (
    <div className="flex gap-0 items-start justify-between w-full">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-[480px]">
        <div className="flex flex-col gap-10 items-end px-10 py-10 w-full">
          <div className="flex flex-col gap-10 items-center justify-center w-full">
            {/* Manifestr Logo - At the top */}
            <div className="flex items-center justify-center shrink-0">
              <Logo size="md" />
            </div>

            {/* Heading */}
            <div className="h-[144.801px] w-[455px] flex flex-col items-center justify-center -mt-24">
              {/* Vector/Icon - placeholder */}
              <div className="h-[34.801px] w-[307.998px] mb-[40px]">
                <div className="w-full h-full bg-base-secondary rounded" />
              </div>

              <div className="flex flex-col gap-[8px] items-start text-center">
                <h1 className="font-hero font-semibold text-[30px] leading-[38px] text-black w-[455px]">
                  Free style
                </h1>
                <p className="font-normal text-[16px] leading-[24px] text-base-muted-foreground+ w-[455px]">
                  Your thinking partner
                </p>
              </div>
            </div>

            {/* Text Editor */}
            <div className="w-full max-w-[1153px]">
              <textarea
                value={content}
                onChange={handleChange}
                placeholder="Start typing your ideas here..."
                className="w-full min-h-[400px] p-6 border border-base-border rounded-lg focus:outline-none focus:ring-2 focus:ring-base-secondary resize-none text-[14px] leading-[20px]"
              />
            </div>

            {/* Info Alert */}
            <div className="w-full max-w-[1153px] flex gap-4 items-center px-10 py-4 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] rounded-lg bg-white border border-base-border">
              <div className="relative size-5 shrink-0">
                <div className="absolute inset-[-20%] opacity-30 rounded-full bg-base-muted" />
                <Lightbulb className="absolute inset-0 size-5 text-base-muted-foreground" />
              </div>
              <p className="flex-1 text-[14px] leading-[20px] font-semibold text-center text-base-muted-foreground+">
                "Don't worry if something's missing — I'll fill gaps for you." You can refine everything in the next step."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
