import { useState } from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'

// Document types - this could be dynamic based on selected tool
const documentTypesByOutput = {
  presentation: [
    {
      id: 'pitch-deck',
      title: 'Pitch Deck',
      subtitle: 'Startups, fundraising, sales',
      imageSrc: '/assets/dummy/tool-card-1.jpg',
    },
    {
      id: 'sales-deck',
      title: 'Sales Deck',
      subtitle: 'B2B sales, product demos',
      imageSrc: '/assets/dummy/tool-card-2.png',
    },
    {
      id: 'qbr',
      title: 'QBR',
      subtitle: 'Quarterly business reviews',
      imageSrc: '/assets/dummy/tool-card-3.jpg',
    },
    {
      id: 'marketing-deck',
      title: 'Marketing Deck',
      subtitle: 'Campaigns, brand strategy',
      imageSrc: '/assets/dummy/tool-card-4.jpg',
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      subtitle: 'Design showcase, case studies',
      imageSrc: '/assets/dummy/tool-card-5.png',
    },
    {
      id: 'keynote',
      title: 'Keynote',
      subtitle: 'Conferences, big announcements',
      imageSrc: '/assets/dummy/tool-card-6.jpg',
    },
    {
      id: 'training',
      title: 'Training',
      subtitle: 'Workshops, educational decks',
      imageSrc: '/assets/dummy/tool-card-7.png',
    },
    {
      id: 'all-hands',
      title: 'All Hands',
      subtitle: 'Company updates, culture',
      imageSrc: '/assets/dummy/tool-card-8.png',
    },
  ],
  document: [
    {
      id: 'report',
      title: 'Report',
      subtitle: 'Analysis, summaries, insights',
      imageSrc: '/assets/dummy/tool-card-1.jpg',
    },
    {
      id: 'brief',
      title: 'Brief',
      subtitle: 'Creative, strategic, tactical',
      imageSrc: '/assets/dummy/tool-card-2.png',
    },
    {
      id: 'article',
      title: 'Article',
      subtitle: 'Blog posts, thought leadership',
      imageSrc: '/assets/dummy/tool-card-3.jpg',
    },
    {
      id: 'memo',
      title: 'Memo',
      subtitle: 'Internal announcements, policy',
      imageSrc: '/assets/dummy/tool-card-4.jpg',
    },
    {
      id: 'case-study',
      title: 'Case Study',
      subtitle: 'Customer success stories',
      imageSrc: '/assets/dummy/tool-card-5.png',
    },
    {
      id: 'white-paper',
      title: 'White Paper',
      subtitle: 'In-depth industry analysis',
      imageSrc: '/assets/dummy/tool-card-6.jpg',
    },
    {
      id: 'proposal',
      title: 'Proposal',
      subtitle: 'Project bids, scope of work',
      imageSrc: '/assets/dummy/tool-card-7.png',
    },
    {
      id: 'specs',
      title: 'Specifications',
      subtitle: 'Product requirements, tech specs',
      imageSrc: '/assets/dummy/tool-card-8.png',
    },
  ],
  spreadsheet: [
    {
      id: 'financial-model',
      title: 'Financial Model',
      subtitle: 'Forecasts, valuations',
      imageSrc: '/assets/dummy/tool-card-1.jpg',
    },
    {
      id: 'budget',
      title: 'Budget',
      subtitle: 'Expense tracking, planning',
      imageSrc: '/assets/dummy/tool-card-2.png',
    },
    {
      id: 'project-tracker',
      title: 'Project Tracker',
      subtitle: 'Timelines, Gantt charts',
      imageSrc: '/assets/dummy/tool-card-3.jpg',
    },
    {
      id: 'inventory',
      title: 'Inventory',
      subtitle: 'Stock management, logistics',
      imageSrc: '/assets/dummy/tool-card-4.jpg',
    },
    {
      id: 'marketing-analytics',
      title: 'Marketing Analytics',
      subtitle: 'Campaign performance',
      imageSrc: '/assets/dummy/tool-card-5.png',
    },
    {
      id: 'sales-pipeline',
      title: 'Sales Pipeline',
      subtitle: 'CRM data, deal tracking',
      imageSrc: '/assets/dummy/tool-card-6.jpg',
    },
    {
      id: 'cap-table',
      title: 'Cap Table',
      subtitle: 'Equity distribution, rounds',
      imageSrc: '/assets/dummy/tool-card-7.png',
    },
    {
      id: 'invoice',
      title: 'Invoice',
      subtitle: 'Billing, accounts receivable',
      imageSrc: '/assets/dummy/tool-card-8.png',
    },
  ],
}

