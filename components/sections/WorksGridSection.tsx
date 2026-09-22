"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, Search, X } from "lucide-react"

import type { Project } from "@/types"
import { cleanTitle } from "@/lib/projects"
import { cn } from "@/lib/utils"

interface WorksGridSectionProps {
  projects: Project[]
}

const PAGE_SIZE = 10

const CORE_CAPABILITIES = [
  "Branding",
  "Key Visual",
  "Social Media",
  "POSM & Retail",
  "Motion",
  "Illustration",
] as const

type CoreCapability = (typeof CORE_CAPABILITIES)[number]

function matchesCapability(project: Project, cap: string): boolean {
  const caps = (project.capabilities || []).map((c) => c.toLowerCase())
  const cat = (project.category || "").toLowerCase()
  const sub = (project.subcategory || "").toLowerCase()

  switch (cap) {
    case "Branding":
      return (
        caps.some((c) => c.includes("brand") || c.includes("logo")) ||
        cat.includes("brand")
      )
    case "Key Visual":
      return (
        caps.some(
          (c) => c.includes("key visual") || c.includes("keyvisual")
        ) ||
        cat.includes("key visual") ||
        cat.includes("keyvisual")
      )
    case "Social Media":
      return caps.some((c) => c.includes("social")) || cat.includes("social")
    case "POSM & Retail":
      return (
        caps.some((c) => c.includes("posm") || c.includes("retail")) ||
        cat.includes("posm") ||
        cat.includes("retail") ||
        sub.includes("retail")
      )
    case "Motion":
      return (
        caps.some(
          (c) =>
            c.includes("motion") ||
            c.includes("animation") ||
            c.includes("mv") ||
            c.includes("music video")
        ) ||
        cat.includes("motion") ||
        cat.includes("animation")
      )
    case "Illustration":
      return (
        caps.some(
          (c) =>
            c.includes("illustration") ||
            c.includes("drawing") ||
            c.includes("digital art")
        ) || cat.includes("illustration")
      )
    default:
      return false
  }
}

function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
}

