"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, LayoutGrid, Rows } from "lucide-react"

import { getTeam, getProjectsByDesigner, cleanTitle } from "@/lib/projects"
import { Lightbox, LightboxTrigger } from "@/components/lightbox"
import type { Project, TeamMember } from "@/types"

interface ProjectDetailSectionProps {
  project: Project
  prev: Project | null
  next: Project | null
}

function findDesigner(designerName: string): TeamMember | undefined {
  const team = getTeam()
  return team.find((member) =>
    designerName.toLowerCase().includes(member.name.toLowerCase())
  )
}

function DesignerCredit({ designerName }: { designerName: string }) {
  const designer = findDesigner(designerName)
  if (!designer) return null

  const projects = getProjectsByDesigner(designer.name)
  const initials = designer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="border-t border-border px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-12 text-sm tracking-widest text-muted-foreground uppercase">
          Behind the work
        </p>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link
              href={`/team/${designer.id}`}
              className="relative flex aspect-square w-32 items-center justify-center overflow-hidden bg-muted text-3xl font-medium tracking-tight text-muted-foreground transition-opacity hover:opacity-70"
            >
              {designer.avatarUrl ? (
                <Image
                  src={designer.avatarUrl}
                  alt={designer.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                initials
              )}
            </Link>
          </div>
          <div className="lg:col-span-9">
            <h3 className="font-serif text-3xl font-normal tracking-tight sm:text-4xl">
              {designer.name}
            </h3>
            <p className="mt-2 text-muted-foreground">{designer.role}</p>
            {designer.bio && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {designer.bio}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <Link
                href={`/team/${designer.id}`}
                className="text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
              >
                View profile · {projects.length} work
                {projects.length !== 1 ? "s" : ""}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProjectDetailSection({
  project,
  prev,
  next,
}: ProjectDetailSectionProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxIndex, setLightboxIndex] = React.useState(0)
  const [layoutMode, setLayoutMode] = React.useState<"grid" | "column">(
    "column"
  )

  // Default view mode to column whenever entering or switching projects
  React.useEffect(() => {
    setLayoutMode("column")
  }, [project.id])

  const handleLayoutChange = (mode: "grid" | "column") => {
    setLayoutMode(mode)
  }

  const galleryImages = React.useMemo(() => {
    const list: (typeof project.heroImage)[] = []
    const seen = new Set<string>()
    if (project.heroImage?.src) {
      list.push(project.heroImage)
      seen.add(project.heroImage.src)
    }
    for (const img of project.supportingImages || []) {
      if (img.src && !seen.has(img.src)) {
        list.push(img)
        seen.add(img.src)
      }
    }
    return list
  }, [project.heroImage, project.supportingImages])

  type ColumnBlock =
    | {
        type: "single"
        image: (typeof galleryImages)[number]
        originalIndex: number
      }
    | {
        type: "gif-pair"
        images: {
          image: (typeof galleryImages)[number]
          originalIndex: number
        }[]
      }

  const columnBlocks = React.useMemo<ColumnBlock[]>(() => {
    const blocks: ColumnBlock[] = []
    let i = 0
    while (i < galleryImages.length) {
      const current = galleryImages[i]
      const isGif = Boolean(current.src?.toLowerCase().includes(".gif"))

      if (isGif) {
        const next = galleryImages[i + 1]
        const nextIsGif = Boolean(next?.src?.toLowerCase().includes(".gif"))

        if (nextIsGif) {
          blocks.push({
            type: "gif-pair",
            images: [
              { image: current, originalIndex: i },
              { image: next, originalIndex: i + 1 },
            ],
          })
          i += 2
        } else {
          blocks.push({
            type: "single",
            image: current,
            originalIndex: i,
          })
          i += 1
        }
      } else {
        blocks.push({
          type: "single",
          image: current,
          originalIndex: i,
        })
        i += 1
      }
    }
    return blocks
  }, [galleryImages])

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <article>
      {/* Header */}
      <section className="px-6 pt-24 pb-8 lg:px-8 lg:pt-28 lg:pb-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-widest text-muted-foreground uppercase">
                <span className="font-serif text-lg text-foreground italic">
                  {String(project.order).padStart(2, "0")}
                </span>
                <span>{project.category}</span>
                {project.client && <span>· {cleanTitle(project.client)}</span>}
              </div>
              <h1 className="font-serif text-3xl font-normal tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {cleanTitle(project.title)}
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                Designer
              </p>
              <p className="font-serif text-lg text-foreground">
                {project.designer}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-6 py-6 lg:px-8">
        {/* Layout Toggle Controls */}
        <div className="mx-auto mb-4 flex max-w-7xl items-center justify-end">
          <div
            className="inline-flex items-center rounded-sm border border-border bg-muted/40 p-1 text-xs"
            role="group"
            aria-label="Chế độ hiển thị thư viện ảnh"
          >
            <button
              type="button"
              onClick={() => handleLayoutChange("grid")}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 transition-all ${
                layoutMode === "grid"
                  ? "bg-background font-medium text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={layoutMode === "grid"}
              title="Modern grid layout with spacing"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => handleLayoutChange("column")}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 transition-all ${
                layoutMode === "column"
                  ? "bg-background font-medium text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={layoutMode === "column"}
              title="Continuous column layout (no gap)"
            >
              <Rows className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Column</span>
            </button>
          </div>
        </div>

        {layoutMode === "grid" ? (
          <div className="mx-auto grid max-w-7xl grid-cols-1 border-t border-l border-border md:grid-cols-2">
            {galleryImages.map((image, index) => (
              <motion.figure
                key={`${image.src}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: (index % 2) * 0.05 }}
                className="relative flex h-full w-full flex-col overflow-hidden border-r border-b border-border p-4 sm:p-6 lg:p-8"
              >
                <LightboxTrigger
                  onClick={() => openLightbox(index)}
                  className="group flex h-full w-full flex-1 cursor-zoom-in flex-col items-center justify-center text-center"
                >
                  <div className="relative flex h-full min-h-[350px] w-full flex-1 items-center justify-center overflow-hidden sm:min-h-[450px]">
                    <Image
                      src={image.src}
                      alt={
                        image.alt ||
                        `${cleanTitle(project.title)} visual ${index + 1}`
                      }
                      width={image.width || 1400}
                      height={image.height || 1000}
                      unoptimized={image.src.includes(".gif") || image.src.startsWith("http")}
                      className="mx-auto block h-full max-h-[75vh] w-auto max-w-full object-contain transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                      priority={index < 2}
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  )}
                </LightboxTrigger>
              </motion.figure>
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-7xl flex-col gap-0 overflow-hidden">
            {columnBlocks.map((block) => {
              if (block.type === "gif-pair") {
                return (
                  <div
                    key={`gif-pair-${block.images[0].originalIndex}`}
                    className="grid w-full grid-cols-1 md:grid-cols-2"
                  >
                    {block.images.map(({ image, originalIndex }, pairIdx) => (
                      <motion.figure
                        key={`${image.src}-${originalIndex}`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 0.5, delay: pairIdx * 0.05 }}
                        className="relative m-0 flex w-full flex-col items-center justify-center overflow-hidden p-0 leading-none bg-background"
                      >
                        <LightboxTrigger
                          onClick={() => openLightbox(originalIndex)}
                          className="group relative m-0 block w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 text-left"
                        >
                          <Image
                            src={image.src}
                            alt={
                              image.alt ||
                              `${cleanTitle(project.title)} visual ${originalIndex + 1}`
                            }
                            width={image.width || 1200}
                            height={image.height || 800}
                            unoptimized={image.src.includes(".gif") || image.src.startsWith("http")}
                            className="block h-auto w-full transition-opacity duration-300 group-hover:opacity-95"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={originalIndex < 2}
                          />
                          {image.caption && (
                            <figcaption className="bg-background/90 p-3 text-center text-xs text-muted-foreground">
                              {image.caption}
                            </figcaption>
                          )}
                        </LightboxTrigger>
                      </motion.figure>
                    ))}
                  </div>
                )
              }

              const { image, originalIndex } = block
              return (
                <motion.figure
                  key={`${image.src}-${originalIndex}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5 }}
                  className="relative m-0 block w-full overflow-hidden p-0 leading-none"
                >
                  <LightboxTrigger
                    onClick={() => openLightbox(originalIndex)}
                    className="group relative m-0 block w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 text-left"
                  >
                    <Image
                      src={image.src}
                      alt={
                        image.alt ||
                        `${cleanTitle(project.title)} visual ${originalIndex + 1}`
                      }
                      width={image.width || 1920}
                      height={image.height || 1080}
                      unoptimized={image.src.includes(".gif") || image.src.startsWith("http")}
                      className="block h-auto w-full transition-opacity duration-300 group-hover:opacity-95"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      priority={originalIndex < 2}
                    />
                    {image.caption && (
                      <figcaption className="bg-background/90 p-3 text-center text-xs text-muted-foreground">
                        {image.caption}
                      </figcaption>
                    )}
                  </LightboxTrigger>
                </motion.figure>
              )
            })}
          </div>
        )}
      </section>

      {/* Project Overview & Story */}
      <section className="border-t border-border px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
                    Capabilities
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.capabilities.join(" · ")}
                  </p>
                </div>
                {project.role && (
                  <div>
                    <h2 className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
                      Role
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {project.role}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-8">
              {project.description && (
                <p className="font-serif text-2xl leading-relaxed font-normal text-foreground sm:text-3xl">
                  {project.description}
                </p>
              )}

              {(project.concept ||
                project.visualSystem ||
                project.application) && (
                <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
                  {project.concept && (
                    <div>
                      <h3 className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
                        Concept
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {project.concept}
                      </p>
                    </div>
                  )}
                  {project.visualSystem && (
                    <div>
                      <h3 className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
                        Visual System
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {project.visualSystem}
                      </p>
                    </div>
                  )}
                  {project.application && (
                    <div>
                      <h3 className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
                        Application
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {project.application}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <DesignerCredit designerName={project.designer} />

      {/* Navigation */}
      <nav className="border-t border-border px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {prev ? (
            <Link
              href={`/work/${prev.id}`}
              className="group flex items-center gap-4 text-sm transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <span className="block text-muted-foreground">Previous</span>
                <span className="font-serif text-lg">
                  {cleanTitle(prev.title)}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/work"
            className="hidden text-sm tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground md:block"
          >
            All Works
          </Link>

          {next ? (
            <Link
              href={`/work/${next.id}`}
              className="group flex items-center gap-4 text-sm transition-opacity hover:opacity-70"
            >
              <div className="text-right">
                <span className="block text-muted-foreground">Next</span>
                <span className="font-serif text-lg">
                  {cleanTitle(next.title)}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      <Lightbox
        images={galleryImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={cleanTitle(project.title)}
        designer={project.designer}
        category={project.category}
      />
    </article>
  )
}
