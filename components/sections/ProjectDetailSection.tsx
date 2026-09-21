"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

import { getTeam, getProjectsByDesigner } from "@/lib/projects";
import { Lightbox, LightboxTrigger } from "@/components/lightbox";
import type { Project, TeamMember } from "@/types";

interface ProjectDetailSectionProps {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

function findDesigner(designerName: string): TeamMember | undefined {
  const team = getTeam();
  return team.find((member) =>
    designerName.toLowerCase().includes(member.name.toLowerCase())
  );
}

function DesignerCredit({ designerName }: { designerName: string }) {
  const designer = findDesigner(designerName);
  if (!designer) return null;

  const projects = getProjectsByDesigner(designer.name);
  const initials = designer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="border-t border-border px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-12 text-sm uppercase tracking-widest text-muted-foreground">
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
                className="text-sm font-medium uppercase tracking-widest transition-opacity hover:opacity-70"
              >
                View profile · {projects.length} work
                {projects.length !== 1 ? "s" : ""}
              </Link>
              {designer.behanceUrl && (
                <a
                  href={designer.behanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                >
                  Behance
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProjectDetailSection({
  project,
  prev,
  next,
}: ProjectDetailSectionProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const galleryImages = React.useMemo(
    () => [project.heroImage, ...project.supportingImages],
    [project.heroImage, project.supportingImages]
  );

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <article>
      {/* Header */}
      <section className="px-6 pb-16 pt-36 lg:px-8 lg:pb-24 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm uppercase tracking-widest text-muted-foreground">
              <span className="font-serif text-2xl italic text-foreground">
                {String(project.order).padStart(2, "0")}
              </span>
              <span>{project.category}</span>
              {project.client && <span>{project.client}</span>}
            </div>
            <h1 className="max-w-5xl font-serif text-4xl font-normal tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative aspect-video w-full bg-muted lg:aspect-21/9"
      >
        <LightboxTrigger
          onClick={() => openLightbox(0)}
          className="block h-full w-full"
        >
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </LightboxTrigger>
      </motion.section>

      {/* Content */}
      <section className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="sticky top-32 space-y-10">
                <div>
                  <h2 className="mb-3 text-sm uppercase tracking-widest text-muted-foreground">
                    Designer
                  </h2>
                  <p className="font-serif text-xl">{project.designer}</p>
                </div>
                <div>
                  <h2 className="mb-3 text-sm uppercase tracking-widest text-muted-foreground">
                    Capabilities
                  </h2>
                  <p className="leading-relaxed text-muted-foreground">
                    {project.capabilities.join(" / ")}
                  </p>
                </div>
                {project.role && (
                  <div>
                    <h2 className="mb-3 text-sm uppercase tracking-widest text-muted-foreground">
                      Role
                    </h2>
                    <p className="text-muted-foreground">{project.role}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-8 lg:col-start-5"
            >
              <div className="flex flex-col gap-14">
                {project.description && (
                  <p className="font-serif text-2xl leading-snug text-muted-foreground sm:text-3xl">
                    {project.description}
                  </p>
                )}

                {project.concept && (
                  <div>
                    <h3 className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
                      Concept
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {project.concept}
                    </p>
                  </div>
                )}

                {project.visualSystem && (
                  <div>
                    <h3 className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
                      Visual System
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {project.visualSystem}
                    </p>
                  </div>
                )}

                {project.application && (
                  <div>
                    <h3 className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
                      Application
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {project.application}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supporting Images */}
      {project.supportingImages.length > 0 && (
        <section className="bg-secondary/30 px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {project.supportingImages.map((image, index) => (
                <motion.div
                  key={`${image.src}-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`relative overflow-hidden bg-muted ${
                    image.aspectRatio === "portrait"
                      ? "aspect-3/4"
                      : "aspect-4/3"
                  } ${index === 0 && project.supportingImages.length % 2 !== 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                >
                  <LightboxTrigger
                    onClick={() => openLightbox(index + 1)}
                    className="block h-full w-full"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {image.caption && (
                      <p className="absolute bottom-0 left-0 right-0 bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm">
                        {image.caption}
                      </p>
                    )}
                  </LightboxTrigger>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                <span className="font-serif text-lg">{prev.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/work"
            className="hidden text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground md:block"
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
                <span className="font-serif text-lg">{next.title}</span>
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
      />
    </article>
  );
}
