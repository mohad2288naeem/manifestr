export default function Hero() {
  return (
    <section className="relative min-h-[500px] md:min-h-[709px] w-full bg-white overflow-hidden pt-28 md:pt-20 flex items-center">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 items-center">
          {/* Left: ELEVATE Text */}
          <div className="flex justify-center md:justify-start order-1 md:order-1">
            <h1 className="text-[48px] md:text-[72px] leading-tight md:leading-[90px] font-bold text-black tracking-[-1.44px] font-hero">
              ELEVATE
            </h1>
          </div>

          {/* Center: Image Placeholder */}
          <div className="flex justify-center order-3 md:order-2 mt-8 md:mt-0">
            <div className="bg-base-muted rounded-xl w-full max-w-[350px] md:max-w-[500px] aspect-[4/3] flex items-center justify-center">
              {/* Placeholder Icon - Circle above mountains */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-base-border" />
                <div className="flex items-end gap-1.5">
                  <div className="w-6 h-10 md:w-8 md:h-12 bg-base-border rounded-t" />
                  <div className="w-10 h-14 md:w-12 md:h-16 bg-base-border rounded-t" />
                  <div className="w-6 h-10 md:w-8 md:h-12 bg-base-border rounded-t" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Your GAME Text */}
          <div className="flex justify-center md:justify-end order-2 md:order-3">
            <div className="flex flex-col items-center md:items-end">
              <span className="text-[48px] md:text-[72px] leading-[60px] md:leading-[88px] italic font-semibold text-black font-accent">
                Your
              </span>
              <span className="text-[48px] md:text-[72px] leading-[60px] md:leading-[90px] font-bold text-black tracking-[-1.44px] font-hero">
                GAME
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
