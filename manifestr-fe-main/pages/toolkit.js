import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import AppHeader from '../components/layout/AppHeader'
import ToolCard from '../components/create-project/ToolCard'

// Tools ordered to match Figma layout:
// Row 1: THE strategist, THE briefcase, THE analyser, DESIGN studio
// Row 2: WORDSMITH, THE deck, THE huddle, COST CTRL
const tools = [
  // Row 1
  {
    id: 'strategist',
    title: 'THE strategist',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: '/assets/dummy/tool-card-1.jpg',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'briefcase',
    title: 'THE briefcase',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: '/assets/dummy/tool-card-2.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'analyser',
    title: 'THE analyser',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: '/assets/dummy/tool-card-3.jpg',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'design-studio',
    title: 'DESIGN studio',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: '/assets/dummy/tool-card-4.jpg',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  // Row 2
  {
    id: 'wordsmith',
    title: 'WORDSMITH',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: '/assets/dummy/tool-card-5.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'deck',
    title: 'THE deck',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: '/assets/dummy/tool-card-6.jpg',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'huddle',
    title: 'THE huddle',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: '/assets/dummy/tool-card-7.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'cost-ctrl',
    title: 'COST CTRL',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: '/assets/dummy/tool-card-8.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
]

export default function Toolkit() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState('')
  const [isSortOpen, setIsSortOpen] = useState(false)

  const handleToolSelect = (toolId) => {
    router.push(`/create-project?tool=${toolId}`)
  }

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
  ]

  return (
    <>
      <Head>
        <title>Toolkit - Manifestr</title>
        <meta name="description" content="Explore Manifestr's powerful toolkit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white min-h-screen w-full flex flex-col">
        {/* Header */}
        <AppHeader showRightActions={true} />

        {/* Spacer for fixed header */}
        <div className="h-[72px]" />

        {/* Main Content */}
        <main className="flex-1 relative overflow-x-hidden">
          {/* Background Image */}
          <div className="absolute top-0 left-0 right-0 h-[199px] overflow-hidden pointer-events-none z-0">
            <div className="relative w-full h-full">
              <Image
                src="/assets/banners/abstract-white-wave.png"
                alt="Background"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 w-full pt-[51px] pb-20">
            {/* Heading Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-[1280px] mx-auto px-6 md:px-8 mb-8 md:mb-16"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <h1 className="font-hero font-bold text-[36px] md:text-[48px] leading-tight md:leading-[48px] tracking-[-0.96px] text-black">
                    THE <span className="font-accent italic font-bold lowercase" style={{ fontFamily: "'Playfair Display', serif" }}>toolkit</span>
                  </h1>
                  <p className="text-[16px] leading-[24px] text-base-muted-foreground+">
                    Hover over a tool for more info
                  </p>
                </div>

                {/* Sort By Dropdown */}
                <div className="relative self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 flex items-center gap-2 hover:bg-base-muted transition-colors cursor-pointer"
                  >
                    <span className="text-[14px] leading-[20px] text-base-foreground font-medium">
                      Sort By
                    </span>
                    <ChevronDown className={`w-4 h-4 text-base-muted-foreground transition-transform ${isSortOpen ? 'rotate-180' : ''
                      }`} />
                  </button>

                  {/* Dropdown Options */}
                  {isSortOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsSortOpen(false)}
                      />
                      <div className="absolute z-20 mt-1 right-0 w-[160px] bg-white border border-[#e4e4e7] rounded-md shadow-lg">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSortBy(option.value)
                              setIsSortOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-[14px] leading-[20px] hover:bg-base-muted transition-colors ${sortBy === option.value ? 'bg-base-muted font-medium' : 'text-base-foreground'
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-[1290px] mx-auto px-4 mt-8 md:mt-16 bg-transparent"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full max-w-[302px]"
                  >
                    <ToolCard
                      title={tool.title}
                      subtitle={tool.subtitle}
                      imageSrc={tool.imageSrc}
                      description={tool.description}
                      onClick={() => handleToolSelect(tool.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}

