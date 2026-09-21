"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react"

import type { AllProject, TeamMember } from "@/types"
import { cleanTitle } from "@/lib/projects"

interface TeamProjectsGridProps {
  projects: AllProject[]
  member: TeamMember
  internalSlugMap: Record<string, string>
}

export function TeamProjectsGrid({
  projects,
  member,
  internalSlugMap,
}: TeamProjectsGridProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const [activeImageIndex, setActiveImageIndex] = React.useState<number>(0)

  const activeProject =
    selectedIndex !== null &&
    selectedIndex >= 0 &&
    selectedIndex < projects.length
      ? projects[selectedIndex]
      : null

  // Reset image index when active project changes
  React.useEffect(() => {
    setActiveImageIndex(0)
  }, [selectedIndex])

  // Collect all unique images for the current project
  const galleryImages = React.useMemo(() => {
    if (!activeProject) return []
    const list: { src: string; alt: string }[] = []
    const seen = new Set<string>()

    if (activeProject.coverUrl) {
      list.push({ src: activeProject.coverUrl, alt: activeProject.title })
      seen.add(activeProject.coverUrl)
    }
    if (
      activeProject.heroImage?.src &&
      !seen.has(activeProject.heroImage.src)
    ) {
      list.push({
        src: activeProject.heroImage.src,
        alt: activeProject.heroImage.alt || activeProject.title,
      })
      seen.add(activeProject.heroImage.src)
    }
    if (activeProject.supportingImages) {
      for (const img of activeProject.supportingImages) {
        if (img.src && !seen.has(img.src)) {
          list.push({
            src: img.src,
            alt: img.alt || activeProject.title,
          })
          seen.add(img.src)
        }
      }
    }
    return list
  }, [activeProject])

  const currentImage = galleryImages[activeImageIndex] || galleryImages[0]

  // Keyboard navigation for modal
  React.useEffect(() => {
    if (selectedIndex === null) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedIndex(null)
      } else if (e.key === "ArrowLeft") {
        // If multiple images, step through images, otherwise step through projects
        if (galleryImages.length > 1 && activeImageIndex > 0) {
          setActiveImageIndex((prev) => prev - 1)
        } else {
          setSelectedIndex((prev) =>
            prev !== null ? (prev > 0 ? prev - 1 : projects.length - 1) : null
          )
        }
      } else if (e.key === "ArrowRight") {
        if (
          galleryImages.length > 1 &&
          activeImageIndex < galleryImages.length - 1
        ) {
          setActiveImageIndex((prev) => prev + 1)
        } else {
          setSelectedIndex((prev) =>
            prev !== null ? (prev < projects.length - 1 ? prev + 1 : 0) : null
          )
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, projects.length, galleryImages.length, activeImageIndex])

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedIndex])

  return (
    <>
      <div className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const slug = internalSlugMap[project.id] || project.id

          return (
            <div
              key={project.id}
              className="group relative flex flex-col border-r border-b border-border bg-background transition-colors hover:bg-secondary/30"
            >
              {/* Clickable Image Thumbnail to open preview modal */}
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="relative aspect-4/3 w-full overflow-hidden bg-muted cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                aria-label={`Xem ảnh dự án ${project.title}`}
              >
                <Image
                  src={project.coverUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {project.isSelected && (
                  <div className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium tracking-wider uppercase backdrop-blur-sm">
                    Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </button>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className="text-xs font-medium tracking-widest text-foreground uppercase">
                    {project.category}
                  </span>
                </div>
                <h3 className="font-serif text-xl leading-snug font-normal transition-colors group-hover:text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className="text-left hover:underline cursor-pointer"
                  >
                    {cleanTitle(project.title)}
                  </button>
                </h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm">
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    <span>Xem ảnh</span>
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    href={`/work/${slug}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
                  >
                    <span>Xem toàn bộ</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Internal Project Preview Lightbox Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 md:p-10"
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Step Counter */}
            <div className="absolute top-6 left-6 z-20 text-xs tracking-widest text-white/70 uppercase">
              {String((selectedIndex ?? 0) + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </div>

            {/* Navigation Buttons */}
            {projects.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex((prev) =>
                      prev !== null
                        ? prev > 0
                          ? prev - 1
                          : projects.length - 1
                        : null
                    )
                  }}
                  className="absolute left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none sm:left-6"
                  aria-label="Dự án trước"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex((prev) =>
                      prev !== null
                        ? prev < projects.length - 1
                          ? prev + 1
                          : 0
                        : null
                    )
                  }}
                  className="absolute right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none sm:right-6"
                  aria-label="Dự án tiếp theo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Modal Body */}
            <div
              className="relative flex max-h-[94vh] w-[95vw] max-w-5xl shrink-0 flex-col items-center overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950/90 p-4 backdrop-blur-md sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image Stage with fixed stable height */}
              <div className="relative h-[48vh] w-full shrink-0 overflow-hidden rounded-sm bg-black/60 sm:h-[56vh] md:h-[62vh]">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || activeProject.title}
                  fill
                  className="object-contain transition-opacity duration-200"
                  sizes="(max-width: 1280px) 95vw, 1200px"
                  priority
                />

                {/* In-gallery Image Prev/Next Overlay Buttons */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImageIndex((prev) =>
                          prev > 0 ? prev - 1 : galleryImages.length - 1
                        )
                      }}
                      className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-black/95 focus:outline-none"
                      aria-label="Hình trước"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImageIndex((prev) =>
                          prev < galleryImages.length - 1 ? prev + 1 : 0
                        )
                      }}
                      className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-black/95 focus:outline-none"
                      aria-label="Hình tiếp theo"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Image Counter Badge */}
                    <div className="absolute right-3 bottom-3 z-10 rounded-full bg-black/80 px-3 py-1 text-[11px] font-medium tracking-wider text-white/90 backdrop-blur-sm">
                      Ảnh {activeImageIndex + 1} / {galleryImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails Strip with fixed height and stable layout */}
              {galleryImages.length > 1 && (
                <div className="mt-4 flex h-16 w-full shrink-0 items-center justify-center gap-2 overflow-x-auto px-1 pb-1 sm:h-20">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={img.src + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded border transition-all sm:h-16 sm:w-16 ${
                        idx === activeImageIndex
                          ? "scale-105 border-white shadow-md shadow-black/50"
                          : "border-white/20 opacity-60 hover:border-white/50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Project Details Footer */}
              <div className="mt-4 flex w-full flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 text-white">
                <div className="text-center sm:text-left">
                  <p className="text-xs tracking-widest text-white/60 uppercase">
                    Designer: {member.name}
                  </p>
                  <h2 className="mt-0.5 font-serif text-xl font-normal text-white sm:text-2xl">
                    {cleanTitle(activeProject.title)}
                  </h2>
                </div>

                <Link
                  href={`/work/${internalSlugMap[activeProject.id] || activeProject.id}`}
                  onClick={() => setSelectedIndex(null)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium tracking-widest text-black uppercase transition-opacity hover:opacity-90 shadow-md"
                >
                  Xem toàn bộ dự án
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
