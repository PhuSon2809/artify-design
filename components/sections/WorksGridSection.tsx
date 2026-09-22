"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown } from "lucide-react"

import type { Project } from "@/types"
import { cleanTitle } from "@/lib/projects"

interface WorksGridSectionProps {
  projects: Project[]
}

const PAGE_SIZE = 10

export function WorksGridSection({ projects }: WorksGridSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleProjects = projects.slice(0, visibleCount)
  const hasMore = visibleCount < projects.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, projects.length))
  }

  return (
    <section className="px-6 py-32 lg:px-8 lg:py-48">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
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

        <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
          {visibleProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index % PAGE_SIZE) * 0.05 }}
            >
              <Link href={`/work/${project.id}`} className="group block">
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
                ({visibleCount}/{projects.length})
              </span>
              <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        )}

        {/* All items loaded indicator */}
        {!hasMore && projects.length > PAGE_SIZE && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-20 text-center text-xs tracking-widest text-muted-foreground/60 uppercase"
          >
            Đã hiển thị toàn bộ {projects.length} dự án
          </motion.p>
        )}
      </div>
    </section>
  )
}
