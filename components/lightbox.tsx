"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion"
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { ImageAsset } from "@/types"

interface LightboxProps {
  images: ImageAsset[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  title?: string
  designer?: string
  category?: string
}

export function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
  designer,
  category,
}: LightboxProps) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(initialIndex)
  const [zoom, setZoom] = React.useState(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const stageRef = React.useRef<HTMLDivElement>(null)

  // Sync index when lightbox opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(initialIndex)
      setZoom(1)
      x.set(0)
      y.set(0)
    }
  }, [isOpen, initialIndex, x, y])

  // Reset zoom & pan when switching images
  React.useEffect(() => {
    setZoom(1)
    x.set(0)
    y.set(0)
  }, [activeImageIndex, x, y])

  // Preload adjacent images in browser cache to make fast-switching instantaneous
  React.useEffect(() => {
    if (!isOpen || !images.length) return

    const nextIdx1 = (activeImageIndex + 1) % images.length
    const nextIdx2 = (activeImageIndex + 2) % images.length
    const prevIdx1 = (activeImageIndex - 1 + images.length) % images.length

    const toPreload = [
      images[nextIdx1]?.src,
      images[nextIdx2]?.src,
      images[prevIdx1]?.src,
    ]

    toPreload.forEach((src) => {
      if (src && typeof window !== "undefined") {
        const img = new window.Image()
        img.src = src
      }
    })
  }, [isOpen, activeImageIndex, images])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.5).toFixed(2)), 4))
  }

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.5).toFixed(2)), 1)
      if (next === 1) {
        animate(x, 0, { duration: 0.2, ease: "easeOut" })
        animate(y, 0, { duration: 0.2, ease: "easeOut" })
      }
      return next
    })
  }

  const handleResetZoom = () => {
    setZoom(1)
    animate(x, 0, { duration: 0.2, ease: "easeOut" })
    animate(y, 0, { duration: 0.2, ease: "easeOut" })
  }

  const handleDoubleClick = () => {
    if (zoom > 1) {
      handleResetZoom()
    } else {
      setZoom(2)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || Math.abs(e.deltaY) > 0) {
      if (e.deltaY < 0) {
        setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 4))
      } else {
        setZoom((prev) => {
          const next = Math.max(Number((prev - 0.25).toFixed(2)), 1)
          if (next === 1) {
            x.set(0)
            y.set(0)
          }
          return next
        })
      }
    }
  }

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    handleResetZoom()
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    handleResetZoom()
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleSelectThumbnail = (idx: number) => {
    if (idx !== activeImageIndex) {
      handleResetZoom()
      setActiveImageIndex(idx)
    }
  }

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn()
      } else if (e.key === "-") {
        handleZoomOut()
      } else if (e.key === "0") {
        handleResetZoom()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, images.length, onClose, zoom])

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[activeImageIndex] || images[0]

  // Calculate drag boundaries based on stage width/height
  const stageWidth = stageRef.current?.offsetWidth || 1000
  const stageHeight = stageRef.current?.offsetHeight || 600
  const maxDragX = Math.round((stageWidth * (zoom - 1)) / 2 + 100)
  const maxDragY = Math.round((stageHeight * (zoom - 1)) / 2 + 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 md:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Step Counter */}
          <div className="absolute top-6 left-6 z-20 text-xs tracking-widest text-white/70 uppercase">
            {String(activeImageIndex + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </div>

          {/* Prev/Next outer arrows if multiple images */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 z-20 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none sm:left-6 sm:flex"
                aria-label="Hình trước"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 z-20 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none sm:right-6 sm:flex"
                aria-label="Hình tiếp theo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Modal Container */}
          <div
            className="relative flex max-h-[94vh] w-[95vw] max-w-5xl shrink-0 flex-col items-center overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950/90 p-4 backdrop-blur-md sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image Stage */}
            <div
              ref={stageRef}
              onWheel={handleWheel}
              className="relative h-[48vh] w-full shrink-0 overflow-hidden rounded-sm bg-black/60 sm:h-[56vh] md:h-[62vh]"
            >
              {/* Zoom Controls Toolbar */}
              <div
                className="absolute top-3 right-3 z-30 flex items-center gap-1 rounded-full border border-white/15 bg-black/80 px-2 py-1 text-white shadow-lg backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Thu nhỏ (-)"
                  aria-label="Thu nhỏ"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>

                <span className="min-w-[42px] select-none text-center text-[11px] font-medium tracking-wider text-white/90">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 4}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Phóng to (+)"
                  aria-label="Phóng to"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>

                {zoom > 1 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="ml-0.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-l border-white/20 pl-0.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                    title="Đặt lại kích thước (0)"
                    aria-label="Đặt lại kích thước"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Pan & Zoom Motion Container */}
              <motion.div
                drag={zoom > 1}
                dragConstraints={{
                  left: -maxDragX,
                  right: maxDragX,
                  top: -maxDragY,
                  bottom: maxDragY,
                }}
                dragElastic={0.08}
                style={{ x, y, scale: zoom }}
                onDoubleClick={handleDoubleClick}
                className={`relative flex h-full w-full items-center justify-center ${
                  zoom > 1
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-zoom-in"
                }`}
                title={
                  zoom > 1
                    ? "Kéo để di chuyển, nhấp đúp để đặt lại"
                    : "Nhấp đúp hoặc cuộn chuột để phóng to"
                }
              >
                <Image
                  key={currentImage.src}
                  src={currentImage.src}
                  alt={currentImage.alt || title || "Visual"}
                  fill
                  unoptimized
                  draggable={false}
                  className="pointer-events-none select-none object-contain"
                  sizes="(max-width: 1280px) 95vw, 1200px"
                  priority
                />
              </motion.div>

              {/* In-gallery Image Prev/Next Overlay Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-black/95 focus:outline-none"
                    aria-label="Hình trước"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-black/95 focus:outline-none"
                    aria-label="Hình tiếp theo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Image Counter Badge */}
                  <div className="absolute right-3 bottom-3 z-20 rounded-full bg-black/80 px-3 py-1 text-[11px] font-medium tracking-wider text-white/90 backdrop-blur-sm">
                    Ảnh {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails Strip with fixed height and smooth scroll */}
            {images.length > 1 && (
              <div className="mt-4 flex h-16 w-full shrink-0 items-center justify-center gap-2 overflow-x-auto px-1 pb-1 sm:h-20">
                {images.map((img, idx) => (
                  <button
                    key={img.src + idx}
                    type="button"
                    onClick={() => handleSelectThumbnail(idx)}
                    className={`relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded border transition-all sm:h-16 sm:w-16 ${
                      idx === activeImageIndex
                        ? "scale-105 border-white shadow-md shadow-black/50"
                        : "border-white/20 opacity-60 hover:border-white/50 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Project Details Footer */}
            {(title || designer) && (
              <div className="mt-4 flex w-full flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 text-white sm:flex-row">
                <div className="text-center sm:text-left">
                  {designer && (
                    <p className="text-xs tracking-widest text-white/60 uppercase">
                      Designer: {designer}
                    </p>
                  )}
                  {title && (
                    <h2 className="mt-0.5 font-serif text-xl font-normal text-white sm:text-2xl">
                      {title}
                    </h2>
                  )}
                </div>

                {category && (
                  <div className="text-xs tracking-widest text-white/60 uppercase">
                    {category}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface LightboxTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function LightboxTrigger({
  children,
  className,
  onClick,
}: LightboxTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("cursor-zoom-in", className)}
    >
      {children}
    </button>
  )
}
