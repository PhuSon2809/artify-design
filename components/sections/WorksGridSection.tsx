"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/types";

interface WorksGridSectionProps {
  projects: Project[];
}

export function WorksGridSection({ projects }: WorksGridSectionProps) {
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
            <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
              Selected Works
            </p>
            <h2 className="font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Những dự án
              <br />
              <span className="italic text-muted-foreground">được chọn lọc</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            {String(projects.length).padStart(2, "0")} dự án đại diện cho năng
            lực đa dạng của Artify Design — từ branding đến motion.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
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
                    <span className="font-serif text-2xl italic text-foreground">
                      {String(project.order).padStart(2, "0")}
                    </span>
                    <span className="uppercase tracking-widest">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl font-normal tracking-tight transition-colors group-hover:text-muted-foreground sm:text-4xl">
                    {project.title}
                  </h3>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground">
                    {project.client || project.designer}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
