"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { AllProject, TeamMember } from "@/types"
import { cleanTitle } from "@/lib/projects"

interface TeamProjectsGridProps {
  projects: AllProject[]
  member: TeamMember
  internalSlugMap: Record<string, string>
}

export function TeamProjectsGrid({
  projects,
  internalSlugMap,
}: TeamProjectsGridProps) {
  return (
    <div className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const slug = internalSlugMap[project.id] || project.id

        return (
          <div
            key={project.id}
            className="group relative flex flex-col border-r border-b border-border bg-background transition-colors hover:bg-secondary/30"
          >
            {/* Clickable Image Thumbnail directly linking to project detail */}
            <Link
              href={`/work/${slug}`}
              className="relative aspect-4/3 w-full overflow-hidden bg-muted cursor-pointer block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              aria-label={`Xem dự án ${project.title}`}
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
            </Link>

            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className="text-xs font-medium tracking-widest text-foreground uppercase">
                  {project.category}
                </span>
                {project.year && (
                  <span className="text-xs text-muted-foreground">
                    {project.year}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-xl leading-snug font-normal transition-colors group-hover:text-muted-foreground">
                <Link
                  href={`/work/${slug}`}
                  className="text-left hover:underline cursor-pointer block"
                >
                  {cleanTitle(project.title)}
                </Link>
              </h3>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm">
                <Link
                  href={`/work/${slug}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
                >
                  <span>Xem toàn bộ dự án</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