function DocumentCard({ document, isSelected, onClick }) {
  return (
    <div
      data-doc-card="true"
      onClick={onClick}
      className={`flex flex-col items-start rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${isSelected
          ? 'border-2 border-[#000000] shadow-lg'
          : 'border-2 border-transparent shadow-sm hover:shadow-md'
        }`}
    >
      {/* Image */}
      <div className="relative w-full h-[118px] bg-gray-200 rounded-t-xl overflow-hidden">
        {document.imageSrc ? (
          <Image
            src={document.imageSrc}
            alt={document.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-base-muted flex items-center justify-center">
            <span className="text-base-muted-foreground text-sm">Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 w-full">
        <div>
          <h3 className="font-hero font-bold text-[24px] leading-[24px] text-black mb-1">
            {document.title}
          </h3>
          <p className="text-[14px] leading-[20px] text-base-muted-foreground+">
            {document.subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper function to render tool title (same as ToolCard) - with white text for banner
function renderToolTitle(title, textColor = 'text-white') {
  if (title.startsWith('THE')) {
    const rest = title.substring(4)
    return (
      <span className="flex items-baseline">
        <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.6px] ${textColor}`}>
          THE&nbsp;
        </span>
        <span
          className={`font-accent italic font-bold text-[40px] leading-[44px] tracking-[-0.72px] ${textColor} lowercase`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {rest}
        </span>
      </span>
    )
  }
  if (title.includes(' ')) {
    const parts = title.split(' ')
    const firstPart = parts[0]
    const rest = parts.slice(1).join(' ')
    return (
      <span className="flex items-baseline">
        <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.72px] ${textColor}`}>
          {firstPart}&nbsp;
        </span>
        <span
          className={`font-accent italic font-bold text-[40px] leading-[44px] tracking-[-0.72px] ${textColor} lowercase`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {' '}
          {rest}
        </span>
      </span>
    )
  }
  return (
    <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.6px] ${textColor}`}>
      {title}
    </span>
  )
}

export default function Step2DocumentSelection({ selectedTool, selectedDocument, onDocumentSelect }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [confidentialMode, setConfidentialMode] = useState(false)

  // Get tool title for display
  const toolTitle = selectedTool?.title || 'Tool'

  // Get document types based on selected tool output type
  const currentDocumentTypes = documentTypesByOutput[selectedTool?.outputType] || documentTypesByOutput.presentation

  return (
    <div className="flex flex-col gap-[35px] items-center w-full max-w-[1110px] mx-auto">
      {/* Banner with Tool Name */}
      <div className="relative w-full h-[186px] rounded-xl overflow-hidden">
        {/* Background Image */}
        {selectedTool?.imageSrc && (
          <div className="absolute inset-0">
            <Image
              src={selectedTool.imageSrc}
              alt={toolTitle}
              fill
              className="object-cover"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        {/* Tool Name - Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center">
            {renderToolTitle(toolTitle, 'text-white')}
          </div>
        </div>
      </div>

      {/* Heading Section */}
      <div className="flex flex-col gap-[12px] items-center w-full">
        <div className="flex flex-col gap-[5px] items-center w-full">
          <h1 className="font-hero font-bold text-[36px] leading-[44px] tracking-[-0.72px] text-black text-center">
            Let's create your document
          </h1>
          <p className="text-[16px] leading-[24px] text-center text-base-muted-foreground+">
            Select what you're creating - we'll shape it into something polished.
          </p>
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-4 gap-5 w-full">
        {currentDocumentTypes.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            isSelected={selectedDocument === doc.id}
            onClick={() => onDocumentSelect(doc.id)}
          />
        ))}
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-[630px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c7c7c]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Not Seeing it? Just type it in"
            className="w-full h-[40px] pl-12 pr-4 border border-[#dadada] rounded-lg bg-[#f6f6f6] text-[14px] leading-[20px] text-black placeholder:text-base-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#dadada] focus:border-[#dadada]"
          />
        </div>
      </div>

      {/* Confidential Mode Toggle */}
      <div className="flex items-center justify-center gap-3 w-full">
        <span className="text-[14px] leading-[24px] text-black">
          Confidential Mode
        </span>
        <span className="text-[14px] leading-[24px] text-base-muted-foreground+">
          |
        </span>
        <span className="text-[14px] leading-[24px] text-base-muted-foreground+">
          Extra Safeguard for sensitive work
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={confidentialMode}
            onChange={(e) => setConfidentialMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-base-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18181B]"></div>
        </label>
      </div>
    </div>
  )
}

