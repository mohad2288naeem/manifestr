import { useState, useRef } from 'react'
import { X, Loader2, CloudUpload } from 'lucide-react'
import Image from 'next/image'

export default function FileUploadZone({ 
  maxFiles = 10, 
  onFilesChange,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4']
}) {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(new Set())
  const fileInputRef = useRef(null)

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).slice(0, maxFiles - files.length)
    
    newFiles.forEach((file) => {
      const fileId = `${Date.now()}-${Math.random()}`
      const fileObj = {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        status: 'uploading'
      }
      
      setFiles((prev) => [...prev, fileObj])
      setUploadingFiles((prev) => new Set(prev).add(fileId))
      
      // Simulate file upload
      setTimeout(() => {
        setUploadingFiles((prev) => {
          const next = new Set(prev)
          next.delete(fileId)
          return next
        })
        setFiles((prev) => {
          const updated = prev.map((f) => 
            f.id === fileId ? { ...f, status: 'completed' } : f
          )
          if (onFilesChange) {
            onFilesChange(updated)
          }
          return updated
        })
      }, 2000)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files)
  }

  const removeFile = (fileId) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      const updated = prev.filter((f) => f.id !== fileId)
      if (onFilesChange) {
        onFilesChange(updated)
      }
      return updated
    })
  }

  const canAddMore = files.length < maxFiles

  return (
    <div className="w-full flex flex-col gap-8 items-start">
      {/* Import from Vault Button - positioned above upload card */}
      {canAddMore && (
        <div className="w-full flex justify-end relative">
          <button className="bg-white text-base-foreground flex gap-2 items-center justify-center h-10 px-4 py-2 rounded-md hover:bg-base-muted hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_1px_3px_0px_rgba(0,0,0,0.1)] backdrop-blur-sm">
            <CloudUpload className="size-4" />
            <span className="text-[14px] leading-[20px] font-medium">Import from Vault</span>
          </button>
        </div>
      )}
      
      {/* Upload Zone - Always visible */}
      <div className="w-full flex flex-col gap-3 items-start">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`bg-[#f4f4f4] box-border flex flex-col h-[315px] items-start pb-[20px] pt-[10px] px-[50px] rounded-xl w-full transition-colors relative overflow-hidden ${
            isDragging ? 'border-2 border-dashed border-base-secondary' : ''
          } ${!canAddMore ? 'opacity-60' : ''}`}
        >
            {/* Background Text */}
          <p className="absolute italic text-[83.5px] leading-normal text-black opacity-[0.03] whitespace-nowrap left-1/2 -translate-x-1/2 top-[215px]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '500', letterSpacing: '-2px' }}>
            LIMITLESS POTENTIAL
            </p>

            {/* Upload Content */}
          <div className="relative z-10 flex flex-col gap-3 items-center w-full">
            <div className="relative h-[78.896px] w-[56.522px] flex items-center justify-center">
              <div className="relative w-[29px] h-[40px]">
                <Image
                  src="/assets/icons/upload-logo.svg"
                  alt="Upload"
                  width={29}
                  height={40}
                  className="w-full h-full"
                />
                </div>
              </div>

              {/* Instructions */}
            <p className="text-center text-[14px] leading-[20px] text-base-muted-foreground+">
              Videos must be less than 30 MB and photos
                  <br />
              must be less than 2 MB in size.
                  <br />
              (JPG, PNG, MP4 accepted)
              </p>

              {/* Action Buttons */}
            <div className="flex gap-2 items-center mt-4">
                <button
                onClick={() => canAddMore && fileInputRef.current?.click()}
                disabled={!canAddMore}
                className="bg-[rgb(24,24,27)] text-white flex gap-2 items-center justify-center h-10 px-3 py-2 rounded-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                <CloudUpload className="size-4 text-white" strokeWidth={2} />
                  <span className="text-[14px] leading-[20px] font-medium">Click to upload</span>
                </button>
              <button 
                disabled={!canAddMore}
                className="bg-white text-base-foreground flex gap-2 items-center justify-center h-10 px-4 py-2 rounded-md hover:bg-base-muted hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_1px_3px_0px_rgba(0,0,0,0.1)] backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Image
                  src="/assets/icons/upload-logo.svg"
                  alt="Upload"
                  width={16}
                  height={22}
                  className="w-4 h-auto"
                />
                  <span className="text-[14px] leading-[20px] font-medium">Browse Drive</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Uploaded Files Row - Below upload card with horizontal scroll */}
      {files.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          <div className="overflow-x-auto w-full scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#71717a transparent' }}>
            <div className="flex gap-3 items-start pb-2" style={{ minWidth: 'min-content' }}>
          {files.map((fileObj) => (
            <div
              key={fileObj.id}
                  className="relative border border-base-border rounded-xl h-[100px] w-[150px] shrink-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {fileObj.preview ? (
                    <>
                <Image
                  src={fileObj.preview}
                  alt={fileObj.name}
                  fill
                  className="object-cover"
                />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[42.788%] to-black/84 rounded-xl pointer-events-none" />
                    </>
              ) : (
                    <div className="w-full h-full flex items-center justify-center bg-base-muted">
                  <span className="text-xs text-base-muted-foreground">Video</span>
                </div>
              )}

              {/* Loading Overlay */}
              {uploadingFiles.has(fileObj.id) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => removeFile(fileObj.id)}
                    className="absolute top-[11.7px] right-[10.5px] bg-black/50 hover:bg-black/70 rounded-[5.625px] p-[2.363px] size-[24px] flex items-center justify-center transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