export function WorksGridSection({ projects }: WorksGridSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null)

  // Count projects matching each of the 6 core capabilities
  const capabilityCounts = useMemo(() => {
    const counts = new Map<string, number>()
    CORE_CAPABILITIES.forEach((cap) => {
      const count = projects.filter((p) => matchesCapability(p, cap)).length
      counts.set(cap, count)
    })
    return counts
  }, [projects])

  // Filter projects based on search query (by title/name) and capability tag
  const filteredProjects = useMemo(() => {
    const queryNorm = removeVietnameseTones(searchQuery.trim())

    return projects.filter((project) => {
      // 1. Search by name / title
      if (queryNorm) {
        const titleNorm = removeVietnameseTones(project.title)
        const cleanTitleNorm = removeVietnameseTones(cleanTitle(project.title))
        const clientNorm = project.client
          ? removeVietnameseTones(project.client)
          : ""

        const match =
          titleNorm.includes(queryNorm) ||
          cleanTitleNorm.includes(queryNorm) ||
          clientNorm.includes(queryNorm)

        if (!match) return false
      }

      // 2. Filter by core capability tag
      if (selectedCapability) {
        if (!matchesCapability(project, selectedCapability)) {
          return false
        }
      }

      return true
    })
  }, [projects, searchQuery, selectedCapability])

  // Restore pagination & scroll to last viewed project on back navigation
  useEffect(() => {
    try {
      const savedCount = sessionStorage.getItem("portfolio_works_visible_count")
      const lastClickedId = sessionStorage.getItem("portfolio_last_clicked_id")
      const savedScrollY = sessionStorage.getItem("portfolio_works_scroll_y")

      let countToSet = PAGE_SIZE
      if (savedCount) {
        const parsed = parseInt(savedCount, 10)
        if (!isNaN(parsed) && parsed > countToSet) {
          countToSet = Math.min(parsed, projects.length)
        }
      }

      // If a specific project was clicked, ensure visibleCount is large enough to include it
      if (lastClickedId) {
        const targetIndex = projects.findIndex((p) => p.id === lastClickedId)
        if (targetIndex >= 0) {
          const neededCount =
            Math.ceil((targetIndex + 1) / PAGE_SIZE) * PAGE_SIZE
          if (neededCount > countToSet) {
            countToSet = Math.min(neededCount, projects.length)
          }
        }
      }

      if (countToSet > visibleCount) {
        setVisibleCount(countToSet)
      }

      // Scroll to project card if returning from detail page
      if (lastClickedId) {
        setHighlightedId(lastClickedId)

        const timer = setTimeout(() => {
          const el = document.getElementById(`work-${lastClickedId}`)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" })
          } else if (savedScrollY) {
            window.scrollTo({
              top: parseInt(savedScrollY, 10),
              behavior: "smooth",
            })
          }

          // Clean up so subsequent normal refreshes don't re-trigger scroll
          sessionStorage.removeItem("portfolio_last_clicked_id")
          sessionStorage.removeItem("portfolio_works_scroll_y")

          const removeHighlightTimer = setTimeout(() => {
            setHighlightedId(null)
          }, 2000)

          return () => clearTimeout(removeHighlightTimer)
        }, 120)

        return () => clearTimeout(timer)
      }
    } catch {
      // Handle private browsing or restricted storage gracefully
    }
  }, [projects])

  const visibleProjects = filteredProjects.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProjects.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => {
      const next = Math.min(prev + PAGE_SIZE, filteredProjects.length)
      try {
        sessionStorage.setItem("portfolio_works_visible_count", String(next))
      } catch {}
      return next
    })
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCapability(null)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section id="works" className="scroll-mt-16 px-6 py-32 lg:px-8 lg:py-48">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="mb-4 text-sm tracking-widest text-muted-foreground uppercase">
              Selected Works
            </p>
            <h2 className="font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Những dự án
              <br />
              <span className="text-muted-foreground italic">
                được chọn lọc
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            {String(projects.length).padStart(2, "0")} dự án đại diện cho năng
            lực đa dạng của Artify Design — từ branding đến motion.
          </p>
        </motion.div>

        {/* Search & Capabilities Tag Filter Bar */}
        <div className="mb-12 flex flex-col gap-6">
          {/* Top row: Search input & Results info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setVisibleCount(PAGE_SIZE)
                }}
                placeholder="Tìm kiếm theo tên dự án..."
                className="w-full rounded-full border border-border/80 bg-background/80 py-2.5 pl-10 pr-10 text-sm placeholder:text-muted-foreground/70 transition-all focus:border-foreground focus:bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setVisibleCount(PAGE_SIZE)
                  }}
                  aria-label="Xóa tìm kiếm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Results counter & Reset button */}
            {(searchQuery || selectedCapability) && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Tìm thấy{" "}
                  <strong className="text-foreground font-medium">
                    {filteredProjects.length}
                  </strong>{" "}
                  dự án
                </span>
                <span className="text-border">•</span>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-medium underline underline-offset-4 hover:text-foreground transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Capabilities Tag Badges (6 core capabilities) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="mr-1 hidden text-xs font-medium uppercase tracking-wider text-muted-foreground/80 sm:inline">
              Lọc theo:
            </span>

            {/* "Tất cả" tag */}
            <button
              type="button"
              onClick={() => {
                setSelectedCapability(null)
                setVisibleCount(PAGE_SIZE)
              }}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-200",
                selectedCapability === null
                  ? "border-foreground bg-foreground text-background shadow-xs"
                  : "border-border/60 bg-muted/30 text-muted-foreground hover:border-foreground/40 hover:bg-muted/70 hover:text-foreground"
              )}
            >
              Tất cả ({projects.length})
            </button>

            {/* 6 Core Capability tags */}
            {CORE_CAPABILITIES.map((cap) => {
              const count = capabilityCounts.get(cap) || 0
              const isSelected = selectedCapability === cap
              return (
                <button
                  key={cap}
                  type="button"
                  onClick={() => {
                    setSelectedCapability(isSelected ? null : cap)
                    setVisibleCount(PAGE_SIZE)
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-200",
                    isSelected
                      ? "border-foreground bg-foreground text-background shadow-xs"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:border-foreground/40 hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <span>{cap}</span>
                  <span
                    className={cn(
                      "text-[10px] font-normal opacity-75",
                      isSelected ? "text-background" : "text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="my-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-12 text-center">
            <p className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
              Không tìm thấy dự án phù hợp
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Không có dự án nào khớp với{" "}
              {searchQuery && (
                <span>
                  từ khóa &ldquo;
                  <strong className="text-foreground">{searchQuery}</strong>
                  &rdquo;
                </span>
              )}
              {searchQuery && selectedCapability && " và "}
              {selectedCapability && (
                <span>
                  năng lực &ldquo;
                  <strong className="text-foreground">{selectedCapability}</strong>
                  &rdquo;
                </span>
              )}
              . Vui lòng thử từ khóa khác hoặc xóa bộ lọc.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-6 cursor-pointer rounded-full border border-foreground bg-foreground px-6 py-2.5 text-xs font-medium tracking-widest text-background uppercase transition-opacity hover:opacity-85"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
          {visibleProjects.map((project, index) => (
            <motion.article
              key={project.id}
              id={`work-${project.id}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index % PAGE_SIZE) * 0.05 }}
              className={`scroll-mt-28 transition-all duration-700 ${
                highlightedId === project.id
                  ? "rounded-2xl bg-muted/40 p-2.5 -m-2.5 shadow-xl ring-2 ring-foreground/40"
                  : ""
              }`}
            >
              <Link
                href={`/work/${project.id}`}
                onClick={() => {
                  try {
                    sessionStorage.setItem(
                      "portfolio_works_visible_count",
                      String(visibleCount)
                    )
                    sessionStorage.setItem(
                      "portfolio_last_clicked_id",
                      project.id
                    )
                    sessionStorage.setItem(
                      "portfolio_works_scroll_y",
                      String(window.scrollY)
                    )
                  } catch {}
                }}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={project.heroImage.src}
                    alt={project.heroImage.alt}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-serif text-2xl text-foreground italic">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="tracking-widest uppercase">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl font-normal tracking-tight transition-colors group-hover:text-muted-foreground sm:text-4xl">
                    {cleanTitle(project.title)}
                  </h3>
                  <p className="text-sm tracking-widest text-muted-foreground uppercase">
                    {project.client || project.designer}
                  </p>

                  {/* Capabilities Tags on Card */}
                  {(() => {
                    const matchedCore = CORE_CAPABILITIES.filter((cap) =>
                      matchesCapability(project, cap)
                    )
                    if (matchedCore.length === 0) return null
                    return (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {matchedCore.map((cap) => (
                          <span
                            key={cap}
                            className="rounded-full border border-border/50 bg-muted/30 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-20 flex flex-col items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleLoadMore}
              className="group relative inline-flex cursor-pointer items-center gap-3 border border-border bg-background px-8 py-4 text-xs font-medium tracking-widest text-foreground uppercase transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <span>Xem thêm</span>
              <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-background/70">
                ({visibleCount}/{filteredProjects.length})
              </span>
              <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        )}

        {/* All items loaded indicator */}
        {!hasMore &&
          filteredProjects.length > PAGE_SIZE &&
          filteredProjects.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-20 text-center text-xs tracking-widest text-muted-foreground/60 uppercase"
            >
              Đã hiển thị toàn bộ {filteredProjects.length} dự án
            </motion.p>
          )}
      </div>
    </section>
  )
}

