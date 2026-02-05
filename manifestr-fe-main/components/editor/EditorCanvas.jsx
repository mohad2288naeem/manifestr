import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import QuickAddToolbar from './QuickAddToolbar'

export default function EditorCanvas({ 
  slides = [],
  currentSlideIndex = 0,
  onSlideChange,
  onSlideUpdate,
  onTextDoubleClick,
  onElementSelect,
  onAddElement
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [quickAddPosition, setQuickAddPosition] = useState({ x: 0, y: 0, visible: false })
  const fileInputRef = useRef(null)

  const currentSlide = slides[currentSlideIndex] || { 
    id: currentSlideIndex + 1, 
    content: [],
    backgroundColor: '#ffffff'
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    // Set canvas size
    canvas.width = 953
    canvas.height = 536

    // Draw slide
    drawSlide(ctx, canvas, currentSlide)
  }, [currentSlide, zoom, selectedElement])

  const drawSlide = (ctx, canvas, slide) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set background
    if (slide.backgroundImage) {
      const bgImg = new Image()
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
      }
      bgImg.src = slide.backgroundImage
    } else {
      ctx.fillStyle = slide.backgroundColor || '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw slide content
    slide.content?.forEach((item, index) => {
      ctx.save()
      
      if (item.type === 'text') {
        // Set font
        const fontWeight = item.bold ? 'bold' : 'normal'
        const fontStyle = item.italic ? 'italic' : 'normal'
        ctx.font = `${fontStyle} ${fontWeight} ${item.fontSize || 24}px ${item.fontFamily || 'Inter'}`
        ctx.textAlign = item.align || 'left'
        ctx.textBaseline = 'top'
        
        // Apply text effects
        if (item.textShadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
          ctx.shadowBlur = 5
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 2
        } else if (item.glow) {
          ctx.shadowColor = item.color || '#18181b'
          ctx.shadowBlur = item.glowIntensity || 10
        } else {
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }
        
        // Draw text with word wrap
        const lines = wrapText(ctx, item.text, item.width || canvas.width - (item.x || 0))
        let y = item.y || 0
        
        // Apply gradient if enabled
        if (item.gradient) {
          const gradient = ctx.createLinearGradient(item.x || 0, item.y || 0, item.x || 0, item.y || 0 + (item.fontSize || 24) * lines.length)
          gradient.addColorStop(0, item.color || '#18181b')
          gradient.addColorStop(1, item.gradientColor || '#71717a')
          ctx.fillStyle = gradient
        } else {
          ctx.fillStyle = item.color || '#18181b'
        }
        
        lines.forEach(line => {
          // Draw outline if enabled
          if (item.outline) {
            ctx.strokeStyle = item.outlineColor || '#ffffff'
            ctx.lineWidth = item.outlineWidth || 2
            ctx.strokeText(line, item.x || 0, y)
          }
          ctx.fillText(line, item.x || 0, y)
          y += (item.fontSize || 24) * 1.2
        })
        
        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        
        // Draw selection border
        if (selectedElement === index) {
          ctx.strokeStyle = '#3b82f6'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.strokeRect(item.x || 0, item.y || 0, item.width || 200, (item.fontSize || 24) * lines.length)
          ctx.setLineDash([])
        }
      } 
      else if (item.type === 'image') {
        if (item.image) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, item.x || 0, item.y || 0, item.width || 200, item.height || 200)
            
            // Draw selection border
            if (selectedElement === index) {
              ctx.strokeStyle = '#3b82f6'
              ctx.lineWidth = 2
              ctx.setLineDash([5, 5])
              ctx.strokeRect(item.x || 0, item.y || 0, item.width || 200, item.height || 200)
              ctx.setLineDash([])
              
              // Draw resize handles
              drawResizeHandles(ctx, item.x || 0, item.y || 0, item.width || 200, item.height || 200)
            }
          }
          img.src = item.image
        }
      }
      else if (item.type === 'shape') {
        // Apply effects
        if (item.effects?.includes('shadow')) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
          ctx.shadowBlur = item.shadowIntensity || 5
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 2
        } else if (item.effects?.includes('glow')) {
          ctx.shadowColor = item.fill || '#e4e4e7'
          ctx.shadowBlur = item.glowIntensity || 10
        } else {
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }
        
        ctx.fillStyle = item.fill || '#e4e4e7'
        ctx.strokeStyle = item.stroke || '#18181b'
        ctx.lineWidth = item.strokeWidth || 1
        
        if (item.shape === 'rect') {
          ctx.fillRect(item.x || 0, item.y || 0, item.width || 100, item.height || 100)
          ctx.strokeRect(item.x || 0, item.y || 0, item.width || 100, item.height || 100)
        } else if (item.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(item.x || 0, item.y || 0, item.radius || 50, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
        
        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        
        // Draw selection border
        if (selectedElement === index) {
          ctx.strokeStyle = '#3b82f6'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          if (item.shape === 'rect') {
            ctx.strokeRect(item.x || 0, item.y || 0, item.width || 100, item.height || 100)
            drawResizeHandles(ctx, item.x || 0, item.y || 0, item.width || 100, item.height || 100)
          } else {
            ctx.strokeRect((item.x || 0) - (item.radius || 50), (item.y || 0) - (item.radius || 50), 
                          (item.radius || 50) * 2, (item.radius || 50) * 2)
          }
          ctx.setLineDash([])
        }
      }
      
      ctx.restore()
    })
  }

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ')
    const lines = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = ctx.measureText(currentLine + ' ' + word).width
      if (width < maxWidth) {
        currentLine += ' ' + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
  }

  const drawResizeHandles = (ctx, x, y, width, height) => {
    const handleSize = 8
    const handles = [
      { x: x, y: y }, // top-left
      { x: x + width, y: y }, // top-right
      { x: x, y: y + height }, // bottom-left
      { x: x + width, y: y + height }, // bottom-right
    ]
    
    handles.forEach(handle => {
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize)
    })
  }

  const getElementAtPoint = (x, y) => {
    for (let i = currentSlide.content.length - 1; i >= 0; i--) {
      const item = currentSlide.content[i]
      
      if (item.type === 'text') {
        if (x >= (item.x || 0) && x <= (item.x || 0) + (item.width || 200) &&
            y >= (item.y || 0) && y <= (item.y || 0) + (item.fontSize || 24) * 2) {
          return i
        }
      } else if (item.type === 'image') {
        if (x >= (item.x || 0) && x <= (item.x || 0) + (item.width || 200) &&
            y >= (item.y || 0) && y <= (item.y || 0) + (item.height || 200)) {
          return i
        }
      } else if (item.type === 'shape') {
        if (item.shape === 'rect') {
          if (x >= (item.x || 0) && x <= (item.x || 0) + (item.width || 100) &&
              y >= (item.y || 0) && y <= (item.y || 0) + (item.height || 100)) {
            return i
          }
        } else if (item.shape === 'circle') {
          const dx = x - (item.x || 0)
          const dy = y - (item.y || 0)
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance <= (item.radius || 50)) {
            return i
          }
        }
      }
    }
    return null
  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const elementIndex = getElementAtPoint(x, y)
    
    if (elementIndex !== null) {
      setSelectedElement(elementIndex)
      if (onElementSelect) onElementSelect(elementIndex)
      setIsDragging(true)
      setDragStart({ x: x - (currentSlide.content[elementIndex].x || 0), 
                     y: y - (currentSlide.content[elementIndex].y || 0) })
      setQuickAddPosition({ x: 0, y: 0, visible: false })
    } else {
      setSelectedElement(null)
      if (onElementSelect) onElementSelect(null)
      // Show quick add toolbar on empty area click
      if (e.button === 0) { // Left click
        setQuickAddPosition({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top, 
          visible: true 
        })
      }
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const elementIndex = getElementAtPoint(x, y)
    
    if (elementIndex === null) {
      // Show quick add toolbar on right click
      setQuickAddPosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top, 
        visible: true 
      })
    }
  }

  const handleQuickAdd = (elementType) => {
    const canvas = canvasRef.current
    if (!canvas || !onAddElement) return

    const rect = canvas.getBoundingClientRect()
    const x = (quickAddPosition.x - rect.left) / zoom
    const y = (quickAddPosition.y - rect.top) / zoom

    onAddElement(elementType, x, y)
    setQuickAddPosition({ x: 0, y: 0, visible: false })
  }

  const handleDoubleClick = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const elementIndex = getElementAtPoint(x, y)
    
    if (elementIndex !== null && currentSlide.content[elementIndex].type === 'text') {
      if (onTextDoubleClick) {
        onTextDoubleClick(elementIndex)
      }
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || selectedElement === null) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const updatedContent = [...currentSlide.content]
    updatedContent[selectedElement] = {
      ...updatedContent[selectedElement],
      x: x - dragStart.x,
      y: y - dragStart.y
    }

    const updatedSlide = { ...currentSlide, content: updatedContent }
    onSlideUpdate(currentSlideIndex, updatedSlide)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target.result
      const newImage = {
        type: 'image',
        image: imageData,
        x: 100,
        y: 100,
        width: 200,
        height: 200
      }

      const updatedContent = [...currentSlide.content, newImage]
      const updatedSlide = { ...currentSlide, content: updatedContent }
      onSlideUpdate(currentSlideIndex, updatedSlide)
      setSelectedElement(updatedContent.length - 1)
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = (e) => {
    if (e.key === 'Delete' && selectedElement !== null) {
      const updatedContent = currentSlide.content.filter((_, index) => index !== selectedElement)
      const updatedSlide = { ...currentSlide, content: updatedContent }
      onSlideUpdate(currentSlideIndex, updatedSlide)
      setSelectedElement(null)
    }
  }

  const handleZoom = (delta) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)))
  }

  useEffect(() => {
    window.addEventListener('keydown', handleDelete)
    return () => window.removeEventListener('keydown', handleDelete)
  }, [selectedElement, currentSlide])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-[#f4f4f5] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onClick={(e) => {
        // Close quick add toolbar when clicking outside
        if (quickAddPosition.visible && e.target === containerRef.current) {
          setQuickAddPosition({ x: 0, y: 0, visible: false })
        }
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Canvas Container */}
      <div 
        className="relative bg-white shadow-lg"
        style={{ 
          width: `${953 * zoom}px`, 
          height: `${536 * zoom}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'center'
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: '953px', height: '536px' }}
        />
        
        {/* Default Slide Content (if empty) */}
        {currentSlide.content.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
            <h1 className="text-[66px] font-semibold leading-[66px] text-[#18181b] mb-4">
              Presentation Title
            </h1>
            <p className="text-[26px] leading-[35px] text-[#71717a]">
              Subtitle or Author Name
            </p>
          </div>
        )}
      </div>

      {/* Quick Add Toolbar */}
      <QuickAddToolbar
        position={quickAddPosition}
        visible={quickAddPosition.visible}
        onAddElement={handleQuickAdd}
      />

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white border border-[#e4e4e7] rounded-lg p-2">
        <button
          onClick={() => handleZoom(0.1)}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#f4f4f5] rounded"
        >
          <ZoomIn className="w-4 h-4 text-[#18181b]" />
        </button>
        <span className="text-[12px] text-[#71717a] text-center px-2">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => handleZoom(-0.1)}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#f4f4f5] rounded"
        >
          <ZoomOut className="w-4 h-4 text-[#18181b]" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#f4f4f5] rounded"
        >
          <Maximize2 className="w-4 h-4 text-[#18181b]" />
        </button>
      </div>

      {/* Upload Image Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-4 right-4 bg-[#18181b] text-white px-4 py-2 rounded-md text-[14px] font-medium hover:opacity-90"
      >
        Upload Image
      </button>
    </div>
  )
}
