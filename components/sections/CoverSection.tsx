"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import Image from "next/image"

import { getSiteMeta, getAllProjects, cleanTitle } from "@/lib/projects"
import type { Project } from "@/types"

interface CoverSectionProps {
  projects?: Project[]
}

// Fisher-Yates shuffle algorithm for uniform randomness
function shuffleProjects(list: Project[]): Project[] {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function CoverSection({ projects: initialProjects }: CoverSectionProps) {
  const site = getSiteMeta()
  const allProjects =
    initialProjects && initialProjects.length > 0
      ? initialProjects
      : getAllProjects()

  // Randomize project positions on client mount (each page visit / refresh)
  const [gridProjects, setGridProjects] = useState<Project[]>(() =>
    allProjects.slice(0, 24)
  )

  useEffect(() => {
    setGridProjects(shuffleProjects(allProjects).slice(0, 24))
  }, [allProjects])

  const scrollToWorks = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById("works")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col justify-between px-6 pt-28 pb-10 sm:pt-32 lg:px-8 2xl:pt-36 2xl:pb-14">
      {/* Top Header Block */}
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 2xl:col-span-8"
          >
            <p className="mb-3 text-xs tracking-widest text-muted-foreground uppercase">
              {site.tagline} — {site.location}
            </p>
            <h1 className="font-serif text-6xl leading-[0.92] font-normal tracking-tight sm:text-7xl md:text-8xl lg:text-9xl 2xl:text-[9.5rem]">
              <span className="block">Artify</span>
              <span className="block text-muted-foreground/90 italic">
                Design
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-end gap-4 lg:col-span-5 2xl:col-span-4"
          >
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Creative team tại {site.location} chuyên về branding, key visual,
              social media, POSM và motion design.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase">
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1">
                Branding
              </span>
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1">
                Key Visual
              </span>
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1">
                POSM
              </span>
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1">
                Motion
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Square Mosaic Grid: 3-4 rows of square project tiles */}
      <div className="mx-auto my-8 w-full max-w-7xl sm:my-10 lg:my-12 2xl:max-w-[1536px]">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 md:grid-cols-6 lg:grid-cols-8 lg:gap-2.5">
          {gridProjects.map((project, index) => {
            // Keep exactly 4 rows on mobile (12 items) and 4 rows on tablet (16 items)
            const isHiddenOnMobile = index >= 12
            const isHiddenOnTablet = index >= 16

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + (index % 12) * 0.035,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative ${
                  isHiddenOnMobile ? "hidden sm:block" : ""
                } ${isHiddenOnTablet ? "sm:hidden md:block" : ""}`}
              >
                <a
                  href="#works"
                  onClick={scrollToWorks}
                  className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-lg border border-border/70 bg-muted/60 transition-all duration-300 ease-out hover:z-30 hover:scale-105 hover:border-foreground/40 hover:shadow-2xl hover:shadow-black/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground sm:rounded-xl dark:hover:border-white/40 dark:hover:shadow-black/70"
                  aria-label={`Xem dự án ${cleanTitle(project.title)} tại danh sách tác phẩm`}
                >
                  <Image
                    src={project.heroImage.src}
                    alt={cleanTitle(project.title)}
                    fill
                    unoptimized={
                      project.heroImage.src.startsWith("http") ||
                      project.heroImage.src.includes(".gif")
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
                  />

                  {/* Gradient Overlay & Project Info on Hover */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/35 to-transparent p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-2.5">
                    <p className="line-clamp-1 font-serif text-xs leading-tight font-normal text-white">
                      {cleanTitle(project.title)}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[9px] tracking-wider text-white/70 uppercase">
                      {project.category}
                    </p>
                  </div>

                  {/* Subtle Inner Ring */}
                  <div className="absolute inset-0 rounded-xl ring-1 ring-black/5 transition-all duration-300 ring-inset group-hover:ring-foreground/20 sm:rounded-2xl dark:ring-white/10" />
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-between border-t border-border/50 pt-5 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="tracking-widest uppercase">
              {allProjects.length} Dự án thiết kế
            </span>
            <span className="hidden sm:inline-block">/</span>
            <span className="hidden tracking-widest uppercase sm:inline-block">
              3 Thành viên
            </span>
            <span className="hidden md:inline-block">/</span>
            <span className="hidden tracking-widest uppercase md:inline-block">
              Client-Facing Portfolio
            </span>
          </div>

          <a
            href="#works"
            onClick={scrollToWorks}
            className="group inline-flex cursor-pointer items-center gap-2 tracking-widest uppercase transition-opacity hover:opacity-70"
          >
            <span>Scroll to explore</span>
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
