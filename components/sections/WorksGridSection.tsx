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
            09 dự án đại diện cho năng lực đa dạng của Artify Design — từ
            branding đến motion.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 lg:gap-24">
          {projects.map((project, index) => {
            const isFeatured = index === 0 || index === 3 || index === 6;
            const isReversed = index % 2 !== 0;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
              >
                <Link
                  href={`/work/${project.id}`}
                  className={`group grid items-center gap-8 lg:grid-cols-12 lg:gap-12 ${
                    isReversed ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-muted ${
                      isFeatured ? "aspect-4/3 lg:col-span-8" : "aspect-4/3 lg:col-span-5"
                    } ${isReversed ? "lg:col-start-6" : "lg:col-start-1"}`}
                  >
                    <Image
                      src={project.heroImage.src}
                      alt={project.heroImage.alt}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes={isFeatured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 40vw"}
                    />
                  </div>

                  <div
                    className={`flex flex-col gap-4 ${
                      isFeatured
                        ? "lg:col-span-4"
                        : "lg:col-span-5"
                    } ${isReversed ? "lg:col-start-1 lg:row-start-1" : ""}`}
                  >
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
                      {project.client || project.designer} · {project.year}
                    </p>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
